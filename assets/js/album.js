$(function () {
    var position = 0,
        itemsToTake = 15,
        $container = $('.album-photos-table');
    $('#submitDelete,#cancelDelete').btn();
    $('.fixed-top-menu .photo').addClass('active');
    showNext();
    $('#deleteAlbum').click(function (){
        $('.submit-delete').fadeIn(500);
        $(this).addClass('active');
    });
    $('#cancelDelete').click(function () {
        $('.submit-delete').fadeOut(500);
        $('#deleteAlbum').removeClass('active');
    });
    $('#submitDelete').click(function () {
        $.ajax({
            url: '/home/album/DeleteAlbum',
            type: 'post',
            data: {id: location.pathname.split('/')[1].split('-')[1]},
            dataType: 'json',
            success: function (data) {
                if (!data.response.err)
                    window.location.href = '/';
            }
        });
    });

    function showNext() {
        var photos = Photos.slice(position, position + itemsToTake);
        var length = photos.length;
        position += length;
        var $tr = $('<tr>');
        $.each(photos, function (i, photo) {
            $tr.append($('<td>').append($('<img>').attr('src', photo.medium).attr('data-id', photo._id)));
            if ((i + 1) % 3 === 0 && i != 0 || i == length - 1) {
                $container.append($tr);
                $tr = $('<tr>');
            }
        });
    };

    $(window).scroll(function () {
        if ($(window).scrollTop() + 200 > $(document).height() - $(window).height())
            showNext();
    });
});