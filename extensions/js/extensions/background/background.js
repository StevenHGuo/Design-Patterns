//Handle request from devtools   
var base_url  = 'http://localhost:8080';
var co_mapped = {};


chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
		
        //Request a tab for sending needed information
		if (message.type == 'savedata' ){
			//alert(JSON.stringify(message.query));
			message.query['md'] = 'cssselector';
			var ajaxtype = 'PUT';
			if (message.query['_id'] == undefined)
				ajaxtype = 'POST';
			//alert('ok');
			//alert(JSON.stringify(message.query));
			//alert(ajaxtype);
			$.ajax({
			    type: ajaxtype,
			    url: base_url + '/save',
				contentType: 'application/json',
				data: JSON.stringify(message.query),
			    dataType: 'Text',
			    success: function(msg,status, xhr){
					//alert(xhr.getAllResponseHeaders());
			    	//alert(msg);
					var rs = {
						type: 'savereslut',
						query: msg
					  };
					port.postMessage(rs);
			    },
			    error:function (XMLHttpRequest, textStatus, errorThrown) {
			    	//alert(XMLHttpRequest.status);
	                //alert(XMLHttpRequest.readyState);
	                //alert(textStatus);
					var tt = '';
					if (ajaxtype == 'PUT')
						tt = 0;	
					var rs = {
						type: 'savereslut',
						query: tt
					  };
					port.postMessage(rs);
						
			    }
		   });
		}
		else if (message.type == 'initdata' ){
			if (window.localStorage['crawleruserinfo']){
				var pwdinfo = window.localStorage['crawleruserinfo'].split("||");
				gettemplate(pwdinfo[0],pwdinfo[1],true);
			}
			else{
				var rs = {
					type: 'showlogin',
					query: ''
				};
				port.postMessage(rs); 	
			}	
		}
		else if (message.type == 'login'){
			var trans_data = message.query.split('||');
			gettemplate(trans_data[0],trans_data[1],true);
		}
		else{
			chrome.tabs.query({
				active: true
			}, function (tabs) {
				for (tab in tabs) {
					//Sending Message to content scripts
					//alert(tabs[tab].id);
					co_mapped[tabs[tab].id] = port.name;
					chrome.tabs.sendMessage(tabs[tab].id, message);
					break;
				}
			});
		}

    });
    //Posting back to Devtools
    chrome.extension.onMessage.addListener(function (message, sender) {
		if (co_mapped[sender.tab.id] == port.name){
			port.postMessage(message);
		}
    });
	
	var gettemplate = function(usr,pwd,checkpwdmk){
		var con_data = {};
		con_data['username'] = usr;
		con_data['password'] = pwd;
		con_data['checkpwdmk'] = checkpwdmk;
		//alert(JSON.stringify(con_data));
		$.ajax({
			type: 'POST',
			url: base_url + '/login',
			contentType: 'application/json',
			data: JSON.stringify(con_data),
			dataType: 'Text',
			success: function(msg,status, xhr){
				if (msg != 'failed' && msg != 'nouser' && msg != 'error' && msg != 'disabled'){
					window.localStorage['crawleruserinfo'] = usr+"||"+pwd;
				}
				var arr = [usr,msg];
				var rs = {
					type: 'datatrans',
					query: arr
				};
				port.postMessage(rs);
			},
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				//alert(XMLHttpRequest.status);
				//alert(XMLHttpRequest.readyState);
				//alert(textStatus);
				var rs = {
					type: 'datatrans',
					query: [usr,'error']
				};
				port.postMessage(rs);
			}
	   });
	};
});