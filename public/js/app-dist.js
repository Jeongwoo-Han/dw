// EventListener | CC0 | github.com/jonathantneal/EventListener
this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && (function() {
    function addToPrototype(name, method) {
        Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
    }
    addToPrototype("addEventListener", function(type, listener) { // add
        var target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];
        // if no events exist, attach the listener
        if (!typeListeners.length) {
            target.attachEvent("on" + type, typeListeners.event = function(event) {
                var documentElement = target.document && target.document.documentElement || target.documentElement || {
                    scrollLeft: 0,
                    scrollTop: 0
                };

                // polyfill w3c properties and methods
                event.currentTarget = target;
                event.pageX = event.clientX + documentElement.scrollLeft;
                event.pageY = event.clientY + documentElement.scrollTop;
                event.preventDefault = function() {
                    event.returnValue = false
                };
                event.relatedTarget = event.fromElement || null;
                event.stopImmediatePropagation = function() {
                    immediatePropagation = false;
                    event.cancelBubble = true
                };
                event.stopPropagation = function() {
                    event.cancelBubble = true
                };
                event.target = event.srcElement || target;
                event.timeStamp = +new Date;

                var plainEvt = {};
                for (var i in event) {
                    plainEvt[i] = event[i];
                }

                // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
                for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
                    // check to see if the cached event still exists in the master events list
                    for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
                        if (typeListener == typeListenerCache) {
                            typeListener.call(target, plainEvt);

                            break;
                        }
                    }
                }
            });
        }
        // add the event to the master event list
        typeListeners.push(listener);
    });
    addToPrototype("removeEventListener", function(type, listener) { // remove
        var target = this,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];

        // remove the newest matching event from the master event list
        for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
            if (typeListener == listener) {
                typeListeners.splice(i, 1);

                break;
            }
        }

        // if no events exist, detach the listener
        if (!typeListeners.length && typeListeners.event) {
            target.detachEvent("on" + type, typeListeners.event);
        }
    });
    addToPrototype("dispatchEvent", function(eventObject) { // dispatch
        var target = this,
            type = eventObject.type,
            listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
            typeListeners = listeners[type] = listeners[type] || [];
        try {
            return target.fireEvent("on" + type, eventObject);
        } catch (error) {
            if (typeListeners.event) {
                typeListeners.event(eventObject);
            }
            return;
        }
    });
    Object.defineProperty(Window.prototype, "CustomEvent", { // CustomEvent
        get: function() {
            var self = this;

            return function CustomEvent(type, eventInitDict) {
                var event = self.document.createEventObject(),
                    key;

                event.type = type;
                for (key in eventInitDict) {
                    if (key == 'cancelable') {
                        event.returnValue = !eventInitDict.cancelable;
                    } else if (key == 'bubbles') {
                        event.cancelBubble = !eventInitDict.bubbles;
                    } else if (key == 'detail') {
                        event.detail = eventInitDict.detail;
                    }
                }
                return event;
            };
        }
    });
    function ready(event) { // ready
        if (ready.interval && document.body) {
            ready.interval = clearInterval(ready.interval);
            document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
        }
    }
    ready.interval = setInterval(ready, 1);
    window.addEventListener("load", ready);
})();

(!this.CustomEvent || typeof this.CustomEvent === "object") && (function() { // CustomEvent for browsers which don't natively support the Constructor method
    this.CustomEvent = function CustomEvent(type, eventInitDict) {
        var event;
        eventInitDict = eventInitDict || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        } catch (error) {
            // for browsers which don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
            event.detail = eventInitDict.detail;
        }

        return event;
    };
})();
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    window.$window = $window; // set global vars.
    window.$document = $document;
    window.$html = $html;
    window.$body = $body; 

    var _is = { // detect object
        lteIE10: !!window.ActiveXObject, // IE, lte 10
        gteIE10: (!!window.navigator.msPointerEnabled), // IE, gte 10
        cssanimations: !$html.hasClass('no-cssanimations')
    };

    $.str = {
        TRANSITIONEND_NAMES: 'webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend transitionEnd',
        ANIMATIONEND_NAMES: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd'
    };

    $.extend({
        isMobile: function(){ // 모바일인지 판단
            var check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        getUriParam: function() { // uri 파라미터 구하기
            var _result = {},
                parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                    _result[key] = value;
                });
            return _result;
        },
        getAnchor: function(_el, _tagName) { // 클릭객체 구하기
            _tagName = (_tagName !== undefined) ? _tagName : 'a';
            var _return = (_el[0].tagName !== undefined && _el[0].tagName.toLowerCase() !== _tagName) ? _el.closest(_tagName) : _el;
            return _return;
        },
        callFunc: function(_func, _obj, _param) { // callback 함수 호출하기
            _func = (typeof _func == 'string') ? window[_func] : _func;
            _param = (_param === null) ? '' : _param;
            if (_func && typeof _func == 'function') {
                _func.call(null, _obj, _param);
            } else {
                console.log('no exist function');
            }
        },
        isInview: function(_el, _options) {
            var _setting = $.extend({
                top: 0, // 상단 마진, 윈도우 크기에서 몇 퍼센트 (0.25);
                bottom: 0 // 하단 마진, 윈도우 크기에서 몇 퍼센트 (0.25);
            }, _options);
            var _getPercent = function(_int, _percent){ // 퍼센트 처리, _getPercent(100, 0.5);
                var _result = Math.floor(_int * _percent);
                return _result;
            };
            var $el = _el,
                $window = $window || $(window),
                _windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, // 윈도우 크기
                _scrollTop = document.documentElement.scrollTop || document.body.scrollTop, // 스크롤 탑
                _scrollBottom = _scrollTop + _windowHeight,
                _elOffset = $el.offset(),
                _elementTop = _elOffset.top, // 객체 상단 위치
                _elementBottom = _elOffset.top + $el.height(), // 객체 하단 위치
                _marginTop = _getPercent(_windowHeight, _setting.top), // 상단 여백 구하기
                _marginBottom = _getPercent(_windowHeight, _setting.bottom), // 하단 여백 구하기
                _isInviewElementTop = ((_scrollBottom - _marginBottom) >= _elementTop), // 스크롤 하단에 객체 상단이 들어왔는지
                _isInviewElementBottom = ((_scrollTop + _marginTop) <= _elementBottom), // 스크롤 상단에 객체 하단이 벗어나지 않았는지
                _result = (_isInviewElementTop === true && _isInviewElementBottom === true) ? true : false;
            return _result;
        },
        getMousePos: function getMousePos(e) {
            var _posX = 0,
    			_posY = 0;
    		if (!e) e = window.event;
    		if (e.pageX || e.pageY) {
    			_posX = e.pageX;
    			_posY = e.pageY;
    		} else if (e.clientX || e.clientY) {
    			_posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    			_posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    		}
    		return { x: _posX, y: _posY };
    	},
        getJsonHtml: function(_obj, _options) { // get json element
           var i = 0,
                _length = _obj.length,
                _html = '';
            var _defaults = {
                format: function(_item, _idx, _total) {
                    var _return = '';
                    _return += '<li class="item ' + 'nth-child-' + (_idx + 1) + '"><div class="module"><img src="' + _item.url + '" alt="' + _item.alt + '" class="pic" /></div></li>';
                    return _return;
                }
            };
            var opts = $.extend({}, _defaults, _options);
            while (i < _length) {
                _html += opts.format.call(null, _obj[i], i);
                i++;
            }
            return _html;
        },
        getJsonFromCustomData: function(_string) { // 커스텀 데이터로 부터 json 추출하기
            if (typeof _string != 'string') return _string;
            if (_string.indexOf(':') != -1 && _string.trim().substr(-1) != '}') {
                _string = '{' + _string + '}';
            }
            var _start = (_string ? _string.indexOf("{") : -1),
                options = {};
            var str2json = function(str, notevil) {
                try {
                    if (notevil) {
                        return JSON.parse(str.replace(/([\$\w]+)\s*:/g, function(_, $1) {
                            return '"' + $1 + '":';
                        }).replace(/'([^']+)'/g, function(_, $1) {
                            return '"' + $1 + '"';
                        }));
                    } else {
                        return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
                    }
                } catch (e) {
                    return false;
                }
            };
            if (_start != -1) {
                try {
                    options = str2json(_string.substr(_start));
                } catch (e) {}
            }
            return options;
        },
        getCustomDataByDefaults: function(_el, _defaultsArr) { // 기본값 기준으로 커스텀 데이터 불러와 배열 생성
            var _result = {};
            var returnBool = function(_str){
                if (_str == 'true') _str = true;
                if (_str == 'false') _str = false;
                return _str;
            };
            for (var key in _defaultsArr) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(),
                    _data = _el.attr('data-' + _key);
                _result[key] = _defaultsArr[key];
                if (_data !== undefined) {
                    _result[key] = returnBool(_data);
                }
            }
            return _result;
        },
        setCustomDataByDefaults: function(_el, _options) { // 기본값 기준으로 커스텀 데이커 저장
            if (typeof _options !== 'object') return false;
            var _result = _options;
            $.each(_result, function(key, val) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase();
                if (_el.attr('data-' + _key) === undefined) {
                    _el.attr('data-' + _key, _result[key]);
                }
            });
        },
        getExtendOpts: function(_defaults, _options, _el){
            // 기본값, 옵션값, 객체 커스텀 데이터 값을 기분으로 opts 배열을 반환 (우선순위 역순)
            // _opts = getExtendOpts(_defaults, _options, $this);
            var _result = $.extend({}, _defaults, _options); // 1차 병합
            var returnBool = function(_str){
                if (_str == 'true') _str = true;
                if (_str == 'false') _str = false;
                return _str;
            };
            for (var key in _defaults) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(),
                    _data = _el.attr('data-' + _key);
                _result[key] = _defaults[key];
                if (_data !== undefined) {
                    _result[key] = returnBool(_data); // 2차 병합
                }
            }
            return _result;
        },
        getRandomInArray: function(_arr) { // 배열에서 랜덤값 추출하기
            var _result = ['blue', 'red', 'green', 'orange', 'pink'];
            _result = (typeof _arr === 'object') ? _arr : _result;
            _result = _result[Math.floor(Math.random() * _result.length)];
            return _result;
        },
        getRandomInLiteralArray: function(_css, _arr){ // replace random literal array
            var _result = _css;
            if (_result == 'random') {
                var _length = 0,
                    _tmpArr = [];
                for (var key in _arr) {
                    _tmpArr[_length] = key;
                    _length++;
                }
                _result = common.getRandomInArray(_tmpArr);
            }
            return _result;
        },
        getIdxProof: function(_idx, _max) { // 인덱스값 범위 내 반환
            _idx = (_idx < 0) ? _max : _idx;
            _idx = (_idx > _max) ? 0 : _idx;
            return _idx;
        },
        onImagesLoaded: function(_el, _func, _args) { // on images loaded
            var _items = _el.filter('img'),
                _len = _items.length,
                _totalLen = 0,
                _timer = null,
                _blankImageSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            _items.one('load.imgloaded', function() {
                _totalLen = --_len;
                if (_totalLen <= 0 && this.src !== _blankImageSrc) {
                    _items.off('load.imgloaded');
                    if (typeof _func == 'function') {
                        _timer = setTimeout(function() {
                            _func.call(null, _args);
                        }, 1);
                    }
                }
            });
            _items.each(function() {
                if (this.complete || this.complete === undefined) {
                    var _src = this.src; // + '?time = ' + new Date().getTime();
                    this.src = _blankImageSrc;
                    this.src = _src;
                }
            });
            return this;
        }
    });

    $.throttle = (function() {
        var _timerThrottle;
        return function(_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

    $.debounce = function(_func, _wait, _immediate) { // debounce 함수
        // From https://davidwalsh.name/javascript-debounce-function.
        // var myEfficientFn = debounce(function() {
        // }, 250);
        // window.addEventListener('resize', myEfficientFn);
        var _timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                _timeout = null;
                if (!_immediate) _func.apply(context, args);
            };
            var _callNow = _immediate && !_timeout;
            clearTimeout(_timeout);
            _timeout = setTimeout(later, _wait);
            if (_callNow) _func.apply(context, args);
        };
    };

})(window.jQuery);

(function($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.fn.extend({
        // $('#yourElement').animateCss('bounce');
        // or;
        // $('#yourElement').animateCss('bounce', function() {
        //   // Do something after animation
        // });
        animateCss: function(animationName, callback) {
            var animationEnd = (function(el) {
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd',
                };
                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
                if (typeof callback === 'function') callback();
            });

            return this;
        },
    });

    $.fn.placeHolder = function(options) {
        var opts = $.extend({
            checkFormSubmit: false
        }, options);
        if (!("placeholder" in document.createElement("input")) || $('html').hasClass('ie')) {
            this.each(function() {
                var $this = $(this);
                $this.on({
                    'focus': function() {
                        if ($this.val() == $this.attr('placeholder')) {
                            $this.val('').removeClass('placeholder');
                        }
                    },
                    'blur': function() {
                        if ($this.val() === '' || $this.val() == $this.attr('placeholder')) {
                            $this.addClass('placeholder').val($this.attr('placeholder'));
                        }
                    }
                });
                if (opts.checkFormSubmit === true) {
                    $this.parents('form').submit(function() {
                        $(this).find('input[placeholder]').each(function() {
                            var $input = $(this);
                            if ($input.val() == $input.attr('placeholder')) {
                                $input.val('');
                            }
                        });
                    });
                }
            });
            this.blur();
        }
    };

    $.fn.equalHeight = function(options){

        this.each(function(){

            var $items = $(this).find($(options.items));
            if (!$items.length) return false;

            var _length = $items.length,
                _maxHeight = 0;
            var _core = function(){
                _maxHeight = 0;
                $items.css({
                    'minHeight': 'auto'
                });
                $items.each(function(i){
                    var $this = $items.eq(i);
                    var _height = $this.height();
                    if (_maxHeight < _height) {
                        _maxHeight = _height;
                    }
                });
                $items.css({
                    'minHeight': _maxHeight
                });
            };
            $window.on('load', function(){
                _core();
            });
        });

        return this;
    }

    var _timerDoAlt = null; // 대체텍스트 Polyfill
    $.doAlt = function(_wrap, _delay){
        var $target = (_wrap !== undefined) ? $(_wrap) : $('#content'),
            $imgs = null,
            $iframes = null;
        var delay = _delay || 1500;
        var _core = function(_t){
            $iframes = $target.find('iframe').not('[title]');
            $imgs = $target.find('img').not('[alt]');
            // console.log(_t + '/' + $imgs.length);
            for (var i = 0; i < $imgs.length; i++) {
                var $this = $imgs.eq(i);
                $this.attr('alt', '');
            }
            for (var i = 0; i < $iframes.length; i++) {
                var $this = $iframes.eq(i);
                $this.attr('title', '빈 프레임');
            }
        };
        setTimeout(function(){
            $target.imagesLoaded(function(){
                _core('map imagesloaded');
            });
        }, 500);
        _timerDoAlt = setTimeout(function(){
            _core('map timer');
        }, 1000);
    };

})(window.jQuery);

$(function() {

    // $('input[placeholder], textarea[placeholder]').placeHolder({ // placeholder
    //     checkFormSubmit: true
    // });

});

function hasClass(_el, _class) {
    return _el.getAttribute('class').indexOf(_class) > -1;
}

function addClass(_el, _class) {
    if (_el.classList) {
        _el.classList.add(_class);
    } else if (!hasClass(_el, _class)) {
        _el.setAttribute('class', _el.getAttribute('class') + ' ' + _class);
    }
}

function removeClass(_el, _class) {
    if (_el.classList) {
        _el.classList.remove(_class);
    } else if (hasClass(_el, _class)) {
        _el.setAttribute('class', _el.getAttribute('class').replace(_class, ' '));
    }
}

function toggleClass(_el, _class, _bool) {
    _bool = (_bool !== undefined) ? _bool : hasClass(_el, _class);
    if (_bool === true) {
        addClass(_el, _class);
    } else {
        removeClass(_el, _class);
    }
}

(function() {
    var method,
        noop = function() {},
        methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'],
        length = methods.length,
        console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        if (!console[method]) { // Only stub undefined methods.
            console[method] = noop;
        }
    }
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
}());

(function($) {

    var browserUtil = (function() {
        var $html = $('html'),
            _html = $html[0] || document.documentElement,
            _ua = (navigator.userAgent || navigator.vendor || window.opera),
            _location = window.location,
            _isLocalHost = (_location.origin == 'file://' || _location.hostname.match('192') || _location.port !== '') ? true : false,
            _browser = '',
            _vendorNames = {
                "android": "mobile android modern no-ie",
                "windows phone": "mobile windows modern no-ie",
                "iphone": "mobile iphone modern no-ie",
                "ipad": "mobile iphone ipad modern no-ie",
                "ipod": "mobile iphone ipod modern no-ie",
                "msie 6": "ie ie6 lt-ie7 lt-ie8 lt-ie9 lt-ie10 oldie",
                "msie 7": "ie ie7 lt-ie8 lt-ie9 lt-ie10 oldie",
                "msie 8": "ie ie8 lt-ie9 lt-ie10 oldie",
                "msie 9": "ie ie9 lt-ie10",
                "msie 10": "ie ie10 gte-ie10",
                "msie 11": "ie ie11 gte-ie10",
                "edge": "edge gte-ie10 modern",
                "chrome": "chrome modern no-ie",
                "webkit": "webkit modern no-ie",
                "safari": "safari modern no-ie",
                "firefox": "firefox modern no-ie"
            },
            _device = ((/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(_ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(_ua.substr(0, 4)))) ? 'mobile' : 'classic',
            _browser;

        var hasClass = hasClass || function(_el, _class) {
                return _el.getAttribute('class').indexOf(_class) > -1;
            },
            addClass = addClass || function(_el, _class) {
                if (_el.classList) {
                    _el.classList.add(_class);
                } else if (!hasClass(_el, _class)) {
                    _el.setAttribute('class', _el.getAttribute('class') + ' ' + _class);
                }
            },
            removeCl = removeClass || function(_el, _class) {
                if (_el.classList) {
                    _el.classList.remove(_class);
                } else if (hasClass(_el, _class)) {
                    _el.setAttribute('class', _el.getAttribute('class').replace(_class, ' '));
                }
            },
            toggleClass = toggleClass || function(_el, _class, _bool) {
                _bool = (_bool !== undefined) ? _bool : hasClass(_el, _class);
                if (_bool === true) {
                    addClass(_el, _class);
                } else {
                    removeClass(_el, _class);
                }
            }

        _html.className += ' ' + _device;

        if (_ua.indexOf("Win") != -1) { // navigator.platform.toLowerCase()
            _html.className += ' windows';
        }

        if (navigator.appVersion.toLowerCase().indexOf('edge') > -1) {
            _ua = 'edge';
        } else if ('behavior' in document.documentElement.style && '-ms-user-select' in document.documentElement.style) {
            _ua = 'msie 10';
        } else if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
            _ua = 'msie 11';
        } else if (!!window.chrome) {
            _ua = 'chrome';
        }

        for (var key in _vendorNames) {
            if (_ua.toLowerCase().match(key)) {
                _browser = _vendorNames[key];
                _html.className += ' ' + _browser;
            }
        }
        if (_isLocalHost === true) {
            _html.className += ' is-localhost';
        }

        window.isMobile = (_device == 'mobile') ? true : false; // set global vars.
        window.browser = _browser;

    })();

    var replaceMeta = (function() {

        var _isMobile = isMobile; // 모바일 기기인지 판단

        var $equiv = $('meta[http-equiv="X-UA-Compatible"]'),
            $viewport = $('meta[name="viewport"]'),
            $head = $('head'),
            _head = document.getElementsByTagName('head')[0],
            _viewport = null,
            _equiv = null;

        if (!$viewport.length && _isMobile === true) { // 모바일 기기 이며 메타 뷰포트가 없을때
            _viewport = document.createElement('meta');
            _viewport.setAttribute('name', 'viewport');
            _viewport.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no');
            _head.insertBefore(_viewport, _head.firstChild);
        }

        if (!$equiv.length) { // 메타 equiv 가 없을때
            _equiv = document.createElement('meta');
            _equiv.setAttribute('http-equiv', 'X-UA-Compatible');
            _equiv.setAttribute('content', 'IE=edge');
            _head.insertBefore(_equiv, _head.firstChild);
        }

    })();

})(window.jQuery);

window.base = (typeof window.base !== 'undefined') ? window.base : {};
window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : [];

// 뒤로 가기 재발생 이벤트 강제, https://programmingsummaries.tistory.com/380
window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload();
  }
};

/**
@prepros-prepend './app/_polyfills.js'
@prepros-prepend './app/_function.js'
@prepros-prepend './app/_jquery.extend.js'
*/

