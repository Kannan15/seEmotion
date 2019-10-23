//ログイン[ログアウト]時に必要な処理をまとめて行う関数
//ログイン[ログアウト]のほか、
//参加中のルームの情報の整理などを行う

//ログイン時の処理
function login(userName, password){

  //ログイン
  ncmbUser
  .login(userName, password)
  .then(function(data){
    Room.CallStart = false;

    //サイドメニューの更新
    //ルームリストの生成
    callSplitterSet();

    //もし参加しているルームがあるなら
    //先頭に保存されているルームへ移動
    if(Room.array.length) Room.EnterRoom(Room.array[0]);
    else ReadyPage.setBodyContent();
  })
  .catch(function(err){
    ons.notification.alert('エラー発生：'+err);
  });
}

//ログアウト時の処理
function logout(){
 
  //ログアウト
  ncmbUser.logout();

  //ルームリストの消去
  Room.Close();

  //ホームページへ移動
  ReadyPage.setBodyContent();

  //サイドメニューの更新
  callSplitterSet();
}