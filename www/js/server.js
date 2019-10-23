//サーバ通信の実装用の関数群
//ピン留めの通知 と チャットの送信 と 事前準備を行う 関数が存在している


function pinMsg(msgObj){
  socket.emit('pin', msgObj);
}

function echoMsg(msgObj){
  const data = JSON.stringify(msgObj);
  socket.emit('message', data );
}

function initSocket(){
  //メッセージ用
  socket.on('message', function(msgData) {
    console.log("got socketMessage :"+ msgData );
    var data = Object ( JSON.parse( msgData ) );


    if(data.room === RoomID) receiveMsg(data);
    else ncmbUser.checkStatus(data);
  });

  //ピン留め用
  socket.on('pin', function(data) {

    const isnotCurrentUser = !(ncmbUser.getCurrentUser());
    const existPin = Pin.ExistInArray(data.id);

    if( isnotCurrentUser || data.room !== RoomID ) return;

    if( data.pinned && !existPin ) Pass(data.id, data.text);
    else if( !(data.pinned) && existPin ) Pdelete(data.id);
  });
}