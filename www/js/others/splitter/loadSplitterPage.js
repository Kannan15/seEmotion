//サイドメニューの更新用の関数群   上から、
//右サイドの下にあるユーザー名表示欄の更新
//ログイン状況に応じてボタンの有効無効を切り替えるために
//各ボタンのイベントを取得する部分
//上二つを実行し、ログイン状況に応じてボタンのUIやイベントの設定を更新する部分

//この3つの関数が存在している

var onClickEventList = null;

function writeUserName(UserName){
  if(UserName === null) {
    const currentUser = ncmbUser.getCurrentUser();
    if(currentUser) $('#displayUserName').html(currentUser.get("userName"));
    else $('#displayUserName').html("");
  }else $('#displayUserName').html(UserName);
  return;
}

function storeSplitterButtonClickEvents(){
  var $obj = $("#splitterList > ons-list-item");
  onClickEventList = new Array;
  for(let i = 0; i < $obj.length; i++)
    onClickEventList.push($obj.get(i).onclick);
}

function callSplitterSet(){
  
  writeUserName(null);
  
  if(onClickEventList === null) storeSplitterButtonClickEvents();
  
  let temp;
  let func;
  const TappabledCss = 'color: #333;';
  const unTappabledCss = 'color: #aaa;';
  const currentUser = ncmbUser.getCurrentUser();
  const $buttons = $("#splitterList > ons-list-item");
  
  for(let i = 0; i < $buttons.length; i++){
    temp = $buttons.get(i).dataset.enable;
    if(temp === "always" || undefined === temp) continue;
    if( (temp === "duringLogin" && currentUser) ||
        (temp === "duringLogout" && !currentUser)
      ){
      func = String(onClickEventList[i]).slice(26);
      $("#splitterList > #"+$buttons.get(i).id).replaceWith('<ons-list-item id="'+$buttons.get(i).id+'" style="'+TappabledCss+'" onclick="' + func.slice(0,func.length-1) + '" data-enable="'+temp+'" tappable>'+$("#splitterList > #"+$buttons.get(i).id).text()+'</ons-list-item>');
    }
    else{
      $("#splitterList > #"+$buttons.get(i).id).replaceWith('<ons-list-item id="'+$buttons.get(i).id+'" style="'+unTappabledCss+'" data-enable="'+temp+'">'+$("#splitterList > #"+$buttons.get(i).id).text()+'</ons-list-item>');
    }
  }

  if(currentUser){
    $('#splitterList > #List').css('opacity', 1);
    Room.Start();
  }else $('#splitterList > #List').css('opacity', 0);
}