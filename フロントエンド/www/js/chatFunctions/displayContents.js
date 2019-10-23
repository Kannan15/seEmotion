var longtap;

function LongTapCancel(){
  clearInterval(longtap);
}

function LongTapGo(id, text, room, uerId){
  longtap = setTimeout(function(){
    messageDialog.open();
  },300);
  messageDialog.ID = id;
  messageDialog.Text = text;
  messageDialog.Room = room;
  messageDialog.Speaker = uerId;
}

function clearMessage(){
  $('#jsi-board').empty();
}

function getColor(negaposi){
        if(+0.3 <= negaposi) return ' coral ';
  else  if(-0.3 <= negaposi) return ' white ';
  else  if(-1.0 <= negaposi) return '#80c1ff';
  else  /* invalid */        return '#ffd700';
}

function getListDesign(name, text, negaposi){
  return '<ons-list-item style="background-color:' + getColor(negaposi) + ';" class="ChatContent" tappable>' 
            +'<div class="pict"><img class="list-itemthumbnail" src="https://placekitten.com/g/40/40"></div>'
            +'<div class="text">'
            + '<span class="sender">' + name + '</span>'
            + '<span class="content">' + text + '</span>'
            +'</div>'
        +'<div class="polarity">' + parseFloat(negaposi).toFixed(3) + '</div>'
        +'</ons-list-item>';
}

function setOnEvent(target, details){
  const id = details.objectId;
  const text = details.text;
  const userId = details.userId;
  const room = details.room;
  if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i))
    $(target).on({
      'touchstart' : function(){LongTapGo(id, text, room, userId);},
      'touchend touchmove' : function(){LongTapCancel();}
    });
  else 
    $(target).on({
      'mousedown' : function(){LongTapGo(id, text, room, userId);},
      'mouseup' : function(){LongTapCancel();}
    });
}

function addContent(place, obj){
  var emo = obj.emotion;
  if(place === 'first') 
    $('#jsi-board').prepend(getListDesign(obj.name, obj.text, obj.negaposiValue) );
  else  {
    place = 'last';
    $('#jsi-board').append( getListDesign(obj.name, obj.text, obj.negaposiValue) );
  }
  setOnEvent('#jsi-board > ons-list-item:'+place+'-child', obj);
}

var showMessage = function(obj){
  let pos = $('#jsi-board').scrollTop();
  const bottom = $('#jsi-board')[0].scrollHeight - $('#jsi-board').height();
  addContent('last', obj);
  if(parseInt(pos) === bottom) $('#jsi-board').scrollTop($('#jsi-board')[0].scrollHeight);
}

var showNCMBMessage = function(obj){
  const size = $('#jsi-board')[0].scrollHeight;
  addContent('first', obj);
  $('#jsi-board').scrollTop($('#jsi-board').scrollTop()+$('#jsi-board')[0].scrollHeight - size);
}