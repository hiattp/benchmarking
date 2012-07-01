$(document).ready(function(){
  
  var socket = io.connect(socketURL);
  
  socket.on("update", function(data){
    $("#connected-users").text(data.total);
  });
  
});