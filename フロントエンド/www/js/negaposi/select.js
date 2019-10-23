function addEmotion(event){
  nowEmo = event.target.value;
  if(nowEmo === "general") nowEmo = "";
}

function addDetail(event){
  nowTag = event.target.value;
  if(nowTag === "general") nowTag = "";
}

function editSelects(event) {
  pastCount = 0;
  ES = event.target.value;

  clearMessage();
  document.getElementById('tag-display').removeAttribute('modifier');

  var dumy = ncmb.DataStore("chat").equalTo("room",RoomID);
  if(event.target.value != "general") dumy = dumy.equalTo("tag",event.target.value);

	dumy
  .order("createDate",true)
  .limit(LOAD)
  .fetchAll()
  .then(function(results) {
    for (var i = 0;i < results.length;i++) {
      var result = results[i];
      showNCMBMessage(result);
    }
  })
  .catch(function(err){
    console.log(err);
  });
}