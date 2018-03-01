var jsonData = [];

function getToTalJsonData(){
	return jsonData;
}

function setTotalJsonData(data){
	jsonData = data;
}

function setJsonData(data){
    jsonData['mdes']['pit'] = data;
}

function getJsonData(){
    return jsonData['mdes']['pit'];
}


/********************************************回调函数********************************************/
/** 
 * 根据返回结果，判断当前程序的登陆情况
 */
function validateCallBackDate( responseData ){
	//判断用户是否正确
	if( responseData === "failed" ){
		//用户名或密码错误
		setWarningInfor( "用户名或者密码错误!" );
		return false;
	};
	if( responseData === "nouser" ){
		//不存在这个用户
		setWarningInfor( "用户不存在!" );
		return false;
	};
	if( responseData === "noset" ){
		//用户没有选中Template
		setWarningInfor( "用户没有选中Template!" );
		return false;
	};
	if( responseData === "seterror" ){
		//数据库中设置的提取码有问题，不能够选中任何的数据
		setWarningInfor( "Template选择有错误!" );
		return false;
	};
	if( responseData === "nodata" ){
		//Template
		setWarningInfor( "当前的Template没有任何的数据!" );
		return false;
	};
	if( responseData === "disabled" ){
		//用户账号被设置为disabled
		setWarningInfor("用户不存在！");
		return false;
	};
	if( responseData === "error" ){
		//服务器异常
		setWarningInfor( "服务器异常!" );
		return false;
	};
	return true;
}

/** 
 * 验证数据的提交状况是否正确
 */
var endloadingF = function ( result ){
	var _message = "";
	if( result == 1 ){
		_message = "提交数据成功!";
	}else if( result == 0 ){
		_message = "提交数据失败!";
	}else if( result == null ){
		_message = "添加数据成功!";
	}else if( result === "" ){
		_message = "位置错误!";
	}else{
		_message = "添加数据成功!";
		//给全局变量赋值
		jsonData['_id'] = result;
	}
	$("body").mLoading('hide');
	alertDiv( alertType.Info, _message );
}

/** 
 * 获取数据的接口，同时重绘页面，将数据显示出来
 * @param{Array} responseArray:页面中获取到的该taskId的内容，是一个数组对象,只包含两个变量。
 * 		responseArray的格式是：["username", responseData];
 * 		responseData是一个JSON对象。
 * 		responseData的格式是:
 * 		{
 * 			"_id": "5798464ef0459bd181240b32", //更新数据时的id值
 * 			"na": "tasktest-1",     //任务的名字
 * 			"tid": 12,				//添加数据时的id
 * 			"mdes": {				//相应的数据
 * 			}
 * 		} 
 */
var initfeildF = function( responseArray ){
	$("#progress_bar").hide();
	//验证用户是否成功登录
	if( !validateCallBackDate( responseArray[1] ) ){
		return;
	};
	var username = responseArray[0];
	var responseData = JSON.parse(responseArray[1]);
	
	//设置用户名
	$("#loging_out b").text(username);

	var taskName = responseData['na'];
	var mdes = responseData['mdes'];
	var taskId = responseData['tid'];

	if( taskName == undefined || taskId == undefined ){
		setWarningInfor("The data from server is error！");
		return;
	};

	if( isJsonNull(mdes) ){
		mdes['pit'] = [];
	};

	try{
		if( mdes["pit"].length == 0 ){
			// 当该任务没有任何的字段的时候，在初始化的时候就字段弹出字段处理界面
			$("#process_panel").click();
		}else{
			// 当前字段已经添加了相应的内容，就隐藏自动选择某个选项的内容
			$("#crawler_template").hide();
		}
		$(".version_error").remove();
	}catch(e){
		$(".version_error p").text("当前任务配置的数据是1.x.x版本的，不能够使用2.0.0版本之后的的插件配置。请使用1.x.x版本查看相应的数据,或者修改需要配置的任务");
		return;
	}

	// 设置全局变量本在本地localStorage中存储相应的参数
	jsonData = responseData;
	
	// 初始化各个标签的事件
	initEvent();
	initCharacter( getJsonData() );
	initPanel();
	
	setTemplateName(taskName);
	
	// 移除登录界面上的相关提示信息并清空输入框的内容
	$("#login_modal").modal("hide");
	$(".login_info").text("");
	$("#login_modal input").val("");
};

/**
 * 初始化界面上的基础数据信息
 */
function initPanel(){
	// 激活选择器的样式
	$("input[type='checkbox']").bootstrapSwitch();
	initStylePanel();
}


var longinshowF = function(){
	// 显示登录界面
	$("#login_modal").modal("show");
}

/*****************************************初始化配置信息*****************************************/


/** 作用：初始化各个面板的字段信息
	输入参数：dataContent  该任务的字段数据信息
  */
function initCharacter( dataContent ){
	// 初始化脚本的类型
	initScriptType();
	var count = dataContent.length;
	// 判断返回来的数据是否符合条件 1. 不为空。 2. 包含mdes的键值。3.mdes对应的值为{}。如果符合就说明是第一次创建这个字段
	if( count === 0 ){
		$("#in_defa_char").show();
	}else{
		// 移除选择类型下拉框
		$("#in_defa_char").hide();
		refreshShowPanel();
		refreshProcessPanel();
	}
}


/** 作用：初始化各个面板中的事件
  */
function initEvent(){
	initCharShowEvent();
	initManageCharEvent();
	initRegularEvent();
}

/**
 * 初始化一些方法
 */
$(document).ready(function(){
	// 初始化登录事件的相关方法
	initLoginEvent();
	initparams( initfeildF, longinshowF );

		// 本地测试用的空数据，当需要本地测试的时候，可以将这几行代码去除注释，把前边的两行加上注释即可
		// var mdes = [{"keyname":"sku","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#nav-xshop>.nav-a.nav_a:eq(1)","attribute":"href","description":"对应url中的sku ","regularexp":"dp/([A-Z\\d]+)","group":"1","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"fullName","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#productTitle","attribute":"text","description":"product title","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"selectedOptionItem","valuetype":"4","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#twisterContainer>form>div","attribute":"","description":"","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"div>label","attribute":"text","description":"option name","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"value","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#native_dropdown_selected_size_name>option[selected],.selection","attribute":"text","description":"pruduct option","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"allOptionItem","valuetype":"4","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#twisterContainer>form>div","attribute":"","description":"","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"div>label","attribute":"text","description":"das","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"value","valuetype":"5","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"","attribute":"","description":"","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[{"keyname":"color","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".a-dropdown-container>select>option:gt(0)","attribute":"text","description":"size option","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"size","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"img","attribute":"alt","description":"color option","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]}]}]},{"keyname":"breadcrumb","valuetype":"4","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".a-list-item>.a-link-normal.a-color-tertiary","attribute":"","description":"","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"","attribute":"text","description":"breadcrumb  name","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"url","valuetype":"1","onemk":"1","absurl":true,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"","attribute":"href","description":"breadcrumb url","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"picture","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".imageSwatches img","attribute":"src","description":"product pictures","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"seller","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#ddmMerchantMessage>b","attribute":"text","description":"product seller","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"ratings","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".content .a-size-small>a","attribute":"text","description":"product rating","regularexp":"\\d+","group":"0","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"star","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".content .a-icon-star>span","attribute":"text","description":"product star","regularexp":"\\d+\\.?(\\d+)?","group":"0","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"model","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":".content>ul>li>b:containsOwn(型号:)","attribute":"text","description":"product model","regularexp":"","group":"","familytype":"2","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"mfgPartNumber","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"mfgWebsite","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"manufacturer","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"delivery","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#ddmFastShippingMessage","attribute":"text","description":"product delivery/d+-/d+","regularexp":"\\d+-\\d+","group":"0","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"upc","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"unspsc","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"brand","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#brand","attribute":"text","description":"product brand","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"condition","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"platform","valuetype":"2","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"listPrice","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#priceblock_ourprice","attribute":"text","description":"product list price","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[{"reptarget":"￥","repto":""}],"checkexparr":[],"sub":[]},{"keyname":"soldPrice","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#priceblock_ourprice","attribute":"text","description":"product sold price","regularexp":"","group":"","familytype":"1","priority":"1"}],"replace":[{"reptarget":"￥","repto":""}],"checkexparr":[],"sub":[]},{"keyname":"newPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"usedPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"mirPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"refurbishedPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"includeMirPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"instantRebate","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"shipping","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[{"cssexp":"#ags_shipping_import_fee","attribute":"text","description":"product shipping","regularexp":"\\d+\\.\\d+","group":"0","familytype":"1","priority":"1"}],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"oem","valuetype":"1","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"bundle","valuetype":"4","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[{"checkexp":".+bundle.+"}],"sub":[{"keyname":"namebundle","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"bundles","valuetype":"4","onemk":"1","absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"url","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"customization","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"callForPrice","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"storePickup","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"newArrival","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"comingSoon","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"preOrder","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"backOrder","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"digitalGoods","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"addItem","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"active","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"stock","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"inventory","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"VipOnly","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"mir","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"mirUrl","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"coupon","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"point","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"aatc","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"aatcProducts","valuetype":4,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"url","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"inBox","valuetype":2,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"pointDiscount","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"currency","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"deal","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"lightningDeal","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"otherSellers","valuetype":4,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[{"keyname":"seller","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"listPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"soldPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"instantRebate","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"shipping","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"fba","valuetype":6,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"salesRank","valuetype":4,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[{"keyname":"rank","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"catalog","valuetype":2,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"promotion","valuetype":2,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"specification","valuetype":4,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[{"keyname":"name","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"value","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}]},{"keyname":"description","valuetype":2,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]},{"keyname":"couponPrice","valuetype":1,"onemk":1,"absurl":false,"default":"","checkrelation":1,"important":false,"exparr":[],"replace":[],"checkexparr":[],"sub":[]}];
		// var array2 = {"_id":"596861600416fd61ea2a8388","na":"testDemo_1","tid":3958501,"mdes":{"pit":mdes},"vd":true};
		// var testData = ['sg90',JSON.stringify(array2)]; // 测试有结果的数据
		// var testData = ["sg90","{\"_id\":\"596861600416fd61ea2a8388\",\"na\":\"testDemo_1\",\"tid\":3958501,\"mdes\":{},\"vd\":true}"];	// 测试空数据
		// initfeildF(testData);
});