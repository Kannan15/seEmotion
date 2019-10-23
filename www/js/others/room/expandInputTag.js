//チャットテキスト入力欄の拡張機能を定義するためのファイル

function textInputerEvent(event){
  if( event.keyCode !== 13 ) return;

  const isDevice = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);

  //PCならシフトなしエンターキーを送信に対応させる
  if( !isDevice && !event.shiftKey ){
    event.preventDefault();
    $('#jsi-msg').blur();
    confirmationDialog.confirm();
  }
}

function setHeight(){
  var $textarea = $('#jsi-msg');
  var lineHeight = parseInt($textarea.css('lineHeight'));
  var lines = String($textarea.val() + '\n').match(/\n/g).length;
  $textarea.css('height', (lineHeight * lines) + 'px');
}