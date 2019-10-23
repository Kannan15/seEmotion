/* scripts.js */
(function() {
  document.open();
  for(var i = 0, l = arguments.length; i < l; i++) {
    document.write('<script src="' + arguments[i] + '"></script>');
  }
  document.close();
})(
  "components/loader.js",

  "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js",

//以下自作
  "js/define.js",
  "js/server.js",

  "js/others/common.js",
  
  "js/chatFunctions/mainProcess.js",
  "js/chatFunctions/displayContents.js",
  "js/chatFunctions/communication.js",
  
  "js/management/procedure/account.js",
  "js/management/procedure/room.js",
  
  "js/management/account/login-logout.js",
  "js/management/account/newRegistration.js",
  
  "js/management/room/roomlist.js",
  "js/management/room/additions.js",
  "js/management/room/enter-exit.js",

  "js/negaposi/addWord.js",
  "js/negaposi/dict.js",
  "js/negaposi/negaposi.js",
  "js/negaposi/analyzing.js",
  "js/negaposi/select.js",

  "js/others/transBodyContents.js",
    
  "js/others/dialog/dialog.js",
  "js/others/dialog/dialogEvents.js",

  "js/others/splitter/splitter.js",
  "js/others/splitter/loadSplitterPage.js",
    
  "js/others/room/pin.js",
  "js/others/room/swipe.js",
  "js/others/room/expandInputTag.js",
    
  "js/init.js",
);