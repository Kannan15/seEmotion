const ncmbRooms = {
  searchRoom: function(roomId){
    return ncmb.DataStore("room")
              .equalTo("objectId",roomId)
              .fetchAll();
  },

  joinRoom: function(roomId){

    //ここからコールバック関数の宣言

    const joinProcess = function( results ){

      if(results.length === 0)
        throw 'cannot find to Room by RoomID';

      var user = ncmbUser.getCurrentUser();

      if( user ){
        results[0]
        .add("entrants", user.get("objectId") )
        .update();
      }

      return results;
    };

    //までコールバック関数の宣言

    return this.searchRoom(roomId)
              .then( (result) => joinProcess(result) );
  },

  createRoom: function(roomName){
    const newroom = ncmb.DataStore("room");
    const newRoom = new newroom();

    const user = ncmbUser.getCurrentUser();

    return newRoom.set("roomName", roomName)
                  .set("entrants", Array( user.get("objectId") ) )
                  .save();
  }
};