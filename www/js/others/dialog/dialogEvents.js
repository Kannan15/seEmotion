//各ダイアログに付随する動作を
//ダイアログ別にまとめたオブジェクト群

//すべてに共通して Name, Init, open, closeが存在している
//これらはそれぞれダイアログのID, 開いたときに最初に呼び出される関数
//ダイアログを開く関数, ダイアログを閉じる関数でこの4つだけは全オブジェクトに存在している

//onKeyPress関数はinput要素を持つダイアログにのみ存在し、
//input要素内での改行入力時の動作や, 対象外の文字を検知するのにつかわれる

//call--で始まる関数はほかのダイアログを呼び出すための関数で
//この関数を使用すると、原則としてほかのダイアログを開いた後自身は閉じる

//その他の関数についてはダイアログの存在意義から類推すべし

const addRoomDialog = {
  Name: 'addRoom',
  Init: function(){
    return;
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  callJRoomPage: function(){
      this.close();
      joinARoomDialog.open();
    },
  callCRoomPage: function(){
    this.close();
    createANewRoomDialog.open();
  }
};

const createANewRoomDialog = {
  Name: 'createANewRoom',
  Init: function(){
    $('.Dialog #createANewRoomBody > #roomName').val('');
    $('.Dialog #createANewRoomBody > #roomName input').focus();
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  onKeyPress: function(event){
    if(event.keyCode !== 13 || event.shiftKey) return;
    $('.Dialog #createANewRoomBody > #roomName input').blur();
    $('.Dialog #createANewRoomBody > #decision').trigger('click');
  },
  createRoom: function(){
    const newRoomName = $('.Dialog #createANewRoomBody > #roomName').val();
    if(newRoomName === '') {
      ons.notification.alert('roomIdを入力してください');
      return;
    }
    createRoom(newRoomName);
    this.close();
  }
};

const joinARoomDialog = {
  Name: 'joinARoom',
  Init: function(){
    $('.Dialog #joinARoomBody > #roomId').val('');
    $('.Dialog #joinARoomBody > #roomId input').focus();
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  onKeyPress: function(event){
    if(event.keyCode !== 13 || event.shiftKey) return;
    $('.Dialog #joinARoomBody > #roomId input').blur();
    $('.Dialog #joinARoomBody > #decision').trigger('click');
  },
  joinRoom: function(){
    const newRoomID = $('.Dialog #joinARoomBody > #roomId').val();
    if(newRoomID === '') {
      ons.notification.alert('roomIdを入力してください');
      return;
    }
    if( Room.ExistInArray(newRoomID) ) {
      ons.notification.alert('既に参加しています');
      return;
    }
    joinRoom(newRoomID);
    this.close();
  }
};

const loginDialog = {
  Name: 'login',
  Init: function(){
    $('.Dialog #loginBody > #jsi-name').val('');
    $('.Dialog #loginBody > #jsi-password').val('');

    $('.Dialog #loginBody > #jsi-name input').focus();
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  onKeyPress: function(event, tags){
    if(event.keyCode !== 13) return;
    if(tags === 'userName'){
      if(event.shiftKey) return;
      $('.Dialog #loginBody > #jsi-password input').focus();
    }
    else if(tags === 'password'){
      if(event.shiftKey)
        $('.Dialog #loginBody > #jsi-name input').focus();
      else{
        $('.Dialog #loginBody > #jsi-password input').blur();
        $('.Dialog #loginBody > #decision').trigger('click');
      }
    }
  },
  callRegisterPage: function(){
      this.close();
      registerDialog.open();
  },
  Login: function(){
    const userName = $("#jsi-name").val();
    const password = $("#jsi-password").val();
    if( userName === '' || password === '' ){
      ons.notification.alert('error no name or password.');
      return;
    }
    login(userName, password);
    this.close();
  }
};

const registerDialog = {
  Name:  'register',
  Init: function(){
    $('.Dialog #registerBody > #userId').val('');
    $('.Dialog #registerBody > #password').val('');

    $('.Dialog #registerBody > #userId input').focus();
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  onKeyPress: function(event, tags){
    if(event.keyCode !== 13) return;
    if(tags === 'userId'){
      if(event.shiftKey) return;
      $('.Dialog #registerBody > #password input').focus();
    }
    else if(tags === 'password'){
      if(event.shiftKey)
        $('.Dialog #registerBody > #userId input').focus();
      else{
        $('.Dialog #registerBody > #password input').blur();
        $('.Dialog #registerBody > #decision').trigger('click');
      }
    }
  },
  Register: function(){
    var userId = $('.Dialog #registerBody > #userId').val();
    var password = $('.Dialog #registerBody > #password').val();
    const A = (userId === '');
    const B = (password === '');
    if ( A || B ) {
      ons.notification
        .alert( A ? 'userIdを入力してください'
                  : 'passwordを入力してください' );
      return;
    }
    register(userId, password);
    this.close();
  }
};

const messageDialog = {
  ID: null,
  Text: null,
  Room: null,
  Speaker: null,
  open: function(){
    ons.notification.alert({
      title: null,
      messageHTML: '<div style="height: 3em;">確認</div>',
      buttonLabels: ['コピー', 'ピン留め'],
      cancelable: true,
      callback: function(buttonNo){
        if(buttonNo === 0)
          messageDialog.Copy();
        else if(buttonNo === 1)
          messageDialog.SubmitPin();
      }
    });
  },
  Copy: function(){
    setClipBox( decodeText( this.Text ) );
  },
  SubmitPin: function(){
    SubmitPin(this.ID, this.Text, this.Room);
  }
};

const confirmationDialog = {
  Name: 'confirmation',
  Init: function(){
    var text = $('#jsi-msg').val();
    $('.Dialog #confirmationBody > #confirmSendText').html( encodeText(text) );
    $('.Dialog #confirmationBody > #confirmNegaposi').html(" <div class='waiting' id='negaposiValueWait'/> ");
    const value = assignNegaposiValue(text)
    .then(function(value){
      $('.Dialog #confirmationBody > #confirmNegaposi').html(value.toFixed(5));
    })
    .catch(function(err){
      console.log(err);
      $('.Dialog #confirmationBody > #confirmNegaposi').html('失敗');
    });//追加 var.a1.4.1(横山)
    return;
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  confirm: function(){
    console.log();
    if ($('#jsi-msg').val() === '') {
      //テキストが未入力だったら終了
      ons.notification
        .alert('メッセージを入力してください');
      return;
    }
    this.open();
  },
  Send: function(){
    let inform = {
      'room': RoomID,
      'text': encodeText( $('.Dialog #confirmationBody > #confirmSendText').text() ),
      'negaposiValue': ($('.Dialog #confirmationBody > #confirmNegaposi > .waiting').length) ? 0 : parseFloat( $('.Dialog #confirmationBody > #confirmNegaposi').text() ),
      'speaker': {
        'id':ncmbUser.getCurrentUser().get("objectId"),
        'name':ncmbUser.getCurrentUser().get("userName")
      }
    };
    console.log(JSON.stringify(inform));
    sendMsg( inform );
    this.close();
  }
};

const addWordDialog = {
  Name: 'addWord',
  Init: function(){
    $('.Dialog #addWordBody > #getRank').val(0);
    $('.Dialog #addWordBody > p > .posOutput').html(0);
    $('.Dialog #addWordBody > #getSurface').val('');
    $('.Dialog #addWordBody > #getReading').val('');
    $('.Dialog #addWordBody > #getNewPos select').val('動詞');

    $('.Dialog #addWordBody ons-input').removeClass("errorInputForm");

    $('.Dialog #addWordBody > #getSurface input').focus();
  },
  open: function(){
    openDialog(this.Name);
  },
  close: function(){
    closeDialog(this.Name);
  },
  check: function(event, tags){
    switch(tags){
    case 'read':
      var str = $('.Dialog #addWordBody > #getReading input').val();
      if(str === '' || str.match(/[^\u30a1-\u30f6\uff70\u30fc]/g)) {
        $('.Dialog #addWordBody > #getReading').addClass("errorInputForm");
        $('.Dialog #addWordBody > #getReading input').attr('placeholder', 'error');
        return false;
      }
      break;
    case 'surface':
      var str = $('.Dialog #addWordBody > #getSurface input').val();
      if(str === ''  || str.match(/[^\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3190-\u319f\u31f0-\u31ff\u3400-\u4DBf\u4e00-\u9fff]/g)) {
        $('.Dialog #addWordBody > #getSurface').addClass("errorInputForm");
        $('.Dialog #addWordBody > #getSurface input').attr('placeholder', 'error');
        return false;
      }
      break;
    }
    return true;
  },
  onKeyPress: function(event, tags){
    if(event.keyCode !== 13) return;
    if(tags === 'surface'){
      if(event.shiftKey) return;
      $('.Dialog #addWordBody > #getReading input').focus();
    }
    else if(tags === 'read'){
      if(event.shiftKey){
        $('.Dialog #addWordBody > #getSurface input').focus();
      }
      else{
        $('.Dialog #addWordBody > #getReading input').blur();
        $('.Dialog #addWordBody > p > .posOutput').trigger('click');
      }
    }
    else if(tags === 'rank'){
      $('.Dialog #addWordBody > #getReading input').blur();
      if(event.shiftKey)
        $('.Dialog #addWordBody > #getReading input').focus();
      else
        $('.Dialog #addWordBody > #getNewPos select').focus();
    }
    else if(tags === 'pos'){
      $('.Dialog #addWordBody > #getNewPos select').blur();
      if(event.shiftKey)
        $('.Dialog #addWordBody > p > .posOutput').trigger('click');
      else
        $('.Dialog #addWordBody > ons-button').trigger('click');
        
      event.preventDefault();
    }
  },
  onFocusInput: function(target, placeholder){
    $(target).removeClass('errorInputForm');
    $($(target)[0].children[0]).attr('placeholder', placeholder);
  },
  addWord: function(){
    var newSurface = $('.Dialog #addWordBody > #getSurface').val();
    var newReading = $('.Dialog #addWordBody > #getReading').val();
    var newRank = $('.Dialog #addWordBody > #getRank').val();
    var newPos = $('.Dialog #addWordBody > #getNewPos select').val();

    if( newSurface === '' || newReading === ''){
      ons.notification.alert({
        title: 'failure: add newWord',
        messageHTML: '情報が不足しています',
        buttonLabel: 'OK',
        animation: 'default',
        cancelable: true,
        callback: function() {
          console.log("情報不足");
        }
      });
      return;
    }
    else if(!!$('.Dialog #addWordBody .errorInputForm').length){
      ons.notification.alert({
        title: 'failure: add newWord',
        messageHTML: '情報の形態が間違っています',
        buttonLabel: 'OK',
        animation: 'default',
        cancelable: true,
        callback: function() {
          console.log("情報不足");
        }
      });
      return;
    }
    addWord(newSurface, newReading, newRank, newPos);
    this.close();
  }
};