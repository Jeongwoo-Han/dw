var YT = YT || null, win;

if (typeof console=="undefined") {
    console = { log : function(){}, info : function(){}, warn : function(){}, error : function(){} };
}
(function(global, ui){

    win = { h : 0, w : 0, scrolltop : 0, scrollleft : 0, scrolldir : "", state : null, size : {header:0, footer:0, fixtop:0} };
    var _evt = {
        winclick : function(e){
            var target = e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget, $target = $.$(target), $relele, uipop, toggleclass, blindtitle;
            uipop = target.getAttribute("data-uipop");
            toggleclass = target.getAttribute("data-toggleclass");
            if(toggleclass) $target.toggleClass(toggleclass);
            blindtitle = target.getAttribute("data-blind-title");
            if(blindtitle) _page.blindtitle.call(target, blindtitle);
            document.focusEl = target;

            if($target.is("[data-anchor]")) anchorani.call(target, e);
            if(uipop){
                $relele = url2el(target, null);
                if(uipop==0 || uipop==1){
                    if(!$relele) $relele = $target.closest('[data-uipopset]');
                    if($relele.length==0) $relele = null;
                    if(!$relele && !window.parent.length) self.close();
                    if($relele && uipop==0) $relele.uipop("close");
                    if($relele && uipop==1) $relele.uipop("open");
                }else if(uipop!="" && uipop!=undefined){
                    var url = target.getAttribute("href") || target.getAttribute("data-url");
                    var _data = $jq.extend([], $target.data("uipop"));
                    _data.unshift(url);
                    $target.uipop({winpop:_data});
                }
                e.preventDefault();
            }
        },
        winresize : function(e, first){
            var _oldWidth = win.w;
            win.h = _page.$win.height();
            win.w = _page.$win.width();
            win.size.header = _page.layout.$header?_page.layout.$header.innerHeight():0;
            win.size.footer = _page.layout.$footer?_page.layout.$footer.innerHeight():0;
            if(!first && _oldWidth!=win.w) swipeset.sizecheck(); //swipe tab
      
            var _ratio = _page.grid.ratio.el, _size, _ratio_$el;
            if(_ratio.length){
                for(i in _ratio){
                    _ratio_$el = $(_ratio[i].gridoption.size.el);
                    _size = [_ratio_$el.width(), _ratio_$el.height(), _ratio[i].gridoption.size.h/_ratio[i].gridoption.size.w, _ratio[i].gridoption.size.w/_ratio[i].gridoption.size.h];
                    _ratio[i].style.width = _size[0]+"px";
                    _ratio[i].style.height = (_size[0]*_size[2])+"px";
                    _ratio[i].style.minWidth = (_size[1]*_size[3])+"px";
                    _ratio[i].style.minHeight = _size[1]+"px";
                }
            }
        },
        winscroll : function(e, first){
            if(first && first==-1) win.scrolltop -= 1;
            var curscrolltop = _page.$win.scrollTop(), curscrollleft = _page.$win.scrollLeft(), _dir;
            _dir = win.scrolltop>curscrolltop ? "up" : "down";
            if(win.scrolldir!=_dir) _page.$body.replaceClass("(up|down)",_dir);
            win.scrolltop = curscrolltop;
            win.scrollleft = curscrollleft;
            win.scrolldir = _dir;
            if(_page.layout.$header) _page.layout.menu.sc.call(_page.layout);
        },
        doc : function($wrap){
            $wrap.findFilter("input[data-delete='ipt']").off('focus.delbtn blur.delbtn propertychange.delbtn change.delbtn keyup.delbtn paste.delbtn input.delbtn').on('focus.delbtn blur.delbtn propertychange.delbtn change.delbtn keyup.delbtn paste.delbtn input.delbtn', function(e) {
                var $p = $.$(this).closest('[data-delete="wrap"]');
                if($.trim(this.value)=="") $p.removeClass("del-view"); else $p.addClass("del-view");
            }).trigger('blur.delbtn').each(function(){
                var _ = this, _$ = $.$(_), $p = _$.closest('[data-delete="wrap"]');
                $p.find('[data-delete="btn"]').off("click.delbtn").on("click.delbtn", function(e){ _.value="", _$.focus().trigger('change'); return false; });
            });
            $wrap.findFilter("input[data-placeholder='true'], textarea[data-placeholder='true']").off('focus.placeholder blur.placeholder change.placeholder').on('focus.placeholder', function() { $.$(this).removeClass("placeholder"); }).on('blur.placeholder change.placeholder', function() {
                if(this.value) $.$(this).removeClass("placeholder"); else $.$(this).addClass("placeholder");
            }).trigger('change.placeholder');
            var selectPlaceholder = function(){
                var $this = $.$(this);
                var isEqual = ($.trim($this.find("option").eq(this.selectedIndex).text()).toLowerCase()==$.trim(this.getAttribute("placeholder")).toLowerCase());
                if(isEqual) $this.addClass("placeholder");
                else $this.removeClass("placeholder");
            };
            $wrap.findFilter("select[data-placeholder]").each(selectPlaceholder).off("change.placeholder").on("change.placeholder", selectPlaceholder).trigger("change.placeholder");
            $wrap.findFilter("input[data-fakefile='file']").off('change.fakefile').on('change.fakefile', function() {
                var _ = this, _$ = $.$(_);
                _$.trigger('blur.delbtn');
                if($.trim(_.value)=="") _$.parent().removeClass("del-view"), _.$ipt && _.$ipt.val("");
                else _$.parent().addClass("del-view"), _.$ipt && _.$ipt.val(_.value.replace(/.*\\/,""));
            }).trigger('change.fakefile').each(function(){ this.$ipt = $.$(this).parent().find("input[data-fakefile='text']"); });
        },
        init : function($wrap, isReInit){
            var _ = this;
            if(!$wrap) $wrap = _page.$body;
            _.doc($wrap); //form event
            if(!isReInit){
                _page.$body.off("click.linkHandler").off("click.linkHandler", "a, button, area").on("click.linkHandler", "a, button, area", _.winclick).off("focus.appFocus blur.appFocus", "input:not([type='checkbox']):not([type='radio']),select,textarea");
                _page.$win.off("resize.layoutsc orientationChange.layoutsc").on("resize.layoutsc orientationChange.layoutsc", _.winresize).trigger("resize.layoutsc", true).off("scroll.layoutsc").on("scroll.layoutsc", _.winscroll).trigger("scroll.layoutsc");
                $("input[data-filter-check]").off('change.filtercheck').on("change.filtercheck", function(){
                    if(!this.isSet){
                        this.isSet = true;
                        var _option = $.$(this).data("filter-check");
                        this.$wrap = _option.wrap ? $(_option.wrap) : null;
                        if(!this.$wrap.length) this.$wrap = null;
                        this.filter = '[data-filter~="'+_option.case+'"]' || null;
                    }
                    if(!(this.$wrap || this.filter)) return;
                    var $visibleWrap = this.$wrap.find(this.filter);
                    if(this.checked) this.$wrap.find(this.filter).removeClass("disabled");
                    else this.$wrap.find(this.filter).addClass("disabled");
                }).trigger('change.filtercheck');
                setTimeout(function(){ _page.$win.trigger("resize.layoutsc", true).trigger("scroll.layoutsc", true); }, 500);
            }else{
                _page.$win.trigger("resize.layoutsc", true).trigger("scroll.layoutsc", true);
            }
        }
    };

    var _page = {
        $win : $(window), $html : null, $body : null, wintitle : "", scrollcontroller : null, msg : {selected : "선택됨"},
        docTitle : function(doctitle){
            var _winTitle = [doctitle];
            $.each($("[data-addtitle]"), function(){
                var t = this.getAttribute("data-addtitle");
                if(!t || t=="this"||t=="") t = $.$(this).text();
                _winTitle.push(t);
            });
            document.title = _winTitle.join(" > ");
        },
        blindtitle : function(blindid){
            if(!blindid) return;
            var blindtitleEle = document.getElementById(blindid);
            if(blindtitleEle){
                blindtitleEle.innerHTML = $.$(this).attr("title",_page.msg.selected).text();
                $('[data-blind-title="'+blindid+'"]').not(this).attr("title","");
            }
        },
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
            anicount : {
                hidden : function(_this, _value, _max){
                    clearTimeout(_this.repeat);
                    _this.innerHTML = 0;
                },
                visible : function(_this, _value, _max){
                    clearTimeout(_this.repeat);
                    var _old = Number(_this.innerHTML);
                    if(_old == _value) return;
                    _this.innerHTML = _old+1;
                    _this.repeat = setTimeout(this.visible.bind(this, _this, _value, _max), (_max/_value)*10); //_value>50?20:200
                },
                init : function(_this){
                var _hook = _this.gridoption.hook || 1, _value = _this.gridoption.value || 0, _max = _this.gridoption.max || 100;
                this.hidden.call(this, _this, _value);
                _this.repeat = null;
                new ScrollMagic.Scene({triggerElement: _this, triggerHook: _hook})
                    .addTo(_page.scrollcontroller).on("enter", this.visible.bind(this, _this, _value, _max)).on("leave", this.hidden.bind(this, _this, _value, _max));
                }
            },
            ratio : {
                el : [],
                init : function(_this){
                    var isEl = false;
                    for(i in this.el){
                        if(this.el[i]==_this) return;
                    }
                    this.el.push(_this);
                }
            },
            stickmouse : {
                ev : {
                    set : function(_, e){
                        $.$(this).off("mousemove.stickmouse").on("mousemove.stickmouse", _.ev.move.bind(this));
                    },
                    kill : function(_, e){
                        $.$(this).off("mousemove.stickmouse");
                    },
                    move : function(e){
                        var _this = this, lockpos = _this.$lock.offset(), elpos = _this.$evel.offset(), pos;
                        pos = {min : {x : lockpos.left - elpos.left, y : lockpos.top - elpos.top}, max : null, move : null}
                        pos.max = {x : pos.min.x + _this.$lock.width(), y : pos.min.y + _this.$lock.height()};
                        pos.move = {x : Math.min(Math.max(e.pageX - elpos.left + 25, pos.min.x), pos.max.x), y : Math.min(Math.max(e.pageY - elpos.top + 25, pos.min.y), pos.max.y)};
                        if(_this.direction=="all") _this.$movel.css({"left":pos.move.x+"px", "top":pos.move.y+"px"});
                        else if(_this.direction=="horizontal") _this.$movel.css({"left":pos.move.x+"px"});
                        else if(_this.direction=="vertical") _this.$movel.css({"top":pos.move.y+"px"});
                    }
                },
                init : function(_this){
                    var _ = this, _dir;
                    _dir = _this.gridoption.dir;
                    $.$(_this).find(_this.gridoption.evel).each(function(){
                        var $this = $.$(this), _cur = this;
                        _cur.$evel = $this;
                        if(_this.gridoption.lock) _cur.$lock = $this.find(_this.gridoption.lock);
                        if(!_cur.$lock || _cur.$lock.length==0) _cur.$lock = $this;
                        _cur.$movel = $this.find(_this.gridoption.movel);
                        _cur.direction = _dir;
                        $this.off("mouseenter.stickmouse").off("mouseleave.stickmouse").on("mouseenter.stickmouse", _.ev.set.bind(_cur, _)).on("mouseleave.stickmouse", _.ev.kill.bind(_cur, _));
                    });
                }
            },
            parallax : {
                init : function(_this){
                    var _hook = _this.gridoption.hook || 1, _tail = _this.gridoption.tail || 100;
                    new ScrollMagic.Scene({triggerElement: _this, triggerHook: _hook, duration: "180%"})
                        .addTo(_page.scrollcontroller)
                        .setClassToggle(_this, "visible") // add class toggle
                        .on("progress", function (e) { 
                            TweenMax.to(_this, 0.3, {top: (1-e.progress)*_tail+"px"});
                        });
                }
            },
        pin : {
            el : [],
            init : function(_this){
                var $this = $.$(_this), classname = "fixed", isTrigger = _this.gridoption.trigger, _$triggerEl = isTrigger ? $this.closest(isTrigger) : $this;
                _this.scene = new ScrollMagic.Scene({triggerElement: _$triggerEl.get(0), triggerHook: 0, duration: isTrigger?_$triggerEl.height():null})
                    .addTo(_page.scrollcontroller).setClassToggle(_this, classname);
                for(i in this.el){
                    if(this.el[i]==_this) return;
                }
                this.el.push(_this);
                if(_page.layout.menu.active) $.$(_this).addClass("is-active");
            }
        },
        indicators : {
            init : function(_this){
                if(!_this.gridoption.ele) return;
                var $this = $.$(_this), classname = "active", $eles = $this.find("["+_this.gridoption.ele+"]");
                if(!$eles.length) return;
                $.each($eles, function(){
                    var _cur = this, _id = this.getAttribute(_this.gridoption.ele), _ele = document.getElementById(_id), $cur = $.$(_cur);
                    if(!_ele) return;
                    $.$(_ele).imagesLoaded().always( function( instance ){
                      _ele.scene = new ScrollMagic.Scene({triggerElement: "#"+_id, duration: _ele.offsetHeight}).addTo(_page.scrollcontroller).setClassToggle(_cur, "active");
                    });
                });
            }
        },
        productsc : {
            init : function(_this){
                $.$(_this).css({"position":"relative"}).find(".product-anchors").stop().delay(600).animate({"opacity":1}, 600);
                _page.layout.$header.addClass("normal");
            }
        },
        mainsc : {
            init : function(_this){
                //메인페이지
                var $global = $(".global-network"), _global = $global.get(0), globalTxt, globalMap, globalList, globalTop, globalFixTop, globalHeight;
                globalTxt = $global.find(".deco-txt"), globalMap = $global.find(".deco-map"), globalList = $global.find(".list"), globalTop = $global.offset().top, globalHeight = $global.height();
                new ScrollMagic.Scene({triggerElement: _global, triggerHook: 0.5, duration: globalHeight})
                .addTo(_page.scrollcontroller)
                .setClassToggle(_global, "ani-visible")
                .on("progress", function (e) {
                    globalTop = $global.offset().top;
                    globalFixTop = globalTop+428;
                    if(win.scrolltop > globalFixTop && win.scrolltop < (globalTop+globalHeight-960)){
                        globalList.addClass("fix").next(".btn-more").addBack().css({"margin-left":(win.scrollleft*-1)+"px"});
                        globalList.parent().css("padding-top", (win.scrolltop - globalFixTop)+"px");
                    }else{
                        globalList.removeClass("fix").next(".btn-more").addBack().css({"margin-left":0});
                    }
                });

                var $store = $(".store-search"), $storebtn = $store.children(".btn"), $visual = $(".main-head"), _winscroll = function(e){
                    var docH = document.body.scrollHeight, _gapbtm, _gaptop, _istop;
                    win.scrolltop = $(window).scrollTop();
                    _gapbtm = ((win.scrolltop+win.h) - (docH-win.size.footer));
                    _istop = ($visual.offset().top+$visual.height())<win.h && ($visual.offset().top+$visual.height()+(win.h/4)) > win.scrolltop+win.h;
                    if(_istop){
                        $store.removeClass("min").css({"margin-left":(win.scrollleft*-1)+"px"}); $storebtn.css({"bottom":(win.h-$visual.height()+(win.scrolltop))+"px"});
                    }else if(_gapbtm > 0){
                        $store.addClass("min").css({"margin-left":(win.scrollleft*-1)+"px"}); $storebtn.css({"bottom":_gapbtm+"px"});
                    }else{
                        $store.addClass("min").css({"margin-left":(win.scrollleft*-1)+"px"}); $storebtn.css({"bottom":0});
                    }
                    $visual.find(".img .in").css({"width":$visual.width()});
                };
                document.documentElement.scrollTop = document.body.scrollTop = 0;
                $(window).off("resize.mainlayoutsc orientationChange.mainlayoutsc").on("resize.mainlayoutsc orientationChange.mainlayoutsc", _winscroll).off("scroll.mainlayoutsc").on("scroll.mainlayoutsc", _winscroll).trigger("scroll.mainlayoutsc");
                $store.addClass("ani-visible");
            }
        },
            historysc : {
                init : function(_this){
                    //연혁페이지
                    var $head = $(".history-head"), $group = $(".history-group"), $anchor = $(".history-anchors"), $anchors = $anchor.find(".anchor"), $anchorPos = $anchor.find(".pos");
                    $.each($head, function(){
                        var $this = $.$(this);
                        new ScrollMagic.Scene({triggerElement: this, duration: "80%"})
                        .addTo(_page.scrollcontroller).on("progress", function (e) {
                            $this.css({"opacity":1-e.progress});
                        });
                    });

                    var groupScenes = [];
                    $.each($group, function(){
                        var $this = $.$(this), $title = $this.find(".history-title"), $photo = $this.find(".history-photo"), $year = $this.find(".year"), $wrap = $this.find(".history-gh"), _h = $this.height(), _inh = $this.innerHeight(), _gh = $wrap.innerHeight(), _top = $this.offset().top;
                        var _year, _first, _last, $curanchor, anchorsize = {w:0, l:0}, _scene;
                        _year = $this.attr("id"), _first = _year=="history-current", $curanchor = $anchors.filter('[data-history-year="'+_year+'"]'), _last = $curanchor.is(":last-child");
                        _scene = new ScrollMagic.Scene({triggerElement: this, triggerHook: 1, duration: _inh+(win.h*0.5)})
                        .addTo(_page.scrollcontroller).on("progress", function (e) {
                            var _pertop, _anchorpos, _ghper = (_inh-_h)/_inh, _contper;
                            _top = $this.offset().top;
                            _pertop = 1-((_top-win.scrolltop)/win.h);
                            anchorsize = {w:$curanchor.width(), l:$curanchor.position().left};
                            if(_last) anchorsize.w = $anchor.width() - anchorsize.l;
                            if($curanchor.is(".end")) $curanchor.removeClass("end");
                            if(e.progress>=_ghper){
                                _contper = ((e.progress-_ghper)*100)/((1-_ghper)*100);
                                TweenMax.to($anchorPos, 0.1, {width: ((_contper*anchorsize.w)+anchorsize.l)+"px"});
                            }else if(_first){
                                if(e.progress>_ghper/2) TweenMax.to($anchorPos, 0.3, {width: (anchorsize.l)+"px"});
                                else TweenMax.to($anchorPos, 0.3, {width: 0}), $curanchor.removeClass("active end");
                            }
                            if(e.progress>_ghper/2 && !$curanchor.is(".active")) $curanchor.addClass("active").siblings().removeClass("active");

                            if(_pertop<1){
                                $wrap.css({"position":"absolute","margin-left":0});
                                TweenMax.to($title, 0, {y: (1-_pertop)*400, scale: Math.min(_pertop, 1)});
                                TweenMax.to($photo, 0, {y: (1-_pertop)*600, opacity: Math.min(_pertop, 1)});
                            }else if(win.scrolltop >= _top && win.scrolltop < _top+_gh){
                                $wrap.css({"position":"fixed","margin-left":(win.scrollleft*-1)+"px"});
                                TweenMax.to($title, 0, {y: 0, scale: 1});
                                TweenMax.to($photo, 0, {y: 0, opacity: 1});
                                TweenMax.to($year, 0, {opacity: 1});
                                for(var qr in groupScenes){
                                    if(groupScenes[qr][0]!=$this.get(0)) groupScenes[qr][1].trigger("end");
                                }
                            }else{
                                $wrap.css({"position":"absolute","margin-left":0});
                                //TweenMax.to($title, 0, {y: 0, scale: 1});
                                TweenMax.to($photo, 0, {y: 0, opacity: 1});
                                TweenMax.to($year, 0, {opacity: 1});
                            }
                        }).on("end", function (e) {
                            $wrap.css({"position":"absolute","margin-left":0});
                            TweenMax.to($title, 0, {y: 0, scale: 1});
                            TweenMax.to($photo, 0, {y: 0, opacity: 0});
                            TweenMax.to($year, 0, {opacity: 0});
                            $curanchor.addClass("end");
                        });
                        groupScenes.push([this, _scene]);
                    });
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
            if(win.h==0) win.h = _page.$win.height(), win.w = _page.$win.width();
            // _player.init($wrap); //youtube 플레이어 셋

            $wrap.findFilter('[data-tab]').tab();
            $wrap.findFilter('[data-dropdown]').dropdown();
            _.grid.init($wrap.findFilter('[data-grid]'));
            swipeset.init($wrap.find('div[data-swipe]').not(".swipe-initialized")); //swipe tab
            setTimeout(function(){ $wrap.findFilter('dl[data-accordion], table[data-accordion], div[data-accordion], ul[data-accordion]').accordion(); }, 200);
            _evt.init($wrap, isReInit);
        },
        layout : {
            $header : null, $footer : null,
            menu : {
                active : null, clear : null, $nav : null, $all : null,
                sc : function(e){
                    var minPos = _page.layout.$header.offset().top+40;
                    if(win.scrolltop>minPos && win.scrolltop>win.size.fixtop && win.state != "min"){
                        _page.layout.$header.addClass("min");
                        for(i in _page.grid.pin.el) $.$(_page.grid.pin.el[i]).addClass("min");
                        win.state = "min";
                    }else if(win.scrolltop<=minPos && win.scrolltop<=win.size.fixtop && win.state == "min"){
                        _page.layout.$header.removeClass("min");
                        for(i in _page.grid.pin.el) $.$(_page.grid.pin.el[i]).removeClass("min");
                        win.state = null;
                    }
                    if(win.scrolltop>win.size.fixtop){
                        !_page.layout.$header.is(".fixed") && _page.layout.$header.addClass("fixed");
                        _page.layout.$header.children().css({"margin-left":(win.scrollleft*-1)+"px"});
                    }else{
                        _page.layout.$header.is(".fixed") && _page.layout.$header.removeClass("fixed");
                        _page.layout.$header.children().css({"margin-left":0});
                    }
                },
                gnb : {
                    subShow : function(e){
                        var _ = _page.layout, $old, $cur, _isold;
                        clearTimeout(_.menu.clear);
                        if(_.menu.active) _.menu.active.removeClass("active");
                        if(!_.$header.is(".hover")) _.$header.addClass("hover");
                        $old = _.menu.$nav.find(".hover-active");
                        $cur = $(e.currentTarget);
                        if($cur.is("a") || $cur.is("button")) $cur = $cur.closest(".dep-1");
                        if($cur.is($old)) return;
                        _isold = ($old.length!=0);
                        if(_isold && !_.$header.is(".not-hover-ani")) _.$header.addClass("not-hover-ani");

                        $cur.addClass("hover-active").promise().done(function(){
                            if(_isold) $old.removeClass("hover-active");
                        });
                    },
                    subHide : function(){
                        var _ = _page.layout;
                        clearTimeout(_.menu.clear);
                        if(_.menu.active) _.menu.active.addClass("active");
                        _.$header.removeClass("hover not-hover-ani");
                        _.menu.$nav.find(".hover-active").removeClass("hover-active");
                    },
                    hideTime : function(){
                        var _ = _page.layout;
                        clearTimeout(_.menu.clear);
                        if(!_.menu.$nav.find(":focus").length) _.menu.clear = setTimeout(_.menu.gnb.subHide.bind(this),100);
                    }
                },
                all : {
                    activecname : "opend-sub",
                    toggleAll : function(){
                        var _ = _page.layout;
                        _.$header.toggleClass("opend-all");
                    },
                    subShow : function(e){
                        var _ = _page.layout, $old, $cur, _isold;
                        clearTimeout(_.menu.clear);
                        if(!_.menu.$all.find(".main").is("."+_.menu.all.activecname)) _.menu.$all.find(".main").addClass(_.menu.all.activecname);
                        $cur = $(e.currentTarget);
                        if($cur.is("a") || $cur.is("button")) $cur = $cur.closest("li");
                        if($cur.is("."+_.menu.all.activecname)) return;
                        $old = $cur.siblings("."+_.menu.all.activecname);
                        _isold = ($old.length!=0);
                        if(_isold) $old.removeClass(_.menu.all.activecname).find("."+_.menu.all.activecname).removeClass(_.menu.all.activecname);
                        $cur.addClass(_.menu.all.activecname);
                    },
                    subHide : function(){
                        var _ = _page.layout;
                        clearTimeout(_.menu.clear);
                        if(_.menu.$all.find(".main").is("."+_.menu.all.activecname)) _.menu.$all.find(".main").removeClass(_.menu.all.activecname);
                        _.menu.$all.find("."+_.menu.all.activecname).removeClass(_.menu.all.activecname);
                    },
                    hideTime : function(){
                        var _ = _page.layout;
                        clearTimeout(_.menu.clear);
                        if(!_.menu.$all.find(":focus").length) _.menu.clear = setTimeout(_.menu.all.subHide.bind(this),100);
                    }
                },
                _click : function($wrap, callback, e){ var _wrap = $wrap[0]; if(e.target !== _wrap && !$.contains(_wrap, e.target)) callback.call(this); },
                init : function(){
                    var layout = _page.layout, _ = this;
                    _.active = layout.menu.$nav.find(".active");
                    if(!_.active || !_.active.length) _.active = null;
                    else layout.$header.addClass("is-active");
                    layout.$header.off("mouseenter.gnbhover mouseleave.gnbhover", ".gnb-nav .dep-1").off("focus.gnbhover blur.gnbhover", "a, button")
                        .on("mouseenter.gnbhover", ".gnb-nav .dep-1", _.gnb.subShow)
                        .on("mouseleave.gnbhover", ".gnb-nav .dep-1", _.gnb.hideTime)
                        .on("focus.gnbhover", ".gnb-nav a, .gnb-nav button", _.gnb.subShow)
                        .on("blur.gnbhover", ".gnb-nav a, .gnb-nav button", _.gnb.hideTime)
                        .off("click.gnball", ".btn-all").on("click.gnball", ".btn-all", _.all.toggleAll)
                        .off("mouseenter.allmenuhover", ".all-inner .main a").on("mouseenter.allmenuhover", ".all-inner .main a", _.all.subShow)
                        .off("mouseleave.allmenuhover", ".all-inner .main").on("mouseleave.allmenuhover", ".all-inner .main", _.all.hideTime)
                        .off("focus.allmenuhover", ".all-inner .main a").on("focus.allmenuhover", ".all-inner .main a", _.all.subShow)
                        .off("blur.allmenuhover", ".all-inner .main a").on("blur.allmenuhover", ".all-inner .main a", _.all.hideTime);
                }
            },
            init : function(){
                var _ = this;
                _.$header = $(".header");
                if(!_.$header.length){
                    _.$header = null;
                }else{
                    _.menu.$nav = _.$header.find(".gnb-nav");
                    _.menu.$all = _.$header.find(".all-inner");
                    if(!_.menu.$nav.length) _.menu.$nav = null, _.menu.$all = null;
                    else _.menu.init();
                }
                _.$footer = $(".footer");
                if(!_.$footer.length) _.$footer = null;
                else _.$footer.find(".btn-top").data("anchor", {"callback":function(){ _page.scrollcontroller && _page.scrollcontroller.update(true); }});
                win.size.header = _.$header?_.$header.innerHeight():0;
                win.size.fixtop = _.$header?_.$header.offset().top:0;
                win.size.footer = _.$footer?_.$footer.innerHeight():0;
            }
        },
        init : function(){
            var _ = this;
            _.docTitle(document.title);
            _.scrollcontroller = new ScrollMagic.Controller();
            _.layout.init();
            _.reInit();
        }
    };

    // 모든 기능 동작
    $(document).ready(function(){
        _page.$html= $("html");
        _page.$body = $("body");
        _page.init();
    });
// 200727 추가 ED
})(this, this.ui = this.ui || {});