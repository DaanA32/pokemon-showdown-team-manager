var ele = document.createElement("script");
ele.src = chrome.extension.getURL("/js/test.js");
document.body.appendChild(ele);