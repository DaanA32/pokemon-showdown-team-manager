// Called when the user clicks on the page action icon. Retrieves the usernames of both combatants and the tier of the battle.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message == "getTeamInfo" ) {

      var items = localStorage.getItem("showdown_teams")
      chrome.runtime.sendMessage(
        {
            "message": "getTeamResult",
            "result": {   "teamList": unpack(items).map(s => ({ "teamId" : Math.abs(s.hashCode()), "team": s}) )} } );
    } else if(request.message == "saveAllTeamsTab"){
      var teams = request.teams;
      console.log(teams);
    }
  }
  /*$(".teamicons .picon").each(function( key, value ) {
  var ptrn = new RegExp("[(].*[)]")
  var str = value.title.replace(new RegExp("[(](([A-z]*((ed)|(ve)))|([0-9]*%))[)]$"), "")
  console.log((ptrn.test(str) ? (ptrn.exec(str) + "").replace( (new RegExp("[(]")) ,"").replace( (new RegExp("[)]")) ,"") : str));
});*/
);

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