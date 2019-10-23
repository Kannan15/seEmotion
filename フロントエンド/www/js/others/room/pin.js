//ピン留め機能を定義しているファイル
//expandクラスを継承しているのでそちらも確認するとよい

//基本的に 表示系 ピン留めの状態の取得系・変更系の3つの系統に分かれていて
//DrawList, LoadPin, Pdelete. submitPinの４つ以外は重要ではなく
//この４つを補助するために実装されている

//Pdelete submitPin はサーバへピン留めの状態の変更を通知するための関数
//どちらが削除でどちらが追加なのかは関数名から推測可能

//DrawList は表示系の関数で、表示に直接かかわる関数はこれのみ

//LoadPin はルーム入室時にルーム内のピン留めの状態をまとめて取得するための関数で、
//入室のタイミングでピン留めされているテキストはこの関数によって取得している

//上記以外の関数で Pass という関数があるが、
//この関数は入室後にピン留めの状態が変更されたときにその情報を
//サーバからこの関数へ受け渡すための中継用の関数

function pin(NameTag, FuncName) {
  this.TextArray = new Array;
  this.ID = NameTag;
  this.FName = FuncName;
  this.CallFanctionNameAtClick = this.FName + ".ClickAction()";
  this.MAXHEIGHT = parseInt(parseInt(window.innerHeight) * 0.55);
  this.isDel = false;
  this.lastCall = "Close";
  this.ClickAction = function(){
    if( this.array.length == 0 || this.isDel) return ;

    this.isCheck = !(this.isCheck);

    this.DrawList('ClickAction');
  };

  this.DrawList = function (caller) {
    var pick="";
    for( let i = 0; i <= this.array.length; i++ ) {
      if( i== 0 ) {
        pick = "<div class=\"lavel\" onClick=\"" + this.CallFanctionNameAtClick + "\"><div class=\"title\">ピン留め 一覧</div></div>";
        if(1 <= this.array.length) pick += '<div class="scroll">';
      }
      if(this.isCheck && i < this.array.length){
        pick += '<ons-list-item class="content">'
                    +'<div class="text">' + this.TextArray[i] + '</div>'
                    +'<input class="listButton" id="del" type="button" value="del" onClick="excludePin(' + i + ')">'
                    +'</ons-list-item>';
      }
    }
    if( pick == undefined ) pick = "";
    else if( 1 <= this.array.length ) pick += '<div id="bottom"></div></div>';

    //スクロール可能かつ終端までスクロールしていたら、更新後も終端に移動しているようにする
    let bottom = $('#' + this.ID + ' .scroll').scrollTop();
    if(bottom === null) bottom = 0;
    $('#' + this.ID + ' .scroll').scrollTop(bottom+1000);
    if( parseInt(document.getElementById(this.ID).style.height) === this.MAXHEIGHT &&
        bottom === $('#' + this.ID + ' .scroll').scrollTop() ) bottom = -1;

    document.getElementById(this.ID).innerHTML=pick;
    if(caller === "ClickAction") this.preventScrollBar();

    //必要な高さの取得
    this.OpenSize = this.GetPinsHeight() + parseInt(getComputedStyle(document.getElementById(this.ID)).getPropertyValue('--ClosedHeightSize'));

    //高さを指定
    this.SetHeightSize();
    if(bottom === -1) bottom = this.GetPinsHeight();
    $('#' + this.ID + ' .scroll').scrollTop(bottom);
  };
  
  this.GetPinsHeight = function (){
    const LIST = $('#' + this.ID + ' .scroll').children();
    const LIST_LENGTH = $('#' + this.ID + ' .scroll > ons-list-item').length;
    let HeightSize = 0;

    for( let i = 0; i < LIST_LENGTH; i++ )
      HeightSize += LIST[i].offsetHeight;
 
    return HeightSize;
  };

  this.AddArray = function(obj){
    delete this.TextArray;
    this.TextArray = new Array;

    for(let i = 0; i < obj.length; i++){
      this.array.push(obj[i].objectId);
      this.TextArray.push(obj[i].text);
    }
  };

  this.LoadPin = function(Room){
    ncmb.DataStore("chat")
    .equalTo("room",Room)
    .equalTo("pinned",true)
    .order("updateDate",false)
    .fetchAll()
    .then((results) => this.AddArray(results))
    .then(this.DrawList(null))
    .catch(function(err){
      console.log(err);
    });
  };

  this.Del = function (elem) {
    this.isDel = true;

    this.array.splice(elem, 1);
    this.TextArray.splice(elem, 1);

    this.DrawList(null);
    this.isDel = false;
  };

  this.Open = function (Room){
    if(this.lastCall === "Open") return;
    this.lastCall = "Open";

    document.getElementById(this.ID).style.width = '100%';
    document.getElementById(this.ID).style.transitionDelay = '0.5';

    this.LoadPin(Room);

    this.setEvent();
  };

  this.Close = function (){
    if(this.lastCall === "Close") return;
    this.isCheck = false;
    this.lastCall = "Close";

    document.getElementById(this.ID).style.transitionDelay = '0';
    document.getElementById(this.ID).style.height = document.getElementById(this.ID).style.width = '0px';

    this.array = [];

    this.resetEvent();
  };
  
  this.Add = function(NewId,NewText){
    this.array.push(NewId);
    this.TextArray.push(NewText);
  };
};

pin.prototype = new Expandable();

const Pin = new pin("pickup", "Pin");

function Pass(NewId,NewText){
  if(Pin.ExistInArray(NewId) == true) return; 
  Pin.Add(NewId,NewText);
  Pin.DrawList(null);
  ons.notification.toast({
      message: "メッセージがピン留めされました。",
      animation: 'fall',
      timeout: 2000
  });
};

function Pdelete(targetId){
  if(Pin.ExistInArray(targetId) === false) return; 
  Pin.Del(Pin.array.indexOf(targetId));
};

function SubmitPin(ID, Text, room){
  console.log(ID);
  console.log(Text);
  console.log(room);
  ncmb.DataStore("chat")
  .equalTo("objectId", ID)
  .fetchAll()
  .then(function(results){
    results[0]
    .set("pinned", true)
    .update()
    .then(function(){
      pinMsg({'id': ID, 'text': Text, 'pinned': true, 'room':room});
    });
  })
  .catch(function(err){
    console.log(err);
  });
}

function excludePin(elem){
  let Text = Pin.TextArray[elem];
  let ID = Pin.array[elem];
  let roomId = RoomID;

  const callbackPinMsg = function(results){
    results[0]
    .set("pinned", true)
    .update()
    .then(function(){
      pinMsg({'id': ID, 'text':results[0].get('text'),'pinned':true,'room':roomId});
    });
  };

  const elasePinMsg = function(){
    pinMsg({'id': ID, 'text':Text,'pinned':false,'room':roomId});
    if(roomId !== RoomID) return;
    ons.notification.toast({
      message: "メッセージがピンから外されました。",
      animation: 'fall',
      buttonLabel: "取り消し",
      cancelable: true,
      timeout: 2000,
      callback: function(event){
        if(event != 0) return;
        ncmb.DataStore("chat")
        .equalTo("objectId", ID)
        .fetchAll()
        .then( (results) => callbackPinMsg(results) )
        .catch(function(err){
          console.log(err);
        });
      }
    });
  }

  ncmb.DataStore("chat")
  .equalTo("objectId", ID)
  .fetchAll()
  .then(function(results){
    results[0]
    .set("pinned", false)
    .update()
    .then( (temp) => elasePinMsg() );
  })
  .catch(function(err){
    console.log(err);
  });
}