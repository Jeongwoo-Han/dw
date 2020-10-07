/* User Agent Check */
var uiagent=function(){var e,i=navigator.userAgent,a=!1,n=i.match(/(opera|chrome|safari|firefox|msie|Android|trident(?=\/))\/?\s*(\d+)/i)||[];return null===i.match(/iPhone|iPad|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i)&&null===i.match(/LG|SAMSUNG|Samsung/)||(a=!0),/trident/i.test(n[1])?{ismobile:a,name:"ie",version:(e=/\brv[ :]+(\d+)/g.exec(i)||[])[1]||""}:"Chrome"===n[1]&&null!==(e=i.match(/\b(OPR|Edge)\/(\d+)/))?{ismobile:a,name:e[0].match("OPR")?"opera":"edge",version:e[2]||""}:(n=n[2]?[n[1],n[2]]:[navigator.appName,navigator.appVersion,"-?"],null!==(e=i.match(/version\/(\d+)/i))&&n.splice(1,1,e[1]),n[0]=n[0].toLowerCase().replace("msie","ie"),"ie"==n[0]&&7==n[1]&&i.match(/trident\/4/gi)&&(n[1]=8),a&&"safari"===n[0]&&(n[0]="ios"),{ismobile:a,name:n[0],version:n[1]})}();
var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return { dom: dom, lowercase: pre, css: '-' + pre + '-', js: pre[0].toUpperCase() + pre.substr(1) };
})();
/* $.$(this) */
!function(e,a){"use strict";var t=document.getElementsByTagName("html");t&&(t[0].className=$.trim(t[0].className.replace(/no\-js ?/,"")+" "+(uiagent.ismobile?"mobile ":"")+uiagent.name+" v"+uiagent.version));var i=function(e){if(1!==e.nodeType)throw new Error("문서객체여야 합니다.");var t=a.data(e,"$this");return t?t:a.data(e,"$this",a(e))};a.cacheele||a.$||(a.cacheele=i,a.$=a.cacheele)}(this,this.$);

/* console not supported */
!function(){var e=["assert","cd","clear","count","countReset","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","select","table","time","timeEnd","timeStamp","timeline","timelineEnd","trace","warn"],n=window.console=window.console||{},o=function(){};for(i in e)n[e[i]]||(n[e[i]]=o)}();

/* Infinite loop on element focus */
var loopfocus={keyel:"a:visible,button:visible,select:visible,input:visible,textarea:visible,iframe:visible,div[tabindex=0]:visible",set:function(o,e){if(o){var i=o[0],s=e?e[0]:void 0,f=function(e){var f=e.shiftKey;if(9==(e.keyCode||e.which)){e.stopPropagation();var t=o.find(loopfocus.keyel),u=t.length-1;u<0||(f?(s==this&&(t[u].focus(),e.preventDefault()),t[0]!=this&&i!=this||(s?s.focus():t[u].focus(),e.preventDefault())):(s==this&&(t[0].focus(),e.preventDefault()),t[u]!=this&&i!=this||(s?s.focus():t[0].focus(),e.preventDefault())))}};e&&e.off("keydown.focusLoopFirst").on("keydown.focusLoopFirst",f),o.off("keydown.focusLoopFirst",loopfocus.keyel).on("keydown.focusLoopFirst",loopfocus.keyel,f)}},kill:function(o,e){o&&(e&&e.off("keydown.focusLoopFirst"),o.off("keydown.focusLoopFirst",loopfocus.keyel))}};
var _baseuasing = 'easeInOutSine';
/* Utility */
var bodyScroll = {"disableBodyScroll" : function(lastpos){
  document.body.style.overflow=document.documentElement.style.overflow="hidden";
  document.body.comstyleheight=document.body.style.height;
  document.documentElement.comstyleheight=document.documentElement.style.height;
  document.body.style.height=document.documentElement.style.height="auto";
  document.body.scrollTop=document.documentElement.scrollTop=lastpos;
}, "enableBodyScroll" : function(lastpos){
  document.body.style.overflow=document.documentElement.style.overflow="visible";
  document.body.style.height=document.body.comstyleheight;
  document.documentElement.style.height=document.documentElement.comstyleheight;
  document.body.scrollTop=document.documentElement.scrollTop=lastpos;
}};
function url2el(node, context){
  var el = node.getAttribute("data-url") || node.getAttribute("href");
  return el&&el.match(/\/|;|\(|\)|\:|,|<|>|\?/) ? null : ((el=$(el,context || null)).length > 0 ? el : null);
}
function globalEval(expression){ return Function(expression)(); }
function twonum(num){
  num = parseFloat(num);
  return (num<10) ? "0"+num : num;
}
function tabindexAdd(el, depth){
  if(!(el.nodeName.toLowerCase().match(/^(a|button|input|select|textarea)$/) || el.getAttribute("contenteditable"))) el.tabIndex = depth;
}
function anchorani(e){
  var $el = url2el(this), $this = $.$(this), _data, _pos = {el:0,wrap:0,scwrap:0,mov:0}, ismodal = false, $focusel = null, focusel = null, $scwrap = $el.closest("[data-anchorwrap]"), isBody = false;
  _data = $.extend({}, {"add" : 0, "isfocus" : true, "isscroll" : true, "callback" : null}, $this.data("anchor"));

  if($scwrap.length==0) $scwrap = $("body, html"), isBody = true;
  _pos.el = $el.offset().top;
  if(!isBody){
    _pos.wrap = $scwrap.offset().top;
    _pos.scwrap = $scwrap.scrollTop();
  }else{
    var headAdd = $scwrap.first().data("anchoradd");
    if(headAdd) _data.add += $("html").data("anchoradd");
  }
  _pos.mov = (_pos.el-(_pos.wrap-_pos.scwrap))-_data.add;
  if(_data.isfocus){
    $focusel = $el.find("[data-anchorfocus]");
    if($focusel.length==0) $focusel = $el;
    focusel = $focusel.get(0);
    tabindexAdd(focusel, 0);
  }
  var _end, elefocus = function(){
    if(_end) return;
    _end = true;
    if(_data.isfocus) this.focus();
    if(_data.callback){
      _data.callback = typeof _data.callback == "function" ? _data.callback.bind(this) : $.proxy($.globalEval(_data.callback), this);
      window.setTimeout(_data.callback, 200);
    }
  };
  
  if(_data.isscroll) $scwrap.stop().animate({"scrollTop":_pos.mov}, 800, _baseuasing, function(){ if(!_end) elefocus.call(focusel) });
  else if(_data.isfocus) elefocus.call(focusel);
  e.preventDefault();
}
//filter && find
$.fn.findFilter = function(){
  var arg = arguments?arguments[0]:null;
  return this.is(arg) ? (this.length>1 ? this.filter(arg) : (this.find(arg).length?this.find(arg).andSelf():this)) : this.find(arg);
};
var uiQuery = (function(){
  var queryName = location.href.split("#")[0], i, rv={}, count = 0;
  if((/\?/).test(queryName)){
    queryName = queryName.split("?")[1].split("&");
    for(i in queryName){
      if((/\=/).test(queryName[i])){
        if(!queryName[i].split) continue;
        rv[queryName[i].split("=")[0]] = queryName[i].split("=")[1];
        count++;
      }
    }
  }
  return rv;
})();
//Replace Class
$.fn.replaceClass = function(){
  var _ = this, args = arguments, str1, re, newname, argLen = args.length, isDefault = argLen>2 ? true : false;
  if(argLen<2) return;
  var re = new RegExp("\\b"+args[0]+"\\b", "g");
  var re2 = new RegExp("\\b"+args[1]+"\\b", "g");
  $.each(this,function(){
    newname = (isDefault && this.className.match(re2) ? args[2] : args[1]);
    this.className = this.className.replace(re, '').replace(/ $/, '');
    if(!this.className.match(newname)) this.className += " "+newname;
  });
  return _;
};
//accordion Type
$.fn.accordion = function(){
  var _option = {
    type : "normal", notslide : false, reset : false, activeidx : false, resetidx : false, effoverlap : false, anitime : 300, effect : "slide", $titles : null, $conts : null, $btns : null, $navs : null, hover : false,
    acttit : "[data-act='title']", actbtn : "[data-act='btn']", actcont : "[data-act='cont']", actclose : "[data-act='close']", actcssname : "active", nav : false, isscroll : false
  };
  var _clear = function(){ clearTimeout(this.hideId); };
  var _isFocusLeng = function(){ return $.$(this).find("a:focus, button:focus, input:focus, select:focus, textarea:focus, "+this.option.actcont+":focus").length; }
  var _timeCall = function(e){
    _clear.call(this);
    if(!this.option.reset || _isFocusLeng.call(this)) return this;
    this.hideId = window.setTimeout($.proxy(_reset, this), 200);
  };
  var _slideUp = function(_parent, overlap, _$title){ this.slideUp(overlap?0:_parent.option.anitime, _parent.option.isscroll?$.proxy(_scroll, _$title, _parent):null); };
  var _slideDown = function(_parent, overlap, _$title){ this.slideDown(overlap?0:_parent.option.anitime, _parent.option.isscroll?$.proxy(_scroll, _$title, _parent):null).css({"display":"block"}); };
  var _fadeIn = function(_parent, overlap, _$title){ this.fadeIn(overlap?0:_parent.option.anitime, _parent.option.isscroll?$.proxy(_scroll, _$title, _parent):null).css({"display":"block"}); };
  var _fadeOut = function(_parent, overlap, _$title){ this.fadeOut(overlap?0:_parent.option.anitime, _parent.option.isscroll?$.proxy(_scroll, _$title, _parent):null); };
  var _scroll = function(_parent){ $("body, html").stop().animate({"scrollTop":this.offset().top}, 400, _baseuasing); };
  var _hide = function(e, _parent, overlap){
    var el = e ? (e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget) : this, _$cont;
    if(el.idx==undefined) return;
    if(!_parent && e.data) _parent = e.data;
    _parent.option.$titles.eq(el.idx).removeClass(_parent.option.actcssname);
    _$cont = _parent.option.$conts.eq(el.idx);
    _$title = _parent.option.$titles.eq(el.idx);
    _$cont.removeClass(_parent.option.actcssname).promise().done(_parent.option.notslide?null:(_parent.option.effect=="slide"?$.proxy(_slideUp, _$cont, _parent, overlap, _$title):$.proxy(_fadeOut, _$cont, _parent, overlap, _$title)));
    if(_parent.option.nav) _parent.option.$navs.eq(el.idx).removeClass(_parent.option.actcssname);
  };
  var _view = function(e, _parent, overlap){
    var el = e ? (e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget) : this;
    if(el.idx==undefined) return;
    if(!_parent && e.data) _parent = e.data;
    _parent.option.$titles.eq(el.idx).addClass(_parent.option.actcssname);
    _$cont = _parent.option.$conts.eq(el.idx);
    _$title = _parent.option.$titles.eq(el.idx);
    _$cont.addClass(_parent.option.actcssname).promise().done(_parent.option.notslide?null:(_parent.option.effect=="slide"?$.proxy(_slideDown, _$cont, _parent, overlap, _$title):$.proxy(_fadeIn, _$cont, _parent, overlap, _$title)));
    _$cont.find("[data-grid]").each(function(){ this.swiper&&this.swiper.update(); }); /* Swiper update() */
    if(_parent.option.nav) _parent.option.$navs.eq(el.idx).addClass(_parent.option.actcssname);
  };
  var _toggle = function(e, _parent){
    var el = e ? (e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget) : this;
    if(el.idx==undefined) return;
    if(!_parent && e.data) _parent = e.data;
    if(_parent.option.$conts.eq(el.idx).is("."+_parent.option.actcssname)){
      _parent.option.activeidx = undefined;
      _hide.call(el, false, _parent);
    }else{
      _parent.option.activeidx = el.idx;
      _view.call(el, false, _parent);
    }
  };
  var _click = function(e, isFirst){
    var el = e ? (e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget) : this, _parent = e.data, oldidx, idx, overlap = false;
    _clear.call(_parent);
    if(el.idx==undefined) _reInit.call(_parent);
    oldidx = _parent.option.activeidx, idx = el.idx, type = _parent.option.type;
    if(isFirst){
      _view.call(_parent.option.$btns[idx], false, _parent);
    }else if(type=="multi"){
      return _toggle.call(el, false, _parent);
    }else if(oldidx===idx){
      if(type=="single" || _parent.option.hover) return false;
      if(type=="normal") _toggle.call(el, false, _parent);
    }else{
      if(oldidx===false && _parent.option.reset=="class" && _parent.option.resetidx!=false) oldidx = _parent.option.resetidx[0];
      _parent.option.activeidx = idx;
      if(oldidx!==false && oldidx!==idx) overlap=_parent.option.reset=="class"?true:false, _hide.call(_parent.option.$btns[oldidx], false, _parent, overlap);
      _view.call(_parent.option.$btns[idx], false, _parent, overlap);
    }
    e.preventDefault();
  };
  var _reset = function(){
    var _this = this;
    if(!(_this.option.activeidx===false || _this.option.activeidx===undefined)){
      _hide.call(_this.option.$btns[_this.option.activeidx], false, _this);
      _this.option.activeidx = false;
    }
    if(_this.option.resetidx===false) return;
    if(_this.option.reset=="class"){
      _this.option.$titles.removeClass(_this.option.actcssname).eq(_this.option.resetidx[0]).addClass(_this.option.resetidx[0]===false?"":_this.option.actcssname);
      _this.option.$conts.removeClass(_this.option.actcssname).eq(_this.option.resetidx[0]).addClass(_this.option.resetidx[0]===false?"":_this.option.actcssname);
    }else{
      _this.option.activeidx = _this.option.resetidx[0];
      _view.call(_this.option.$btns[_this.option.activeidx], false, _this);
    }
  };
  var _reInit = function(){
    var _this = this, $this = $.$(this), activeidx = _this.option.activeidx;
    _this.option.$titles = $this.find(_this.option.acttit).each(function(iii){ this.idx = iii; if(_this.option.activeidx===false && this.className.match(_this.option.actcssname)) activeidx = iii; });
    if($this.find(_this.option.actbtn).length != _this.option.$titles.length){
      _this.option.actbtn = _this.option.$titles.eq(0).prop('nodeName').match(/^(a|button)/i) ? _this.option.acttit : _this.option.acttit+" a:first-child, "+_this.option.acttit+" button:first-child";
    }
    _this.option.$btns = $this.find(_this.option.actbtn).each(function(iii){ this.idx = iii; });
    _this.option.$conts = $this.find(_this.option.actcont).each(function(iii){ this.idx = iii; $.$(this).find(_this.option.actclose).each(function(){ this.idx = iii; }); });
    if(_this.option.nav) _this.option.$navs = $(_this.option.nav).each(function(iii){ this.idx = iii; }).removeClass(_this.option.actcssname);
    if(activeidx!==undefined){
      if(_this.option.reset) _this.option.resetidx = [activeidx, _this.option.$conts.eq(activeidx).attr("class")];
      else _this.option.activeidx = activeidx;
      if(_this.option.nav) _this.option.$navs.eq(activeidx).addClass(_this.option.actcssname);
    }
  };
  $.each(this, function(index){
    var _this = this, $this = $.$(this);
    _this.option = $.extend({}, _option, $this.data("accordion"));
    if(_this.option.type=="single" && _this.option.activeidx===false) _this.option.activeidx=0;
    _reInit.call(_this);
    var eventSelector = (_this.option.actbtn+", "+_this.option.actcont+" a, "+_this.option.actcont+" button, "+_this.option.actcont+" inupt, "+_this.option.actcont+" select, "+_this.option.actcont+" textarea, "+_this.option.actcont);
    var eventSelector2 = (_this.option.actcont+" a, "+_this.option.actcont+" button, "+_this.option.actcont+" inupt, "+_this.option.actcont+" select, "+_this.option.actcont+" textarea, "+_this.option.actcont);
    if(_this.option.hover){
      $this.off("mouseleave.accordionClose").off("focusin.accordionTitle mouseleave.accordionTitle", _this.option.actbtn).off("blur.accordionTitle", eventSelector).off("focus.accordionTitle mouseenter.accordionClose", eventSelector2)
          .on("mouseenter.accordionTitle focus.accordionTitle", _this.option.actbtn, _this, _click).on("mouseleave.accordionClose", $.proxy(_timeCall, _this))
          .on("blur.accordionTitle", eventSelector, $.proxy(_timeCall, _this)).on("focus.accordionTitle mouseenter.accordionClose", eventSelector2, $.proxy(_clear, _this));
    }else{
      $this.off("click.accordionTitle", _this.option.actbtn).off("click.accordionClose", _this.option.actclose).off("blur.accordionTitle", eventSelector).off("focus.accordionTitle", eventSelector2)
        .on("click.accordionTitle", _this.option.actbtn, _this, _click).on("click.accordionClose", _this.option.actclose, _this, _hide)
        .on("blur.accordionTitle", eventSelector, $.proxy(_timeCall, _this)).on("focus.accordionTitle", eventSelector2, $.proxy(_clear, _this));
      if(_this.option.activeidx!==false && !isNaN(parseFloat(_this.option.activeidx))) $this.find(_this.option.actbtn).eq(_this.option.activeidx).trigger("click.accordionTitle", true);
    }
    if(_this.option.nav) _this.option.$navs.on("click.accordionTitle", function(){ _this.option.$btns.eq(this.idx).trigger("click.accordionTitle"); });
    if(_this.option.reset) _reset.call(_this);
  });
  return this;
};
//dropdown area
$.fn.dropdown = function(){
  var _option = { hover : false, selected : false, focusout : true, anitime : 250, effect : "fade", acttit : "[data-act='title']", actcont : "[data-act='cont']", actclose : "[data-act='close']", actcssname : "active" };
  var _clear = function(){ clearTimeout(this.hideId); };
  var _timeCall = function(e){
    _clear.call(this);
    if(_isFocusLeng.call(this)) return;
    this.hideId = window.setTimeout($.proxy(_hide, this), 200);
  };
  var _isFocusLeng = function(contclass){ return $.$(this).find("a:focus, button:focus, input:focus, select:focus, textarea:focus, "+this.option.actcont+":focus").length; }
  var _hide = function(pass){
    var _this = this;
    _clear.call(_this);
    if(!_this.option.isopen || (_isFocusLeng.call(this) && !pass)) return;
    if(_this.option.notslide) _this.option.cont.removeClass(_this.option.actcssname);
    else if(_this.option.effect=="slide") _this.option.cont.slideUp(_this.option.anitime).removeClass(_this.option.actcssname);
    else _this.option.cont.fadeOut(_this.option.anitime).removeClass(_this.option.actcssname);
    _this.option.tit.removeClass(_this.option.actcssname);
    $.$(_this).removeClass("dropdown-show");
    if(!_this.option.focusout) loopfocus.kill($.$(_this));
    _this.option.isopen = false;
  };
  var _view = function(){
    var _this = this;
    _clear.call(_this);
    if(_this.option.isopen) return;
    if(_this.option.notslide) _this.option.cont.addClass(_this.option.actcssname);
    else if(_this.option.effect=="slide") _this.option.cont.slideDown(_this.option.anitime).addClass(_this.option.actcssname);
    else _this.option.cont.fadeIn(_this.option.anitime).addClass(_this.option.actcssname);
    _this.option.tit.addClass(_this.option.actcssname);
    $.$(_this).addClass("dropdown-show");
    if(!_this.option.focusout) loopfocus.set($.$(_this));
    _this.option.isopen = true;
  };

  $.each(this, function(index){
    var _this = this, $this = $.$(this);
    _this.option = $.extend({}, _option, $this.data("dropdown"));
    _this.option.isopen = false;
    _this.option.tit = $this.find(_this.option.acttit);
    _this.option.cont = $this.find(_this.option.actcont).attr("tabindex", -1).css({"outline":"0"});
    var eventSelector = (_this.option.acttit+", "+_this.option.actcont+" a, "+_this.option.actcont+" button, "+_this.option.actcont+" inupt, "+_this.option.actcont+" select, "+_this.option.actcont+" textarea, "+_this.option.actcont);
    var eventSelector2 = (_this.option.acttit+", "+_this.option.actcont+" a, "+_this.option.actcont+" button, "+_this.option.actcont+" inupt, "+_this.option.actcont+" select, "+_this.option.actcont+" textarea");
    if(_this.option.focusout) $this.off("focusout.dropdownSet", eventSelector).on("focusout.dropdownSet", eventSelector, $.proxy(_timeCall, _this));
    if(_this.option.hover){ $this.off("mouseover.dropdownSet mouseenter.dropdownSet focus.dropdownSet", eventSelector).off("mouseleave.dropdownSet").off("click.dropdownSet", _this.option.acttit)
        .on("mouseover.dropdownSet mouseenter.dropdownSet focus.dropdownSet", eventSelector, $.proxy(_view, _this)).on("mouseleave.dropdownSet", $.proxy(_timeCall, _this)).on("click.dropdownSet", _this.option.acttit, function(e){
          var _href = this.getAttribute("href");
          if(_href&&_href.match(/[^#]/)) return true; else e.preventDefault();
        });
    }else{ $this.off("focus.dropdownSet", eventSelector).off("click.dropdownSet", eventSelector2).on("focus.dropdownSet", eventSelector, $.proxy(_clear, _this)).on("click.dropdownSet", eventSelector2, function(e){
          var $curBtn = $.$(this), isSubject = $curBtn.is(_this.option.acttit), isClose = $curBtn.is(_this.option.actclose);
          if(_this.option.isopen && ((_this.option.selected || isClose)||isSubject)) _hide.call(_this, true), _this.option.tit.focus();
          else if(!_this.option.isopen) _view.call(_this);
          if(_this.option.selected && !isSubject) _this.option.tit.text($curBtn.text());
          if(_this.option.selected || isClose || (!_this.option.selected && isSubject)) e.preventDefault();
        });
    }
  });
};
//Tab Type
$.fn.tab = function(){
  var _option = {
    activeidx : false, $titles : null, actbtn : null, fade : false, acttit : "[data-act='tab']", actcssname : "active", callback : null
  };
  var _reInit = function(){
    var _parent = this, $this = $.$(this);
    _parent.taboption.$titles = $this.find(_parent.taboption.acttit).each(function(iii){ this.idx = iii; if(!_parent.taboption.activeidx && this.className.match(_parent.taboption.actcssname)) _parent.taboption.activeidx = iii; });
    if(!_parent.taboption.$titles || !_parent.taboption.$titles.length) return;
    if(!_parent.taboption.actbtn){
      if(_parent.taboption.$titles[0].nodeName.toLowerCase().match(/^(a|button)$/i)) _parent.taboption.actbtn = _parent.taboption.acttit;
      else _parent.taboption.actbtn = _parent.taboption.acttit+">a:first-child, "+_parent.taboption.acttit+">button:first-child";
    }
    _parent.taboption.$btns = $this.find(_parent.taboption.actbtn).each(function(iii){ this.idx = iii; });
  };
  var _hide = function(_parent){
    var _this = this, $curCont = url2el(_this), idx = _this.idx;
    _parent.taboption.$titles.eq(idx).removeClass(_parent.taboption.actcssname);
    _parent.taboption.$btns.eq(idx).attr("title","");
    if($curCont){
      if(_parent.taboption.fade) $curCont.fadeOut(800).removeClass(_parent.taboption.actcssname);
      else $curCont.hide().removeClass(_parent.taboption.actcssname);
    }
  };
  var _view = function(_parent, isFirst){
    var _this = this, $curCont = url2el(_this), idx = _this.idx;
    _parent.taboption.$titles.eq(idx).addClass(_parent.taboption.actcssname);
    _parent.taboption.$btns.eq(idx).attr("title","선택됨");
    if($curCont){
      if(_parent.taboption.fade) $curCont.fadeIn(800).addClass(_parent.taboption.actcssname);
      else $curCont.show().addClass(_parent.taboption.actcssname);
      return true;
    }else{ return false; }
  };
  var _viewImg = function(_parent, isFirst){
    var _this = this, $curCont = url2el(_this), idx = _this.idx;
    _parent.taboption.$titles.removeClass(_parent.taboption.actcssname).eq(idx).addClass(_parent.taboption.actcssname);
    _parent.taboption.$btns.attr("title","").eq(idx).attr("title","선택됨");
    if($curCont){
      var _src = _parent.taboption.$btns.eq(idx).attr("href");
      if(_src && _src.match(/(\.png)|(\.gif)|(\.jpg)|(\.bmp)|(\.tif)/i)) $curCont.attr("src", _src);
      return true;
    }else{ return false; }
  };
  var _click = function(e, isFirst){
    var _this = this, _parent = e.data, _callback;
    if(_this.idx==undefined) _reInit.call(_parent);
    if(_parent.taboption&&_parent.taboption.case&&_parent.taboption.case=="bigimg"){
      var isCont = _viewImg.call(_parent.taboption.$btns[_this.idx], _parent, isFirst);
    }else{
      if(isFirst) _parent.taboption.activeidx = _this.idx;
      else if(!(_parent.taboption.activeidx===false||_parent.taboption.activeidx==undefined) && _parent.taboption.activeidx != _this.idx) _hide.call(_parent.taboption.$btns[_parent.taboption.activeidx], _parent);
      var isCont = _view.call(_parent.taboption.$btns[_this.idx], _parent, isFirst);
    }
    _parent.taboption.activeidx = _this.idx;
    if(_parent.repos) _parent.repos.call(_parent);
    _callback=$.$(this).data("callback")
    _callback && (typeof _callback.callback == "function" ? _callback.callback() : $.globalEval(_callback.callback));
    _parent.taboption.callback &&  (typeof _parent.taboption.callback == "function" ? _parent.taboption.callback() : $.globalEval(_parent.taboption.callback));
    if(isCont) e.preventDefault();
  };

  $.each(this, function(index){
    var _parent = this, $this = $.$(this);
    _parent.taboption = $.extend({}, _option, $this.data("tab"));
    _reInit.call(_parent);
    $this.off("click.tab", _parent.taboption.actbtn).on("click.tab", _parent.taboption.actbtn, _parent, _click);
    if(_parent.taboption.activeidx!==false && !isNaN(parseFloat(_parent.taboption.activeidx))) _parent.taboption.$btns.eq(_parent.taboption.activeidx).trigger("click.tab", true);
  });

  return this;
};
//팝업
(function(fc){ 'use strict'; "function"==typeof define && define.amd ? define(["jquery"],fc) : "undefined"!=typeof exports ? module.exports=fc(require("jquery")) : fc($); }(function($){
  'use strict';
  var UiPop = {}, zindex = 10000, dimclass = "dim", openbtnclass = "uipopShow", _defaults = { callbackOpen: null, callbackClose: null, isdim : true, direction : "none", isrepos : true };
  var _elin = function(e, wrap){ return (e.target !== wrap && !$.contains(wrap, e.target)); };
  var _focus = function(e){ this.focus(); };
  var _click = function(e){ !_elin(e, this.ele) || this.close(); };
  var _hide = function(){
    var _ = this;
    _.$wrap.animate({"opacity":"0"}).promise().done(function(){ _.$wrap.removeClass(dimclass).removeAttr("style"); });
    if(_.lastfocus) $.$(_.lastfocus).removeClass(openbtnclass).focus();
    loopfocus.kill(_.$wrap);
    if(_.options.isdim) bodyScroll.enableBodyScroll(_.lastscroll);
    _.lastfocus = null;
    $(window).off("resize.popRepos");
    _.iscallback(_.options.callbackClose);
  };

  UiPop = (function(){
    function _init(element, settings){
      var _ = this;
      _.ele = element, _.$ele = $(_.ele);
      _.isshow = false, _.lastfocus = null, _.lastscroll; /* 열렸는지, 팝업열기전 포커스엘리먼트, 열리기 전 스크롤 위치 값. */
      _.options = $.extend({}, _defaults, _.$ele.data('uipopset') || {}, settings);
      if(_.options.isdim || _.options.direction.match(/(top|bottom)/)) _.options.isrepos = false;
      var tabidx, $focusele = _.$ele.find("[data-focus]");
      if($focusele.length>0) tabidx = null, _.focusele = $focusele.get(0);
      else tabidx = 0, _.focusele = _.$ele.get(0);
      _.$ele.attr({"tabindex":tabidx, "role":"document"});
      if(!_.wrap){
        _.$ele.wrap('<div class="uipop-container'+(_.options.addclass?" "+_.options.addclass:"")+(_.options.isfixed?" isfixed":"")+'" role="alertdialog" aria-labelledby="'+_.ele.id+'"><div class="uipop-track"></div></div>').promise().done(function(){
          _.ele.style.display = "block";
          _.$track = this.parent();
          _.track = _.$track.get(0);
          _.$wrap = _.$track.parent();
          _.wrap = _.$wrap.get(0);
          if(_.options.direction.match(/(top|bottom)/)) _.$track.addClass("track-bottom");
        });
      }
      //_.init();
    }
    return _init;
  }());
  UiPop.prototype = {
    constructor: UiPop,
    //init : function(){ var _ = this; },
    open : function(){
      var _ = this;
      if(_.isshow) return;
      if(document.activeElement.nodeName.toLowerCase()=="body") _.lastfocus = document.focusEl || document.activeElement;
      else _.lastfocus = document.activeElement;
      _.lastscroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      $.$(_.lastfocus).addClass(openbtnclass);
      loopfocus.set(_.$wrap);
      _.isshow = true, zindex++;
      _.$wrap.addClass(_.options.isdim?dimclass:"").css({"display":"block", "left":(!_.options.isrepos&&_.options.left ?_.options.left:null), "top":(!_.options.isrepos&&_.options.top ?_.options.top:null), "opacity":"0", "z-index":(_.options.isfixed?zindex-800:zindex)}).promise().done(function(){ _.repos.call(_); _focus.call(_.focusele); _.$wrap.animate({"opacity":"1"}); });
      if(_.options.isdim){
        bodyScroll.disableBodyScroll(_.lastscroll);
        _.$wrap.off("click.uipopcontainer").on("click.uipopcontainer", _click.bind(_)); //딤클릭시 닫힘
      }
      if(_.options.isrepos) $(window).off("resize.popRepos").on("resize.popRepos", $.proxy(_.repos, _));
      if(_.options.direction.match(/(top|bottom)/)) _.track.style[_.options.direction] = 0;
      _.iscallback(_.options.callbackOpen);
    },
    close : function(){
      var _ = this, _time = 0;
      if(!_.isshow) return;
      _.isshow = false;
      if(_.options.direction.match(/(top|bottom)/)) _.track.style[_.options.direction] = "-100%", _time = 200;
      _.$wrap.off("click.uipopcontainer"); //딤클릭시 닫힘
      setTimeout(_hide.bind(_), _time);
    },
    repos : function(){
      if(this.options.isrepos){
        var size = [document.documentElement.scrollWidth, document.documentElement.scrollHeight, $(window).height(), this.lastscroll || Math.max(document.body.scrollTop, document.documentElement.scrollTop), this.$wrap.width(), this.$wrap.height(), $(".header").height()||0];
        if(this.options.isfixed) this.$wrap.css({"left":"50%", "top":"50%", "margin-left":(size[4]/2*-1)+"px", "margin-top":(size[5]/2*-1+(size[6]/2))+"px"});
        else this.$wrap.css({"left":((size[0] - size[4])/2)+"px", "top":(((size[2] - size[5])/2)+size[3])+"px"});
      }
    },
    setoption : function(option){ this.options = $.extend({}, this.options, option); },
    iscallback : function(callback){ if(Object.prototype.toString.call(callback).slice(8, -1).toLowerCase() === 'function') callback.call(this); }
  }

  $.fn.uipop = function(){
    var _ = this, opt = arguments[0], args = Array.prototype.slice.call(arguments,1), ret;
    $.each(_, function(){
      if(typeof opt == 'object' || typeof opt == 'undefined') this.uipop = new UiPop(this, opt);
      else{
        if(!this.uipop) this.uipop = new UiPop(this, opt);
        ret = this.uipop[opt].apply(this.uipop, args);
        if(typeof ret != 'undefined') return ret;
      }
    });
    return _;
  };
}));

/*responsive swipe*/
var swipeset = {
  case1 : {
    curdata : { $obj : null, $child : null, endpos : 0, startpos : 0 },
    move : function(e, phase, direction, distance, duration, fingers){
      var _this = e.currentTarget, $this = $.$(_this), _ = swipeset[_this.option.type];
      if(phase=="start"){
        if(!$this || $this.is(".swipe-off")) return true;
        $this.off("mouseleave.swipeend").on("mouseleave.swipeend", _.end).scrollLeft(0);
        _this.$list = $this.data("$list");
        _this.startpos = _this.endpos = _this.$list.position().left;
      }
      if(!$this || $this.is(".swipe-off")) return true;
      if(direction==="left" || direction==="right"){
        if(_this.option.guide) swipeset.guidehide($this);
        var dir = (direction==="left") ? -1 : 1;
        _this.$list.css("left",_this.endpos+(distance*dir))
        if(phase=="end" || phase=="cancel"){
          _this.endpos += distance*dir;
          _.end.call(_this, e, Math.min(distance/duration*200, $this.width()));
        }
      }
    },
    keyboard : {
      move : function(e ,pos){
        var _this = e.currentTarget, $this = $.$(_this), _code, dir, max, aPos, isPos = pos!=undefined;
        if(!$this || $this.is(".swipe-off")) return true;
        _this.$list.scrollLeft(0);
        _code = e.which || e.keyCode;
        if(_code==37 || _code==39 || isPos) swipeset[_this.option.type].moveact.call(_this, _code==39?-1 : 1);
      },
      evset : function(e){
        var _this = e.currentTarget, $this = $.$(_this);
        if(!_this || !_this.option) return false;
        var _case1 = swipeset[_this.option.type];
        $this.scrollLeft(0);
        _this.endpos = _this.startpos = _this.$list.position().left;
        if(_this.option.guide) swipeset.guidehide($this);
        $this.off("keydown.swipeset").on("keydown.swipeset", _case1.keyboard.move);
      },
      evkill : function(e){
        var _this = e.currentTarget;
        $.$(_this).off("keydown.swipeset");
        _this.endpos = _this.startpos = 0;
      }
    },
    end : function(e, addPos){
      var _this = e.currentTarget, $this = $.$(_this), _ = swipeset[_this.option.type], leave;
      if(e&&e.type=="mouseleave") leave = true, _this.endpos = _this.$list.position().left;
      var _thisW = $this.width(), max = ((_this.$list.get(0).scrollWidth-_thisW)*-1), aPos, pos = _this.endpos || 0, time = 0.6;
      var dir = (_this.startpos>_this.endpos ? -1 : 1);
      if(pos>0) aPos = 0;
      else if(pos < max) aPos = Math.abs(max);
      else time = 0.3;
       if(!leave || (leave && aPos)) swipeset[_this.option.type].moveact.call(_this, dir, aPos, time, addPos);
      $this.off("mouseleave.swipeend").scrollLeft(0);
    },
    moveact : function(dir, aPos, time, addPos){
      var _this = this, $this = $.$(_this), max, isbtn, w;
      if(typeof aPos == "object") aPos=undefined;
      w = $this.width(), max = ((_this.$list.get(0).scrollWidth-w)*-1);
      if(aPos==undefined){
        if(_this.startpos==undefined) _this.startpos = 0;
        if(_this.endpos==undefined) _this.endpos = _this.$list.position().left;
        if(!dir) dir = (_this.startpos>_this.endpos ? -1 : 1);
        if(dir=="prev"||dir=="next") isbtn=true, dir = (dir=="next" ? -1 : 1);
        var $breakchild = _this.option.breakel ? _this.$list.find(_this.option.breakel) : [], time = 0.3, sc = Math.abs(_this.endpos);
        if(_this.option.breakel && $breakchild.length){
          var isNext = 0, isPrev = 0, isStop = false;
          $breakchild.each(function(){
            var _$child = $.$(this), pl = _$child.position().left, w2 = _$child.width(), pc = (sc - pl)/w2;
            if(dir<0 && pl<=sc && sc < pl+w2){
              aPos = _$child.next().length>0 ? _$child.next().position().left : pl; //다음
              if(_$child.next().length) _$child.next().find("a,button").trigger("click");
              return false;
            }else if(dir>0 && sc<=pl && sc+w > pl){
              aPos = _$child.prev().length>0 ? _$child.prev().position().left : pl; //이전
              if(_$child.prev().length) _$child.prev().find("a,button").trigger("click");
              return false;
            }
          });
          aPos = (Math.min(aPos, Math.abs(max)));
        }else{
          aPos = (sc*-1) + (dir*(isbtn?w:(addPos||80)));
          if(dir < 0)  aPos = Math.max(aPos, max);
          else aPos = Math.min(aPos, 0);
        }
      }else{
        if(aPos<0) aPos = 0;
        else aPos = (Math.min(aPos, Math.abs(max)));
      }
      _this.endpos=Math.abs(aPos)*-1;
      _this.$list.stop().animate({left: _this.endpos}, {"duration":(time||0.3)*1200,"easing":"easeOutQuint", complete:swipeset.btnset.bind(_this)});
    }
  },
  sizecheck : function($objs){
    $.each($objs||this.$objs, function(){
      var _this = this, $this = $.$(_this), swipeguide, pdl, pdr;
      $this.addClass("swipe-off"), swipeguide = $this.data("swipeguide"), pdl = parseFloat($this.css("padding-left")), pdr = parseFloat($this.css("padding-right"));
      $this.parents(":hidden").addClass("js-visible");
      if(!_this.$list) return this;
      if(_this.offsetWidth-pdl-pdr >= _this.$list[0].scrollWidth){
        $this.addClass((swipeguide ? "swipe-guide ":"") + "swipe-off");
        _this.$list.stop().animate({left: 0}, {"duration":(0.3)*1000,"easing":"easeInOutQuad", complete:swipeset.btnset.bind(_this)});
      }else{
        $this.removeClass("swipe-off");
        if(($this.data("start")||!_this.option.touch) && _this.option.start && _this.$list && _this.$list.find(_this.option.start).length>0){
          var _$firstChild = _this.$list.children().first(), firstPos, $actel = _this.$list.find(_this.option.start);
          firstPos = $actel.position().left - (_$firstChild.position().left + parseFloat(_$firstChild.css("margin-left")) + parseFloat(_$firstChild.css("padding-left")));
          swipeset[_this.option.type].moveact.call(_this, 1, firstPos-Math.floor(($this.width()-$actel.width())/2));
        }else{
          swipeset[_this.option.type].moveact.call(_this);
        }
        swipeset.btnset.call(_this);
      }
      $this.parents(".js-visible").removeClass("js-visible");
    });
  },
  guidehide : function($obj){
    if($obj.data("swipeguide")) $obj.data("swipeguide", false).removeClass("swipe-guide");
  },
  btnset : function(){
    var _this = this, $this;
    if(_this.target) $this = _this.target.closest("[data-swipe]"), _this = $this.get(0);
    else $this = $.$(this);
    var l = Math.abs(parseFloat(_this.$list.css("left"))), w = _this.$list[0].scrollWidth, cw = $this.width();
    if(l+cw >= w) !$this.is(".swipe-last") && $this.addClass("swipe-last");
    else $this.is(".swipe-last") && $this.removeClass("swipe-last");
    if(l==0) !$this.is(".swipe-first") && $this.addClass("swipe-first");
    else $this.is(".swipe-first") && $this.removeClass("swipe-first");
    if(!_this || !_this.option || !_this.option.arrow) return false;
    var pdl = parseFloat($this.css("padding-left")), pdr = parseFloat($this.css("padding-right"));
    _this.option.arrow.prev.prop("disabled",(l==0) ? true : false);
    _this.option.arrow.next.prop("disabled",(w - cw <= (l+pdr)) ? true : false);
  },
  $objs : null,
  init : function($obj){
    if(!$obj.length) return false;
    this.$objs = $obj;
    var _option = {type:"case1",guide:true,touch:true,arrow:false,allow:"vertical",start:null,breakel:null};
    $.each($obj, function(){
      var _this = this, casename = _this.getAttribute("data-swipe"), $this = $(_this).attr("tabindex",0);
      _this.option = $.extend({}, _option, $this.data("swipe"));
      $this.data("swipeguide", _this.option.guide).addClass(_this.option.guide?"swipe-guide":"");
      _this.$list = $this.children().eq(0).addClass("swipe-cont");
      if(_this.option.arrow) $this.append('<button type="button" class="swipe-prev" disabled="disabled"><span class="ir">이전</span></button><button type="button" class="swipe-next" disabled="disabled"><span class="ir">다음</span></button>').promise().done(function(){
        _this.option.arrow = {"prev":$this.find(".swipe-prev"),"next":$this.find(".swipe-next")};
        _this.option.arrow.prev.off("click.swipePrev").on("click.swipePrev", $.proxy(swipeset[_this.option.type].moveact, _this, "prev"));
        _this.option.arrow.next.off("click.swipeNext").on("click.swipeNext", $.proxy(swipeset[_this.option.type].moveact, _this, "next"));
      });
      if(_this.option.start) $this.data("start", true);
      $this.data("$list",$this.children().eq(0).addClass("swipe-cont")).addClass("swipe-initialized");
      if(_this.option.touch) $this.swipe( { swipeStatus:swipeset[_this.option.type].move, excludedElements:"", allowPageScroll:_this.option.allow||"none", triggerOnTouchLeave:true, threshold:50 } );
      $this.off("focusin.swipeset").on("focusin.swipeset", swipeset[_this.option.type].keyboard.evset).off("focusout.swipeset").on("focusout.swipeset", swipeset[_this.option.type].keyboard.evkill).off("scroll.swipeset");
      _this.$list.off("focusin.swipesetlink","a,button,input,select,textarea").on("focusin.swipesetlink","a,button,input,select,textarea", function(){ this.focus({preventScroll:false}); _this.scrollLeft = 0;});
    });
    this.sizecheck.call(this);
  }
}