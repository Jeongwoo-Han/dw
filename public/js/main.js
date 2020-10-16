$(function(){

    var $window = $(window);

    var myApp = new BaseInView('#content .js-inview-container', {
        countUpRestart: true, // 카운트업 재시작
        onResize: function(base) {
            // console.log(base.scope);
        },
        onScroll: function(base) {
            // console.log(base);
        }
    });

    var scrollReveal = function(){ // rnd 비전 등 스크롤 효과
        var $wrap = $('#scrollReveal');
        if (!$wrap.length) return false;
        var $container = $wrap.closest('.container');
        var $holder = $wrap.find('.wrapper');
        var a,b,c,d,e,a1,a2,a3,y;
        var idx = 0;
        var alpha = $window.height()/4;
        var _onScroll = function(){
            y = $window.scrollTop();
            if (y >= 0 && y < a - alpha) {
                $wrap.attr('class','').addClass('upper');
            }
            if (y >= a - alpha && y < c - alpha) {
                $container.addClass('in');
                $wrap.attr('class','').addClass('inner');
                if (y > a + e*0.5) {
                    idx = 2;
                } else if (y > a + e*0.2) {
                    idx = 1;
                } else {
                    idx = 0;
                }
                $wrap.attr('data-idx', idx);
            }
            if (y >= c - alpha) {
                $wrap.attr('class','').addClass('downer');
            }
        }
        var _onResize = function(){
            alpha = $window.height()/4;
            a = $wrap.offset().top;
            b = a;
            e = $wrap.height();
            d = $holder.height();
            c = a + e - d;
            _onScroll();
        };
        $window.on('scroll', function(){
            _onScroll();
        });
        $window.on('resize', function(){
            _onResize();
        });
        _onResize();
    };
    scrollReveal();

});
