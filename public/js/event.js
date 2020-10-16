$(function() {

    'use strict';

    var $window = window.$window || $(window),
        $document = window.$document || $(document),
        $html = window.$html || $('html'),
        $header = window.$header || $('#header');

    var toggleHtmlClass = function(e) {
        var $this = $(e.target);
        $this = ($this.is('a')) ? $this : $this.closest('a');
        var _class = $this.attr('data-class');
        $html.toggleClass(_class);
    };

    $document.on('click', '.js-movie', function(e){
        var $this = $(e.target);
        e.preventDefault();
        $this = ($this.is('a')) ? $this : $this.closest('a');
        var _src = $this.attr('href');
        var _html = '<iframe src="' + _src + '?autoplay=1" width="100%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay="true"></iframe>';
        $this.parent().html(_html);
    });

    $document.on('click', '.js-movie-lang', function(e){ // 언어
        var $this = $(e.target);
        e.preventDefault();
        $this = ($this.is('a')) ? $this : $this.closest('a');
        var _idx = $this.index();
        var $target = $this.closest('.wrap').find('.video-wrap');
        var $lang = $this.closest('.wrap').find('.lang').eq(_idx).addClass('in').siblings().removeClass('in');
        var _src = $this.attr('href');

        console.log(_src);

        var _html = '<iframe src="' + _src + '?autoplay=1" width="100%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay="true"></iframe>';
        $target.html(_html);
        $this.addClass('in').siblings().removeClass('in');
    });

    // element toggle
    $document.on('click', '.js-toggle-el', function(e) {
        var $this = $(e.target);
        $this = ($this.is('a')) ? $this : $this.closest('a');
        if ($this.data('prevent') !== 'false') {
            e.preventDefault();
        }
        var _href = $this.attr('href');
        if (_href.indexOf('#') < 0) {
            _href = '#' + $this.data('id');
        }
        var _targetEl = $(_href);
        var _parentEl = $this.attr('data-parent');
        if (_parentEl) {
            $this.closest(_parentEl).addClass('in').siblings().removeClass('in');
        }
        $this.toggleClass('in');
        _targetEl.toggleClass('in').siblings().removeClass('in');
    });

    $document.on('click', '.js-active-el', function(e) {
        e.preventDefault();
        var $this = $(e.target);
        $this = ($this.is('a')) ? $this : $this.closest('a');
        var _targetEl = $($this.attr('href')),
            _parentEl = $this.data('parent');
        if (_parentEl) {
            $this.closest(_parentEl).addClass('in').siblings().removeClass('in');
        }
        $this.addClass('in');
        _targetEl.addClass('in').siblings().removeClass('in');
    });

    // html toggle class
    $document.on('click', '.js-toggle-html', function(e) {
        e.preventDefault();
        toggleHtmlClass(e);
    });

    // header
    $document.on('click', '.js-toggle-html-header', function(e) {
        e.preventDefault();
        var $this = $(e.target);
        $this = ($this.is('a')) ? $this : $this.closest('a');
        var _class = $this.attr('data-class');
        if (_class == 'is-toggle-language') {
            $html.removeClass('is-toggle-social is-toggle-user is-toggle-search');
        } else if (_class == 'is-toggle-social') {
            $html.removeClass('is-toggle-language is-toggle-user is-toggle-search');
        } else if (_class == 'is-toggle-user') {
            $html.removeClass('is-toggle-language is-toggle-social is-toggle-search');
        } else if (_class == 'is-toggle-search') {
            $html.removeClass('is-toggle-language is-toggle-social is-toggle-user');
            if (!$html.hasClass('is-toggle-search')) {
                var $field = $header.find('input.text');
                $field.val('');
                setTimeout(function(){
                    $field.focus();
                }, 30);
                $html.addClass('is-overlay');
            } else {
                $html.removeClass('is-overlay');
            }
        }
        $html.toggleClass(_class);
        $('#header li.d1.in').removeClass('in');
    });

    // collapse
    $document.on('click', '.js-toggle-collapse', function(e) {
        var $this = $(e.target);
        var $parent = $this.closest('.collapse-item');
        var $sr = $this.find('em');
        $parent.toggleClass('in');
        if ($parent.hasClass('in')) {
            $sr.text('접기');
        } else {
            $sr.text('펼치기');
        }
    });

    // collapse single
    $document.on('click', '.js-toggle-collapse-single', function(e) {
        e.preventDefault();
        var $this = $(e.target);
        var $parent = null;
        var $sr = $this.find('em');
        $this = ($this.is('a')) ? $this : $this.closest('a');
        $parent = $this.closest('.collapse-item');
        var _boolToggle = ($this.data('toggle') !== 'false'); // data-toggle 이 off 가 아니면, 토글기능 해제
        if (_boolToggle === true) {
            $parent.addClass('in');
            $sr.text('접기');
        } else {
            $parent.toggleClass('in');
            $sr.text('펼치기');
        }
        $parent.siblings().removeClass('in');
    });

    // 인쇄하기
    $document.on('click', '.js-print', function(e) {
        e.preventDefault();
        var $this = $(e.target);
        $this = $this.is('a') ? $this : $this.closest('a');
        var _href = $this.attr('href');
        var winPrint = window.open(
            _href,
            "winPrint",
            "width=1024, height=768, resizable, scrollbars=yes, status=1"
        );
    });

    // toggle faq collapse
    $document.on('click', '.item-question a', function(e) {
        var $this = $(e.target);
        var $parent = $this.closest('.bbs-collapse-item');
        var $sr = $this.find('em');
        $parent.toggleClass('in');
        if ($parent.hasClass('in')) {
            $sr.text('접기');
        } else {
            $sr.text('펼치기');
        }
    });


    // search
    $document.on('click', '.js-search', function(e) {
        var $this = $(e.target);
            $this = $this.is('a') ? $this : $this.closest('a');
        var $parent = $this.closest('.section-product-search'),
            $sr = $this.children('span');

        $parent.toggleClass('in');
        if ($parent.hasClass('in')) {
            $sr.text('검색열기');
        } else {
            $sr.text('검색닫기');
        }
    });

});
