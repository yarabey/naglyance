$(function () {
    var errPhotoPath = '/img/photo-error.jpg',
        maxSize = 3000000,
        minSize = 20000,
        isEdit = false;
    $('#uploadPhotos').click(function () {
        if ($(this).hasClass('active'))
            return;
        if ($('#editAlbum').hasClass('active')){
            $('#editAlbum').removeClass('active');
            $('.upload-popup').hide();
            $('#saveCancel').unbind('click');
        }
        $(this).hide();
        $('.upload-popup').html() ? showUpload($(this)) : getUpload($(this));
    });
    $('#editAlbum').click(function () {
        if ($(this).hasClass('active'))
            return;
        if ($('#uploadPhotos').hasClass('active')){
            $('#uploadPhotos').removeClass('active');
            $('.upload-popup').hide();
            $('#saveCancel').unbind('click');
        }
        $(this).hide();
        var album = {
            name: $('#albumName').text(),
            place: $('#albumPlace').text(),
            date: $('#albumDate').attr('data-date'),
            photos: Photos.map(function (photo) {
                return {
                    id: photo._id,
                    medium: photo.medium
                }
            })
        };
        $('.upload-popup').html() ? showUpload($(this), album) : getUpload($(this), album);
        isEdit = true;
    });
    function RenderItem(item) {
        $('.upload-photo-loading').remove();
        $('<div>').addClass('new-photo-item')
            .append($('<img>').attr('data-id', item.id || '').attr('src', item.medium || item.err || errPhotoPath))
            .append($('<div>').addClass('delete-photo'))
            .appendTo($('.upload-photo-block'));
    };
    function getUpload($button,album) {
        $('<span>').addClass('upload-getting ' + (album ? 'upload-getting-edit' : '')).insertAfter($button);
        $.ajax({
            url: '/home/photo/UploadModal',
            type: 'get',
            success: function (data) {
                $('.upload-popup').html(data);
                $('.upload-getting').remove();
                $button.addClass('active').show();
                prepareUpload();
                showUpload($button,album)
            }
        });
    };
    function showUpload($button,album) {
        album = album || {};
        $button.addClass('active').show();
        $('.upload-album .album-name').val(album.name || '');
        $('.upload-album .album-place').val(album.place || '');
        $('.upload-album .album-date').val(album.date || new Date().format('mm.dd.yyyy'));
        $('.upload-photo-block').html('');
        if (album.photos){
            $.each(album.photos, function (i, photo) {
                RenderItem(photo);
            });
        }
        var $popup = $('.upload-popup');
        var height = $popup.css('height');
        $('.fixed-top-back').addClass('border-top-fix');
        $popup.css('height', 0).show().animate({ 'height': height }, 600, function () {
            $('.upload-album .album-name').focus();
            $('#saveCancel').click(function () {
                isEdit = false;
                $popup.animate({ 'height': 0 }, 600, function () {
                    $('.fixed-top-back').removeClass('border-top-fix');
                    $popup.hide().css('height', height);
                    $button.removeClass('active');
                });
                $('#saveCancel').unbind('click');
            });
        });
    };
    function prepareUpload() {
        var filesCount = 0,
            isCanceled = false,
            files = [],
            isLoading = false;
        $('.upload-popup').click(function () {
            return false;
        });
        $('#addPhotos').click(function () {
            $('#uploadInput').click();
        });
        $('#saveUpload,#addPhotos,#saveCancel').btn();
        $('#uploadInput').change(function () {
            var newFiles = $(this)[0].files;
            for (var i = 0, len = newFiles.length; i < len; i++) {
                files.push(newFiles[i]);
            }
            filesCount = files.length;
            if (!isLoading) {
                $('#progressBlock').show();
                isLoading = true;
                Upload(0);
            }
        });
        $('.upload-album .album-date').datepicker({ dateFormat: 'mm.dd.yy' }).datepicker('setDate', '+0');
        $('#saveUpload').click(function () {
            var isOk = true;
            var name = $('.upload-album .album-name').val();
            var place = $('.upload-album .album-place').val();
            var date = $('.upload-album .album-date').val();
            var photoItems = $('.upload-photo-block .new-photo-item img');
            if (!name) {
                isOk = false;
                $('.upload-album .album-field > .album-name + .album-error').text('Заполните поле');
            }
            if (!place) {
                isOk = false;
                $('.upload-album .album-field > .album-place + .album-error').text('Заполните поле');
            }
            if (!date) {
                isOk = false;
                $('.upload-album .album-field > .album-date + .album-error').text('Заполните поле');
            }
            if (isOk) {
                var photos = [];
                for (var i = 0, len = photoItems.length, id; i < len; i++) {
                    if (id = $(photoItems[i]).attr('data-id'))
                        photos.push(id);
                }
                SaveAlbum({
                    name: name,
                    photos: photos,
                    place: place,
                    date: date,
                    id: isEdit ? location.pathname.split('/')[1].split('-')[1] : undefined
                });
            }
        });
        $('.album-field input').focusin(function () {
            $(this).next().text('')
        });
        $('#progressBlock .cancel-upload').click(function () {
            isCanceled = true;
            EmptyProgress();
        });
        $('.upload-photo-block').on('click', '.delete-photo',
            function () {
                var $item = $(this).closest('.new-photo-item');
                var id = $item.children('img').attr('data-id');
                if (id == 0) {
                    $item.remove();
                }
                else {
                    AppendRepair($item);
                    $.ajax({
                        url: '/home/photo/DeletePhoto',
                        type: 'post',
                        data: {id: id},
                        dataType: 'json',
                        success: function (data) {
                            if (data.response.err)
                                alert('Server error, sorry.');
                        }
                    });
                }
                return false;
            }
        );
        $('.upload-photo-block').on('click', '.repair-photo',
            function () {
                var $item = $(this).closest('.new-photo-item');
                var id = $item.children('img').attr('data-id');
                if (id == 0) {
                    $item.remove();
                }
                else {
                    DeleteRepair($item);
                    $.ajax({
                        url: '/home/photo/RepairPhoto',
                        type: 'post',
                        data: {id: id},
                        dataType: 'json',
                        success: function (data) {
                            if (data.response.err)
                                alert('Server error, sorry.');
                        }
                    });
                }
                return false;
            }
        );
        $('.upload-photo-block').on('mouseenter', '.delete-photo',
            function () {
                $(this).css('opacity', 1);
            }
        );
        $('.upload-photo-block').on('mouseleave', '.delete-photo',
            function () {
                $(this).css('opacity', 0.8);
            }
        );
        $('.upload-photo-block').on('mouseenter', '.new-photo-item',
            function () {
                $(this).find('.delete-photo').css('opacity', 0.8);
            }
        );
        $('.upload-photo-block').on('mouseleave', '.new-photo-item',
            function () {
                $(this).find('.delete-photo').css('opacity', 0);
            }
        );
        function Upload(i) {
            if (files[i] && !isCanceled) {
                $('#progressBlock span').text(i + '/' + filesCount);
                $('#progressBlock .progress').css('width', i/filesCount*100 + '%');
                $('<div>').addClass('upload-photo-loading').appendTo($('.upload-photo-block'));
                if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png') {
                    RenderItem({err: '/img/photo-format-error.jpg'});
                    Upload(i + 1);
                    return true;
                }
                if (files[i].size < minSize || files[i].size > maxSize) {
                    RenderItem({err: '/img/photo-size-error.jpg'});
                    Upload(i + 1);
                    return true;
                }
                var data = new FormData();
                data.append('photo', files[i]);
                $.ajax({
                    url: '/home/photo/UploadPhoto',
                    type: 'post',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: function (data) {
                        if (isCanceled) {
                            isCanceled = isLoading = false;
                            return;
                        }
                        RenderItem(data.response.err ? {} : data.response.item);
                        Upload(i + 1);
                    }
                });
            }
            else {
                EmptyProgress();
                isCanceled = isLoading = false;
            }
        };
        function EmptyProgress() {
            $('.upload-photo-loading').remove();
            $('#progressBlock').hide();
            $('#progressBlock span').text('');
            $('#progressBlock .progress').css('width', '0');
            files = [];
        };
        function SaveAlbum(model) {
            $.ajax({
                url: '/home/album/SaveAlbum',
                type: 'post',
                data: model,
                dataType: 'json',
                success: function (data) {
                    if (!data.response.err)
                        window.location.reload();
                }
            });
        };

        function AppendRepair($item) {
            $item.children().hide();
            $('<p>').addClass('repair').text('Фотография удалена')
                .append($('<span>').addClass('repair-photo').text('Восстановить'))
                .appendTo($item);
        };
        function DeleteRepair($item) {
            $item.children('.repair').remove();
            $item.children().show();
        };
    }
});
