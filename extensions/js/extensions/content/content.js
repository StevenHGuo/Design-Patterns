var xh = xh || {};

xh.crawlerDivIdName = 'PriceToolBarSelRect';
xh.divintervalid = -1;
xh.chargedrawindexno = 1;
xh.chargedrawtype = 0;
xh.drawEl = null;
xh.addbuttonid = 'input_jsonData';
xh.getdatainputid = 'input_jsonData';
xh.taskid = 'taskId';
xh.taskname = 'taskName';
xh.egg_match_id = 0;
xh.prefix_match = 'Egg_Match_Div_Id_';

xh.elementsShareFamily = function (primaryEl, siblingEl) {
	var p = primaryEl,
		s = siblingEl;
	return (p.tagName === s.tagName &&
		(!p.className || p.className === s.className) &&
		(!p.id || p.id === s.id));
};

xh.CSSelementsShareFamily = function (primaryEl, siblingEl) {
	var p = primaryEl,
		s = siblingEl;
	return (p.tagName === s.tagName &&
		(!p.className || p.className === s.className) &&
		(!p.id || p.id === s.id));
};

xh.getElementIndex = function (el) {
	var index = 1;
	var sib;
	for (sib = el.previousSibling; sib; sib = sib.previousSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE && xh.elementsShareFamily(el, sib)) {
			index++;
		}
	}
	if (index > 1) {
		return index;
	}
	for (sib = el.nextSibling; sib; sib = sib.nextSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE && xh.elementsShareFamily(el, sib)) {
			return 1;
		}
	}
	return 0;
};

xh.getCSSElementIndex = function (el) {
	var index = 1;
	var sib;
	var mk = false;
	for (sib = el.previousSibling; sib; sib = sib.previousSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE) {
			index++;
			if (xh.CSSelementsShareFamily(el, sib))
				mk = true;
		}
	}
	if (index > 1 && mk) {
		return index;
	}
	for (sib = el.nextSibling; sib; sib = sib.nextSibling) {
		if (sib.nodeType === Node.ELEMENT_NODE) {
			if (xh.CSSelementsShareFamily(el, sib))
				mk = true;
			if (mk) {
				return index;
			}
		}
	}
	return 0;
};

xh.makeQueryForElement = function (el) {
	var query = '';
	for (; el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
		var component = el.tagName.toLowerCase();
		var index = xh.getElementIndex(el);
		if (el.id) {
			component += '[@id=\'' + el.id + '\']';
		} else if (el.className) {
			component += '[@class=\'' + el.className + '\']';
		}
		if (index >= 1) {
			component += '[' + index + ']';
		}
		// If the last tag is an img, the user probably wants img/@src.
		if (query === '' && el.tagName.toLowerCase() === 'img') {
			component += '/@src';
		}
		query = '/' + component + query;
	}
	return query;
};

xh.evaluateQuery = function (query) {
	var xpathResult = null;
	var str = '';
	var nodeCount = 0;
	var toHighlight = [];

	try {
		xpathResult = document.evaluate(query, document, null,
			XPathResult.ANY_TYPE, null);
	} catch (e) {
		str = '[INVALID XPATH EXPRESSION]';
		nodeCount = 0;
	}

	if (!xpathResult) {
		return [str, nodeCount];
	}

	if (xpathResult.resultType === XPathResult.BOOLEAN_TYPE) {
		str = xpathResult.booleanValue ? '1' : '0';
		nodeCount = 1;
	} else if (xpathResult.resultType === XPathResult.NUMBER_TYPE) {
		str = xpathResult.numberValue.toString();
		nodeCount = 1;
	} else if (xpathResult.resultType === XPathResult.STRING_TYPE) {
		str = xpathResult.stringValue;
		nodeCount = 1;
	} else if (xpathResult.resultType ===
		XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
		for (var node = xpathResult.iterateNext(); node; node = xpathResult.iterateNext()) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				toHighlight.push(node);
			}
			if (str) {
				str += '\n';
			}
			str += node.textContent;
			nodeCount++;
		}
		if (nodeCount === 0) {
			str = '[NULL]';
		}
	} else {
		// Since we pass XPathResult.ANY_TYPE to document.evaluate(), we should
		// never get back a result type not handled above.
		str = '[INTERNAL ERROR]';
		nodeCount = 0;
	}

	//xh.highlight(toHighlight);
	return [str, nodeCount];
};

xh.makeCSSSelectorForElement = function (el) {
	var query = '';
	var rsmnk = false;
	for (; el && el.nodeType === Node.ELEMENT_NODE; el = el.parentNode) {
		var component = el.tagName.toLowerCase();
		if (component == 'html')
			continue;
		var index = xh.getCSSElementIndex(el);
		if (el.id) {
			if (isNaN(el.id)) {
				component += '#' + el.id;
				rsmnk = true;
			}
		} else if (el.className) {
			var classarr = xh.charFilter(el.className).replace(/[\r\n]/g, '').trim().split(' ');
			for (var i = 0; i < classarr.length; i++) {
				if (component.charAt(component.length - 1) != '.')
					component += '.' + classarr[i];
				else
					component += classarr[i];
			}
		}
		if (index >= 1) {
			component += ':nth-child(' + index + ')';
		}
		if (query == '') {
			query = component;
		} else {
			query = component + ' > ' + query;
		}
		//if (rsmnk)
		//  return query;
	}
	return query;
};

xh.evaluateCSSSelector = function (query) {

}

xh.charFilter = function (str) {
	var fileType = "";
	var ascNum = 173;
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) != ascNum) {
			fileType += str.charAt(i);
		}
	}
	return fileType;
}


xh.fFindPos = function (oEle, bReturnY) {
	if (!oEle) {
		alert('The object cannot be empty!');
		return;
	}
	if (bReturnY) {
		return fFindPosY(oEle);
	} else {
		return fFindPosX(oEle);
	}

	function fFindPosX(oEle) {
		var iLeft = 0;
		if (oEle.offsetParent) {
			while (true) {
				iLeft += oEle.offsetLeft;
				if (!oEle.offsetParent) {
					break;
				} // end if 1
				oEle = oEle.offsetParent;
			} // end while
		} else if (oEle.x) {
			iLeft += oEle.x;
		}
		return iLeft;
	} // end function fFindPosX
	function fFindPosY(oEle) {
		var iTop = 0;
		if (oEle.offsetParent) {
			while (true) {
				iTop += oEle.offsetTop;
				if (!oEle.offsetParent) {
					break;
				} // end if 1
				oEle = oEle.offsetParent;
			} // end while
		} else if (oEle.y) {
			iTop += oEle.y;
		}
		return iTop;
	} // end function fFindPosX
}

xh.drawRectframe = function (elelem, flag, type, num) {
	var x = xh.fFindPos(elelem, false);
	var y = xh.fFindPos(elelem, true);
	var w = elelem.getBoundingClientRect().right -
		elelem.getBoundingClientRect().left;
	var h = elelem.getBoundingClientRect().bottom -
		elelem.getBoundingClientRect().top;
	var elm, linecolor, desc;
	if (type == 1) {
		elm = document.getElementById(xh.crawlerDivIdName);
		if (elm) {
			elm.parentNode.removeChild(elm);
		}
		elm = document.createElement('div');
		elm.id = xh.crawlerDivIdName;
		linecolor = 'dodgerblue';
		desc = elelem.tagName;
	} else if (type == 2) {
		elm = document.getElementById(xh.crawlerDivIdName);
		if (elm) {
			elm.parentNode.removeChild(elm);
		}
		linecolor = 'green';
		desc = num;
		elm = xh.getMatchDiv();
	}

	document.body.appendChild(elm);
	elm.style.cssText = 'width: ' + w + 'px' + ';height: ' + h + 'px' +
		';top: ' + y + 'px' + ';left: ' + x + 'px' +
		';border: 2px solid ' + linecolor + ';color:white;font-weight:bold;' +
		';position: absolute; z-index: 999998; opacity : 0.1';

	elm.innerHTML = '<span name=\'tagnamespan\' style=\'float:left;margin:0px;background:' + linecolor + ';padding:1px;font-size:9px;\'>' + desc + '</span>';

	if (flag)
		$(elm).css('opacity', 0.9);
	else
		$(elm).animate({
			opacity: 0.9
		}, 800);
}

xh.getMatchDiv = function () {
	var e = document.getElementById(xh.prefix_match + xh.egg_match_id);
	if (e) {
		xh.egg_match_id = xh.egg_match_id + 1;
		return e;
	} else {
		var elm = document.createElement('div');
		elm.id = xh.prefix_match + xh.egg_match_id;
		xh.egg_match_id = xh.egg_match_id + 1;
		elm.style.cssText = 'position: absolute;top:0px;left:0px;display:none;';
		document.body.appendChild(elm);
		return elm;
	}
}

xh.clearMatchedRect = function () {
	var object;
	for (var i = 0; i < xh.egg_match_id; i++) {
		object = document.getElementById(xh.prefix_match + i);
		object.innerHTML = '';
		object.style.cssText = 'dispaly:none';
	}
	xh.egg_match_id = 0;
}

xh.drawMatchedRects = function (exp) {
	var matchnodes = document.querySelectorAll(exp);
	for (var i = 1; i <= matchnodes.length; i++) {
		xh.drawRectframe(matchnodes[i - 1], true, 2, i);
	}
}


xh.circleDrawRect = function (p_nodes, c_nodes) {
	if (xh.divintervalid != -1) {
		clearInterval(xh.divintervalid);
		xh.divintervalid = -1;
	}
	xh.divintervalid = setInterval(function () {
		xh.drawRectcharge(p_nodes, c_nodes);
	}, 1500);
}

xh.drawRectcharge = function (p_nodes, c_nodes) {
	if (xh.chargedrawtype == 0) {
		xh.drawEl = c_nodes[xh.chargedrawindexno];
		xh.chargedrawindexno++;
		if (xh.chargedrawindexno >= c_nodes.length) {
			if (p_nodes.length > 1)
				xh.chargedrawtype = 1;
			xh.chargedrawindexno = 0;
		}
	} else {
		xh.drawEl = p_nodes[xh.chargedrawindexno];
		xh.chargedrawindexno++;
		if (xh.chargedrawindexno >= p_nodes.length) {
			if (c_nodes.length > 1)
				xh.chargedrawtype = 0;
			xh.chargedrawindexno = 0;
		}
	}
	xh.drawRectframe(xh.drawEl, false, 1, -1);
}

xh.getParentNode = function (elelem, p_nodeArr) {
	p_nodeArr.push(elelem);
	if (elelem.parentNode != null && elelem.parentNode.tagName != 'HTML')
		arguments.callee(elelem.parentNode, p_nodeArr);
}

xh.getchildNode = function (elelem, c_nodeArr) {
	c_nodeArr.push(elelem);
	if (elelem.children.length > 0)
		arguments.callee(elelem.children[0], c_nodeArr);
}

xh.clearRect = function () {
	var elm = document.getElementById(xh.crawlerDivIdName);
	if (elm) {
		elm.parentNode.removeChild(elm);
	}
}


xh.Bar = function () {
	this.boundHandleRequest_ = this.handleRequest_.bind(this);
	this.boundMouseMove_ = this.mouseMove_.bind(this);
	this.boundClick_ = this.click_.bind(this);

	this.currEl_ = null;
	this.parentNodeArr_ = null;
	this.childNodeArr_ = null;
	chrome.extension.onMessage.addListener(this.boundHandleRequest_);

}

xh.Bar.prototype.handleRequest_ = function (request, sender, cb) {
	//alert('In content Script Message Recieved is ' + request);
	//Send needed information to background page
	if (request.type === 'Crawler') {
		document.addEventListener('mousemove', this.boundMouseMove_);
		document.addEventListener('click', this.boundClick_);
		xh.clearMatchedRect();
	} else if (request.type === 'UnCrawler') {
		document.removeEventListener('mousemove', this.boundMouseMove_);
		document.removeEventListener('click', this.boundClick_);
		clearInterval(xh.divintervalid);
		console.log("test");
		var elm = document.getElementById(xh.crawlerDivIdName);
		if (elm) {
			elm.parentNode.removeChild(elm);
		}
	} else if (request.type === 'Notreslut') {
		/*var btad = document.getElementById(xh.addbuttonid);
	  if (btad){
		  btad.addEventListener('click', function(){
			var transdata = '';
			var templatejson = JSON.parse(document.getElementById(xh.getdatainputid).value);
			if (templatejson.length == 0){
				var rt = {};
				rt['na'] = document.getElementById(xh.taskname).innerHTML;
				rt['tid'] = document.getElementById(xh.taskid).innerHTML;
				transdata = JSON.stringify(rt);
			}
			else
				transdata = JSON.stringify(templatejson[0]);
			chrome.extension.sendMessage({
				type: 'datatrans',
				query: transdata
			  });
		  });
	  }*/
	} else if (request.type === 'ajax') {
		$.ajax({
			type: 'GET',
			url: 'http://www.baidu.com',
			dataType: 'Text',
			success: function (msg, status, xhr) {
				alert(xhr.getAllResponseHeaders());
				alert(msg);
				//var tt = window.open('./test.html','_blank');
				//y.document.body.innerHTML = msg;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);

			}
		});
	} else if (request.type === 'DrawFeildRect') {
		xh.drawMatchedRects(request.query);
	} else if (request.type === 'UnDrawFeildRect') {
		xh.clearMatchedRect();
	}
};

xh.Bar.prototype.mouseMove_ = function (e) {
	var elm = document.getElementById(xh.crawlerDivIdName);
	if (elm) {
		elm.parentNode.removeChild(elm);
	}
	var p_el = document.elementFromPoint(e.clientX, e.clientY);
	//var p_el = e.toElement;
	if (!p_el || p_el.id == xh.crawlerDivIdName) {
		return;
	}
	this.currEl_ = p_el;
	xh.drawEl = p_el;
	this.parentNodeArr_ = new Array();
	this.childNodeArr_ = new Array();
	xh.getParentNode(this.currEl_, this.parentNodeArr_);
	xh.getchildNode(this.currEl_, this.childNodeArr_);
	xh.drawRectframe(this.currEl_, true, 1, -1);
	if (this.parentNodeArr_.length > 1 || this.childNodeArr_.length > 1) {
		xh.chargedrawindexno = 1;
		if (this.childNodeArr_.length > 1)
			xh.chargedrawtype = 0;
		else
			xh.chargedrawtype = 1;
		//xh.circleDrawRect(this.parentNodeArr_, this.childNodeArr_);
	}
};


xh.Bar.prototype.click_ = function (e) {
	chrome.extension.sendMessage({
		type: 'cssselector',
		query: xh.makeCSSSelectorForElement(xh.drawEl)
	});
	document.removeEventListener('mousemove', this.boundMouseMove_);
	document.removeEventListener('click', this.boundClick_);
	clearInterval(xh.divintervalid);
	setTimeout("xh.clearRect()", 900);
};


if (location.href.indexOf('acid3.acidtests.org') === -1) {
	window.xhBarInstance = new xh.Bar();
}