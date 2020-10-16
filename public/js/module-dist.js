;(function(root) { // 글로벌 함수 선언

    'use strict';

    root.detectMobile = root.detectMobile || function() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    root.extend = root.extend || function(_source, _props) { // object 병합
        var _key;
        for (_key in _props) {
            if (_props.hasOwnProperty(_key)) {
                _source[_key] = _props[_key];
            }
        }
        return _source;
    };

    root.throttle = root.throttle || function(fn, threshhold, scope) { // throttle
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;
            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) { // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };

    root.debounce = root.debounce || function(func, wait, immediate) { // debonce

        /*
        var returnedFunction = debounce(function() {
            noop();
        }, 250);
        */

        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    root.random = root.random || function() { // 0~1000 난수
        return Math.floor(Math.random() * 1000)
    }

    root.round = root.round || function(n) { // 소숫점 4자리
        return Math.round(n * 10000) / 10000;
    }

    root.setUniqueId = root.setUniqueId || function(_str) { // Unique Id 생성하기, 특수문자 제거 또는 난수 생성
        return (typeof _str == 'string') ? _str.toLowerCase().replace(/[^a-z0-9)]/gi, '') : Math.floor(Math.random() * 1000)
    };

    root.hyphenate = root.hyphenate || function(_value) { // camelCase to hypen pattern, hyphenate(key)
        var cache = {};
        var replacer = function(_match) {
            return '-' + _match[0].toLowerCase();
        };
        return cache[_value] || (cache[_value] = _value.replace(/([A-Z])/g, replacer));
    }

})(this);

/*
 * 'Highly configurable' mutable plugin boilerplate
 * Author: @markdalgleish
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// Note that with this pattern, as per Alex Sexton's, the plugin logic
// hasn't been nested in a jQuery plugin. Instead, we just use
// jQuery for its instantiation.

;(function($, window, document, undefined) {

    'use strict';

    var isMobile = isMobile || detectMobile();

    var root = (function(g) { // global 셋업
        return g;
    })(this);

    var BaseInView = function(elements, options) { // plugin constructor 생성

        var base = { // base 선언
            appId: '',
            $el: (typeof elements == 'string') ? $(elements) : elements,
            length: 0,
            scope: [],
            visible: [],
            window: {
                scrollTop: 0
            }
        };

        if (!base.$el.length) return false;

        base.appId = setUniqueId(base.$el.attr('id')) + random(); // set unit app id

        var $document = $(document), // dom 캐쉬
            $window = $(window),
            $html = $('html'),
            $body = $('body'),
            __this = this;

        var metadata = base.$el.attr('data-plugin-options'); // option 에 취합하기 위한 metadata 생성, // <body id="app" data-plugin-options='{ "foo": "123" }'>
        metadata = (metadata !== undefined) ? $.parseJSON(metadata) : {};

        var defaults = { // default 셋팅
            namespace: '.app',
            countUpEl: '.inview-countup', // count up el, <span class="inview-count" data-end="1968">1968</span>
            countUpRestart: false, // 카운트업 재시작
            darkmode: false, // dark mode
            darkmodeToggleClass: false,
            onInit: noop,
            onResize: noop,
            onScroll: noop,
            thresholdTop: (isMobile === true) ? 0 : 0.15, // 지연 임계치, %로 환산, 모바일일때 0
            thresholdBottom: (isMobile === true) ? 0 : 0.15,
            once: false, // 한번만 실행 (removeClass 안함, PC, 모바일 모두)
            onceAtMobile: true, // 모바일에서 한번만 실행 (removeClass 안함)
            throttleScrollDelay: 100
        };

        var opts = {}; // option 셋업

        var timer = { // 타이머 셋업
            scroll: null // 스크롤 타이머
        };

        /* common functions **************************************************/
        function noop() {}; // noop

        function callFunc(_func, _param){ // call function
            _func = (typeof _func == 'string') ? window[_func] : _func;
            _param = (_param === null) ? '' : _param;
            if (typeof _func !== 'function') return false;
            _func.call(null, base, _param);
        };

        /* private functions **************************************************/
        var model = {
            getWindow: function(){
                var _getPercent = function(_int, _percent) { // 퍼센트 처리, _getPercent(100, 0.5);
                    var _result = Math.floor(_int * _percent);
                    return _result;
                };
                base.window.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || $window.height();
                base.window.thresholdTop = _getPercent(base.window.height, (isMobile === true) ? 0 : opts.thresholdTop); // 임계치, 모바일일때 0
                base.window.thresholdBottom = _getPercent(base.window.height, (isMobile === true) ? 0 : opts.thresholdBottom);
            },
            getScope: function(){
                base.scope = [];
                var _scope = {};
                for (var i = 0; i < base.length; i++) {
                    var $this = base.$el.eq(i),
                        _top = $this.offset().top,
                        _height = $this[0].offsetHeight || $this.height(),
                        _middle = _top + (_height * 0.5);
                    _scope = {
                        top: Math.ceil(_top), // offset top
                        middle: Math.round(_middle),
                        bottom: Math.floor(_top + _height), // offset bottom
                        countUp: ($this.find(opts.countUpEl).length) ? true : false, // count up element
                        dark: (opts.darkmode === true && $this.attr('data-dark')) || false,
                        id: $this.attr('id')
                    };
                    base.scope.push(_scope);
                }
                // console.info(base.scope);
            },
            init: function(){
                base.$el = $(elements);
                base.length = base.$el.length;
            }
        };
        var handler = {
            scroll: function(){
                var currentFloatingId = '';
                var floatingNav = {
                    init: function() {
                        this.nav = $('#floating-nav');
                        this.lis = this.nav.find('li');
                    },
                    nav: '',
                    currentId: '',
                    lis: '',
                    active: function(id) {
                        var that = this;
                        if (id === 'undefined') return false;
                        this.lis.each(function(i, o) {
                            var li = $(o);
                            var targetId = li.find('a').attr('href').replace('#', '');
                            if (id == targetId) {
                                if (id == currentFloatingId) return false;

                                floatingNav.resetAll();
                                li.addClass('active');
                                floatingNav.moveSlide(li);
                                currentFloatingId = id;
                            }
                        });
                    },
                    moveSlide: function(li) {
                        var aPos = li.position().top;
                        floatingNav.nav.find('.slider').css('top', aPos);
                    },
                    resetAll: function() {
                        this.lis.removeClass('active');
                    }
                };

                var onScroll = function () {
                    var _getScroll = function(){
                        base.window.top = window.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || $window.scrollTop(); // window scroll to
                        base.window.middle = base.window.top + (base.window.height * 0.5);
                        base.window.bottom = base.window.top + base.window.height;
                    };

                    var mainVisual = $('.new-main-visual');
                    var activeNavPos = parseInt(mainVisual.height() * 0.4);

                    if (base.window.top > activeNavPos && base.window.top) {
                        $('html').addClass('active-floating-nav');
                    } else {
                        $('html').removeClass('active-floating-nav');
                    }

                    var _getItems = function(){

                        base.visibleIdx = []; // visible idx
                        base.invisibleIdx = [];

                        // base.window.thresholdTop, base.window.thresholdBottom 는 inview
                        var _prevIdx = base.window.height;

                        var setAttrs = function(el, attrs) { // tslint:disable-next-line:forin
                            for (var key in attrs) {
                                el.attr("data-" + hyphenate(key), attrs[key]);
                            }
                        };

                        for (var i = 0; i < base.scope.length; i++) {

                            var _this = base.scope[i],
                                $this = base.$el.eq(i);

                            _this.containTop = (base.window.bottom >= _this.top); // 순수 기준선
                            _this.containBottom = (base.window.top <= _this.bottom);
                            _this.contain = (_this.containTop && _this.containBottom);
                            _this.inviewTop = (base.window.bottom - base.window.thresholdTop >= _this.top); // threshold(임계점)을 포함한 기준선
                            _this.inviewBottom = (base.window.top + base.window.thresholdBottom <= _this.bottom);
                            _this.inview = (_this.inviewTop && _this.inviewBottom);

                            var _currentIdx = Math.abs( _this.middle - base.window.middle); // get current idx

                            if (_currentIdx <= _prevIdx) { // current idx
                                base.currentIdx = i;
                                _prevIdx = _currentIdx;
                                floatingNav.active(_this.id);
                            }

                            if (_this.contain !== true) { // 영역을 벗어 났을때
                                base.invisibleIdx.push(i);
                            }

                            if (_this.inview === true) { // 임계치를 포함한 inview 영역 안에 들어 왔을때
                                base.visibleIdx.push(i); // set visible idx
                            }

                            if (opts.darkmode === true) { // darkmode
                                var _boolTop = (_this.top - 40 <= base.window.top) && (_this.bottom >= base.window.top + 40);
                                var _boolBottom = (_this.bottom + 40 >= base.window.bottom) && (_this.top <= base.window.bottom - 40);
                                base.topIdx = (_boolTop === true) ? i : base.topIdx;
                                base.bottomIdx = (_boolBottom === true) ? i : base.bottomIdx;
                            }

                        }
                    }

                    var _countUp = function(_el, _bool){ // count up, 숫자 카운트
                        var $el = _el.find(opts.countUpEl);
                        var _stop = function($el){
                            $el.prop('Counter', 0).stop().text('0');
                        };
                        if (_bool === false && opts.countUpRestart === true) {
                            $el.each(function () {
                                var $this = $(this);
                                if ($this.hasClass('is-count-upped') !== true) return false;
                                _stop($this);
                                $this.removeClass('is-count-upped');
                            });
                        } else {
                            $el.each(function (i) {
                                var $this = $(this),
                                    _end = $this.data('countup') || $this.text();
                                var _start = function(){
                                    if ($this.hasClass('is-count-upped')) return false;
                                    _stop($this);
                                    $this.addClass('is-count-upped').animate({
                                        Counter: _end
                                    }, {
                                        duration: 1700, // Speed of counter in ms, default animation style
                                        easing: 'swing',
                                        step: function (now) {
                                            $this.text(Math.ceil(now)); // Round up the number
                                        }
                                    });
                                }
                                _start();
                            });
                        }
                    };

                    var _activate = function(){ // do activate

                        if (base.currentIdx === undefined) return false;

                        base.$active = base.$el.eq(base.currentIdx);
                        // base.$el.removeClass('in-current'); // do current idx;
                        // console.log('in-current');
                        base.$active.addClass('in-current');

                        var _removeClass = function($el){
                            if (!$el.length) return false;
                            // $el.removeClass('in').attr('data-scroll', 'out');
                        };

                        // invisible
                        for (var j = 0; j < base.invisibleIdx.length; j++) {
                            var $invisible = base.$el.eq(base.invisibleIdx[j]);

                            if (isMobile === true) { // 모바일일때
                                if (opts.once !== true && opts.onceAtMobile !== true) { // 한번만 실행이 아니면
                                    _removeClass($invisible);
                                }
                            } else if (opts.once !== true) { // 모바일이 아닐때
                                _removeClass($invisible);
                            }

                            if (base.scope[base.invisibleIdx[j]].countUp == true) { // 카운트업 초기화, 보강필요
                                _countUp($invisible, false);
                            }

                        }

                        // visible
                        for (var k= 0; k < base.visibleIdx.length; k++) {
                            var $visible = base.$el.eq(base.visibleIdx[k]);
                            $visible.addClass('in inviewed').attr('data-scroll', 'in');

                            if (base.scope[base.visibleIdx[k]].countUp === true) { // count up
                                _countUp($visible, true);
                            }
                        }

                        if (opts.darkmode === true) { // dark mode

                            if (base.topIdx === undefined) base.topIdx = 0;
                            if (base.bottomIdx === undefined) base.bottomIdx = base.length - 1;
                            $html.toggleClass('is-dark-middle', base.scope[base.currentIdx].dark);
                            $html.toggleClass('is-dark-top' , base.scope[base.topIdx].dark);
                            $html.toggleClass('is-dark-bottom' , base.scope[base.bottomIdx].dark);
                            if (opts.darkmodeToggleClass === true) { // dark mode toggle class
                                base.$el.removeClass('in-top in-bottom');
                                base.$el.eq(base.topIdx).toggleClass('in-top');
                                base.$el.eq(base.bottomIdx).toggleClass('in-bottom');
                            }
                        }

                    };

                    floatingNav.init();
                    floatingNav.resetAll();

                    _getScroll();
                    _getItems();
                    _activate();

                    callFunc(opts.onScroll); // callback

                };

                if (timer.scroll !== null) { // 타이머 해제
                    clearTimeout(timer.scroll);
                    timer.scroll = null;
                }

                timer.scroll = setTimeout(onScroll, 10);

            },
            resize: function(){
                model.init();
                model.getWindow(); // 윈도우 특성 탐지
                model.getScope(); // items 특성 탐지
                this.scroll();
                // callFunc(opts.onResize); // callback
            },
            init: function(){

                handler.resize();

                var debounceResize = debounce(function() { // resize
                    handler.resize();
                }, 300);

                var throttleScroll = throttle(function() { // scroll
                    handler.scroll();
                }, opts.throttleScrollDelay);

                $window.on('resize' + opts.namespace, debounceResize); // set handler
                $window.on('scroll' + opts.namespace, throttleScroll); // set handler

            },
            destroy: function(){
                $window.off('scroll' + opts.namespace, this.scroll); // set handler
            }
        };

        /* public functions ***************************************************/
        function refresh() { // refresh
            console.log('refresh');
        };

        function init() {
            opts = $.extend({}, defaults, options, metadata); // option 셋업
            handler.init(); // 핸들러 등록
        };

        init();

        /* public method ******************************************************/
        return {
            init: init,
            refresh: refresh
        }

    };

    $.fn.plugin = function(options) { // jquery 플러그인 생성
        return this.each(function() {
            new BaseInView(this, options);
        });
    };

    window.BaseInView = BaseInView; // set global func

})(jQuery, window, document);