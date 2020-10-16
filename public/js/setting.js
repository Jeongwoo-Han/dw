window.setting = (typeof window.setting !== 'undefined') ? window.setting : {};
// window.setting.modalPage = true; // modalPage 사용 유무

window.setting = {
    suit: 'classic', // 기기 모드 classic, mobile
    dev: false, // 개발모드
    lang: 'ko', // 언어 설정 en, cn
    path: { // ajax path
        header: '../common/ajax_header.asp', // 패밀리사이트
        allmenu: '../common/ajax_allmenu.asp', // 패밀리사이트
    }
};

var fonts = {
  notoSansKr: 'Noto Sans KR:100,300,400,500,700,900:korean',
  muli: 'Muli:400,500,600,700'
};
WebFont.load({
  google: {
    families: [fonts.notoSansKr, fonts.muli]
  }
});
