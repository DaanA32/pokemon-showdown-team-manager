chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        var rule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher(
                    {pageUrl: {urlContains: 'pokemonshowdown.com/teambuilder'}}
                )
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        };
        var rule2 = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher(
                    {pageUrl: {urlContains: 'psim.us/teambuilder'}}
                )
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }
        chrome.declarativeContent.onPageChanged.addRules([rule, rule2]);
    });
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.message == "getTeam") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {"message": "getTeamInfo"});
      });

      /*chrome.tabs.query({active:true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {code: 'console.log(localStorage.getItem("showdown_teams"))'});
      });*/
    } else if(request.message == "saveAllTeams"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {"message": "saveAllTeamsTab", "teams": request.teams});
        });
    } else if(request.message == "getTeamResult"){
        //console.log("----------------TEAM RESULT-----------------");
        //console.log(request)
        chrome.runtime.sendMessage({ "message":"getTeamReturn", "result": request.result});
    }
  });