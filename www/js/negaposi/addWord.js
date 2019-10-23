function addWord(newSurface,newReading,newRank,newPos){
  if( newSurface === '' ||
      newReading === '' ||
      newRank    === '' ||
      newPos     === '' ) return;

  Dict.setData(newSurface, newReading, newPos, newRank);
  Dict.reflectLocalStrage();

  ons.notification.alert({
    title: 'success: add newWord',
    messageHTML: '登録が完了しました',
    buttonLabel: 'OK',
    animation: 'default',
    cancelable: true,
    callback: function() {
      console.log('successful add newWord');
      closeDialog('addWord.html');
      var jsonFinalConfirm = localStorage.getItem('Dict');
      var jsFinalConfirm = JSON.parse(jsonFinalConfirm);
      console.log(jsFinalConfirm);
    }
  });
}

function posChanged(value) {
  document.querySelector('.posOutput').innerHTML = value;
}

function reflectRank(value){
  $('.Dialog #addWordBody > #getRank').val(value);
  $('.Dialog #addWordBody > #getRank').trigger('input');
}

var shiftkeyPressed = false;

function inputRank(){
  const f = function(event){
    shiftkeyPressed = event.shiftKey;
  };
  window.addEventListener('keydown', (f)(event), false);
  ons.notification.prompt({
    message: '極性値を入力してください',
    defaultValue: $('.Dialog #addWordBody > #getRank').val(),
    autofocus: true,
    inputType: 'number',
    animation: 'default',
    cancelable: true,
    callback: function(value) {
      if(value === '') return;
      value = parseFloat(value);
      if(value < -1) value = -1;
      else if(1 < value) value = 1;
      reflectRank(value);
      addWordDialog.onKeyPress({keyCode:13,shiftKey:shiftkeyPressed},'rank');
      document.removeEventListener('keydown', f);
    }
  });
}