const LOAD = 25;

var showMsgScope = 0;
var nowReplace = false;
var canJumpLast = true;
var ChatHistoryes = new Array;
var gettingChatTexts = false;

//サーバから直近1000件(ニフクラで取得できる限界)のチャットの履歴を取得する
//サーバから取得した情報を前から、ルームで送信された情報は後ろから配列に入れることで、
//サーバから取得している間に送信されたメッセージも、取得後に送信されたメッセージも
//順番通りに格納されるようにする
function getHistoryes(Room){
  gettingChatTexts = true;
  ChatHistoryes.length = 0;
  
  ncmb.DataStore("chat")
  .equalTo("room", Room)
  .order("createDate",true)
  .limit( 1000 )
  .fetchAll()
  .then(function(results){
    if(Room != RoomID) return;

    for(let i = 0; i < results.length; i++)
      ChatHistoryes.unshift(results[i]);

    gettingChatTexts = false;

    console.log('getting');
  })
  .catch(function(err){
    console.log(err);
  });
}

//表示する区画を変更する
//view の 値は現在の区画を起点に、どれだけ動かすかを決めている
//負の数を入れると現在へ、正の数を入れると過去へ近づいていく
function changeShowScope(view){
  nowReplace = true;

  //そもそも全部表示されているなら何もしない
  if(ChatHistoryes.length <= LOAD) return;

  //区画が移動してもわかりやすいように
  //区画は隣接した区画と区画の2/5の要素を共有する
  let start = ChatHistoryes.length - 1 - (LOAD * 2 / 5) * (showMsgScope + view);
  if(start < 0){
    nowReplace = false;
    return;
  }
  else if(start < LOAD - 1) start = LOAD - 1;

  showMsgScope += view;

  //画面をクリアし、再表示
  clearMessage();
  for (var i = 0;i < LOAD;i++)
    showNCMBMessage(ChatHistoryes[start - i]);

  //最新まで飛ぶ時以外は区画移動時にスクロールを真ん中まで持ってくる
  if(view !== 0) $('#jsi-board').scrollTop(($('#jsi-board')[0].scrollHeight - $('#jsi-board').height() ) / 2);

  //連続して移動しすぎないように少し間を入れる
  setTimeout(function(){nowReplace = false;}, 100);
}

//チャット内容を取得して表示する関数
//過去の内容を一括で取得する部分と
//直近25(LOAD変数の値)件を取得する部分を非同期で行うことで
//履歴が多くなっても表示までの時間があまり長くならないようにしている
function LoadChat(Room, viewpoint = 'under'){
  nowReplace = true;
  //過去のチャット内容を取得
  getHistoryes(Room);

  ncmb.DataStore("chat")
  //ニフクラのデータベースにある”room”フィールドの値が今いるroomのIDと一致しているものだけ取得
  .equalTo("room", Room)
  //データベースに生成した日付で降順に整列させる
  .order("createDate",true)
  //読み込み上限だけ取得する
  .limit(LOAD)
  .fetchAll()  //データを取得
  .then(function(results) {
    clearMessage();
    //データの取得結果は配列で返ってくるのでfor文で処理
    for (var i = 0;i < results.length;i++) {
      var result = results[i];
      //画面に表示する関数を呼び出す。
      showNCMBMessage(result);
    }
    if(viewpoint === 'top') $('#jsi-board').scrollTop(0);
    setTimeout(function(){nowReplace = false;}, 100);
  })
  .catch(function(err){
    console.log('err'+err);
  });
}

//最新の部分へ移動
function jumpLastMsg(){
  if(!gettingChatTexts && showMsgScope !== 0){
    showMsgScope = 0;
    changeShowScope(0);
  }
  $('#jsi-board').scrollTop($('#jsi-board')[0].scrollHeight);
}


//ルーム内のスクロールの位置のよって最下層へ飛ぶボタンを非表示にする
function hideJumpButton(){
  canJumpLast = false;
   $('#jumpLastMessage').css({'bottom':'-8px'});
}


//ルーム内のスクロールの位置のよって最下層へ飛ぶボタンを表示する
function showJumpButton(){
  canJumpLast = true;
  $('#jumpLastMessage').css({'bottom':'48px'});
}

//ルームのチャット内容のスクロール時の処理
//すべてを表示すると重くなるため、区画分けして表示する
//上端についたら一つ前の区画、下端についたら一つ後の区画へ移動する
//最新の内容まで一気に飛ぶボタンの管理もここで行う
//最新の区画の下の方以外では表示し、その部分では非表示にする
function scrollHis(){
  var pos = parseInt($('#jsi-board').scrollTop());
  const bottom = $('#jsi-board')[0].scrollHeight - $('#jsi-board').height();

  //最下層の下のほうなら隠す
  if(canJumpLast && showMsgScope === 0 && bottom/7 < pos/6)
    hideJumpButton();
  //最下層以外もしくは上のほうなら表示する
  else if(!canJumpLast && (showMsgScope !== 0 || pos/6 <= bottom/7)) 
    showJumpButton();

  //読み込み中ならここで終わり
  if(nowReplace || gettingChatTexts) return;

  //端のまでスクロールしたら過去[最近]のログに切り替える
  if(pos < bottom/10) changeShowScope(1);
  else if( showMsgScope && bottom/10 < pos/9)
    changeShowScope(-1);
}