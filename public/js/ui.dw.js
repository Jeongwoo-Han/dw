var _page = {
    $win : $(window), $html : null, $body : null, wintitle : "", scrollcontroller : null, msg : {selected : "선택됨"},
    grid : {
        slide : {
            init : function(_this){
                var $wrap = $.$(_this);
                var _pagination = $wrap.find(".progressbar").length>0 ? { el: '.progressbar', type: 'progressbar'}: $wrap.find(".swiper-pagination[data-type='fraction']").length>0 ? { el: '.swiper-pagination', type: 'fraction', renderFraction:function(currentClass, totalClass){return '<span class="' + currentClass + '"></span><span class="' + totalClass + '"></span>'}, formatFractionCurrent: function (num){ return twonum(num)}, formatFractionTotal: function (num){ return twonum(num)}} : $wrap.find(".swiper-pagination").length>0 ? { el: '.swiper-pagination', bulletElement: 'button', clickable: true}: { el: null, type: null};
                var _nextEl = $wrap.find(".swiper-button-next").length>0 ? ".swiper-button-next": null;
                var _prevEl = $wrap.find(".swiper-button-prev").length>0 ? ".swiper-button-prev": null;
                if(_this.gridoption.option&&_this.gridoption.option.custom){
                    _pagination = { el: _this.gridoption.option.custom, clickable: true, renderBullet: function (index, className){
                        return '<button type="button" class="'+className+'">'+($wrap.find(".swiper-slide").eq(index).data("custom")||index)+'</button>'
                    }}
                }else if(_this.gridoption.option&&_this.gridoption.option.dotcircle){
                    _pagination.renderBullet = function (index, className){
                        return '<button type="button" class="'+className+'">'+index+'<span class="circle"><i></i><i></i></span></button>'
                    };
                }
                var previewSet = function(){
                    var _ = this, $previews = _.$el.find(_.params.preview), previews_idx = [], _html;
                    if($previews.length==0) return;
                    previews_idx = [_.params.loop&&_.activeIndex==0&&_.params.slidesPerView==1?_.slides.length-3:_.activeIndex-1, _.params.loop&&_.realIndex==0&&_.params.slidesPerView==1?2:_.activeIndex+1];
                    $previews.each(function(){
                        var $this = $.$(this), isCase = $this.parent().is(".swiper-button-next") ? 1 : 0;
                        _html = previews_idx[isCase]>=0 && _.slides.length>previews_idx[isCase] ? _.slides[previews_idx[isCase]].getAttribute("data-preview") : null;
                        if($this.find(".js-preview")) $this.find(".js-preview").remove();
                        if(_html) $this.append("<div class='js-preview' style='display:none;'>"+_html+"</div>").promise().done(function(){ $this.find(".js-preview").fadeIn(400) });
                    });
                };
                var _leng, _lengoption, iscontrol = true, _options, _default = {
                    speed: 600,
                    threshold: 10,
                    slidesPerView: 'auto',
                    simulateTouch: false,
                    pagination: _pagination,
                    noSwipingSelector : "button, input, select, textarea",
                    navigation: { nextEl: _nextEl, prevEl: _prevEl },
                    on: {
                        init: function(){
                            this.$el.find(".swiper-slide-duplicate").attr("aria-hidden",true).find("a, button").attr("tabindex",-1);
                            if(this.params.preview && (!this.params.loop || this.params.speed==0)) previewSet.call(this);
                        },
                        slideChange: function(){
                            if(this.params.preview) previewSet.call(this);
                        },
                        slideNextTransitionStart: function(){
                            $.$(this.el).replaceClass("direction\-prev","direction-next");
                        },
                        slidePrevTransitionStart: function(){
                            $.$(this.el).replaceClass("direction\-next","direction-prev");
                        }
                    }
                };
                _options = $.extend({}, _default, _this.gridoption.option||{});
                if(_options.thumbs&&_options.thumbs.swiper) _options.thumbs.swiper = $(_options.thumbs.swiper).get(0).swiper;
                if(_options.initnum && _options.initnum=="center"){
                    _options.initialSlide = Math.floor(_leng/2);
                }
                _leng = $wrap.find(".swiper-slide").length, _lengoption = _options.slidesPerView=="auto" ? 1 : _options.slidesPerView;
                if(_leng<=_lengoption) iscontrol = false;
                if(!iscontrol){
                    _options.autoplay = false;
                    _options.pagination = { el: null, bulletElement: null, clickable: null, type: null};
                    $wrap.find(".swiper-button-play").remove();
                }
                _this.swiper = new Swiper(_this, _options);
                $wrap.find(".swiper-button-play").on("click",function(){
                    if(_this.swiper.autoplay.running) _this.swiper.autoplay.stop(), $.$(this).addClass("stop");
                    else _this.swiper.autoplay.start(), $.$(this).removeClass("stop");
                });
            }
        },
        aniclass : {
            init : function(_this){
                var classname = _this.gridoption.classname || "ani-visible", _hook = _this.gridoption.hook || 1;
                new ScrollMagic.Scene({triggerElement: _this, triggerHook: _hook})
                    .setClassToggle(_this, classname) // add class toggle
                    .addTo(_page.scrollcontroller);
            }
        },
        init : function($wrap){
            if(!$wrap || $wrap.length==0) return;
            $.each($wrap, function(){
                var _this = this;
                _this.gridoption = $.$(_this).data("grid");
                if(_this.gridoption.case && _page.grid[_this.gridoption.case]) _page.grid[_this.gridoption.case].init(_this);
            });
        }
    },
    reInit : function($wrap){
        var _ = _page, isReInit = true;
        if(!_.$body) return;
        if(!$wrap) $wrap = _.$body, isReInit = false;

        $wrap.findFilter('[data-tab]').tab();
        $wrap.findFilter('[data-dropdown]').dropdown();
        _.grid.init($wrap.findFilter('[data-grid]'));
        swipeset.init($wrap.find('div[data-swipe]').not(".swipe-initialized")); //swipe tab
        setTimeout(function(){ $wrap.findFilter('dl[data-accordion], table[data-accordion], div[data-accordion], ul[data-accordion]').accordion(); }, 200);
    },
    init : function(){
        var _ = this;
        _.scrollcontroller = new ScrollMagic.Controller();
        _.reInit();
    }
};

// 모든 기능 동작
$(document).ready(function(){
    _page.$html= $("html");
    _page.$body = $("body");
    _page.init();
});