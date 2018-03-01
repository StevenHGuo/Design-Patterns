/*------------------------------------用户选中的对应选项与解析结构中对应值的映射关系------------------------------------*/
/**
 * valuetype字段的值与名称的映射关系
 * 		key:生成的JSON结构中valuetype的值
 * 		value:页面Base Info部分Data Type的选项名称
 */
const DATA_TYPE = {
    '1': 'String',
    '2': 'String Array',
    '3': 'JSONObject',
    '4': 'JSONArray',
    '5': 'Merge',
    '6': 'Merge And Validate',
    '7': 'Merge the children to Array',
    '8': 'Get data from Param',
    '9': 'Parse data from currently url',
    '10': 'Merge JSONArray by character name'
}

function getDataType() {
    return DATA_TYPE;
}

/**
 * checkrelation字段的值与名称的映射关系
 * 		key:生成的结构中checkrelation的值
 * 		value:页面Base Info部分Validate Type的选项名称；
 */
const CHECK_RELATION = {
    '1': 'OR',
    '2': 'AND'
}

function getCheckRelation() {
    return CHECK_RELATION;
}

/**
 * onemk字段的映射关系
 * 		key:生成的数据中onemk的值
 * 		value:页面Base Info部分Deafault Select的选项名称
 */
const DEFAULT_SELECT = {
    '1': 'Select The First',
    '2': 'Return Error'
}

function getDefaultSelect() {
    return DEFAULT_SELECT;
}

/**
 * function字段的映射关系
 * 		对应的style元素可以执行的JSoup方法
 */
const ELES_FUNCTION_TYPE = {
    '1': 'not select',
    '2': 'parent',
    '3': 'next',
    '4': 'nextall',
    '5': 'prev',
    '6': 'prevall'
}

function getElesFunctionType() {
    return ELES_FUNCTION_TYPE;
}

/**
 * 设置解析语法的优先级。在解析单个Style元素的时候，以父元素的解析结果为基础，是先执行相应的function方法还是执行相应的Selector
 * 		对应解析结构中exparr字段下的priority字段
 */
const PRIORITY = {
    '1': 'css exp',
    '2': 'function'
}

function getPriority() {
    return PRIORITY;
}

/*------------------------------------脚本解析结构模板------------------------------------*/
/**
 * Rootcategory模板结构
 */
const AP_ROOTCATEGORY = {
    'rootcategory': [{
        'name': '',
        'url': ''
    }]
}

/**
 * Subcategory模板结构
 */
const AP_SUBCATEGORY = {
    'subcategory': [{
        'name': '',
        'url': ''
    }],
    'skuCount': '',
    'lastpageNum': ''
}

/**
 * Page模板结构
 */
const AP_PAGE = {
    'skuCount': '',
    'pagesizeCount': '',
    'lastpageNum': ''
}

/**
 * List脚本的数据结构
 */
const AP_LIST = {
    'catalog': {
        'breadcrumb': [{
            'name': '',
            'url': ''
        }],
        'filter': [],
        'subCatalog': [{
            'name': '',
            'url': ''
        }],
        'refine': [{
            'name': '',
            'value': []
        }],
        'skuCount': ''
    },
    'productList': [{
        'url': '',
        'sku': '',
        'name': '',
        'listPrice': '',
        'soldPrice': '',
        'instantRebate': '',
        'usedPrice': '',
        'newPrice': '',
        'brand': '',
        'model': '',
        'condition': [],
        'picture': [],
        'shipping': '',
        'delivery': '',
        'mir': '',
        'mirText': '',
        'coupon': '',
        'currency': '',
        'ratings': '',
        'star': '',
        'tax': '',
        'seller': ''
    }]
}

/**
 * Info脚本的数据结构
 */
const AP_INFO = {
    'options': '',
    'productInfo': {
        'sku': '',
        'fullName': '',
        'selectedOptionItem': [{
            'name': '',
            'value': ''
        }],
        'allOptionItem': [{
            'name': '',
            'value': []
        }],
        'breadcrumb': [{
            'name': '',
            'url': ''
        }],
        'picture': [],
        'seller': '',
        'ratings': '',
        'star': '',
        'model': '',
        'mfgPartNumber': '',
        'mfgWebsite': '',
        'manufacturer': '',
        'delivery': '',
        'upc': [],
        'unspsc': '',
        'brand': '',
        'condition': [],
        'platform': [],
        'listPrice': '',
        'soldPrice': '',
        'newPrice': '',
        'usedPrice': '',
        'mirPrice': '',
        'refurbishedPrice': '',
        'includeMirPrice': '',
        'instantRebate': '',
        'shipping': '',
        'oem': '',
        'bundle': '',
        'bundles': [{
            'name': '',
            'url': ''
        }],
        'customization': true,
        'callForPrice': true,
        'storePickup': true,
        'newArrival': true,
        'comingSoon': true,
        'preOrder': true,
        'backOrder': true,
        'digitalGoods': true,
        'addItem': true,
        'active': true,
        'stock': true,
        'inventory': '',
        'VipOnly': true,
        'mir': '',
        'mirUrl': '',
        'coupon': '',
        'point': '',
        'aatc': '',
        'aatcProducts': [{
            'name': '',
            'url': ''
        }],
        'inBox': [],
        'pointDiscount': '',
        'currency': '',
        'deal': '',
        'lightningDeal': '',
        'otherSellers': [{
            'seller': '',
            'listPrice': '',
            'soldPrice': '',
            'instantRebate': '',
            'shipping': '',
            'fba': true
        }],
        'salesRank': [{
            'rank': '',
            'catalog': []
        }],
        'promotion': [],

        'specification': [{
            'name': '',
            'value': ''
        }],
        'description': [],
        'tax': '',
        'url': ''
    },
    'autoAddChars': {
        'number': [],
        'decimal': [],
        'big_number': [],
        'datetime': [],
        'varchar': []
    }
}

/**
 * Shipping脚本的解析结构
 */
const AP_SHIPPING = {
    'name': '',
    'active': true,
    'stock': true,
    'condition': [],
    'soldPrice': '',
    'currency': '',
    'shipping': '',
    'handingCharge': '',
    'mktp': true
}

/**
 * Seller List的解析结构
 */
const SELLER_LIST = {
    'breadcrumbList': [{
        'name': '',
        'url': ''
    }],
    'productUrl': '',
    'activeSKUCount': '',
    'topBrands': {
        'name': '',
        'value': []
    },
    'brand': '',
    'brandUrl': '',
    'sellerList': [{
        'sellerId': '',
        'sellerName': '',
        'status': '',
        'ratingCount': '',
        'ratingAverage': '',
        'deliveryTimeframe': '',
        'expeditedDeliveryAvailable': true,
        'shipFrom': '',
        'actualShippingCost': '',
        'currency': '',
        'sellerUrl': '',
        'condition': '',
        'email': '',
        'phoneNumber': ''
    }]
}

/**
 * 统一的数据结构，键值最后会被作为对应数据结构的名称显示在页面上。
 * 页面上显示的模板以及对应的显示名称。
 */
const SCRIPT_TYPE = {
    'AP_RootCategory': AP_ROOTCATEGORY,
    'AP_SubCategory': AP_SUBCATEGORY,
    'AP_Page': AP_PAGE,
    'AP_List': AP_LIST,
    'AP_Info': AP_INFO,
    'Ap_Shipping': AP_SHIPPING,
    'Seller_List': SELLER_LIST
}

function getScriptTypeList() {
    return SCRIPT_TYPE;
}

/**
 * 获取指定数据对应的数据结构参数.
 * 根据我们设计的解析结构规则将相应的模板转换成相应的解析结构。将对应可以直接了当的属性添加上去。
 * 
 * 数据结构只接受3中形式的数据：Object、String、Array、Boolean
 * 		Object代表当前字段是一个包含了多个子字段的字段
 * 		String代表当前字段是一个解析类型为字符串的字段
 * 		Array代表当前字段是一个解析类型为数组的字段
 * 		Boolean代表当前字段是一个布尔型的字段。
 * 程序会根据这个来自动填充相应的解析结构的值。
 * 
 * @param {Number} key: 当前字段对应的解析结构中的dataType类型
 * @param {Object} parentData: 父级元素的引用
 * 
 * @return Array: 
 * 		包含两个数据的索引：
 * 			第一个数据是当前字段对应在数据结构中valuetype的类型（这点主要是为了实现方法的递归而特意假的一般外部方法是不会用到这个值得）
 * 			第二个数据是对应解析模板的数据结构。
 */
function getSTTemplate(key, parentData) {
    var result = [];
    var data = null;

    if (parentData == '' && typeof (parentData) == 'string') {
        return [1, []];
    }

    if (parentData) {
        data = parentData;
    } else {
        data = deepCopy(SCRIPT_TYPE[key]);
    }
    var dataType = data.constructor;
    switch (dataType) {
        case String:
            // 当前字段的值是一个字符串
            return [1, []];
        case Array:
            if (data.length > 0) {
                // 字段对应数组的长度大于0
                // 该字段对应的数据需要合并
                return [4, getSTTemplate(null, data[0])[1]];
            } else {
                return [2, []];
            }
        case Object:
            // 当前字段的值是一个JSON对象
            for (var character in data) {
                var children = getCharaterTemplate();
                children[KEY_MAPPING['keyname']] = character;

                var sub = getSTTemplate(null, data[character]);
                children[KEY_MAPPING['datatype']] = sub[0];
                children[KEY_MAPPING['children']] = sub[1];
                result.push(children);
            }
            return [3, result];
        case Boolean:
            // 布尔型的字段需要根据当前的内容自动生成一个子字段，对应的子字段名称自动生成
            var children = getCharaterTemplate();
            children[KEY_MAPPING['keyname']] = 'condition1';
            children[KEY_MAPPING['datatype']] = 1;
            children[KEY_MAPPING['children']] = [];
            return [6, [children]];
        default:
            return null;
    }
}

const CHARACTER_CHILDREN = {
    'keyname': '', // 当前字段的名称
    'valuetype': 1,
    'onemk': 1,
    'absurl': false,
    'default': '',
    'checkrelation': 1,
    'important': false,
    'exparr': [
        // 具体的结构请看 STYLE_CHILDREN 变量
    ],
    'replace': [
        // 具体的结构请看 Replace_Template
    ],
    'checkexparr': [],
    'sub': [
        // 具体的结构请看 CHARACTER_CHILDREN
    ],
    'calexpression': ''
}

function getCharaterTemplate() {
    return deepCopy(CHARACTER_CHILDREN);
}

/**
 * 单个style的数据结构
 */
const STYLE_CHILDREN = {
    'cssexp': '',
    'attribute': '',
    'regularexp': '',
    'description': '',
    'group': '',
    'function': '',
    'priority': ''
}

function getStyleChildTemplate() {
    return deepCopy(STYLE_CHILDREN);
}

/**
 * replacement的数据结构
 */
const REPLACE_CHILDREN = {
    'reptarget': '',
    'repto': ''
}

function getReplaceTemplate() {
    return deepCopy(REPLACE_CHILDREN);
}

/**
 * 检查的父结构
 */
const CHECK_EXPARRING = {
    'checkexparr': ''
}

function checkExparring() {
    return deepCopy(CHECK_EXPARRING);
}

/**
 * 检查的子结构
 */
const CHECK_EXP = {
    'checkexp': ''
}

function getCheckExp() {
    return deepCopy(CHECK_EXP);
}

/*****************由于在初始开发时期，字段名称经常性的变换，所以这里使用了字段名称映射的方式防止在后期过程中经常性的变换字段名称*****************/
/**
 * 第一级目录生成的结构中字段的映射关系
 */
const KEY_MAPPING = {
    'keyname': 'keyname',
    'datatype': 'valuetype',
    'onemk': 'onemk',
    'absurl': 'absurl',
    'important': 'important',
    'exparr': 'exparr',
    'replacement': 'replace',
    'validateType': 'checkrelation',
    'validateExp': 'checkexparr',
    'default': 'default',
    'children': 'sub',
    'calexpression': 'calexpression'
}

/**
 * 存储Style字段的映射关系
 */
const EXP_MAPPING = {
    'jsoupSelector': 'cssexp',
    'attribute': 'attribute',
    'regularexp': 'regularexp',
    'group': 'group',
    'description': 'description',
    'function': 'familytype',
    'priority': 'priority'
}

/**
 * replace字段的键映射关系
 */
const REPLACE_MAPPING = {
    'target': 'reptarget',
    'replacement': 'repto'
}

/**
 * 检查的验证逻辑
 */
const CHECK_EXP_Mapping = {
    'checkexp': 'checkexp'
}