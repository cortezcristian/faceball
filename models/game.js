var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var gameSchema = new Schema({
    canvas: {
        players: []
    }
});

gameSchema.statics.returningGame = function (id, sN, cb) {
      this.findOne({ identity: id, socialNetwork : sN }, cb);
}

gameSchema.statics.login = function (idGame) {
      this.findOne({ identity: idGame }, function(err, game){
        if(game!=null){
          game.online = true;
          game.save();
        }
      });
}

gameSchema.statics.logout = function (idGame) {
      console.log('Logout');
      this.findOne({ identity: idGame }, function(err, game){
        if(game!=null){
          game.online = false;
          console.log("goodbybe!");
          game.save();
        }
      });
}

gameSchema.statics.findByGamename = function (gamename, cb) {
      this.find({ name: new RegExp(gamename, 'i') }, cb);
}

module.exports = mongoose.model('Games', gameSchema);
