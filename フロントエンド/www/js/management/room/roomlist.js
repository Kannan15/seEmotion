function room(NameTag, FuncName){
  this.MAXHEIGHT = 400;
  this.ID = NameTag;
  this.CallStart = false;
  this.CallFanctionNameAtClick = FuncName + ".ClickAction()";
  this.ClickButton = false;
  this.narray = new Array;

  this.Del = function (elem) {
    this.ClickButton = true;
    const userId = ncmbUser.getCurrentUser().get("objectId");
    const roomId = this.array[elem];
    this.array.splice(elem, 1);
    this.narray.splice(elem, 1);
    if(this.array.length === 0) this.isCheck = false;
    this.DrawList(null);

    exitRoom(roomId,userId);
  };

  this.DrawList = function (caller) {
    var pick="";
    for( let i = 0; i <= this.narray.length; i++ ) {
      if( i== 0 ) {
        pick = '<div class="lavel" onClick="' + this.CallFanctionNameAtClick + '"><div class="title">ルーム一覧</div></div>';
        if(1 <= this.narray.length)
          pick += '<div class="scroll">';
      }
      if(this.isCheck && i < this.narray.length){
        pick += '<ons-list-item class="content" onclick="' + FuncName + '.EnterRoom(' + "'" + this.array[i] + "'" + ')"  tappable>'
                    +'<div class=\"text\">' + this.narray[i] + '</div>'
                    +'<input class="listButton" type="button" value="del" onClick="' + FuncName + '.Del(' + i + ')">'
                    +'</ons-list-item>';
      }
    }
    if( pick === undefined ) pick = "";
    else if( 1 <= this.array.length ) pick += "</div>";

    document.getElementById(this.ID).innerHTML=pick;
    if(caller === 'ClickAction') this.preventScrollBar();

    this.OpenSize = this.array.length * this.ListSize + parseInt(getComputedStyle(document.getElementById(this.ID)).getPropertyValue('--ClosedHeightSize'));

    this.SetHeightSize();
  };

  this.Start = function(){
    if(this.CallStart) return;
    this.CallStart = true;
    let user = ncmbUser.getCurrentUser();
    if(!!user === null) return;
    let Idlist = user.get('roomId');
    let Namelist = user.get('roomName');
    for(let i = 0; i < Idlist.length; i++)
      Room.AddRoom(Idlist[i], Namelist[i]);
    Room.DrawList(null);
    
    document.getElementById(this.ID).style.width = '100%';
    document.getElementById(this.ID).style.transitionDelay = '0.5';
    this.setEvent();
  };

  this.Close = function(){
    this.CallStart = false;

    this.array = [];
    this.narray = [];

    document.getElementById(this.ID).style.transitionDelay = '0';

    this.DrawList(null);

    return true;
  };

  this.AddRoom = function(ID, Name){
    this.array.push(ID);
    this.narray.push(Name);
  };

  this.EnterRoom = function(Room){
    if(this.ClickButton === true){
      this.ClickButton = false;
      return;
    }
    RoomPage.setBodyContent(Room);
    getOtherUsers();
  };

  this.duplArray = function(){
    return this.array.slice(0, this.array.length);
  };

  this.duplNArray = function(){
    return this.narray.slice(0, this.narray.length);
  };
};

room.prototype = new Expandable();

const Room = new room("List", "Room");

function RPass(newRoomId, newRoomName){
  if(Room.ExistInArray(newRoomId) == true || newRoomId === '') return; 
  Room.AddRoom(newRoomId, newRoomName);
  Room.DrawList(null);
}