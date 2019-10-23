//ここには クリップ機能や expandクラス等の
//メイン機能をサポートする目的で実装された関数のみ記述している

//現在は5つ存在していて
//上から、コードインジェクション対策
//上から、テキストをjsの関数に変換して実行するプログラム
//(これは dialog の初期化処理の実行で使われている)
//クリップボードに保存する機能
//expandクラスの実装である
//今後増える可能性はあるが、この部分は重要ではないため
//完全に理解する必要はなく、存在の把握程度で十分なはず

function encodeText(text){
  return text.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
function decodeText(text){
  return text.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
}

function runJSCode(code){
  try{
    Function(code)();
  }catch(e){
    console.log(e)
  }
}

//引数にとった値をクリップボックスに入れる
function setClipBox(value){
  // テキストエリアを作り、
  // IDと値をセットする
  const copyFrom = document.createElement("textarea");
  copyFrom.setAttribute('id', 'CopyFormThisArea');
  copyFrom.textContent = value;

  copyFrom.addEventListener('click', function(){
    // テキストエリアの値を選択し、
    // コピーコマンド発行
    this.select();
    console.log(document.execCommand('copy'));
  })

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    document.querySelector('textarea#CopyFormThisArea').readOnly = false;
    document.querySelector('textarea#CopyFormThisArea').contentEditable  = true;
  }

  // 子要素にテキストエリアを配置
  document.body.appendChild(copyFrom);

  //コピーイベントを発火
  $('textarea#CopyFormThisArea').trigger('click');

  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    document.querySelector('textarea#CopyFormThisArea').readOnly = true;
    document.querySelector('textarea#CopyFormThisArea').contentEditable  = false;
  }

  document.body.removeChild(copyFrom);
};

function Expandable (){
  this.array = new Array;
};
Expandable.prototype.ID = 0;
Expandable.prototype.MAXHEIGHT = -1;//-1の場合は無制限
Expandable.prototype.OpenSize = 50;
Expandable.prototype.ListSize = 50;
Expandable.prototype.isCheck = false;
Expandable.prototype.CallFanctionNameAtClick = "Expandable.ClickAction()";
Expandable.prototype.ExistInArray = function(data){
  return (this.array.indexOf(data) === -1)?false:true;
};
Expandable.prototype.SetHeightSize = function(){
  const MINSIZE = String(getComputedStyle(document.getElementById(this.ID)).getPropertyValue('--ClosedHeightSize')).trim();
  if( this.array.length === 0 || !this.isCheck) {
    if(this.array.length === 0) this.isCheck = false;
    document.getElementById(this.ID).style.height = MINSIZE;
  }else{
    if( this.OpenSize < this.MAXHEIGHT || this.MAXHEIGHT === -1 )
      document.getElementById(this.ID).style.height = String(this.OpenSize+'px');
    else
      document.getElementById(this.ID).style.height = String(this.MAXHEIGHT+'px');
  }
};
Expandable.prototype.DrawList = function () {
  var pick="";
  for( let i = 0; i <= this.array.length; i++ ) {
    if( i== 0 ) {
      pick = "<div class=\"lavel\" onClick=\"" + this.CallFanctionNameAtClick + "\">" + "<div class=\"text\">Expandable</div></div>";
      if(1 <= this.array.length)
        pick += "<div id=\"scroll\">";
    }
    if(this.isCheck && i < this.array.length)
      pick += "<li><div class=\"text\">" + this.array[i] + "</div></li>";
  }

  if( pick == undefined ) pick = "";
  else if( 1 <= this.array.length ) pick += "</div>";

  document.getElementById(this.ID).innerHTML=pick;

  this.OpenSize = this.array.length * this.ListSize + parseInt(getComputedStyle(document.getElementById(this.ID)).getPropertyValue('--ClosedHeightSize'));
  this.SetHeightSize();
};
Expandable.prototype.ClickAction = function(){
  if( this.array.length <= 0 ) return;

  this.isCheck = !(this.isCheck);

  this.DrawList('ClickAction');
};
Expandable.prototype.preventScrollBar = function(){
  $('#'+this.ID + ' .scroll').css({'overflow-y':'hidden'});
}
Expandable.prototype.setEvent = function(){
  this.resetEvent();
  this.setEvent();
};
Expandable.prototype.resetEvent = function(){
  this.setEvent = function(){
    $('#'+this.ID).on('transitionend', function(){
      $(this).find('.scroll').css({'overflow-y':'auto'});
    });

    this.setEvent = function(){return;};
  };
};