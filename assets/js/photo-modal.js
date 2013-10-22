$('.album-photos-table,.photo-week').on('click', 'img', function () {
    var index = $(this).attr('data-id');
    $.each(Photos, function (i, p) {
        if (p._id == index) {
            index = i;
            return false;
        }
    });
    $('#bigPhoto').photo(index);
});

$.fn.photo = function (index) {
    return this.each(function () {
        var $fog = $('<div>').addClass('modal-fog');
        $('body').append($fog);
        var $prev = $('<div>').addClass('modal-back').append($('<i>').addClass('icon-caret-left'));
        $('body').append($prev);
        var $close = $('<div>').addClass('modal-close').append($('<i>').addClass('icon-remove'));
        $('body').append($close);
        var $self = $(this);
        $self.empty()
            .append($('<div>').addClass('photo-loading'))
            .append($('<div>').addClass('photo-count'))
            .append($('<img>').attr('data-id', Photos[index]._id))
            .css({ 'max-width': window.innerWidth - 300, 'max-height': window.innerHeight - 100});
        $self.fadeIn(500);
        var $photo = $self.find('img');
        var $loading = $self.find('.photo-loading');
        var allCount = Photos.length;
        var $counter = $self.find('.photo-count');
        $photo.load(function () {
            var width = $(this).css('width');
            var margin = width.split('px')[0]/2;
            $loading.hide();
            $self.stop().hide().css({ 'width': width, 'margin-left': '-' + margin + 'px' }).fadeIn(250);
            $photo.show();
            $counter.text('Фото ' + (index + 1) + ' из ' + allCount).show();
            $prev.css('right', $('body').css('width').split('px')[0]/2 + margin);

//            $self.animate({ 'width': width, 'margin-left': '-' + width.split('px')[0]/2 + 'px' }, { duration: 500, done: function () {
//                if (index == 2)
//                    width = width;
//                if ($self.css('width') == width) {
//                    $loading.hide();
//                    $photo.show();
//                    $counter.text('Фото ' + (index + 1) + ' из ' + allCount);
//                    $counter.show();
//                }
//            }});
        });
        $photo.attr('src', Photos[index].medium.replace('.med', '.big'));

        $close.click(hide);

        $fog.click(hide);

        $self.on('click', '[data-dismiss="modal"]', hide);

        $('body').on('mousedown', '.btn', function () {
            $(this).addClass('btn-clicked');
        });

        $('body').on('mouseup', '.btn', function () {
            $(this).removeClass('btn-clicked');
        });

        $prev.click(function () {
            setPhoto(--index);
        });

        $photo.click(function () {
            setPhoto(++index);
        });

        $('html').on('keyup', function (event) {
            if (event.which == '39') {
                setPhoto(++index);
            }
            else if (event.which == '37') {
                setPhoto(--index);
            }
            else if (event.which == '27') {
                hide();
            }
            return false;
        });

        function hide() {
            $self.hide();
            $fog.remove();
            $prev.remove();
            $close.remove();
            $('html').unbind('keyup');
        };

        function setPhoto(i) {
            if (!Photos[i]) {
                if (i >= allCount - 1)
                    i = index = 0;
                else
                    i = index = allCount - 1;
            }
            $loading.css({ 'width': '100%' }).show();
            $photo.hide().attr('src', Photos[i].medium.replace('.med', '.big'));
            $counter.hide();
        };
    });
};
