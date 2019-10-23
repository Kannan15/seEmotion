//ルームから退出するときの処理
function exitRoom(roomId, userId){

  //ここからコールバック関数の宣言

  const rmv = function(results){
    results[0].remove("entrants", userId);
    results[0].update();
  };

  //ここまでコールバック関数の宣言

  ncmb.DataStore("room")
  .equalTo( "objectId", roomId )
  .fetchAll()
  .then( (results) => rmv(results) );

  ncmbUser.exitRoom(roomId);
}

//参加中のほかの会員の情報を取得して
//右のサイドメニューに表示する
function getOtherUsers(){
  const roomId = RoomID;
  $('#otherUsers').empty();

  //ここからコールバック関数の宣言

  const express = function(results){
    if(results.length !== 1) return;

    const userList = results[0].get("entrants");
    
    for(let i = 0; i < userList.length; i++)
      $('#otherUsers').append('<ons-list-item>' + userList[i] + '</ons-list-item>');
  }

  //ここまでコールバック関数の宣言

  ncmb.DataStore("room")
  .equalTo( "objectId", roomId )
  .fetchAll()
  .then( (results) => express(results) )
  .catch();
}