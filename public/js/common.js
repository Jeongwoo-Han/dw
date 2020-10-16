//ime-mode
$.fn.fnSetImeMode = function(v) {
	$(this).css("ime-mode", v);
}

$.fn.fnKeyOnlyKorean = function(msg) {
	var regexp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
	$(this).fnSetImeMode("active");
	$(this).on("input", function() {
		if (regexp.test($(this).val())) {
			if (msg) alert(msg);
			$(this).val( $(this).val().replace(regexp, '') );
		}		
	});
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
	var regexp = /[^FN0-9]/g;
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

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function autoHypenPhone(str) {
	str = str.replace(/[^0-9]/g, '');
	var tmp = '';
	if( str.length < 4){
		return str;
	}else if(str.length < 7){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
		return tmp;
	}else if(str.length < 11){
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 3);
		tmp += '-';
		tmp += str.substr(6);
		return tmp;
	}else{
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
		return tmp;
	}
	return str;
}

function fnFrontSearch() {
	event.preventDefault();
	if ($.trim($("#sq").val()) != '') {
		$("#sFrm").submit();
	} else {
		alert("검색할 제품명을 입력하세요");
		$("#sq").focus();
		return;
	}	
}

function fnSrchBBS() {
	//event.preventDefault();
	if ($.trim($("#sq").val()) != '') {
		return true;
	} else {
		alert("검색어를 입력하세요");
		$("#sq").focus();
		return false;
	}
}

function fnSrchSabo() {
	$("#bSFrm").submit();
}

function fnProductSrch() {
	$("#choseong").val('');
	$("#catcd1").val('');
	$("#catcd2").val('');
	if ($.trim($("#sq").val()) != '') {
		$("#sFrm").submit();
	} else {
		alert("검색어를 입력하세요");
		$("#sq").focus();
		return;
	}
}

function fnPrdSrchChoseong(flag) {
	$("#choseong").val(flag);
	$("#choGrid > .col").removeClass("in");
	$("#choGrid > .col").each(function(index) {
		var t = $(this).find("span").text();
		if (t == flag) {
			$(this).addClass("in");
		}
	});

	fnPrdSrchChoseongSbm();
}

function fnPrdSrchChoseongSbm() {
	$("#sq").val('');
	$("#catcd1").val('');
	$("#catcd2").val('');
	if ($.trim($("#choseong").val()) != '') {
		$("#sFrm").submit();
	} else {
		alert("초성을 선택하세요");
		return;
	}
}

function fnSrchCatDetail(cat) {
	$("#sq").val('');
	$("#choseong").val('');
	$("#catcd2").val(cat);

	$("#sFrm").submit();
}

function fnPrdSrchCategory(cat) {
	$("#sq").val('');
	$("#choseong").val('');
	$("#catcd1").val(cat);
	if (selcatcd1 != cat) {
		$("#catcd2").val('');
	}
	var selPrdCat = '';
	var _html = '';
	_html += '<div class="col" data-catcd2="all">';
	_html += '<a href="javascript:;" onclick="fnSrchCatDetail(\'all\');return false;">';
	_html += '<span class="name">전체</span>';
	_html += '</a>';
	_html += '</div>';
	$.ajax({					
		url: sjROOT + "/common/get_gen_category.asp",
		type: 'POST',
		dataType: 'text',
		data: {"scatelv":"lv2", "scode1" : cat},
		success: function(data) {
			if (data) {
				var obj = JSON.parse(data);
				if (obj && obj.length > 0) {
					$.each(obj, function(index, entry) {
						_html += '<div class="col" data-catcd2="'+entry.code2+'">';
						_html += '<a href="javascript:;" onclick="fnSrchCatDetail(\''+entry.code2+'\');return false;">';
						_html += '<span class="name">'+entry.label+'</span>';
						_html += '</a>';
						_html += '</div>';
					});
					$("#cat2List").html(_html);
				}
			} else {
				$("#cat2List").html(_html);
			}

			if ($("#catcd2").val() == '') {
					fnSrchCatDetail('all');
			} else {
				if (cat == selcatcd1)
				{
					fnCat2Disp();
				}
			}
		},
		error: function(e) {
			console.log(e);
		}
	});	
}

function fnDispPrdSrchCondition() {
	if ($("#catcd1").val() != '') {
		$("#catCd1List > .col").each(function() {
			var $this = $(this);
			var catcd1 = $this.data("catcd1");
			if (catcd1 == $("#catcd1").val()) {
				setTimeout(function() {$this.find(".module").find("a").trigger('click');}, 300);
			}
		});
	}
}

function fnCat2Disp() {
	if ($("#catcd2").val() != '') {
		$("#cat2List > .col").each(function() {
			var $this = $(this);
			var catcd2 = $this.data("catcd2");
			if (catcd2 == $("#catcd2").val()) {
				$this.addClass("in");
			}
		});
	}
}

function fnGetCategoryInfo() {
	var _html = '<option value="">선택</option>';
	$.ajax({					
		url: sjROOT + "/common/get_gen_category.asp",
		type: 'POST',
		dataType: 'text',
		data: {"scatelv":"lv1", "scode1" : "0100"},
		success: function(data) {
			if (data) {
				var obj = JSON.parse(data);
				if (obj && obj.length > 0) {
					$.each(obj, function(index, entry) {
						_html += '<option value="'+entry.code2+'">'+entry.label+'</option>\n';
					});
					$("#catcd1").html(_html);
				}

				if (selCat != '') {
					$("#catcd1").val(selCat);
				}
			}
		},
		error: function(e) {
			console.log(e);
		}
	});			
}

function fnGetCategoryInfo2() {
	var _html = '';
	$.ajax({					
		url: sjROOT + "/common/get_gen_category.asp",
		type: 'POST',
		dataType: 'text',
		data: {"scatelv":"lv1", "scode1" : "0200"},
		success: function(data) {
			if (data) {
				var obj = JSON.parse(data);
				if (obj && obj.length > 0) {
					$.each(obj, function(index, entry) {
						_html += '<p>';
						_html += '<span class="checks">';
						_html += '<input type="checkbox" id="category'+(index+1)+'" name="categorys" value="'+entry.code2+'"/>';
						_html += '<label for="category'+(index+1)+'">'+entry.label+'</label>';
						_html += '</span>';
						_html += '</p>';
					});
					$("#categorylists").html(_html);
				}
			}
		},
		error: function(e) {
			console.log(e);
		}
	});			
}

function fnGetAddr1(seladdr) {
	var _html = '<option value="">시/도 선택</option>';
	$.ajax({					
		url: sjROOT + "/common/get_gen_category.asp",
		type: 'POST',
		dataType: 'text',
		data: {"scatelv":"lv1", "scode1" : "0300"},
		success: function(data) {
			if (data) {
				var obj = JSON.parse(data);
				if (obj && obj.length > 0) {
					$.each(obj, function(index, entry) {
						_html += '<option value="'+entry.label+'">'+entry.label+'</option>\n';
					});
					$("#saddr1").html(_html);
				}

				if (seladdr) {
					$("#saddr1").val(seladdr);
				};
			}
		},
		error: function(e) {
			console.log(e);
		}
	});			
}

function fnSrchPharmacy() {
	var sq = $("#sq").val();
	var sad1 = $("#saddr1 option:selected").val();
	var sad2 = $("#saddr2").val();

	if ($.trim(sq) == '') {
		alert("제품명을 입력하세요");
		$("#sq").focus();
		return;
	}
	if ($.trim(sad1) == '') {
		alert("시/도를 선택하세요");
		$("#saddr1").focus();
		return;
	}
	$("#sFrm").submit();
}

function fnInitSrchPharmacy() {
	$("#sq").val('');
	$("#saddr1").val('');
	$("#saddr2").val('');
}

function fnShowPharmacyLocation(maptitle, address) {
	var geocoder = new kakao.maps.services.Geocoder();
	geocoder.addressSearch(address, function(result, status) {
		// 정상적으로 검색이 완료됐으면 
		if (status === kakao.maps.services.Status.OK) {
			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
			var mapid = "map1";
			var mapContainer = document.getElementById(mapid), // 지도를 표시할 div 
				mapOption = {
					center: coords, // 지도의 중심좌표
					level: 3 // 지도의 확대 레벨
				};  

			// 지도를 생성합니다    
			var map = new kakao.maps.Map(mapContainer, mapOption); 

			var mapTypeControl = new kakao.maps.MapTypeControl();

			map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
			var zoomControl = new kakao.maps.ZoomControl();
			map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);

			// 결과값으로 받은 위치를 마커로 표시합니다
			var marker = new kakao.maps.Marker({
				map: map,
				position: coords
			});

			var contentString = [
			'<div class="iw_inner">',
			'   <p style="width:200px;padding:10px;line-height:1.3em;text-align:center;font-size:15px;">'+maptitle+'</p>',
			'</div>'
			].join('');

			// 인포윈도우로 장소에 대한 설명을 표시합니다
			var infowindow = new kakao.maps.InfoWindow({
				content: contentString
			});
			infowindow.open(map, marker);

			// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
			map.setCenter(coords);
		} 
	});
}

function OnCheckPhone(e, oTa) { 
	var sMsg = oTa.value ;
	var onlynum = "" ;
	var imsi=0;
	onlynum = RemoveDash2(sMsg);
	onlynum =  checkDigit(onlynum);
	var retValue = "";
	var key = ( e.which ) ? e.which : e.keyCode;

	if(key != 12 && key != 8 && key != 46) {
		if(onlynum.substring(0,2) == 02) {
			if (GetMsgLen(onlynum) <= 1) oTa.value = onlynum ;
			if (GetMsgLen(onlynum) == 2) oTa.value = onlynum + "-";
			if (GetMsgLen(onlynum) == 4) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,3) ;
			if (GetMsgLen(onlynum) == 4) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,4) ;
			if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) ;
			if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) ;
			if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) + "-" + onlynum.substring(5,7) ; ;
			if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,8) ;
			if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) + "-" + onlynum.substring(5,9) ;
			if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
			if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
			if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
		}
		if(onlynum.substring(0,2) == 05 ) {
			if(onlynum.substring(2,3) == 0 ) {
				if (GetMsgLen(onlynum) <= 3) oTa.value = onlynum ;
				if (GetMsgLen(onlynum) == 4) oTa.value = onlynum + "-";
				if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,5) ;
				if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,6) ;
				if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) ;
				if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
				if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) + "-" + onlynum.substring(7,9) ; ;
				if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,10) ;
				if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) + "-" + onlynum.substring(7,11) ;
				if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,12) ;
				if (GetMsgLen(onlynum) == 13) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,12) ;
			} else {
				if (GetMsgLen(onlynum) <= 2) oTa.value = onlynum ;
				if (GetMsgLen(onlynum) == 3) oTa.value = onlynum + "-";
				if (GetMsgLen(onlynum) == 4) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
				if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
				if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
				if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
				if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,8) ; ;
				if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
				if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
				if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
				if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
			}
		}
		if(onlynum.substring(0,2) == 03 || onlynum.substring(0,2) == 04  || onlynum.substring(0,2) == 06  || onlynum.substring(0,2) == 07  || onlynum.substring(0,2) == 08 ) {
			if (GetMsgLen(onlynum) <= 2) oTa.value = onlynum ;
			if (GetMsgLen(onlynum) == 3) oTa.value = onlynum + "-";
			if (GetMsgLen(onlynum) == 4) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
			if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
			if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
			if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
			if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,8) ; ;
			if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
			if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
			if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
			if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
		}
		if(onlynum.substring(0,2) == 01) {
			if (GetMsgLen(onlynum) <= 2) oTa.value = onlynum ;
			if (GetMsgLen(onlynum) == 3) oTa.value = onlynum + "-";
			if (GetMsgLen(onlynum) == 4) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
			if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
			if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
			if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
			if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,8) ;
			if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
			if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
			if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
			if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
		}
		if(onlynum.substring(0,1) == 1) {
			if (GetMsgLen(onlynum) <= 3) oTa.value = onlynum ;
			if (GetMsgLen(onlynum) == 4) oTa.value = onlynum + "-";
			if (GetMsgLen(onlynum) == 5) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,5) ;
			if (GetMsgLen(onlynum) == 6) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,6) ;
			if (GetMsgLen(onlynum) == 7) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) ;
			if (GetMsgLen(onlynum) == 8) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
			if (GetMsgLen(onlynum) == 9) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
			if (GetMsgLen(onlynum) == 10) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
			if (GetMsgLen(onlynum) == 11) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
			if (GetMsgLen(onlynum) == 12) oTa.value = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
		}
	} else {
		//console.log(event.keyCode);
	}
}

function RemoveDash2(sNo) {
	var reNo = "";
	for(var i=0; i<sNo.length; i++) {
		if ( sNo.charAt(i) != "-" ) {
			reNo += sNo.charAt(i);
		}
	}
	return reNo;
}

function GetMsgLen(sMsg) { // 0-127 1byte, 128~ 2byte
	var count = 0;
	for(var i=0; i<sMsg.length; i++) {
		if ( sMsg.charCodeAt(i) > 127 ) {
			count += 2;
		} else {
			count++;
		}
	}
	return count;
}

function checkDigit(num) {
	var Digit = "1234567890";
	var string = num;
	var len = string.length
	var retVal = "";

	for (i = 0; i < len; i++) {
		if (Digit.indexOf(string.substring(i, i+1)) >= 0) {
			retVal = retVal + string.substring(i, i+1);
		}
	}
	return retVal;
}

function auto_date_format( e, oThis ) {
	var num_arr = [ 
		97, 98, 99, 100, 101, 102, 103, 104, 105, 96,
		48, 49, 50, 51, 52, 53, 54, 55, 56, 57
		];

	var key = ( e.which ) ? e.which : e.keyCode;
	var key_code = ( e.which ) ? e.which : e.keyCode;
	if( key != 12 && key != 8 && key != 46 ) {
		var len = oThis.value.length;
		if( len == 4 ) oThis.value += "-";
		if( len == 5 ) {
			if (oThis.value.charAt(oThis.value.length-1) == 0 || oThis.value.charAt(oThis.value.length-1) == 1) {
				oThis.value = oThis.value.substring(0,4) + "-" + oThis.value.charAt(oThis.value.length-1);
			} else {
				oThis.value = oThis.value.substring(0,4) + "-0";
			}
		}
		
		if( len == 7 ) oThis.value += "-";

		if( len == 9 ) {
			if (oThis.value.charAt(oThis.value.length-1) == 0 || oThis.value.charAt(oThis.value.length-1) == 1 || oThis.value.charAt(oThis.value.length-1) == 2 || oThis.value.charAt(oThis.value.length-1) == 3) {
				oThis.value = oThis.value.substring(0,4) + "-" + oThis.value.substring(5,7) + "-" + oThis.value.charAt(oThis.value.length-1);
			} else {
				oThis.value = oThis.value.substring(0,4) + "-" + oThis.value.substring(5,7) + "-0";
			}
		}
	}
}

function fnFindPharmacyFromProduct(nm) {
	var form = $('<form></form>');
	form.attr('action', sjFURL + "/product/pharmacy.asp");
	form.attr('method', 'post');
	form.appendTo('body');
	var idx = $("<input type='hidden' value="+nm+" name='sq'>");
	form.append(idx);
	form.submit();
}

function fnSetPopCookie() {
	$.cookie('sjpop', 'no', { expires: 1, path: '/' });
}

function fnSrchChange(type) {
	$("#msrch_type").val(type);
	if (type == 1) {
		$("#sFrm").attr('action', sjFURL + '/product/search.asp');
		$("#mSrchPrd").addClass("active");
		$("#mSrchPharm").removeClass("active");
		
	} else if (type == 2) {
		$("#sFrm").attr('action', sjFURL + '/product/pharmacy.asp');
		$("#mSrchPrd").removeClass("active");
		$("#mSrchPharm").addClass("active");
	}
}

function fnSetEmailDomain(tgt) {
	var domain = $("#selMailDomain option:selected").val();
	if (domain != "input")
	{
		$("#"+tgt).val($("#"+tgt).val() + "@" + domain);
	}
	else
	{
		var emid = "";
		var em = $("#"+tgt).val();
		if (em != '')
		{
			em = em.split("@");
			emid = em[0];
		}
		$("#"+tgt).val(emid);
		$("#"+tgt).focus();
	}
}