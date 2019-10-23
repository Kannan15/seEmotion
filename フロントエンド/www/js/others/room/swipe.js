//ルームの一番上にあるルーム名・ルームIDの切り替え部分の処理
//directionは名前→IDかID→名前かを記録する変数
//delayはアニメーションの長さ
//swipe関数は実際に入れ替える関数
//onClickSwipeIdは上にIDが表示されているときに
//クリックすると出てくるログを定義している関数

var direction = 0;
const delay = 200;

function swipe(mode){
  if(mode === 'set') direction = 0;
  $('#RoomTitle > .swiper-Id').stop();
  $('#RoomTitle > .swiper-Name').stop();
  $('#RoomTitle > .swiper-Button').toggleClass('swiper-Button_opened');
  if(direction == 0) {
    $('#RoomTitle > .swiper-Name').animate({'width': '89%'}, {'duration': delay});
    $('#RoomTitle > .swiper-Id').animate({'width': '0%'}, {'duration': delay});
  }
  else  {
    $('#RoomTitle > .swiper-Id').animate({'width': '89%'}, {'duration': delay});
    $('#RoomTitle > .swiper-Name').animate({'width': '0%'}, {'duration': delay});
  }
  direction = 1 - direction;
}

function onClickSwipeId(){
  const ROOMID = $('#RoomTitle > .swiper-Id').html();
  ons.notification.alert({
    title: '確認',
    message: 'RoomIdをコピーしますか？',
    buttonLabel: ['いいえ','はい'],
    animation: 'default',
    cancelable: true,
    callback: function(event){
      if(event===1) setClipBox($('#RoomTitle > .swiper-Id').html());
    }
  });
}