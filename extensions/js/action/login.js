/********************************************登录界面********************************************/
function setWarningInfor(message) {
	$(".login_info").text(message);
}

/** 
 * 验证用户名是否符合条件
 * @param {String} 待验证的用户名。
 * @return {Boolean} true代表符合条件，false代表不符合条件
 */
function validateUserName(userName) {
	//判断输入框内容是否为空
	if (userName == "") {
		return "User is empty!";
	};
	return "";
}


/** 
 * 验证密码是否符合条件
 * @param {String} 待验证的密码。
 * @return {Boolean} true代表符合条件，false代表不符合条件
 */
function validatePasword(userPass) {
	if (userPass == "") {
		return "Password is empty!";
	}
	return "";
}

/**
 * 登出事件
 */
function logOut() {
	//参数初始化
	setTotalJsonData({});
	setScriptType("");
	recordModal = 0;

	setTemplateName("Log Out!");
	$(".breadcrumb li").remove();
	$("#process_panel").nextAll().remove();
	clearBaseInfoPanel();
	$("#style_content tbody tr").remove();
	$("#current_character tbody tr").remove();

	//解绑相关按钮的事件
	$("#search_character").unbind("click");
	$("#select").unbind("mouseover");
	$("#add_style_row").unbind("mouseover");
	$("#remove_style_row").unbind("mouseover");
	$("#commit_data").unbind("click");
	$("#loging_out").unbind("click");
	$("#add_character").unbind("mouseover");
	$("#delete_character").unbind("mouseover");
	$(".close_panel").unbind("click");

	//调用登出的接口
	userlogout();
	$("#login_modal").modal("show");
}

/** 
 * 初始化登录界面的标签事件
 */
function initLoginEvent() {
	$("#login").click(function () {
		$("#progress_bar").show();
		// 显示进度条并隐藏登陆面板
		var userName = $("#inputEmail3").val();
		var userPass = $("#inputPassword3").val();
		var _message = validateUserName(userName);

		if (_message != "") {
			setWarningInfor(_message);
			return;
		}
		_message = validatePasword(userPass);
		if (_message != "") {
			setWarningInfor(_message);
			return;
		}
		userlogin(userName, userPass);
	});
}
