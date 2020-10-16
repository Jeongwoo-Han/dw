(function($){

    'use strict';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body'),
        $container = $('#container');

    var settings = {
        anchor: null,
        id: 'modal',
        size: '400x400',
        className: 'is-modal', // 추가될 class명
        scroll: true, // 스크롤 필요한지
        scrollEl: 'modal-scroller', // 스크롤되는 객체
        url: null,
        html: null,
        onComplete: function(_el){ // 열렸을때
            if (typeof $.init == 'function') {
                $.init();
                console.log('$.init');
            }
        },
        onSubmit: function(){ // 확인 버튼
            console.log('submit');
        },
        onClose: function(){ // 닫기 버튼
            console.log('close');
        }
    };

    var opts = {};
    var REGSIZE = /^(\d{1,4})x(\d{1,4})$/;

    var isActive = false; // active

    var $modal = null;
    var $modalContent = null;
    var $sandbox = $('<div />');

    var scrollTop = 0;

    var htmlUpper = [ // 풀사이즈가 아닐때
        '    <a href="javascript:;" class="js-modal-close outer-close"><i class="icon"><em>닫기</em></i></a>',
        '    <div class="md-modal">',
        '        <div class="md-modal-wrapper">',
        '            <div class="md-modal-holder">',
        '                <div class="md-modal-relative">',
        // '                    <a href="javascript:;" class="js-modal-close inner-close"><i class="icon"><em>닫기</em></i></a>',
        '                    <div class="md-modal-inner">',
        '                        <div class="md-modal-content">',
    ];
    var htmlDowner = [
        '                        </div>',
        '                    </div>',
        '                    <a href="javascript:;" class="js-modal-close inner-close"><i class="icon"><em>닫기</em></i></a>',
        '                </div>',
        '            </div>',
        '        </div>',
        '    </div>'
    ];

    // 리셋
    var reset = function(_options){

        opts = $.extend({}, settings, _options);

        $sandbox = $('<div />');
        $modal = $('#' + opts.id);

        if (!$modal.length) { // 타겟이 없을 경우
            var _html = '';
            $modal = $('<div class="modal-container"></div>');
            $modal.attr('id', opts.id);
            $body.append($modal);
            _html = htmlUpper.join('') + htmlDowner.join('');
            $modal.html(_html);
        }
        $modalContent = $modal.find('.md-modal-content');
        $modalContent.html(opts.html);
    }

    // 커스텀 데이터 확장
    var getCustomData = function($el, _arr){
        var _result = {};
        $.each(_arr, function(key, val) { // get custom data
            var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(), // buttonSubmit 을 button-submit 등으로 camelCase 를 hipen 구조로 변환
                _data = $el.data(_key);
            if (_data !== undefined) _result[key] = _data;
        });
        return _result;
    };

    // set attr
    var setAttr = function(){
        var _size = opts.size.split('x');
        var _css = {};
        var _unusefullClose = ''; // 불필요한 닫기 버튼
        $modal.addClass(opts.className)
        if (opts.size.indexOf('fullsize') < 0) { // 풀사이즈가 아닐때
            var _height = parseInt(_size[1], 10);
            var _windowHeight = $window.height();
            _height = parseInt(Math.min(_height, (_windowHeight - (_windowHeight * 0.2))), 10);
            _css = {
                'max-width': parseInt(_size[0], 10),
                'height': _height
            };
            _unusefullClose = '.outer-close';
        } else {
            _unusefullClose = '.inner-close';
        }
        $modal.find(_unusefullClose).remove(); // 닫기 버튼 제거
        $modal.find('.md-modal-inner').css(_css);
    };

    // 초점이동
    var focus = function(_bool){
        if (_bool === true) {
            $modal.find('.md-modal-inner').attr('tabIndex', 0).focus();
            $('html, body').stop().animate({
                'scrollTop': scrollTop
            }, 0);
        } else {
            $modal.find('.md-modal-inner').removeAttr('tabIndex');
            var $anchor = opts.anchor;
            if (opts.anchor !== null && typeof $anchor == 'object' && $anchor.length) {
                $anchor.attr('tabIndex', 0);
                $anchor.focus();
                $('html, body').stop().animate({
                    'scrollTop': scrollTop
                }, 300);
            }
        }
    };

    // anim
    var anim = function(_bool){
        if (_bool !== true) { // 끄기
            $modal.removeClass('anim');
            $html.removeClass('is-overlay');
            setTimeout(function(){
                $modal.removeClass('in');
                focus(false);
                isActive = false;
            }, 200);
        } else { // 켜기
            $html.addClass('is-overlay is-indicator'); // 오버레이
            scrollTop = $window.scrollTop();
            $modal.addClass('in');
            setTimeout(function(){
                $html.removeClass('is-indicator');
                $modal.addClass('anim');
                focus(true);
                isActive = true;
            }, 200);
        }
    };

    var empty = function(_bool){
        if (_bool === true) {
            if (opts.className == 'is-modal-youtube') {
                $modalContent.empty(true);
            }
        }
    };

    var onComplete = function(){
        var func = opts.onComplete;
        if (typeof func == 'function') {
            func.call(null, $modal);
        }
        var $activeTab = $modal.find('li.in a'); // 탭 있을때 초기화 클릭
        if ($activeTab.length) {
            $activeTab.trigger('click');
        }
        if ($modal.find('.js-slider').length) { // 슬라이더 있으면
            setTimeout(function(){
                // window.singleSlider();
                initSlider();
            }, 300);
        }
        $modalContent.parent().stop().animate({ // scroll top
            'scrollTop': 0
        }, 50);
    };

    var onClose = function(){
        var func = opts.onClose;
        if (typeof func == 'function') {
            func.call(null);
        }
        var $anchor = opts.anchor;
        setTimeout(function(){
            console.log(typeof $anchor);
        }, 10)
    };

    var onSubmit = function(){
        var func = opts.onSubmit;
        if (typeof func == 'function') {
            func.call(null);
        }
    };

    // 이벤트 핸들링
    var setEvent = function(){
        $modal.off('.modal');
        $modal.one('click.modal', '.js-modal-submit', function(e){
            e.preventDefault();
            e.stopPropagation();
            fullsize(false);
            anim(false);
            empty(true);
            onSubmit();
        });
        $modal.one('click.modal', '.js-modal-close', function(e){
            e.preventDefault();
            e.stopPropagation();
            fullsize(false);
            anim(false);
            empty(true);
            onClose();
        });
        $modal.on('click.modal', function(e){
            var $this = $(e.target);
            if (!$this.closest('.md-modal-inner').length) {
                e.preventDefault();
                e.stopPropagation();
                fullsize(false);
                anim(false);
                empty(true);
                onClose();
            }
        });
        $window.on('mousewheel.modal, DOMMouseScroll.modal', function(e){
            var $this = $(e.target);
            if (isActive === true && opts.className === 'is-modal-youtube') {
                return false;
            }
        });
    };

    var fullsize = function(_bool){
        if (opts.size.indexOf('fullsize') > -1 && opts.className !== 'is-modal-youtube') { // 풀사이즈일때
            if (_bool === true) {
                scrollTop = $window.scrollTop();
                setTimeout(function(){
                    $html.addClass('is-modal-fullsize');
                    $('html, body').stop().animate({
                        'scrollTop': 0
                    }, 0);
                }, 300);
            } else {
                $html.removeClass('is-modal-fullsize');
            }
        }
    }

    // 내용 그리기
    var draw = function(){

        // 샌드박스
        $sandbox.html(opts.html);

        // custom data 확장
        var extOpts = getCustomData($sandbox.children(), opts);
        opts = $.extend({}, opts, extOpts);

        fullsize(true);

        // html 그리기
        opts.html = $sandbox.children().html();
        $modalContent.html(opts.html);

        // 이벤트 바인딩
        setEvent(true);

        // setStyle
        setAttr();

        // 애니메이션
        anim(true);

        // 콜백, 열렸을때
        onComplete();

    };

    // 타입 분기
    var build = {
        ajax: function(_options){
            reset(_options);
            console.log('load url:' + opts.url);
            $sandbox.load(opts.url, function(_response){
                opts.html = _response;
                draw(); // 내용 그리기
            });
        },
        youtube: function(_options){ // 유투브
            reset(_options);
            var returnParserYoutube = function(url){
                var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                var match = url.match(regExp);
                return (match&&match[7].length==11)? match[7] : false;
            };
            var _url = 'https://www.youtube.com/embed/' + returnParserYoutube(opts.url) + '?autoplay=1&controls=1';
            var _code = '<iframe width="100%" height="100%" src="'+ _url +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            var _response = '<div>' + _code + '</div>';
            opts.html = _response;
            // console.info(opts);
            draw(); // 내용 그리기
        },
        html: function(_options){
            reset(_options);
            draw(); // 내용 그리기
        }
    };

    // 외부 함수
    var model = {
        destory: function(){

        },
        build: function(){

        }
    };

    var modal = function(_options, _type) {
        switch (_type) {
            case 'ajax':
                build.ajax(_options);
                break;
            case 'html':
                build.html(_options);
                break;
            case 'youtube':
                build.youtube(_options);
                break;
            default:
                model.destory(_options);
        }
    };

    var Modal = function(_options){
        return {
            close: function(_options){
                model.destory();
            },
            ajax: function(_options){
                modal(_options, 'ajax');
            },
            html: function(_options){
                modal(_options, 'html');
            },
            youtube: function(_options){
                modal(_options, 'youtube');
            },
        }
    };

    $.modal = new Modal();

})(window.jQuery);

$(function(){

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body'),
        $container = $('#container');

    var setHander = (function(){

        /**
        $.modal.ajax({
            className: 'is-modal-nospam', // 모달에 추가될 class
            size: '510x350', // 모달 사이즈
            anchor: null, // 클릭하면 포커스가 돌아갈 객체
            id: 'modalNoSpam', // 모달 ID
            url: '../html_ajax/_nospam.html' // url
        });
        */

        // modal 띄우기
        $document.on('click', '.js-modal', function(e){
            e.preventDefault();
            var $anchor = $(e.target);
            $anchor = $anchor.is('a') ? $anchor : $anchor.closest('a');
            var _url = $anchor.data('url');
            var _id = $anchor.data('id') || 'modal';
            $.modal.ajax({
                anchor: $anchor, // 클릭 요소
                id: _id, // 생성될 레이어 팝업 DOM 객체의 ID
                url: _url // 호출될 ajax URL
            });
        });

        // 유투브 동영상
        $document.on('click', '.js-modal-youtube', function(e){
            e.preventDefault();
            var $anchor = $(e.target);
            $anchor = $anchor.is('a') ? $anchor : $anchor.closest('a');
            var _url = $anchor.data('url');
            if ($html.attr('class').indexOf('suit-classic') == -1) { // 모바일이면
                window.open(_url);
            } else {
                $.modal.youtube({
                    anchor: $anchor,
                    id: 'modalYoutube',
                    className: 'is-modal-youtube',
                    size: 'fullsize',
                    url: _url
                });
            }
        });

        // attr title
        if ($html.attr('class').indexOf('suit-classic') == -1) {
            $('.js-modal-youtube').each(function(){
                $(this).attr('title', '새창열기');
            });
        }

        // 컨텐트 팝업
        $document.on('click', '.js-modal-content', function(e){
            e.preventDefault();
            var $anchor = $(e.target);
            $anchor = $anchor.is('a') ? $anchor : $anchor.closest('a');
            var _url = $anchor.data('url');
            $.modal.ajax({
                anchor: $anchor,
                id: 'modalContent', // 모달 ID
                url: _url, // url
                onSubmit: function(){
                    // console.log('submit');
                },
                onClose: function(){
                    // console.log('close');
                }
            });
        });

    })();


});
