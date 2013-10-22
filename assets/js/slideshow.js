var Slideshow = {
    _options: {
        slideTable: '',
        albums: [],
        items: []
    },
    Init: function (args) {
        var self = this;
        var o = $.extend(self._options, args);

        self.RenderAlbums();

        $('.album-item').hover(
            function () {
                setOpacity($(this).find('.album-item-info'), 1, 0.7);
            },
            function () {
                setOpacity($(this).find('.album-item-info'), 0.7, 0.3);
            }
        );
        $('.album-item-info').hover(
            function () {
                setOpacity($(this), 1, 0.8);
            },
            function () {
                setOpacity($(this), 1, 0.7);
            }
        );
        function setOpacity($elem, elemOpacity, backOpacity) {
            $elem.css({ 'opacity': elemOpacity, 'background': 'rgba(24, 7, 35, ' + backOpacity + ')' });
        };
    },
    RenderAlbums: function () {
        var self = this;
        var o = self._options;

        var $tbody = $(o.slideTable + ' tbody:first');
        var $tr = $('<tr>').addClass('double');

        for (var i = 0, len = o.albums.length; i < len; i++) {
            var $album = $('<div>').addClass('album-item');
            var $info = $('<div>').addClass('album-item-info')
                .append($('<span>').addClass('album-info')
                    .append($('<i>').addClass('icon-calendar'))
                    .append($('<p>').addClass('album-info-date').text(new Date(o.albums[i].date).format('dddd d mmmm')))
                    .append($('<p>').text(o.albums[i].place))
                    .append($('<p>').text(o.albums[i].name)));
            var $item = $('<div>').addClass('slide-album-item');
            var $a = $('<a>').attr('href', 'album-' + o.albums[i]._id).append($item).append($info);
            $album.append($a);
            $tr.append($('<td>').append($album));
            var $big = $('<div>').addClass('big-photo-preview').appendTo($item);
            var $min = $('<div>').addClass('min-photo-preview').css('top', '15px').appendTo($item);
            var minCount = Math.floor(o.albums[i].photos.length / 4);
            var start = 0;
            $.each([ $min, $min.clone().css('top', '100px').appendTo($item), $min.clone().css('top', '185px').appendTo($item) ], function (j, el) {
                o.items.push({
                    $item: el,
                    photos: o.albums[i].photos.slice(start, start += minCount).map(function (el) {
                        return '/img/' + el.small;
                    }),
                    index: 0
                });
            });
            o.items.push({
                $item: $big,
                photos: o.albums[i].photos.slice(start).map(function (el) {
                    return '/img/' + el.small.replace('.min', '.med');
                }),
                index: 0
            });
            if (i % 2) {
                $tbody.append($tr);
                $tr = $tr.clone().empty();
            }
        }
        if (i % 2) {
            $tbody.append($tr);
        }
        self.PreparePhotos();
    },
    PreparePhotos: function () {
        var self = this;
        var o = self._options;

        $.each(o.items, function (i, el) {
            el.$item.append($('<img>').addClass('front').attr('src', el.photos[el.index++]));
            el.$item.append($('<img>').addClass('hidden').css('display', 'none').attr('src', el.photos[el.photos[el.index] ? el.index++ : --el.index]));
        });
        self.AnimatePhotos($('.slide-album-item img.hidden'), $('.slide-album-item img.front'));
    },
    AnimatePhotos: function (hidden, front) {
        var self = this;
        var o = self._options;

        setTimeout(function () {
            hidden.fadeIn(600).addClass('front').removeClass('hidden');
            front.fadeOut(400).removeClass('front').addClass('hidden');
            setTimeout(function () {
                $.each(o.items, function (i, el) {
                    if (!el.photos[el.index])
                        el.index = 0;
                    el.$item.find('.hidden').attr('src', el.photos[el.index++]);
                });
            }, 400);
            self.AnimatePhotos(front, hidden);
        }, 4500);
    }
}
