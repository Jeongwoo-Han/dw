function fnPrdSearchByKeyword(pnm) {
	if (pnm) {
		$("#pageIndex").val(1);
		$("#srchword").val('');
		$("#srchkey").val(pnm);
		$("#srchcho").val('');
		$("#srchFrm").submit();
	}
}

function fnPrdSrchByPrdNm2(pnm) {
	if (pnm) {
		$("#pageIndex").val(1);
		$("#srchword").val(pnm);
		$("#srchkey").val('');
		$("#srchcho").val('');
		$("#srchFrm").submit();
	}
}

function fnPrdSearchByPrdNmGetWord(el) {
	var txt = $(el).text();
	if (txt) {
		var txts = txt.split("(");
		fnPrdSrchByPrdNm2($.trim(txts[0].replace(/(\r\n|\n|\r)/gm, "")));
	}
}

function fnPrdSearchByKeywordGetWord(el) {
	var txt = $(el).text();
	if (txt) {
		txt = txt.replace('#', '');
		fnPrdSearchByKeyword(txt);
	}
}

function fnSearchPharmacyByPrd(pnm) {
	$("#srchword2").val(pnm);
	$("#pharmFrm").attr("action", lnkUrl + "/product/pharmacy");
	$("#pharmFrm").submit();
}

function fnMakePaging(page, total_cnt, page_size, block_size, flag) {
	if (!page_size) {
		page_size = 6;
	}
	if (!block_size) {
		block_size   = 10;
	}

	var tot_page_cnt = Math.ceil(total_cnt/page_size); 
	var this_block = Math.ceil(page/block_size);
	var start_page, end_page;
	var res_html = "";

	if (this_block > 1) {
		start_page = (this_block-1) * block_size + 1;
	}else{
		start_page = 1;
	}

	if ((this_block*block_size) >= tot_page_cnt) {
		end_page = tot_page_cnt;
	} else {
		end_page = this_block * block_size;
	}

	var hashtag = "#none";
	if (flag) {
		hashtag = "#c"+$("#seltab").val()+"-";
	}
	if (start_page > block_size) {
		res_html += '<a href="'+hashtag+(start_page-1)+'" onclick="goPagePrd('+(start_page-1)+');" class="pag"><span class="ir i-prev">이전 페이지</span></a>';
	}
	res_html += '<span class="num">';
	for (var i=start_page; i <= end_page; i++) {
		if (i != page) {
			res_html += '<a href="'+hashtag+i+'" onclick="goPagePrd(' + i + ');">' + i + '</a>';
		} else {
			res_html += '<strong class="active" title="현재페이지">' + i + '</strong>';
		}
	}
	res_html += '</span>';

	if (end_page < tot_page_cnt) {
		res_html += '<a href="'+hashtag+(end_page+1) +'" onclick="goPagePrd(' + (end_page+1) + ');"  class="pag"><span class="ir i-next">다음 페이지</span></a>';

	}
	return res_html;
}