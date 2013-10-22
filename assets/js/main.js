$(function () {
    $('#uploadPhotos,#signIn,#logOut,.fixed-top-menu a,.user-email,.pages a,#editAlbum,#uploadAnnounce,#deleteAlbum,#allAlbums').btn();
    $('#signIn').click(function () {
        var $auth = $('#authPopup');
        if ($auth.css('display') == 'none') {
            var height = $auth.css('height');
            var width = '-' + $auth.css('width');
            $auth.css({ 'height': '0', 'right': width }).show().animate({ 'height': height, 'right': 0 }, 500, function () {
                $('#email').focus();
                $('body,#loginCancel,#loginSubmit').click(function () {
                    var $auth = $('#authPopup');
                    $auth.animate({ 'height': 0, 'right': width  }, 600, function () {
                        $auth.hide().css('height', height);
                    });
                    $('body,#loginCancel').unbind('click');
                });
            });
        }
        return false;
    });
    $('#logOut').click(function () {
        $.ajax({
            url: '/home/auth/logOut',
            type: 'post',
            success: function () {
                window.location.reload();
            }
        });
    });
    $('a').each(function (i, el) {
        if ($(el).attr('href').indexOf('//') != -1)
            $(el).attr('target', 'blank');
    });
});