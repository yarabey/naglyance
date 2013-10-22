$(function () {
    $('body').on('click', '.modal-fog', function () {
        $('.modal').hide();
        $(this).remove();
    });

    $('.modal').on('click', '[data-dismiss="modal"]', function () {
        $(this).closest('.modal').hide();
        $('.modal-fog').remove();
    });

    $('body').on('mousedown', '.btn', function () {
        $(this).addClass('btn-clicked');
    });

    $('body').on('mouseup', '.btn', function () {
        $(this).removeClass('btn-clicked');
    });
});
$.fn.modal = function () {
    var $self = $(this);
    var halfWidth = $self.css('width').split('px')[0]/2;
    var halfHeight = $self.css('height').split('px')[0]/2;

    $self.css({ 'margin-left': '-' + halfWidth + 'px', 'margin-top': '-' + (halfHeight + 50) + 'px'});
    $self.fadeIn(500);
    $('body').append($('<div>').addClass('modal-fog'));
};
