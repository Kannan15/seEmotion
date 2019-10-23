window.fn = {};

window.fn.open = function(a) {
  var menu = document.getElementById(a);
  menu.open();
  callSplitterSet();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  var sub = document.getElementById('sub');
  if(Room.CallStart){
    Room.isCheck = false;
    Room.DrawList();
  }
  return content.load(page)
    .then(menu.close.bind(menu))
    .then(sub.close.bind(sub));
};