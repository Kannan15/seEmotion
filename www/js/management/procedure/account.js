//会員管理システム用のクラス

//連鎖処理のために基本的にPromiseを返す

//private変数・関数の実現のために一部シンボルを使用

//ログイン中の会員の情報は localStrage に保存する

//関数名や使い方は ncmb の User() によせている

//階層構造が深くなるのを避けるために先にコールバック関数を宣言しておく
//join, exit, nameNewAccount 等が該当する

//ログイン状態の可否は
//ローカルに情報があるか否かで判断しているので
//ローカルストレージを初期化することでログアウト状態とする
//逆に、ローカルに情報がある場合はログイン状態とする

//最下行に ncmbUser が定義されているので、新規登録の時以外はこれを利用すべし

const User = (() => {
  //private領域へのアクセス用のシンボル
  const CurrentUser = Symbol();
  const setCurrentUser = Symbol();
  const newAccount = Symbol();

  const getUserStatus = Symbol();

  const detectChange = Symbol();

  //ログイン中のユーザの情報を格納するパス
  const storagePath = 'kadaikenkyuu/ChatApp/CurrentUser';

  //"会員情報格納用のオブジェクト"のひな形
  var proto = {
    "userName": null,
    "password": null,
    "objectId": null,
    "roomId":null,
    "roomName":null,
    "mailAddress":null,
    "mailAddressConfirm":null,
    "sessionToken": null,
    "createDate": null,
    "updateDate": null,
    "authData":null
  };

  //クラスを返す -> new演算子の後ろにこの関数を呼び出すことで使用する
  return class {
    constructor() {
      this[CurrentUser] = {
        Detail: null,
        get: function(key){
          return this.Detail[key];
        }
      };

      //状態取得関数群
      //キーは取得する情報の名前
      //基本的に引数に取った情報と等しいかを比較する
      //この関数は必要に応じて拡張する
      //今はルームID以外を比較する必要性はないのでメンバは1つのみ
      this[detectChange] = {
        "room": function(content){
          return this.getCurrentUser().get('roomId').indexOf(content) === -1;
        }
      };

      this.instans = this;
      
      this[newAccount] = false;
    }

    E() {//こいつだけは何とかしたい

    }

    //サーバに保存されている情報を持ってくる
    get() {
      const user = this.getCurrentUser();

      const setCurrent = function( result, sync ){
        if(result[0]) sync[setCurrentUser]( result[0] );
        return result;
      }

      return ncmb.DataStore("account")
                .equalTo('objectId', user.get('objectId'))
                .fetchAll()
                .then( (result) => setCurrent( result, this ) );
    }

    //会員登録用 -> 会員情報のセッタ
    set( key, item ) {
      
      //必要な情報は userName と password のみなのでそれ以外は無視する
      if( Array("userName","password").indexOf(key) === -1) this.instans;

      if(this[newAccount] === false){
        //会員情報の初期化
        this[CurrentUser] = {
          "userName": null,
          "password": null,
        };
        
        this[newAccount] = true;
      }

      this[CurrentUser][key] = item;
      return this.instans;
    }
    
    //複数デバイスで一つのアカウントを扱うことを許容したため、
    //他デバイスで増やされたルーム情報を取得できない
    //次のような手段で対処する
    //1.自分(アカウント)が操作中の端末では参加していないルームで発言したら自動で参加
    checkStatus(data){
      const user = this.getCurrentUser();

      //ログインしていない又は自分のアカウントではないなら無視
      if( !user || data.userId !== user.get('objectId') ) return;
      
      if( this[detectChange]['room'](data.room) )
        this.get().then(function( result ){
          const roomName = result[0].roomName[  result[0].roomId.indexOf(data.room) ];
          RPass( data.room, roomName );
        });
    }

    //private関数  記述 ==> [functionName](argument) { process }
    [setCurrentUser](obj) {
      var detail = proto;

      detail['userName'] = obj.userName;
      detail['password'] = obj.password;
      detail['objectId'] = obj.objectId;
      detail['roomId'] = obj.roomId;
      detail['roomName'] = obj.roomName;
      detail['createDate'] = obj.createDate;

      localStorage.setItem(storagePath, JSON.stringify(detail));
    }

    //ログイン時はログインしている会員の情報を、それ以外の時は null を返す
    getCurrentUser() {
      if(this[newAccount]) return this.E();

      const getCurrentUserDetail = localStorage.getItem( storagePath );

      this[CurrentUser].Detail = JSON.parse(getCurrentUserDetail);
      if(this[CurrentUser].Detail === null) return null;
      else return this[CurrentUser];
    }

    //新規で会員を作成する
    signUpByAccount() {
      if(!this[newAccount]) return this.E();

      //ここからコールバック関数の宣言

      const makeNewAccount = function(result, sync){
        if( result.length !== 0 )
          throw 'すでに使用されている名前です';

        var Account = ncmb.DataStore("account");
        var account = new Account();

        //アカウント作成処理の後にアカウントの情報でログインする
        const callbackfunc = function(result, sync){
          sync[setCurrentUser](result);
          return result;
        }

        return account
              .set( 'userName', sync[CurrentUser]['userName'] )
              .set( 'password', sync[CurrentUser]['password'] )

              //新規作成時は参加しているルームの情報は 空配列で初期化する
              .set( 'roomId', [] ) // (empty-list)
              .set( 'roomName', [] ) // (empty-list)
              
              .save()
              .then( (results) => callbackfunc(results, sync) );
      };

      //ここまでコールバック関数の宣言

      //ニフクラに会員の情報の生成を要求
      return ncmb.DataStore("account")
              .equalTo('userName', this[CurrentUser]['userName'])
              .fetchAll()
              .then( (result) => makeNewAccount(result, this) );
    }

    [getUserStatus](){
      //重複することのない objectId でログイン中の会員の情報を検索する
      return ncmb.DataStore("account")
                .equalTo('objectId', this.getCurrentUser().get('objectId'))
                .fetchAll();
    }

    joinRoom(roomId, roomName){

      //ここからコールバック関数の宣言

      const join = function( result, sync ){
        //取得した会員情報のルームの情報に
        //新しく参加したルームの情報を追加する (末尾に追加する)
        result[0].roomId.push(roomId);
        result[0].roomName.push(roomName);

        //ローカルに卸してきている会員情報にも同様に追加
        var currentDetail = sync.getCurrentUser();
        currentDetail.Detail['roomId'] = result[0].roomId;
        currentDetail.Detail['roomName'] =  result[0].roomName;

        //追加した情報で更新する
        sync[setCurrentUser](currentDetail.Detail);
        result[0].update();
        
        return result;
      }

      //ここまでコールバック関数の宣言

      this[getUserStatus]()
          .then( (results) => join( results, this ) );
    }

    exitRoom(roomId){

      //ここからコールバック関数の宣言

      const exit = function( result, sync ){

        //配列のどの位置にいるかを取得する
        const index = result[0].roomId.indexOf(roomId);
        
        //いないなら何もしない
        if( index === -1 ) return result;

        //ルームの情報(Id と Name)を抜き取る
        result[0].roomId.splice(index, 1);
        result[0].roomName.splice(index, 1);

        //ローカルに卸してきている会員情報にも同様に追加
        var current = sync.getCurrentUser();
        current.Detail['roomId'] = result[0].roomId;
        current.Detail['roomName'] =  result[0].roomName;

        //追加した情報で更新する
        sync[setCurrentUser](current.Detail);
        result[0].update();

        return result;
      };

      //ここまでコールバック関数の宣言

      this[getUserStatus]()
          .then( (results) => exit( results, this ) );
    }

    login(userName, password) {

      //ここからコールバック関数の宣言

      //指定した名前の会員が存在しない、
      //またはパスワードが誤っている場合エラーを返す
      const callbackfunc = function(result, sync){

        //例外処理

        //ヒットしなかった
        if(result.length !== 1)
          throw '指定されたアカウントが発見できませんでした';

        //パスワードが誤っている
        else if(result[0].password !== password)
          throw 'パスワードが間違っています';
        
        //ログイン
        sync[setCurrentUser](result[0]);

        return result;
      };

      //ここまでコールバック関数の宣言

      //名前は重複しないので,検索結果が一つに絞れる

      return ncmb.DataStore("account")
                .equalTo("userName", userName)
                .fetchAll()
                .then( (results) => callbackfunc(results, this) );
    }

    logout() {
      //ローカルストレージの初期化
      localStorage.removeItem( storagePath );
    }
  }
})();

const ncmbUser = new User();