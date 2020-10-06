//ime-mode
$.fn.fnSetImeMode = function(v) {
	$(this).css("ime-mode", v);
}

$.fn.fnKeyOnlyNumber = function() {
	$(this).fnSetImeMode("disabled");
	$(this).on("input", function(evt) {
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
		evt = evt || window.event;
		var code = (evt.which) ? evt.which : evt.keyCode;
		if ( code != 46 && (code < 48 || code > 57) ) {
			if (window.event) {
				window.event.returnValue = false;
			} else {
				evt.preventDefault();
			}
		}
	});
}

$.fn.fnKeyNotKorean = function(msg) {
	var regexp = /[^a-zA-Z0-9.\-\_\@]/g;
	$(this).fnSetImeMode("inactive");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			if (msg) alert(msg);
			$(this).val( $(this).val().replace(regexp, '') );
		}
	});	
}

$.fn.fnKeySetPwd = function(msg) {
	var regexp = /[^a-zA-Z0-9.\-\_\@\`\!\@\#\$\)\(\*\&\^\%\+\=\-\_\"\']/g;
	$(this).fnSetImeMode("inactive");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			if (msg) alert(msg);
			$(this).val( $(this).val().replace(regexp, '') );
		}
	});	
}

$.fn.fnKeyOnyNum2 = function(msg) {
	var regexp = /[^0-9.]/g;
	$(this).fnSetImeMode("inactive");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			if (msg) alert(msg);
			$(this).val( $(this).val().replace(regexp, '') );
		}
	});	
}

$.fn.fnKeyOnyDate = function(msg) {
	var regexp = /[^0-9\-]/g;
	$(this).fnSetImeMode("inactive");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			if (msg) alert(msg);
			$(this).val( $(this).val().replace(regexp, '') );
		}
	});	
}

$.fn.fnKeyOnlyOrdNo = function() {
	var regexp = /[^A-Z0-9]/g;
	$(this).fnSetImeMode("inactive");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			$(this).val( $(this).val().replace(regexp, '') );
		}
	});	
}

$.fn.fnSetMaxlength = function(mxlen) {
	mxlen = mxlen || 10;
	$(this).attr("maxlength", mxlen);
}

$.fn.fnSetAttr = function(p, v) {
	$(this).attr(p, v);
}

$.fn.fnKeyOnlyPercentNumber = function() {
	var regexp = /[^0-9.%]/g;
	$(this).fnSetImeMode("disabled");
	$(this).on("input", function(e) {
		if (regexp.test($(this).val())) {
			$(this).val( $(this).val().replace(regexp, '') );
		} else {
			var v = e.target.value.slice(0, e.target.value.length - 1);
			if (v.includes('%')) {
				e.target.value = '%';
			} else if (v.length >= 3 && v.length <= 4 && !v.includes('.')) {
				if (v == '100' || v == '10000') {
					e.target.value = v + '.00%';
				} else {
					e.target.value = v.slice(0, 2) + '.' + v.slice(2, 3) + '%';
					e.target.setSelectionRange(4, 4);
				}
			} else if (v.length >= 5 & v.length <= 6) {
				var whole = v.slice(0, 2);
				var fraction = v.slice(3, 5);
				e.target.value = whole + '.' + fraction + '%';
			} else {
				e.target.value = v + '%';
				e.target.setSelectionRange(e.target.value.length - 1, e.target.value.length - 1);
			}
			e.target.value = e.target.value.replace('..', '.');
		}
	});
}

function goPage(pageIndex){
	$("#pageIndex").val(pageIndex);
	$("#listFrm").submit();
}

function fnSrchFrm(){
	goPage(1);
}

function fnSrchInit(){
	var url = window.location.pathname;
	document.location.href = url;
}

function fnGoList() {
	$("#listFrm").submit();
}	

function fnDownLoad(fidx, tgt) {
	if (tgt == '_blank') {
		window.open(dwCtx + "/comm/download?fi="+fidx, '_blank');
	} else {
		document.location.href = dwCtx + "/comm/download?fi="+fidx;
	}
}

function fnSetCookie(n, v, exp) {
	$.cookie(n, v, { expires: exp, path: '/' });
}

function fnRemoveCookie(n) {
	$.removeCookie(n, { path: '/' });
}

function fnGetCookie(n) {
	var rtn = $.cookie(n);
	if (rtn === undefined) {
		rtn = '';
	}
	return rtn;
}

function fnSetTopBannerClose(id) {
	var ischk = $('#topBannerToday'+id).is(":checked");
	if (ischk) {
		fnSetCookie('pop'+id, 'ok', 1);
	}
	$('#topBanner'+id).slideUp(600);
}

function fnSetTopPopClose(id) {
	var ischk = $('#topPopToday'+id).is(":checked");
	if (ischk) {
		fnSetCookie('pop'+id, 'ok', 1);
	}
	$('#lPop'+id).uipop('close');
}

function fnAddEventListener() {
	$('.i-download, .i-download-2').closest(".item").off('click').click(function(e) {
		e.preventDefault();
		var fidx = $(this).attr('data-fidx');
		fnDownLoad(fidx, '_blank');
	});
}

function get_version_of_IE() {
	 var word;
	 var version = "N/A";
	 var agent = navigator.userAgent.toLowerCase();
	 var name = navigator.appName;
	 // IE old version ( IE 10 or Lower )
	 if ( name == "Microsoft Internet Explorer" ) word = "msie ";
	 else {
		 // IE 11
		 if ( agent.search("trident") > -1 ) word = "trident/.*rv:";
		 // Microsoft Edge
		 else if ( agent.search("edge/") > -1 ) word = "edge/";
	 }
	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );
	 if (  reg.exec( agent ) != null  ) version = RegExp.$1 + RegExp.$2;
	 return version;
}

function getInternetExplorerVersion() {
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

function changeLanguage(lang, obj) {
	var str = '';
	switch (lang) {
		case "kr":
			str = obj.kr;
			break;
        case "en":
            str = obj.en;
            break;
		default :
			str = obj.kr;
			break;
	}
	return str;
}

function fnMakeTelNo1(obj) {
	var domains = ['010', '011', '016', '017', '018', '019'];
	for (var i = 0; i < domains.length; i++) {
		obj.append('<option value="'+domains[i]+'">'+domains[i]+'</option>');
	}
}

function fnMakeEmailDomins(obj, lang) {
	var domains = ['chol.com', 'daum.net', 'dreamwiz.com', 'empal.com', 'freechal.com', 'hanmir.com', 'hitel.net', 
					'intizen.com', 'kebi.com', 'korea.com', 'lycos.co.kr', 'msn.com', 'nate.com', 'naver.com', 
					'netian.com', 'orgio.net', 'gmail.com', 'yahoo.co.kr', 'yahoo.com', '00'];
	var tmpTxt = '';

	for (var i = 0; i < domains.length; i++) {
		if (domains[i] == '00') {
            tmpTxt = changeLanguage(lang, {
                "kr": "직접입력",
                "en": "Enter"
            });
		} else {
			tmpTxt = domains[i];
		}
		obj.append('<option value="'+domains[i]+'">'+tmpTxt+'</option>');
	}
}

function isEmailValid(email) {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email);
}

function fnShowMapFromAddr(mapId, maptitle, address) {
	var dwMap = null;
	var isvisible = $("#"+mapId).parent().is(":visible");
	if (isvisible) {
		$("#"+mapId).parent().hide();
	} else {
		$("#"+mapId).parent().css("width", 1920);
		$("#"+mapId).parent().css("height", 560);
		$("#"+mapId).parent().show();
	}
	var geocoder = new kakao.maps.services.Geocoder();
	geocoder.addressSearch(address, function(result, status) {
		if (status === kakao.maps.services.Status.OK) {
			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
			var mapid = mapId;
			var mapContainer = document.getElementById(mapid),
			mapOption = {
				center: coords,
				level: 3
			};  

			dwMap = new kakao.maps.Map(mapContainer, mapOption); 
			var mapTypeControl = new kakao.maps.MapTypeControl();

			dwMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

			var imageSrc = "/resource/p/"+langcd + "/image/common/map-pin-2.png"; //image source
			var imageSize = new kakao.maps.Size(32, 40); // 마커이미지의 크기
			var imageOption = {};

			var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

			var marker = new kakao.maps.Marker({
				map: dwMap,
				image: markerImage,
				position: coords
			});

			marker.setMap(dwMap);
			dwMap.setCenter(coords);
			dwMap.relayout();
		} 
	});
}

function fnInitAcc() {
	$.ajax({
		type: 'POST',
		url: dwCtx + '/comm/' + langcd + '/chkAccessInit',
		data: "",
		dataType:"json",
		beforeSend: function( xhr ) {
			xhr.setRequestHeader("AJAX", "true");
		},
		success: function(result) {
		},
		error : function(xhr, textStatus, error) {
		}
	});
}

function fnMakeSubBanner(result) {
	var _html = '';
	var datas = result.bannerPopList;
	if (datas && datas.length > 0) {
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];
			var cssColor = '';
			if (data.bg_color != '') {
				cssColor = "style='background-color:#" + data.bg_color + ";'"
			}
			_html += '<div class="top-banner" id="topBanner'+data.idx+'" ' + cssColor + '>';
			_html += '<div class="inner">';
			_html += '<a href="#"><img src="'+data.pc_path + data.pc_save + '" alt="" /></a>';
			_html += '</div>';
			_html += '<div class="foot">';
			_html += '<span class="today">';
			_html += '<input type="checkbox" id="topBannerToday'+data.idx+'" class="fm-chk"/>';
			_html += '<label for="topBannerToday'+data.idx+'" class="fm-chk-i">오늘 그만 보기</label>';
			_html += '</span>';
			_html += '<button type="button" class="close" onclick="fnSetTopBannerClose(\''+data.idx+'\');"><span class="ir i-close">닫기</span></button>';
			_html += '</div>';
			_html += '</div>';

			$("#subBList").prepend(_html);
			_html = '';

			if (fnGetCookie('pop'+data.idx+'') != 'ok') {
				$("#topBanner"+data.idx+"").delay(600).slideDown(600);
			}
		}
	}
}

function fnChkSubBanner() {
	$.ajax({
		type: 'POST',
		url: dwCtx + '/comm/' + langcd + '/getSubBanner',
		data: '',
		dataType:"json",
		beforeSend: function( xhr ) {
			xhr.setRequestHeader("AJAX", "true");
		},
		success: function(data) {
			fnMakeSubBanner(data);
		},
		error : function(xhr, textStatus, error) {
		}
	});
}

function fnChkPwd(str, uid) {
	var minLen = 8;
	var maxLen = 12;
	var pass = str;
	var message = "";
	var chk = 0;
	
	if (pass.length < minLen || pass.length > maxLen) {
		message = "비밀번호는 " + minLen + "자 이상 " + maxLen + "자 이하로 입력해주세요.";
	}
	if (pass.search(/₩s/) != -1) {
		message = "비밀번호는 공백업이 입력해주세요.";
	}

	// 비밀번호 문자열에 숫자 존재 여부 검사
	var pattern1 = /[0-9]/;  // 숫자
	if(pattern1.test(pass) == false) {
		message = "비밀번호에 숫자가 입력되지 않았습니다.\n숫자를 입력해주세요.";
	}

	// 비밀번호 문자열에 영문 소문자 존재 여부 검사
	var pattern2 = /[a-zA-Z]/;
	if(pattern2.test(pass) == false) {
		message = "비밀번호에 영문자가 입력되지 않았습니다.\n영문자를 입력해주세요.";
	}

	// 비밀번호 문자열에 영문 대문자 존재 여부 검사
	/*var pattern3 = /[A-Z]/;
	if(pattern3.test(pass) == false) {
		message = "비밀번호에 영문 대문자가 입력되지 않았습니다.\n영문 대문자를 입력해주세요.";
	}
	*/

	// 비밀번호 문자열에 특수문자 존재 여부 검사
	var pattern4 = /[~!@#$%^&*()_+|<>?:{}]/;  // 특수문자
	if(pattern4.test(pass) == false) {
		message = "비밀번호에 특수문자가 입력되지 않았습니다.\n특수문자를 입력해주세요.";
	}
	
	var pattern5 = /(\w)\1\1\1/;
	if(pattern5.test(pass)){
		message = '같은 문자를 4번 이상 사용하실 수 없습니다.';
    }
	
	if (uid) {
		if (pass.search(uid) > -1) {
			message = "ID가 포함된 비밀번호는 사용하실 수 없습니다.";
		}
	}

	// 비밀번호 문자열 결과 출력
	if(message) {
		alert(message);
		return false;
	} else {
		return true;
	}
}
