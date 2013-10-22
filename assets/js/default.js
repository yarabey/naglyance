$(function () {
    $('.fixed-top-menu .home').addClass('active');
    $('.toggle').click(function () {
        var $self = $(this);
        $self.find('i').toggleClass('icon-caret-right');
        $self.next().toggleClass('hidden');
    });
});

$(function () {
    var $container = $('.photo-week');
    $.each(Photos, function (i, photo) {
        photo.small = '/img/' + photo.small;
        photo.medium = photo.small.replace('.min', '.big');
        $container.append($('<img>').attr('src', photo.small).attr('data-id', photo._id));
    });
});
