/*                    start up                    */
//ページから離れた時の処理
//ページに入った時の処理
//プログラム起動時の処理を定義している

window.document.addEventListener( 'destroy', function(event){
  if(event.target.id === "room") Pin.Close();
});

document.addEventListener( 'init', function(event){
  ES = "general"
  if(event.target.id !== "room") return;

  Pin.Open(RoomID);
  ncmb.DataStore("room")
  .equalTo("objectId",RoomID)
  .fetchAll()
  .then(function(results){
    if(results.length != 0){
      swipe('set');
      $('#RoomTitle > .swiper-Name').html(results[0].get("roomName"));
      $('#RoomTitle > .swiper-Id').html(results[0].get("objectId"));
    }
  })
  .catch(function(err){
    console.log(err);
  });
});

ons.ready(function () {
  initSocket();
  
  ons.enableDeviceBackButtonHandler();
  ons.setDefaultDeviceBackButtonListener(function(){});

  let currentUser = ncmbUser.getCurrentUser();
  if (currentUser) {
    ncmbUser.get()
    .then(function(result){
      if(ncmbUser.getCurrentUser().get('roomId').length)
        RoomPage.setBodyContent(ncmbUser.getCurrentUser().get('roomId')[0]);
      else ReadyPage.setBodyContent();
    });
  }

  window.document.addEventListener('backbutton', function(){
    const pageName = document.getElementById('content').page;

    if(pageName === ReadyPage.path)
      ons.setDefaultDeviceBackButtonListener(function(){
        if( navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i))
            navigator.app.exitApp();
      });

    if(pageName === RoomPage.path)
      ons.setDefaultDeviceBackButtonListener(function(){
        ReadyPage.setBodyContent();
      });
  });
});