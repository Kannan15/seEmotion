//各バックエンドへデータを送信する関数
function sendMsg(inform) {
  //ニフクラの機能を使うインスタンスを生成
  const Chat = ncmb.DataStore("chat");
  const newMsg = new Chat();

  const text            = inform.text;
  const negaposiValue   = inform.negaposiValue;
  const NCMBName        = inform.speaker.name;
  const NCMBUserId      = inform.speaker.id;
  const room            = inform.room;

  Dict.setSentenceData(text, negaposiValue);

  //各データをニフクラのサーバに保存
  newMsg
  .set("room",room)
  .set("text",text)
  .set("name",NCMBName)
  .set("userId",NCMBUserId)
  .set("negaposiValue",negaposiValue)
  .save()
  .then(function(NCMBmessageData){
    //テキストボックスを空に
    $('#jsi-msg').val("").trigger('input');

    //各クライアントに通知
    echoMsg(NCMBmessageData);
  })
  .catch(function(err){
    console.log(err);
  });
}

//メッセージ受信時に、
//メッセージ格納用の変数に入れて、
//もしスコープが一番下ならそのまま表示する
function receiveMsg(msgData){
  ChatHistoryes.push(msgData);

  if(showMsgScope === 0) showMessage(msgData);
}