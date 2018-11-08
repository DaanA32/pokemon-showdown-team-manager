function uploadTeams(){
  var items = unpack(localStorage.getItem("showdown_teams"))
  items.forEach((k,v) => {
    var dt = { [v] : k}
    chrome.storage.sync.clear()
    chrome.storage.sync.set(dt, function() {
    });
  });
}

function downloadTeams(){
  chrome.storage.sync.get(null, function(items) {
    var allValues = Object.values(items);
    localStorage.setItem("showdown_teams", pack(allValues))
    location.reload()
  });
}

String.prototype.hashCode = function(s){
      var hash = 0;
      if (this.length == 0) return hash;
      for (i = 0; i < this.length; i++) {
          char = this.charCodeAt(i);
          hash = ((hash<<5)-hash)+char;
          hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
  }
  
function unpack(buffer){
  return buffer.split('\n');
}

function pack(teams) {
	return teams.join('\n');
};

var b1 = $("<button id='upload-button' class='upload-button'>Upload</button>").addClass("button big")
var b2 = $("<button id='download-button' class='download-button'>Download</button>").addClass("button big")
$(".teampane>p>[name=newTop]").after(b2)
$(".teampane>p>[name=newTop]").after(b1)
/*var ele = document.createElement("script");
ele.src = chrome.extension.getURL("/js/inject.js");
document.body.appendChild(ele);*/
$("#upload-button").click(uploadTeams)
$("#download-button").click(downloadTeams)