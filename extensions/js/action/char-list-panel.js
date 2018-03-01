/**************************************字段显示界面相关方法**************************************/
/**
 * 判断当前被激活的目录是否是二级目录
 */
function isSecondCategory(){
	if( $("#character_panel .active").parent("ul").length == 1 ){
		return true;
	}
	return false;
}

/** 
 * 设置当前Template的名称
 * @param {String} templateName: 当前Template的名称
 */
function setTemplateName(templateName) {
	//修改任务名
	if( templateName.length > 25 ){
		var abbrName = templateName.substring(0, 24) + "...";
		$("#template_name").text( abbrName );
		$("#template_name").attr( "title", templateName );
	}else{
		$("#template_name").text( templateName );
	};
}


/**
 * 获取当前正在操作字段的参数的引用
 * @return {Object} 当前正在操作字段的引用
 */
function getSelectedDataQuote(){
	var jsonData = getDataQuote(1);
	var obj = $("#character_panel .active");
	if( $(obj).parents("ul").length == 1 ){
		jsonData = jsonData[$(obj).parent().prev().attr("value")][KEY_MAPPING['children']];
	}
	var index = $(obj).attr("value");
	return jsonData[index];
}

/**
 * 获取当前选中标签的父标签对应的数据索引
 * @return {Array}: 父元素的索引值。当没有父元素的时候，返回空。
 */
function getSelectedParentDataQuote(){
	// 获取面包屑对应的数据
	var jsonData;
	var index = 0;
	var activeObj = $("#character_panel .active");

	if( isSecondCategory() ){
		// 获取二级目录父元素的索引值
		jsonData = getDataQuote(1);
		index = $(activeObj).parent("ul").prev().attr("value");
		return jsonData[index];
	}else{
		jsonData = getJsonData();
		var liObj = $("#character_panel .breadcrumb li");
		var length = $(liObj).length;
		// 如果只有一个根目录直接返回结果
		if( length == 1 ){
			return {};
		};

		for( ; index<length-2; index++ ){
			// 在标签中存储有当前数据在同级目录中的位置
			jsonData = jsonData[$(liObj).eq(index).attr("value")];
			jsonData = jsonData[KEY_MAPPING['children']];
		};
		return jsonData[$(liObj).eq(length-1).attr("value")];
	}
}

/**
 * 打开面包屑中指定路径的内容
 * 1：保存Style中的数据。
 * 2：重置Style框以及清空基础数据信息。
 * 3：修改面包屑中的显示数据
 * 4：修改字段面板中的数据
 * 5：在Style面板中显示新的数据信息
 * @param {jQuery} obj: 面包屑中指定字段的标签元素
 * @param {String} parentObj: 获取父字段
 * @param {Number} index: 父字段的索引
 */
function openCharacterOfBreadcrumb(obj, parentChar, index) {
	// 保存Style中相关的内容
	if( $("#character_panel .active").length == 1 ){
		if( !saveCurrentStyleData() ){
			return false;
		}
	};
	// 该操作必须在保存数据之后
	$("#process_panel").nextAll().remove();
	
	var activeCharacter = $(obj).text();

	if (parentChar) {
		// 添加父级面包屑
		addBreadcrumb(1, parentChar, index);
	} else {
		// 面包屑路径触发，需要移除无用的项
		var liObj = $(obj).parents("li");
		// 移除无用的面包屑路径
		var afterObj = $(liObj).nextAll("li");
		$(afterObj).remove();
	};

	// 添加字段
	addCharacterByData(getDataQuote(1));

	// 激活用户选中的字段
	var currentIndex = $(obj).attr("value");
	var activeObj = $("#character_panel > .list-group > a[value=" + currentIndex + "]");
	$(activeObj).click();
}

/**
 * 向字段显示面板中添加字段。
 * @param {String} character: 待添加的字段
 * @param {Boolean} hasChildren: 该字段是否含有子字段
 * @param {Number} index: 添加字段的类型。1代表添加的是一级字段；2代表添加的是二级字段
 * @param {Number} dataIndex: 当前字段在临时变量jsonData中对应数组中的索引值。
 */
function addShowCharacter(character, hasChildren, index, dataIndex) {
	if( index != 1 && index != 2){
		return;
	};
	var parentObj = $("#character_panel > .list-group");
	var aPattern = $("#list_pattern a").clone();
	var spanPattern = $("#list_pattern .character_label").clone();

	if( index == 1 && hasChildren ){
		$(aPattern).bind("click", function(){
			showHideList(this);
			changeShowCharacter(this);
		});
	}else if( index == 2 && hasChildren ){
		$(aPattern).bind("click", function(){
			openSecondCharacter(this);
		});
	}else{
		$(aPattern).bind("click", function(){
			changeShowCharacter(this);
		});
	}
	$(aPattern).attr("value", dataIndex);
	$(aPattern).find("span").text(character);
	$(aPattern).append(spanPattern);

	// 生成有效的标签
	if (index == 2) {
		// 添加二级菜单
		parentObj = $(parentObj).find("ul:last");
	};
	if (hasChildren) {
		spanPattern.addClass("glyphicon glyphicon-chevron-right");
	};

	// 添加标签
	$(parentObj).append(aPattern);
}

/**
 * 向字段中添加一级目录
 * @param {Object} data: 待添加的数据信息
 * @param {Number} dataIndex: 数据索引值
 */
function addCharacterTree(data, dataIndex){
	var sub = data[KEY_MAPPING['sub']];
	var length = sub.length;
	var hasChildren = false;
	var character_name = data[KEY_MAPPING['keyname']];
	var index = 1;
	if( length > 0 ){
		hasChildren = true;
	};

	// 添加当前级别的菜单
	addShowCharacter( character_name, hasChildren, index, dataIndex );

	if( hasChildren ){
		// 添加子列表标签
		$("#character_panel > .list-group").append($("#list_pattern").find("ul").clone());
		index ++;
		for( var i=0; i<sub.length; i++ ){
			var children = sub[i];
			var children_character = children[KEY_MAPPING['keyname']];
			var grandson = children[KEY_MAPPING['sub']];
			var has_grandson = false;
			if( grandson.length > 0 ){
				has_grandson = true;
			};

			addShowCharacter(children_character, has_grandson, index, i);
		};
	};

}

/**
 * 根据用户传入的数据添加相应的字段,该方法可以实现数据的递归
 * @param {Object} data: 待添加数据的索引
 * @param {Number} count: 当前添加字段位于菜单中的层级
 * @param {Number} dataIndex: data数据对应在根数据中的索引。可以不传入，如果不传入那么data的结构必须为数组
 */
function addCharacterByData(data, count, dataIndex){
	if( !count ){
		count = 1;
	}
	var sub = [];
	var hasChildren = false;
	if( dataIndex ){
		// 传入的值不是数组
		sub = data['sub'];
		if( sub.length > 0 ){
			hasChildren = true;
		}
		var character_name = data[KEY_MAPPING['keyname']];
		addShowCharacter( character_name, hasChildren, count, dataIndex );
		if( count == 1 && sub['sub'].length > 0 ){
			$("#character_panel > .list-group").append($("#list_pattern").find("ul").clone());
		}
	}else{
		sub = data;
		// 传入的值是一个数组
		var index = 0;
		for( var i=0; i<sub.length; i++ ){
			var children = sub[i];
			var children_character = children[KEY_MAPPING['keyname']];
			var grandson = children[KEY_MAPPING['children']];
			var has_grandson = false;
			if( grandson.length > 0 ){
				has_grandson = true;
			};
			addShowCharacter(children_character, has_grandson, count, i);
			if( count == 1 && has_grandson ){
				$("#character_panel > .list-group").append($("#list_pattern").find("ul").clone());
				var new_count = count + 1;
				addCharacterByData( grandson, new_count );
			}
			has_grandson = false;
		};
	}
}

/**
 * 显示或隐藏二级标签对象
 * 1：首先判断当前字段是否含有子字段
 * 2：通过Class当前标签是打开还是关闭
 * @param {jQuery} obj: 指定字段对应的值。
 * 
 */
function showHideList(obj) {
	var nextObj = $(obj).next();
	var childObj = $(nextObj).find(" > a");
	if (childObj.length == 0) {
		// 没有子字段直接返回
		return;
	};

	var labelObj = $(obj).find("span:eq(1)");
	if ($(labelObj).hasClass("glyphicon-chevron-right")) {
		$(labelObj).removeClass("glyphicon-chevron-right");
		$(labelObj).addClass("glyphicon-chevron-down");
		$(nextObj).show();
	} else {
		$(labelObj).removeClass("glyphicon-chevron-down");
		$(labelObj).addClass("glyphicon-chevron-right");
		$(nextObj).hide();
	};
}

/**
 * 打开二级目录的子列表
 * @param {jQuery} obj:指定字段对应的值
 * @return {object}: 返回页面刷新后字段对应的标签
 */
function openSecondCharacter(obj) {
	// 获取当前字段的父字段
	var parentObj = $(obj).parents("ul");
	if( $(parentObj).find(".character_label").length <= 0 ){
		// 没有含有子字段，直接返回
		return;
	}

	// 获取父字段
	parentObj = $(parentObj).prev("a");

	// 重新打开一级目录
	openCharacterOfBreadcrumb(obj, $(parentObj).text(), $(parentObj).attr("value"));
}

/** 
 * 修改当前字段的内容
 * @param {jQuery} obj: 触发字段对应的a标签
  */
function changeShowCharacter(obj) {
	// 如果已经被激活，那么就是无效操作
	if ($(obj).hasClass("active")) {
		return;
	};

	// 移除上一个被激活选项；保存并重置当前style内容
	var activeObj = $("#character_panel .active");
	if( activeObj.length == 1 ){
		// 只有当存在active字段的时候才保存该数据
		if( !saveCurrentStyleData() ){
			return false;
		}
	}
	// 因为后续会用到active字段所以在这里将该字段移除
	$(activeObj).removeClass("active");

	$(obj).addClass("active");

	// 获取并显示数据信
	resetStylePanel();
}

/** 
 * 将当前页面的值设置为初始状态，即只显示一级目录中的值。
 * @param {Boolean} byBredcrumb: 刷新页面是以当前显示的面包屑为准还是以根数据为准来刷新页面
 * 		true代表以当前显示的面包屑为准；false代表以根目录为准刷新页面。
  */
function refreshShowPanel(byBredcrumb) {
	$("#process_panel").nextAll().remove();
	$("#character_panel .breadcrumb li:first").nextAll().remove();

	var jsonData = null;
	if( byBredcrumb ){
		jsonData = getDataQuote(1);
	}else{
		jsonData = getJsonData();
	};
	addCharacterByData(jsonData);
}

/** 
 * 初始化字段显示面板的相关事件
 */
function initCharShowEvent() {
	$("#search_character").click(function () {//过滤按钮
		var filterName = $("#search_character + input").val().toLowerCase();
		// 先将所有的数据显示出来
		$("#process_panel").nextAll().hide();

		// 隐藏不匹配的数据
		$("#process_panel").nextAll(">a:contains(" + filterName + ")").show();
	});

	$("#character_panel .breadcrumb li:last").click(function(){
		if( !saveCurrentStyleData() ){
			return false;
		}
		refreshShowPanel();
	});
}
