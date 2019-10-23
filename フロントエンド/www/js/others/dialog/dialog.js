var Dialog = new Array;
var DialogName = new Array;

function createDialog(dialog, mode) {
  Dialog.push(Object);    //ダイアログのオブジェクトを保持
  DialogName.push(dialog);//ダイアログの名前を保持
  const PATH = 'html/dialog/' + dialog + '.html';
  const pushDialog = function(newDialog,entry){
    Dialog[entry] = newDialog;
    if(mode)
      setTimeout(function(){
        openDialog(DialogName[entry]);
      },50);
  };
  ons.createDialog(PATH).then( (result) => pushDialog( result, DialogName.indexOf(dialog) ) );
  return;
}

function openDialog(dialogName){
  const temp = DialogName.indexOf(dialogName);
  if(temp === -1)//初回のときに作成する
    createDialog(dialogName, true);
  else{
    Dialog[ temp ].show();
    runJSCode(dialogName + 'Dialog.Init();');
  }
}

function closeDialog(dialogName){
  const temp = DialogName.indexOf(dialogName);
  if(temp === -1) return;
  Dialog[ temp ].hide();
}