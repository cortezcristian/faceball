var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var personaSchema = new Schema({
	nombre      : String,      
	cargo       : String  
});

personaSchema.static("buscarAlumnos", function(cb){
   this.find({cargo:"Alumno"}, function(err, r){
        cb(r);    
   });    
});

personaSchema.static("eliminarAlumno", function(id, cb){
   this.remove({_id:id, cargo:"Alumno"}, function(err){
        cb();    
   });    
});

personaSchema.static("obtenerAlumno", function(id, cb){
   this.find({_id:id, cargo:"Alumno"}, function(err, r){
        cb(r);    
   });    
});

personaSchema.static("editarAlumno", function(id, name, cb){
   this.findOne({_id:id, cargo:"Alumno"}, function(err, r){
        r.nombre = name;
        r.save(function(err, al){
            cb(al);    
        });
   });    
});

personaSchema.static("buscarPorNombre", function(name, cb){
   this.find({nombre:name}, function(err, r){
        cb(r);    
   });    
});

module.exports = mongoose.model('Personas', personaSchema);
