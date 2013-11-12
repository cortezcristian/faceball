var mongoose = require('mongoose')
  , validate = require('mongoose-validate')
  , Schema = mongoose.Schema
  , crypto = require('crypto');

var administradorSchema = new Schema({
	nombre      : String,      
	email       : { type: String, required: true, validate: [validate.email, 'email no valido'] }, 
	password    : String  
});

/**
 * Ponemos un Hook a save
 * http://mongoosejs.com/docs/api.html#schema_Schema-pre
 */

administradorSchema.pre("save", function(next) {
    if(this.isModified('password'))
        this.password = crypto.createHash('md5').update(this.password).digest("hex");
    next();
});

administradorSchema.method('authenticate', function(password) {
    console.log("==>", crypto.createHash('md5').update(password).digest("hex") === this.password);
    return crypto.createHash('md5').update(password).digest("hex") === this.password;
});

module.exports = mongoose.model('Administradores', administradorSchema);
