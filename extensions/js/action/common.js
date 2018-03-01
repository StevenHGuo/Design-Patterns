var optionPattern = '<option value="{0}">{1}</option>';

/**
 * 判断一组输入框标签中是否符合指定标准（正则表达式）、是否含有空元素、重复元素
 * @param {jQuery.Object} objs: jquery对象
 * @param {Boolean} allowNull: 是否允许当前的元素为空
 * @param {Boolean} allowDuplicate: 是否允许当前的元素的值重复
 * @param {String} regexp:需要满足的正则表达式语法,非空的情况下会进行验证
 * @param {String} message:当不满足条件的时候返回的错误信息
 * @return {Array} 一个包含了错误信息的数组。
 * 			返回的是三个元素的数组的时候，说明当前产生的是数据重复的错误，前两个代表对应错误元素的索引。
 * 			返回的是两个元素的数组的时候，其它的非0个元素的返回值说明产生的是其它错误。
 */
function hasDuplicateOrNullData(objs, allowNull, allowDuplicate, regExp, message) {
	var length = objs.length;
	var current;
	var next;
	var expression;
	for (var i = 0; i < length; i++) {
		current = $(objs).eq(i).val().trim();
		if (allowNull && current == "") {
			continue;
		}
		if (!allowNull && current == "") {
			// 不允许为空但是为空，直接返回当前数据的索引值
			return [i, "Empty is forbidden"];
		}
		if (regExp != "" && !current.match(regExp)) {
			return [i, message];
		}
		// 不允许为空且当前判断的不是最后一个值，进行重复值得判断
		if (!allowDuplicate && i < (length - 1)) {
			for (var j = i + 1; j < length; j++) {
				next = $(objs).eq(j).val().trim();
				if (next == current) {
					return [i, j, "Duplicate is forbidden!"];
				}
			}
		}
	}
	// 成功
	return [];
}

/**
 * 高亮化显示对应的输入框
 * @param {jQuery} obj: 待提醒的输入框对象
 * @param {String} message：提示信息
 */
function hightInput(obj, message) {
	$(obj).attr("title", message);
	$(obj).parent().addClass("has-error");
}

/**
 * 取消高亮显示输入框
 * @param obj：待取消的输入框对象
 */
function unHightInput(obj) {
	$(obj).removeAttr("title");
	$(obj).parent().removeClass("has-error");
}

/**
 * 深度拷贝一个json格式的数据
 * @param {Object} json:待拷贝的json对象
 * @return {Object} : 转换后的json对象
 */
function deepCopy(json) {
	var string = JSON.stringify(json);
	return JSON.parse(string);
}

/** 
 * 判断数组对象中是否包含某个值
 * @param {Object} value : 待测的值
 * @param {Array} array  待测的数组
 * @return {Boolean} true代表包含，false代表未包含
 */
function in_array(value, array) {
	for (var i = 0; i < array.length; i++) {
		var thisEntry = array[i];
		if (thisEntry === value) {
			return true;
		}
	}
	return false;
}

/** 
 * 设置按钮组件的样式(禁用和可用),并设置相应的提示信息
 * @param {boolean} isActive : 代表当前设置的组件是否被激活
 * @param {jQuery} obj : 代表要设置的组件
 * @param {String} message : 是待设置组件的提示信息
 */
function disableElement(isActive, obj, message) {
	if (isActive) {
		$(obj).removeClass("disabled");
	} else {
		$(obj).addClass("disabled");
	}
	$(obj).attr("title", message);
}

/** 
 * 获取一个JSON对象第一级元素的个数
 * @param {Object} json:一个JSON对象变量
 * @return {Number} json对象根元素的个数
 */
function getJsonLength(json) {
	var count = 0;
	for (var obj in json) {
		count += 1;
	}
	return count;
}

/** 
 * 验证一个json对象是否为空（值为空;值为undefined;json的元素个数为0）
 * @param {Object} json : 待验证的JSON结构对象
 * @return {Boolean} :true代表为空，false代表不为空
 */
function isJsonNull(json) {
	if (json == null || json == undefined) {
		return true;
	}
	// 判断对象是不是一个Array数组
	if (json instanceof Array) {
		return false;
	}
	if (getJsonLength(json) === 0) {
		return true;
	}
	return false;
}

/** 
 * 验证一个数组对象是否为空(值为空;值为undefined;元素个数为0)
 * @param {Array} array: 待验证的数组对象
 * @return {Boolean}：true代表为空，false代表不为空
 */
function isArrayNull(array) {
	if (array == null || array == undefined || array === []) {
		return true;
	}
	return false;
}

/** 
 * 验证字符串是否符合基本条件（1.字符串不为空。2.字符串中间不包含空格。
 * 同时去除字符串开头和结尾的空字符
 * @param {String} str : 待验证的字符串
 * @return {String}：字符串。代表要判断字符串特点。当字符串为空时，说明符合所有的条件。
 */
function validateString(str) {
	//字符串是否为空
	if (str == null || str == undefined || str === "") {
		return "Name is empty!";
	};
	//除去首尾空格
	str = str.replace(/(^\s*)|(\s*$)/g, "");
	//判断字符串中间是否有空白字符（包含空格，制表，回车，换行，垂直换行，换页）
	var regExp = new RegExp(/(.*\s.*)/);
	if (regExp.test(str)) {
		return "Blank character is forbidden!";
	};
	//验证是否包含汉字
	regExp = new RegExp("[\\u4E00-\\u9FFF]+", "g");
	if (regExp.test(str)) {
		return "Chinese character is forbidden!";
	}
	return "";
}

/** 
 * 判断字符串是否为空
 * @param {String} str: 待验证的字符串
 * @return {Boolean} : true代表为空；false代表不为空
 */
function isStringNull(str) {
	//字符串是否为空
	if (str == null || str == undefined || str === "") {
		return true;
	}
	return false;
}

/** 
 * 验证字符串中是否包含汉字
 * @param {String} str: 待验证的字符串
 * @return {String} : 空字符串代表不包含；非空代表包含。
 */
function hasChinese(str) {
	var regExp = new RegExp("[\\u4E00-\\u9FFF]+", "g");
	if (regExp.test(str)) {
		return "Chinese character is forbidden!";
	}
	return "";
}

/**
 * 返回当前字段在jsonData['mdes']中的遍历路径以及面包屑的路径。
 * @param {Number} index: 触发的是那一块的操作。
 * 		1时说明触发的是字段显示面板的面包屑；
 * 		2时说明触发的是字段操作面板的面包屑；
 * @param {jQuery} obj: 
 * 		触发标签元素。如果没有传入该元素，那么将返回对应面包屑处所有的元素值
 * @return {Array}:
 * 		数组的第一个值为对应字段在jsonData中对应的路径地址；数组的第二个值对应的是面包屑的路径；
 */
function getCurrentlyBreadcrumb(index, obj) {
	var liObj = null;
	if (index == 1) {
		// 字段显示面板
		if (obj !== null) {
			liObj = $(obj).prevAll('li');
			// 将当前级添加上去
			$(liObj).append(obj);
		} else {
			liObj = $("#character_panel .bredcrumb li");
		}
	} else if (index == 2) {
		// 字段操作面板
		liObj = $("#character_process_panel .breadcrumb");
	}

	// 获取缓存变量
	var jsonData = getJsonData();
	var length = liObj.length;
	if (length == 1) {
		return jsonData;
	}
	var breadcrumb = new Array(length);
	for (var i = 1; i < length; i++) {
		var children = $(liObj).eq(i);
		var char = $(children).text();
		var index = $(children).attr("value");
		jsonData = jsonData[char];
		breadcrumb[i] = char;
	}

	return [jsonData, breadcrumb];
}

/**
 * 返回当前字段在jsonData['mdes']中的遍历路径，基于该数据的特点，返回的是一个整形的数组。
 * @param {Number} index: 触发的是那一块的操作。
 * 		1时说明触发的是字段显示面板的面包屑；
 * 		2时说明触发的是字段操作面板的面包屑；
 * @param {jQuery} obj: 
 * 		触发标签元素。如果没有传入该元素，那么将返回对应面包屑处所有的元素值
 * @return {Array}:
 * 		当点击的是根路径的时候（即Base)那么返回一个空的数组；
 * 		当点击的是其它的内容的时候返回的是一个不包含（Base)的面包屑路径
 */
function getDataQuote(index) {
	var liObj = null;
	if (index == 1) {
		liObj = $("#character_panel .breadcrumb li");
	} else if (index == 2) {
		// 字段操作面板
		liObj = $("#character_process_panel .breadcrumb li")
	}

	// 获取缓存变量
	var jsonData = getJsonData();
	var length = $(liObj).length;
	if (length == 1) {
		return jsonData;
	}

	// 面包屑存在一个Root选项，该选项对于遍历数据是无效的，所以这里从1开始便利
	for (var i = 1; i < length; i++) {
		// 在标签中存储有当前数据在同级目录中的位置
		var index = $(liObj).eq(i).attr("value");
		jsonData = jsonData[index];
		jsonData = jsonData[KEY_MAPPING['children']];
	}

	return jsonData;
}

/**
 * 返回面包屑路径的值
 * @param {Number} index: 触发的是那一块的操作。
 * 		1时说明触发的是字段显示面板的面包屑；
 * 		2时说明触发的是字段操作面板的面包屑；
 * @param {jQuery} obj: 
 * 		触发标签元素。如果没有传入该元素，那么将返回对应面包屑处所有的元素值
 * @return {Array}:
 * 		当点击的是根路径的时候（即Base)那么返回一个空的数组；
 * 		当点击的是其它的内容的时候返回的是一个不包含（Base)的面包屑路径
 */
function getPath(index, obj) {
	var liObj = null;
	if (index == 1) {
		// 字段显示面板
		if (obj !== null) {
			// 中间路径
			liObj = $(obj).prevAll('li');
		} else {
			// 全路径
			liObj = $("#character_panel .bredcrumb li")
		}
	} else if (index == 2) {
		// 字段操作面板
		liObj = $("#character_process_panel .breadcrumb")
	}

	// 获取缓存变量
	var jsonData = getJsonData();
	var length = $(liObj).length;
	if (length == 1) {
		return [];
	}
	var breadcrumb = new Array(length);
	for (var i = 1; i < length; i++) {
		var char = $(liObj).eq(i).text();
		breadcrumb[i] = char;
	}

	return breadcrumb;
}

/**
 * 向面包屑中添加新的以及选项
 * @param {Number} index: 需要在那个位置添加选项。1代表在字段显示面板添加；2代表在字段操作列表添加。
 * @param {String} character: 需要添加的字段名称
 * @param {Number} character_index：需要添加的字段在数据结构中的索引值
 */
function addBreadcrumb(index, character, character_index) {
	if (index != 1 || index != 2) {
		return;
	}

	var lastBreadcrumb = null;
	var parentObj = $("#breadcrumb_pattern");
	var aPattern = $(parentObj).find("a");
	if (index == 1) {
		lastBreadcrumb = $("#character_panel .breadcrumb li:last");
	} else {
		lastBreadcrumb = $("#character_process_panel .breadcrumb li:last")
	}

	if (index == 1) {
		// 打开字段显示面板指定的面包屑
		var pattern = $(parentObj).find(".middle").clone();
		$(pattern).attr("value", character_index);
		$(pattern).find("a").bind("click", function () {
			openCharacter(this);
		});
		$(pattern).find("a").text(character);
		$(lastBreadcrumb).after(pattern);
	} else if (index == 2) {
		// 修改旧一级的标签
		$(lastBreadcrumb).wrapInner(aPattern);
		// 打开字段操作面板指定的面包屑
		$(lastBreadcrumb).find("a").bind("click", function () {
			openCharacterOfBreadcrumb(this);
		});
		// 添加新一级的字段
		var pattern = $(parentObj).find(".final").clone();
		$(pattern).attr("value", character_index);
		$(pattern).text(character);
		$(lastBreadcrumb).after(pattern);
	}
}

/**
 * 页面中设计很多Select标签的添加，为了减少代码数，降低维护成本。
 * 这里写了一个向指定标签中添加option标签组的方法。
 * @param {Object} data: 待添加的数据
 * @param {jQuery} obj: 待添加标签的父标签
 */
function addOption(data, obj) {
	for (var value in data) {
		$(obj).append(optionPattern.replace('\{0\}', value).replace('\{1\}', data[value]));
	}
}