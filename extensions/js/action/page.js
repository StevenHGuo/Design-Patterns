var loginfun = null;
var fillElementfun = null;
var initfeildfun = null;
var endloadingfun = null;

var port = chrome.extension.connect({
	name: "devtools-page" + Date.parse(new Date())
});

var Start = function () {
	port.postMessage({
		type: 'initdata',
		query: ''
	});
};

port.onMessage.addListener(function (request) {
	//alert(JSON.stringify(request));
	if (request.type === 'cssselector') {
		fillElementfun(request.query);
	} else if (request.type === 'savereslut') {
		endloadingfun(request.query);
	} else if (request.type === 'datatrans') {
		//alert(request.query);
		initfeildfun(request.query);
	} else if (request.type === 'showlogin') {
		//alert(loginfun);
		loginfun();
	}
});

var initparams = function (initfeildF, longinshowF) {
	loginfun = longinshowF;
	initfeildfun = initfeildF;
	Start();
}

var userlogin = function (usr, pwd) {
	port.postMessage({
		type: 'login',
		query: usr + "||" + pwd
	});
}

var userlogout = function () {
	//window.localStorage['crawleruserinfo']
	window.localStorage.removeItem('crawleruserinfo');
}


var startDraw = function (eleF) {
	fillElementfun = eleF;
	port.postMessage({
		type: 'Crawler',
		query: ''
	});
};

var endDraw = function () {
	port.postMessage({
		type: 'UnCrawler',
		query: ''
	});
}


var saveTemplate = function (savedata, endloadingF) {
	endloadingfun = endloadingF;
	port.postMessage({
		type: 'savedata',
		query: savedata
	});
};


var drawFeildCSSRect = function (feildexp) {
	port.postMessage({
		type: 'DrawFeildRect',
		query: feildexp
	});
};


var cancelFeildCSSRect = function () {
	port.postMessage({
		type: 'UnDrawFeildRect',
		query: ''
	});
};