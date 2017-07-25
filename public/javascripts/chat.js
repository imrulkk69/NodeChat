/**
 * Created by IMRUL on 6/18/2017.
 */

(function () {

    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    var client = mows.createClient('ws://www.paxtech.live:61614'); //ActiveMQ

     var Username = $('.title').html();

     var subTopic = "";
     var pubTopic = "";

     if(Username == 'imrul'){
         subTopic = 'test/imrul';
         pubTopic = 'test/jeevan';

     }else if(Username === 'jeevan'){
         subTopic = 'test/jeevan';
         pubTopic = 'test/imrul';
     }

    client.subscribe(subTopic);



    $(function () {
        var getMessageText, message_side, sendMessage;

        //message_side = 'right';

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

        sendMessage = function (text, side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }

            $('.message_input').val('');

            $messages = $('.messages');

            //message_side = message_side === 'left' ? 'right' : 'left';
            message_side = side;

            message = new Message({
                text: text,
                message_side: message_side
            });

            message.draw();

            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        $('.send_message').click(function (e) {

            var getMessage = getMessageText();

            client.publish(pubTopic, getMessage.toString());

            return sendMessage(getMessage, 'right');
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                var getMessage = getMessageText();

                client.publish(pubTopic, getMessage.toString());

                return sendMessage(getMessage, 'right');
            }
        });

        //sendMessage('Hello Philip! :)', 'left');

        /*setTimeout(function () {
         return sendMessage('Hi Sandy! How are you?');
         }, 1000);

         return setTimeout(function () {
         return sendMessage('I\'m fine, thank you!');
         }, 2000);*/

        client.on('message', function (topic, message) {
            console.log('topic: '+topic.toString()+' & message:'+message.toString());
            sendMessage(message.toString(), 'left');
        });
    });
}.call(this));