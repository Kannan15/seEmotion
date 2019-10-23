//ルームへの参加及び新規作成時に必要な処理をまとめて行う関数
//ルームへの参加[作成]のほか、
//参加中のルームの情報の更新などを行う

//1.ルームへ参加
//2.リストへ追加

function joinRoom(newRoomID){
 
  //1
  ncmbRooms.joinRoom(newRoomID)
  .then(function(result){
    const roomId = result[0].get('objectId');
    const roomName = result[0].get('roomName');

    ncmbUser.joinRoom( roomId, roomName );

    //2
    RPass(roomId, roomName );
  })
  .catch(function(err){
    ons.notification.alert({
      message: 'なかった',
      cancelable: true
    });
  });

  return;
}


//1.ルームを作成
//2.リストへ追加

function createRoom(newRoomName){

  //1
  ncmbRooms.createRoom(newRoomName)
  .then(function(result){
    const roomId = result.get('objectId');
    const roomName = result.get('roomName');
    console.log(result);
    console.log(roomId);
    console.log(roomName);

    ncmbUser.joinRoom( roomId, roomName );

    //2
    RPass(roomId, roomName );
  });

}