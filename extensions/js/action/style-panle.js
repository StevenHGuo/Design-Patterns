/**************************************页面的数据操作部分**************************************/
/**
 * 清空基础信息界面中的内容
 * replacement部分只剩3组内容
 */
function clearBaseInfoPanel() {
	// 清空基础信息数据面板
	$('#default_value').val('');
	$('#data_type option:first').attr('selected', true);
	$('#default_select option:first').attr('selected', true);
	$('#validate_type option:first').attr('selected', true);

	var checkObj = $('#add_check_exp').prevAll();
	for (var i = checkObj.length; i > 1; i--) {
		$(checkObj).eq(i).remove();
	}
	$('#validate_list input').val('');

	var replaceObjs = $('#auto_add_group').parent().prevAll();
	for (var i = replaceObjs.length; i > 1; i--) {
		$(replaceObjs).eq(i).remove();
	}
	$('#replace_list input').val('');
}

/**
 * 保存当前Style面板中的数据
 */
function saveCurrentStyleData() {
	if (!validateCheckArr()) {
		$('#base_info').collapse('show');
		return false;
	}
	// 获取当前用户操作的JsonData数据
	var jsonData = getSelectedDataQuote();

	// 生成并存储基础数据信息
	jsonData[KEY_MAPPING['datatype']] = $('#data_type option:selected').attr('value');
	jsonData[KEY_MAPPING['onemk']] = $('#default_select option:selected').attr('value');
	jsonData[KEY_MAPPING['absurl']] = $('#abs_url').bootstrapSwitch('state');
	jsonData[KEY_MAPPING['important']] = $('#important').bootstrapSwitch('state');
	jsonData[KEY_MAPPING['default']] = $('#default_value').val();
	jsonData[KEY_MAPPING['validateType']] = $('#validate_type option:selected').attr('value');
	jsonData[KEY_MAPPING['calexpression']] = $('#calexpression').val();
	
	// 生成并存储Style行数据
	var styleRowObjs = $('#style_content tbody tr');
	var exparr = [];
	for (var i = 0; i < styleRowObjs.length; i++) {
		var child = styleRowObjs[i];
		var data = {};
		data[EXP_MAPPING['jsoupSelector']] = $(child).find('.selector').val();
		data[EXP_MAPPING['attribute']] = $(child).find('.attribute').val();
		data[EXP_MAPPING['description']] = $(child).find('.description').val();
		data[EXP_MAPPING['regularexp']] = $(child).find('.regular_exp').val();
		data[EXP_MAPPING['group']] = $(child).find('.group').val();
		data[EXP_MAPPING['function']] = $(child).find('.function option:selected').attr('value');
		data[EXP_MAPPING['priority']] = $(child).find('.priority option:selected').attr('value');
		exparr.push(data);
	}
	jsonData[KEY_MAPPING['exparr']] = exparr;

	// 生成Replacement的数据
	var replace_list = [];
	var replaces_obj = $('#replacement .list-group').not($('#auto_add_group').parent());
	for (var i = 0; i < replaces_obj.length; i++) {
		var replace = {};
		var child = $(replaces_obj).eq(i);
		var firstInput = $(child).find('input:eq(0)').val();
		// 第一列为空，默认当前行为无效行
		if (firstInput == '') {
			continue;
		}
		var secondInput = $(child).find('input:eq(1)').val();
		replace[REPLACE_MAPPING['target']] = firstInput;
		replace[REPLACE_MAPPING['replacement']] = secondInput;

		replace_list.push(replace);
	};
	jsonData[KEY_MAPPING['replacement']] = replace_list;

	// 获取Validate的数据
	var checkRelation = [];
	var checkObjs = $('#validate_expr input:not(#add_check_exp)');
	for (var i = 0; i < checkObjs.length; i++) {
		var exp = $(checkObjs).eq(i).val();

		if (!exp) {
			continue;
		}

		var child = getCheckExp();
		child[CHECK_EXP_Mapping['checkexp']] = exp;

		checkRelation.push(child);
	}
	jsonData[KEY_MAPPING['validateExp']] = checkRelation;
	
	return true;
}

/**
 * 根据页面选中的内容设置当前页面的值
 */
function resetStylePanel() {
	clearBaseInfoPanel();
	$('#style_content tbody tr').remove();
	var jsonData = getSelectedDataQuote();

	var valueType = jsonData[KEY_MAPPING['datatype']];
	$('#data_type').val(valueType);
	var defaultSelect = jsonData[KEY_MAPPING['onemk']];
	$('#default_select').val(defaultSelect);

	var ischecked = jsonData[KEY_MAPPING['absurl']] ? true : false;
	var isChecked2 = $('#abs_url').bootstrapSwitch('state');
	if (ischecked != isChecked2) {
		$('#abs_url').bootstrapSwitch('toggleState');
	}

	var important = jsonData[KEY_MAPPING['important']] ? true : false;
	var important2 = $('#important').bootstrapSwitch('state');
	if (important != important2) {
		$('#important').bootstrapSwitch('toggleState');
	}

	var defaultValue = jsonData[KEY_MAPPING['default']];
	$('#default_value').val(defaultValue);
	var checkRelation = jsonData[KEY_MAPPING['validateType']];
	$('#validate_type').val(checkRelation);

	var checkexpArr = jsonData[KEY_MAPPING['validateExp']];
	if (checkexpArr) {
		for (var i = 0; i < checkexpArr.length; i++) {
			if (i > 1) {
				$('#add_check_exp').click();
			};
			var children = checkexpArr[i]
			$('#validate_expr input').eq(i).val(children[CHECK_EXP_Mapping['checkexp']]);
		};
	};

	var replaceArr = jsonData[KEY_MAPPING['replacement']];
	if (replaceArr) {
		for (var i = 0; i < replaceArr.length; i++) {
			if (i > 1) {
				$('#auto_add_group input:eq(0)').click();
			};
			var children = replaceArr[i];
			var parentObj = $('#replacement .list-group').eq(i);
			$(parentObj).find('input:eq(0)').val(children[REPLACE_MAPPING['target']]);
			$(parentObj).find('input:eq(1)').val(children[REPLACE_MAPPING['replacement']]);
		};
	};

	var styleArr = jsonData[KEY_MAPPING['exparr']];
	if (styleArr) {
		for (var i = 0; i < styleArr.length; i++) {
			addRegularRow();
			var children = styleArr[i];
			var parentObj = $('#style_content tbody tr:last');
			$(parentObj).find('.selector').val(children[EXP_MAPPING['jsoupSelector']]);
			$(parentObj).find('.description').val(children[EXP_MAPPING['description']]);
			$(parentObj).find('.attribute').val(children[EXP_MAPPING['attribute']]);
			$(parentObj).find('.regular_exp').val(children[EXP_MAPPING['regularexp']]);
			$(parentObj).find('.group').val(children[EXP_MAPPING['group']]);
			$(parentObj).find('.function').val(children[EXP_MAPPING['function']] ? children[EXP_MAPPING['function']] : '1');
			$(parentObj).find('.priority').val(children[EXP_MAPPING['priority']] ? children[EXP_MAPPING['priority']] : '1');
		};
	};
}


/**************************************页面的按钮事件部分**************************************/
var recordModal = 0;//记录那种方式打开了遮罩层。1：用户打开画框工具打开了遮罩层。2：向用户展示指定EXP对应的标签打开的遮罩层。

/** 
 * 添加Style行
 */
function addRowClick() {
	var selectedCharacterObj = $('#character_panel .active');

	// 验证当前是否有字段被选中
	if (selectedCharacterObj.length != 1) {
		alertDiv(alertType.Danger, 'Please select a character that you want to process!');
		return;
	};

	// 获取当前字段对应的值
	var jsonData = getSelectedDataQuote(1);

	// 获取Style行数据结构
	var styleStructe = getStyleChildTemplate();
	jsonData[KEY_MAPPING['exparr']].push(styleStructe);
	addRegularRow();
}

/** 
 * 删除指定的样式行。
 */
function removeRowClick() {
	Modal.confirm({ message: '  Are you sure that delete selected row?' }).on(function (e) {
		if (e) {
			var selectedObj = $('#style_content .select');
			var index = $(selectedObj).index();
			var jsonData = getSelectedDataQuote(1);
			jsonData[KEY_MAPPING['exparr']].splice(index, 1);
			$(selectedObj).remove();
		}
	})
}

/** 
 * 提交生成的数据，该过程是不可逆的。
 * 提交的时候需要验证并保存当前页面中的内容是否正确
 */
function commitDataClick() {
	$('body').mLoading();
	var jsonData = getToTalJsonData();
	//验证是否存在字段信息
	if (getJsonLength(jsonData['mdes']) === 0) {
		alertDiv(alertType.Danger, 'There is no data to be commited!');
		return;
	};
	// 保存当前页面中的数据参数
	if ($('#character_panel .active').length == 1) {
		if (!saveCurrentStyleData()) {
			$('body').mLoading('hide');
			return;
		};
	};

	commitData();
}

function commitData() {
	//处理当前显示页的数据
	var saveData = getToTalJsonData();
	saveTemplate(saveData, endloadingF);
}

/** 
 * 根据EXP内容在界面上画框
 */
function showRegularExp(obj) {
	//打开遮罩层
	$('#showExp').modal('show');
	recordModal = 2;
	var exp = $(obj).val();
	drawFeildCSSRect(exp);
}

/** 
 * 选择指定的元素生成相应的数据。
 */
function crawlerClick() {
	//根据Select按钮是否包含有'crawler'类来判断执行什么操作
	startDraw(addExp);
	recordModal = 1;
	$('#showExp').modal('show');
}

/** 
 * 向界面中添加新的规则行，并同时添加各个标签的事件
 */
function addRegularRow() {
	var pattern = $('#style_row_pattern tr').clone();
	var parentObj = $('#style_content tbody');
	$(parentObj).append(pattern);
	var lastObj = $(parentObj).find('tr:last');
	$(lastObj).bind('click', function () {
		selectedStyleRow(this);
	});
	$(lastObj).find('textarea').bind('click', function () {
		selectedStyleRow($(this).parents('tr'));
	});
	$(lastObj).find('.show-btn').bind('click', function () {
		var superEle = $(this).parent('tr');
		selectedStyleRow(superEle);
		if ($(superEle).find('.regularExp').val() === '') {
			return false;
		};
		showRegularExp(this);
	});
	$(lastObj).find('.up-btn').bind('click', function(){
		var superEle = $(this).parent('tr');
		selectedStyleRow(superEle);
		changeRow(this);
	});
}

/**
 * 向上交换相邻两行的内容
 * @param obj: 待交换行的数据
 */
var changeRow = function(obj){
	console.log('转换之前的数据结构是：' + getJsonData()); // ************
	
	// 判断是否符合交换标准
	let selectEleIndex = $(obj).index();
	if( selectEleIndex == 0 ){
		return false;
	}
	let lastEle = $(obj).prev();
	
	// 交换界面中相邻的两行
	$(obj).insertBefore(lastEle);
	
	// 获取当前用户操作的字段
	let jsonData = getDataQuote();	
	swapValueOfArr(jsonData['exparr'], selectEleIndex, selectEleIndex-1);
	// 同时修正子字段中的值
	for( let child in jsonData ){
		swapValueOfArr(child['exparr'], selectEleIndex, selectEleIndex-1);
	};
	
	console.log('转换之后的数据结构是：' + getJsonData()); // ************
};


// 交换一个数组中指定的两个索引处的值
var swapValueOfArr = function(array, index, index2){
	// 当子字段的个数不满足相应的索引值的时候，结束当前的内容
	if( index > array.length ){
		return;
	}
	let mid = array[index];
	array[index] = array[index2];
	array[index2] = mid;
};

/** 
 * 向选中行中添加根据画框工具生成的正则表达式
 * @param exp: 画框工具生成的Selector
  */
var addExp = function (exp) {
	//生成Selector并获取焦点
	var selectExpObj = $('#style_content .select .selector');
	$(selectExpObj).val(exp);
	$(selectExpObj).focus();
	// 隐藏遮罩层
	$('#showExp').modal('hide');
}


/**************************************界面特效部分**************************************/
/**
 * 选中一个Style行
 */
function selectedStyleRow(obj) {
	if ($(obj).hasClass('select')) {
		return;
	}
	$('#style_content .select').removeClass('select');
	$(obj).addClass('select');
}

/**
 * 自动添加替换行
 */
function addReplaceRow(obj) {
	var pattern = $('#replace_pattern > div').clone();
	var parentObj = $(obj).parents('.list-group');
	$(parentObj).before(pattern);
	$(parentObj).prev().find('input:eq(0)').focus();
}



/**************************************页面的时间验证部分**************************************/
/**
 * 验证用户输入的数据类型是否正确
 */
function validateDataType(hasChildrenChar) {
	var dataType = $('#data_type option:selected').attr('value');
	var message = '';
	switch (dataType) {
		case '1':
			message = validateStringDataType(hasChildrenChar);
			break;
		case '2':
			message = validateStringArrDataType(hasChildrenChar);
			break;
		case '3':
			message = validateJsonObjDataType(hasChildrenChar);
			break;
		case '4':
			message = validateJsonArrDataType(hasChildrenChar);
			break;
		case '5':
			message = validateMerge(hasChildrenChar);
			break;
		case '6':
			message = validateMergeAndValidate(hasChildrenChar);
			break;
		default:
			break;
	}
	if (message) {
		hightInput($('#data_type'), message);
		return false;
	} else {
		unHightInput($('#data_type'));
		return true;
	}
}

/**
 * 验证DataType为1的时候的数据类型
 */
function validateStringDataType(hasChildrenChar) {
	// 为String的时候不允许出现任何的子字段
	if (hasChildrenChar) {
		return '该字段不能够包含子字段';
	}
	return '';
}

/**
 * 验证DataType为2的时候的数据类型
 */
function validateStringArrDataType(hasChildrenChar) {
	// 为String的时候不允许出现任何的子字段
	if (hasChildrenChar) {
		return '该字段不能够包含子字段';
	}
	return '';
}

/**
 * 验证JSONObject数据类型的相关数据
 */
function validateJsonObjDataType(hasChildrenChar) {
	// 为JSONArray的时候必须包含子字段
	if (!hasChildrenChar) {
		return '该字段必须包含子字段';
	}
	return '';
}

/**
 * 验证JSONOArray数据类型的是否符合要求
 */
function validateJsonArrDataType(hasChildrenChar) {
	// 为JSONArray的时候必须包含子字段
	if (!hasChildrenChar) {
		return '该字段必须包含子字段';
	}
	return '';
}

/**
 * 验证Merge类型是否符合相应要求
 */
function validateMerge(hasChildrenChar) {
	return '';
}

/**
 * 验证MergeAndValidate类型是否符合相应要求
 */
function validateMergeAndValidate(hasChildrenChar) {
	// 要求用户必须输入至少一个Validate表达式
	var objs = $('#validate_list input');
	for (var i = 0; i < objs.length; i++) {
		if ($(objs).eq(i).val() != '') {
			return '';
		}
	}
	return 'Merge And Validate要求用户必须输入至少一个Validate表达式';
}

/**
 * 验证检查组中的逻辑
 * @param obj: 代表一行style标签的jquery对象
 */
function validateCheckArr() {

	// 判断当前字段是否含有子字段
	var currentData = getSelectedDataQuote();
	var hasChildrenChar = false;
	if (currentData[KEY_MAPPING['children']].length > 0) {
		hasChildrenChar = true;
	}

	// Data Type
	if (!validateDataType(hasChildrenChar)) {
		$('#base_info').collapse('show');
		return false;
	}
	
	var result = [];
	var validateObjs;
	var dataType = parseInt($('#data_type option:selected').attr('value'));
	var styleObjs = $('#style_content > tbody > tr');
	var styleLength = $(styleObjs).getJsonLength;

	// 获取触发元素父元素的索引内容
	var parentData = getSelectedParentDataQuote();
	if ( !(dataType == 5) && !(dataType == 6) && !validateRelation(currentData, parentData, styleObjs)) {
		return false;
	}

	// Selector Array
	if( result.length == 0 && styleLength != 0 ){
		validateObjs = $(styleObjs).find('.selector');
		result = hasDuplicateOrNullData(validateObjs, true, true);
	}

	// Description
	if (result.length == 0 && styleLength != 0) {
		unHightInput(validateObjs);
		validateObjs = $(styleObjs).find('.description');
		result = hasDuplicateOrNullData(validateObjs, hasChildrenChar, true);
	}

	// 当不是子字段的时候验证attribute不为空、不重复
	if (!hasChildrenChar && result.length == 0 && styleLength != 0) {
		unHightInput(validateObjs);
		validateObjs = $(styleObjs).find('.attribute');
		if( dataType == 9 || dataType == 8 ){
			// 当用户选择的数据类型为8、9时，允许输入空的属性
			result = hasDuplicateOrNullData(validateObjs, true, true);
		}else{
			result = hasDuplicateOrNullData(validateObjs, false, true);
		}
	}

	// Group
	if (result.length == 0 && styleLength != 0) {
		unHightInput(validateObjs);
		validateObjs = $(styleObjs).find('.group');
		result = hasDuplicateOrNullData(validateObjs, true, true, '^(([1-9]\\d*)|0)$', 'Number is required!');
	}

	// 只有当前的字段类型为6、当前字段不含有子字段、且前边的字段的验证结果为真那么验证Validate部分的数据
	if (dataType == 6 && !hasChildrenChar && result.length == 0) {
		unHightInput(validateObjs);
		validateObjs = $('#add_check_exp').prevAll();
		result = hasDuplicateOrNullData(validateObjs, true, false);
	}

	// 当没有子字段的时候判断当前字段的Replace内容是否正确
	if (!hasChildrenChar && result.length == 0) {
		unHightInput(validateObjs);
		validateObjs = $('#replace_list .old');
		result = hasDuplicateOrNullData(validateObjs, true, false);
	}


	if (result.length == 0) {
		unHightInput(validateObjs);
		return true;
	}
	if (result.length == 2) {
		hightInput($(validateObjs).eq(result[0]), result[1]);
	}
	if (result.length == 3) {
		hightInput($(validateObjs).eq(result[0]), result[2]);
		hightInput($(validateObjs).eq(result[1]), result[2]);
	}
	alertDiv(alertType.Danger, 'There are some error!');
	return false;
}

/**
 * 验证子标签与父标签之间的关系
 */
function validateRelation(childrenData, parentData, styleObjs) {
	if (!isJsonNull(parentData)) {
		// 判断当前输入的Style数与父级是否一样
		var parentStyleSize = parentData[KEY_MAPPING['exparr']].length;
		// 父字段没有Style元素就不需限制子字段的数据
		if( parentStyleSize == 0 ){
			return true;
		}
		var currentStyleSize = $(styleObjs).length;
		if (parentStyleSize != currentStyleSize) {
			alertDiv(alertType.Danger, '父字段与子字段Style个数不想等;父字段Style个数为' + parentStyleSize);
			// 经开发的建议，这里将父字段与子字段不相等时不能够删除代码的限制给移除
			// return false;
		}
	}
	return true;
}

/**
 * 验证用户输入repalce是否符合条件
 */
function validateOldReplace(obj) {
	var content = $(obj).text();
	if (content == '') {
		unHightInput(obj);
		// 重新设置Replace输入框的内容
		resetReplaceInput();
		return;
	}
	var otherObjs = $('.old').remove(obj);
	for (var i = 0; i < $(otherObjs).length; i++) {
		if (content == $(otherObjs).eq(i).text().trim()) {
			hightInput(obj, 'Duplicate Expression');
			hightInput($(otherObjs).eq(i), 'Duplicate Expression!');
			return;
		}
	}

}

/**
 * 验证参数替换中的逻辑
 */
function validateReplacement(obj) {
	// TODO

}

/**
 * 验证单个替换框中的逻辑
 */
function validateSingleReplacement(obj) {
	// TODO

}

/**
 * 验证表达式是否正确
 */
function validateExp(obj) {
	// TODO
}

/**
 * 验证描述信息
 */
function validateDescription(obj) {
	// TODO
}

/**
 * 验证属性
 */
function validateAttribute(obj) {
	// TODO
}

/**
 * 验证正则
 */
function validateRegexp(obj) {
	// TODO
}

/**
 * 验证Group
 */
function validateGroup(obj) {
	// TODO
}




/**************************************初始化页面数据信息部分**************************************/
/**
 * 初始化界面上的一些基础数据信息
 */
function initStylePanel() {
	// 添加默认的选项
	addOption(getDataType(), $('#data_type'));
	addOption(getDefaultSelect(), $('#default_select'));
	addOption(getCheckRelation(), $('#validate_type'));
	addOption(getElesFunctionType(), $('#style_row_pattern .function'));
	addOption(getPriority(), $('#style_row_pattern .priority'));
}

/** 作用：初始化规则面板的相关JS事件
  */
function initRegularEvent() {
	//关闭模板
	$('#showExp').click(function () {
		$('#showExp').modal('hide');
		if (recordModal == 1) {
			endDraw();
		} else if (recordModal == 2) {
			cancelFeildCSSRect();
		}
		recordModal == 0;
	});

	//打开画框工具
	$('#crawler').mouseover(function () {
		$('#crawler').unbind('click');
		var selectedCharacter = $('#character_panel .active');
		if (selectedCharacter.length == 1) {
			disableElement(true, $('#crawler'), 'Select Element');
			$('#crawler').bind('click', function () {
				crawlerClick();
			});
		} else {
			disableElement(false, $('#crawler'), 'Select a style row');
		};
	});

	//添加规则行按钮
	$('#add_style_row').mouseover(function () {
		$('#add_style_row').unbind('click');
		// 获取被选中的字段
		var selectedCharacter = $('#character_panel .active');

		if (selectedCharacter.length == 1) {
			disableElement(true, $('#add_style_row'), 'Config ' + $(selectedCharacter).text() + ' character');
			$('#add_style_row').bind('click', function () {
				addRowClick();
			});
		} else {
			$('#add_style_row').unbind('click');
			disableElement(false, $('#add_style_row'), 'Selct a style row');
		}
	});

	//删除行按钮
	$('#remove_style_row').mouseover(function () {
		$('#remove_style_row').unbind('click');

		var selectedCharacter = $('#style_content .select');

		if (selectedCharacter.length == 1) {
			disableElement(true, $('#remove_style_row'), 'Delete the selected style row!');
			$('#remove_style_row').bind('click', function () {
				removeRowClick(this);
			});
		} else {
			disableElement(false, $('#remove_style_row'), 'Select the selected row!');
		};
	});

	//提交数据按钮
	$('#commit_data').off('click').on('click', function () {
		commitDataClick();
	});

	//登出操作
	$('#loging_out').click(function () {
		Modal.confirm({ message: '  Login Out?' }).on(function (e) {
			if (e) {//确定登出
				logOut();
			}
		});
	});

	$('#auto_add_group input').click(function () {
		addReplaceRow(this);
	});

	$('#add_check_exp').click(function () {
		$(this).before("<input type='text' class='form-control' placeholder='exp' rows='1'>");
		$(this).prev().focus();
	});
}
