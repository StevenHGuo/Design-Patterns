var panels = chrome && chrome.devtools && chrome.devtools.panels;

panels && panels.elements.createSidebarPane(
    "$scope",
    function (sidebar) {

        var angularPanel = panels.create(
            "UIT(DEV)",
            "UITemplateTools.png",
            "main.html"
        );
    });

/*
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

chrome.runtime.sendMessage({
    type: 'evaluate',
    query: 'kk'
});
*/