//ボディーを room.html[ready.html] にするための関数

//頻繁に呼び出される関数だが
//ページ遷移と遷移後の必要な処理しか行っていないため非常に簡素

const ReadyPage = {
  path: 'html/ready.html',
  setBodyContent: function(){
    RoomID = null;
    fn.load(this.path);
  }
};

const RoomPage = {
  path: 'html/room.html',
  setBodyContent: function(roomId){
    pastCount = 0;
    RoomID = roomId;
    fn.load(this.path);
    LoadChat(roomId, null);
  }
};