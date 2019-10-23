//会員の新規登録時に行う処理をまとめたもの
//会員の登録以外は行わないが
//登録処理が長かったため分割されている

function register(userId, password){
  var user = new User();

  user
  
  //情報の設定
  .set("userName",userId)
  .set("password",password)

  //設定した情報をもとに会員を登録  
  .signUpByAccount()
  
  .then(function(){
    ons.notification.alert('会員登録が完了しました');
  })
  .catch(function(err){
    ons.notification.alert('エラー発生：'+err);
    console.log(err);
  });
}