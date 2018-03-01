/**************************************字段处理界面相关方法**************************************/
/** 全局变量
 */
let selectedScriptType = ''; //记录被选中的字段的类型


function setScriptType(scriptType) {
	selectedScriptType = scriptType;
}


function getScriptType() {
	return selectedScriptType;
}


/** 删除缓存变量jsonData中mdes下指定路径下的指定的字段
 *  @param {Number} index:  要删除在对应参数中索引的值
 */
function deleteCharacterOfVariable(index) {
	var jsonData = getDataQuote(2);
	jsonData.splice(index, 1);

}


/**
 * 添加字段到缓存变量jsonData下mdes下指定路径下添加指定字段
 * @param {String} characterName:待添加字段的名称
 */
function addCharacterOfVairable(characterName) {
	var jsonData = getDataQuote(2);
	var children = getCharaterTemplate();
	children[KEY_MAPPING['keyname']] = characterName;
	jsonData.push(children);
}


/** 获取字段处理界面中已经添加的字段名
 * @return {Array} ：数组对象。包含当前已经添加的所有子字段的名称。
 */
function getAleardyChars() {
	var charsEle = $('#character_process_panel tbody tr');
	var charArray = [];
	for (var i = 0; i < charsEle.length; i++) {
		charArray[i] = $(charsEle[i]).find('a').text();
	}
	return charArray;
}


/** 验证添加的字段名是否符合条件（基本条件；是否只包含字母，数字或者下划线_;字段名是否已经存在)
 * @return {String} ：带有信息的字符串。当字符串为空时，说明字段名符合相应的条件。
 */
function validateCharacterName() {
	var character_name = $('#input_character_text').val();
	//除去字符串开头和结尾的空格
	character_name = character_name.replace(/(^\s*)|(\s*$)/g, '');
	//验证是否符合基本条件
	var message = validateString(character_name);
	if (message != '') {
		return message;
	}
	//验证字符串中是否包含'.'和'$'符号
	var regExp = new RegExp(/([\.\$])/);
	if (regExp.test(character_name)) {
		return "'.' or '$' is forbidden!";
	}
	//判断用户是否输入了'\0'，这种参数是不允许的
	var regExp = new RegExp(/(.*\\0.*)/);
	if (regExp.test(character_name)) {
		return '\\0 is forbidden!';
	}
	//验证字符串不能够以下划线(_)开头
	var regExp = new RegExp(/(^_.*)/);
	if (regExp.test(character_name)) {
		return '_ is forbidden!';
	}
	//验证字段名是否已经存在
	//	var existChars = getAleardyChars();
	//	if( in_array( character_name, existChars ) ){
	//		return 'Name has been existed!';
	//	}

	return '';
}

/** 作用：验证移除的字段名是否符合条件
 * @return {String} : 验证的结果。如果为空，说明当前的内容不符合条件。如果不为空，符合条件。
 */
function validateRemoveName() {
	var inputName = $('#remove_character_text').val();
	if (inputName === '') {
		message = 'Empty is forbidden!';
		return message;
	}
	if (hasName(inputName) != null) {
		return '';
	}
	return "Character isn't exist!";
}


/** 
 * 移除obj对象所在的字段行，并将对应的字段从临时数据中删除
 * @param {jQuery} obj:标签对象
 */
function removeCharacterClick(obj) {
	obj = $(obj).parents('.character');
	var name = $(obj).find('a').text();
	Modal.confirm({
		message: "Delete '" + name + " ?"
	}).on(function (e) {
		if (e) {
			var index = $(obj).index();
			//从临时缓存变量中删除参数
			deleteCharacterOfVariable(index);
			$(obj).remove();
		};
	});
}


/** 
 * 向字段处理界面添加新的字段行
 * @param {String} characterName 是要添加的字段名
 * @return {Boolean} : true代表添加成功；false代表添加失败。
 */
function addCharacter(characterName) {
	// 添加新的字段行
	var trModel = $('#character_pattern tr').clone();

	$(trModel).find('a').text(characterName);
	$(trModel).find('a').bind('click', function () {
		createChildrenCharacter(this);
		return false;
	});
	$(trModel).find('.removeCharacter').bind('click', function () {
		removeCharacterClick(this);
		//这里只是借用了样式，没有触发关闭面板事件，所以这里返回的false，不让点击事件触发(即不执行关闭窗口事件)
		return false;
	});

	// 这里不能够使用prepend,因为数据中数据的顺序是以数组的顺序来获取的
	$('#current_character tbody').append(trModel);
}


/**
 * 给指定字段添加子字段。
 * 1：记录当前字段所对应的值的选项
 * 2：给面包屑添加新的一级。
 * 3: 添加相应的事件。
 * 4：将面包屑最后一级和倒数第二级的名称以及字段顺序替换。
 * 5：移除当前页面上显示的字段
 * 6：显示当前级别中的字段。
 * @param {jQuery} obj: 用户点击的标签
 */
function createChildrenCharacter(obj) {
	// 获取当前字段对应的数据位置
	var index = $(obj).parents('tr').index();
	if (index == -1) {
		alertDiv(alertType.Danger, 'Get the index of elements to fail!');
		return;
	}

	var character = $(obj).text();
	var breadcrumbObj = $('#character_process_panel .breadcrumb');
	var lastBreadcrumbObj = $(breadcrumbObj).find('li:last');
	var parentObj = $('#breadcrumb_pattern');

	// 修改旧一级的标签
	var aPattern = $(parentObj).find('a');
	$(lastBreadcrumbObj).wrapInner(aPattern);
	$(lastBreadcrumbObj).find('a').bind('click', function () {
		openCharacter(this);
		return false;
	});

	// 添加新一级的字段
	var pattern = $(parentObj).find('.final').clone();
	$(pattern).attr('value', index);
	$(pattern).text(character);
	$(breadcrumbObj).append(pattern);

	refreshProcessPanel();
}

/**
 * 作用：打开指定的字段界面
 * @param {jQuery} obj: 打开指定字段的内容
 */
function openCharacter(obj) {
	var currentChar = $(obj).text();
	var liObj = $(obj).parents('li');

	// 移除包括自己的所有数据
	var afterObj = $(liObj).nextAll('li');
	$(afterObj).remove();
	$(liObj).find('a').remove();
	$(liObj).text(currentChar);

	// 获取当前的路径
	var jsonData = getDataQuote(2);


	// 移除当前显示的所有字段
	$('#current_character').find('tr').remove();
	for (var i = 0; i < jsonData.length; i++) {
		addCharacter(jsonData[i][KEY_MAPPING['keyname']]);
	}
}


/** 
 * 判断字段处理表格中是否包含某个字段
 * @param {String} str: 要判断的字段
 * @return {jQuery} 待判断字段所在的字段行的标签元素。返回null代表不存在该字段。
 */
function hasName(str) {
	var characterList = $('#character_process_panel tbody tr');
	for (var i = 0; i < characterList.length; i++) {
		if (str === $.trim($(characterList[i]).find('.name').text())) {
			return $(characterList[i]);
		}
	}
	return null;
}


/** 
 * 移除用户输入的字段
 */
function removeCharacter() {
	var removeName = $('#remove_character_text').val();
	Modal.confirm({
		message: "Delete '" + removeName + "?"
	}).on(function (e) {
		if (e) { //选择确定
			var removeCharEle = hasName(removeName);
			if (removeCharEle != null) {
				var index = $(removeCharEle).index();
				deleteCharacterOfVariable(index);
				$(removeCharEle).remove();
				alertDiv(alertType.Success, 'Success!');
				return;
			} else {
				alertDiv(alertType.Danger, "Character isn't exist!");
			}
		}
	});
}


/** 
 * Add(添加字段按钮)的点击事件
 */
function addCharacterClick() {
	var inputName = $('#input_character_text').val();
	//添加新行
	addCharacter(inputName);
	//在变量中添加数据信息
	addCharacterOfVairable(inputName);
	//清空输入框
	$('#input_character_text').val('');
	//设置按钮禁用
	disableElement(false, $('#add_character'), 'Empty is forbidden!');
	//移除点击事件
	$('#add_character').unbind('click');
}


/** 
 * Remove(删除输入字段按钮)的点击事件
 */
function removeCharButtonClick() {
	var removeName = $('#remove_character_text').val();
	var obj = hasName(removeName);
	var index = $(obj).index();
	deleteCharacterOfVariable(index);
	$(obj).remove();
	$('#remove_character_text').val('');
	disableElement(false, $('#delete_character'), 'Empty is forbidden!');
	$('#delete_character').unbind('click');
}


/** 
 * 根据当前页面中的显示的字段面包屑显示当前级别的字段列表。
 */
function refreshProcessPanel() {
	var jsonData = getDataQuote(2);
	var length = jsonData.length;

	//移除原有显示的字段信息
	$('#character_process_panel tbody tr').remove();
	for (var i = 0; i < length; i++) {
		addCharacter(jsonData[i][KEY_MAPPING['keyname']]);
	}
}


/** 
 * 初始化字段处理面板相关的JS事件
 */
function initManageCharEvent() {
	//添加按钮
	$('#add_character').mouseover(function () {
		$('#add_character').unbind('click');
		//判断添加的字符串是否符合条件
		var message = validateCharacterName();
		var isActive = false;
		if (message == '') {
			isActive = true;
			message = 'Add new character';
			$('#add_character').bind('click', function () {
				addCharacterClick();
			});
		}
		//设置CSS样式
		disableElement(isActive, $('#add_character'), message);
	});

	//删除按钮
	$('#delete_character').mouseover(function () {
		$('#delete_character').unbind('click');
		var message = validateRemoveName();
		var isActive = false;
		if (message == '') {
			isActive = true;
			message = 'Delete character';
			$('#delete_character').bind('click', function () {
				removeCharButtonClick();
			});
		}
		disableElement(isActive, $('#delete_character'), message);
	});

	$('.close_panel').click(function () { //关闭按钮的事件
		//刷新显示字段页面
		refreshShowPanel();
		//关闭界面并刷新数据信息
		refreshProcessPanel();
	});

}


/** 
 * 初始化脚本类型下拉框
 */
function initScriptType() {
	var typeJson = getScriptTypeList();
	var parentObj = $('#type_content');
	$(parentObj).children().remove();
	for (var a in typeJson) {
		var character = a.toString();
		var pattern = $('#dropdown_pattern li').clone();
		$(pattern).find('a').text(character);
		$(pattern).bind('click', function () {
			changeScriptType(this);
		});
		$(parentObj).append(pattern);
	}
}


/** 
 * 用户选择脚本类型后触发的事件。
 * @param {jQuery} obj:用户选中模板类型对应的标签元素。
 */
function changeScriptType(obj) {
	var currentScriptType = $(obj).text().trim();
	if (selectedScriptType == currentScriptType) {
		return;
	}
	selectedScriptType = currentScriptType;
	$('#character_process_panel .breadcrumb li:not(#character_process_panel .breadcrumb li:first)').remove();
	$('#current_character tr').remove();

	var templateData = getSTTemplate(currentScriptType);
	console.log(JSON.stringify(templateData)); // ************
	templateData = templateData[1];
	setJsonData(templateData);
	for (var index = 0; index < templateData.length; index++) {
		var charaterName = templateData[index][KEY_MAPPING['keyname']];
		addCharacter(charaterName);
	}
}