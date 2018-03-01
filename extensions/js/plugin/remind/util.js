function getWidth() {
	return $(document).width();
}
function getHeight() {
	return $(document).height();
}
function getScrollTop() {
	return $(document).scrollTop();
}


/**
 * 每种框的标签类型
 */
var PATTERN_LABEL = {
	"success":
	'<div id="alertSuccessBase" class="alert alert-success alert-dismissable" >'
	+ '<button type="button" class="close" aria-hidden="true" style="top: 0.5px;">&times;</button>'
	+ '<strong><span id="alertSuccessContent"></span></strong>'
	+ '</div>',
	'info':
	'<div id="alertInfoBase" class="alert alert-info alert-dismissable">'
	+ '<button type="button" class="close" aria-hidden="true" style="top: 0.5px;">&times;</button>'
	+ '<span id="alertInfoContent"></span>'
	+ '</div>',
	'warning':
	'<div id="alertWarningBase" class="alert alert-warning alert-dismissable">'
	+ '<button type="button" class="close"  aria-hidden="true" style="top: 0.5px;">&times;</button>'
	+ '<span id="alertWarningContent"></span>'
	+ '</div>',
	'danger':
	'<div id="alertDangerBase" class="alert alert-danger alert-dismissable">'
	+ '<button type="button" class="close" aria-hidden="true" style="top: 0.5px;">&times;</button>'
	+ '<span id="alertDangerContent"></span>'
	+ '</div>',
	'confirm':
	'<div id="ModalDiv" class="modal fade" style="z-index:9999">'
	+ '<div class="modal-dialog">'
	+ '<div id = "confirmBase" class="panel panel-default">'
	+ '<div id="confirmHead" class="panel-heading">'
	+ '<span class="glyphicon glyphicon-question-sign"></span>'
	+ 'Confirm'
	+ '</div>'
	+ '<div class="panel-body">'
	+ '<div id = "confirmContent" style="text-align: center; font-size: 14px; font-weight: bold"></div>'
	+ '<div class="row">'
	+ '<div class="col-md-offset-9">'
	+ '<button id="confirmSubmit" type="button" class="btn btn-success btn-sm">Submit</button>'
	+ '<button type="button" class="btn btn-default btn-sm" data-dismiss="modal" onclick="removeConfirm()">Cancel</button>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>'
}

//alert start
var alertType = {
	Success: "success",
	Info: "info",
	Warning: "warning",
	Danger: "danger"
};


/**
 * 移除动态狂
 */
function removeConfirm() {
	$("#ModalDiv").remove();
}


/**
 * 确认提示框
 * @param title{string} 确认框的标题
 * @param text{string} 确认框的内容
 * @param fun 回调函数
 * @param funParam 回调函数的参数
 * @param checkInfo 检查的信息
 */
function custConfirmDiv(title, text, fun, funParam) {
	if (title == undefined || title == "") {
		title = "Confirm";
	}
	if (text == undefined) {
		text = "";
	}

	$("body").append(PATTERN_LABEL['confirm']);
	$('#ModalDiv').modal({ backdrop: "static" });

	var contentHTML = "<div id='confirmError' class='alert alert-danger hidden'></div>" + text;
	$("#confirmContent").html(contentHTML);

	if (funParam == null || funParam == undefined) {
		$("#confirmSubmit").click(
			function () {
				$("#ModalDiv").modal("hide");
				$('#ModalDiv').remove();
				$('.modal-backdrop').remove();
				fun();
			});
	}
	else {
		$("#confirmSubmit").click(
			function () {
				$("#ModalDiv").modal("hide");
				$('#ModalDiv').remove();
				$('.modal-backdrop').remove();
				fun(funParam);
			});
	}
}


/**
 * 信息提示框
 * @param type 信息的类型
 * @param text 信息的内容
 * @returns {String}
 */
function alertDiv(type, text, closeTime) {
	$("#alertSuccessBase").remove();
	$("#alertInfoBase").remove();
	$("#alertWarningBase").remove();
	$("#alertDangerBase").remove();

	var halfWidth;
	var halfHeight;
	if( !closeTime ){
		closeTime = 4000;
	}
	var label;
	var font_size = "12px";
	var padding_top = "5px";
	var contentObj;
	var baseObj;
	label = PATTERN_LABEL[type];
	$("body").append(label);
	if (type == "success") {
		contentObj = $("#alertSuccessContent");
		baseObj = $("#alertSuccessBase");
	}
	else if (type == "info") {
		contentObj = $("#alertInfoContent");
		baseObj = $("#alertInfoBase");
	}
	else if (type == "warning") {
		contentObj = $("#alertWarningContent");
		baseObj = $("#alertWarningBase");
	}
	else if (type == "danger") {
		contentObj = $("#alertDangerContent");
		baseObj = $("#alertDangerBase");
	}
	else {
		return "";
	}
	// 考虑到用户如果点的速度过于快的话，要删除上一个参数
	$(contentObj).html(text);
	$(baseObj).find("button").bind("click", function(){
		$(this).parent().remove();
	});

	halfWidth = getWidth() / 2 - $(contentObj).width() / 2;
	halfHeight = getScrollTop() + $(baseObj).height() / 2;

	$(baseObj).css({
		"position": "absolute",
		"z-index": "999998",
		"top": halfHeight,
		"left": halfWidth,
		"font-size": font_size,
		"padding-top": padding_top,
		"padding-bottom": padding_top
	});

	setTimeout(function () { $(baseObj).remove(); }, closeTime);
}
