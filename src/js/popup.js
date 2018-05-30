var loaded

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { // This is triggered when the background script sends the ratings:
      /*document.getElementById("playerRating").innerText = request.ratings[0]; // Replace the rating field with your rating
      document.getElementById("oppRating").innerText = request.ratings[1]; // Replace the rating field with your opponent's rating*/
      console.log(request);
      if(request.message == "getTeamReturn"){
        var list = request.result.teamList;
        loaded = list;
        /*list.forEach(e => {
          $("<p/>", {"text": e.teamId + ": " +e.team }).appendTo( "#content" )
        });*/
      }
    }
  );
  
  // Called when the user clicks on the page action icon to look at the opponent's rating.
  document.addEventListener('DOMContentLoaded', function() {
    //chrome.runtime.sendMessage({"message": "getTeam"}); // Start the process of fetching the rating by signaling to the background script to do so.
  });

  $("#loadbtn").click(function() {
    chrome.runtime.sendMessage({"message": "getTeam"});
  });

  $("#downloadallbtn").click(function() {
    $.getJSON( "http://localhost:8080/"+$("#textbox").val(), function( data ) {
      console.log(data)
      chrome.runtime.sendMessage({"message": "saveAllTeams", "teams": data});
    });
  });

  $("#signupbtn").click(function() {
    $.ajax({
      contentType: 'application/json',
      dataType: 'application/json',
      type : "POST",
      url: "http://localhost:8080/",
      //data: '{ "teamId": "' + t.teamId+ '", "team": "' + t.team + '" }' ,
      data: JSON.stringify({"username": $("#textbox").val(), "teamList" : []}) ,
      success: null,
    })
  });

  $("#uploadallbtn").click(function() {
    console.log(loaded)
    if(loaded != null){
      $.ajax({
        contentType: 'application/json',
        dataType: 'application/json',
        type : "POST",
        url: "http://localhost:8080/"+$("#textbox").val()+"/teams",
        //data: '{ "teamId": "' + t.teamId+ '", "team": "' + t.team + '" }' ,
        data: JSON.stringify(loaded) ,
        success: null,
      })
    }
  });