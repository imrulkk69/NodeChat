/**
 * Created by IMRUL on 6/17/2017.
 */
$(document).ready(function(){
    $('.toggle').on('click', function() {
        $('.container').stop().addClass('active');
    });

    $('.close').on('click', function() {
        $('.container').stop().removeClass('active');
    });

});