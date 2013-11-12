var app = module.parent.exports.app
  , Personas = require('../models/personas.js')
  , adminAuth;

/**
 * Interceptors
 */
adminAuth = function(req, res, next){
    //authorize role
    console.log(req.user)
    if(typeof req.user != "undefined"){
        next();
    }else{
        //Not authorized go to the login form
        res.redirect('/admin');
    }
}

/*
 * GET 
 */

app.get('/', function(req, res){
  res.render('index', { title: 'Faceball' });
});

app.get('/game', function(req, res){
  res.render('index', { title: 'Game' });
});

/*
app.get('/new', adminAuth, function(req, res){
   res.render('new', { title: 'Nuevo',user: req.user, obj: {} });
});

app.post('/new', adminAuth, function(req, res){
  var p = new Personas({nombre: req.body.nombre, cargo: "Alumno"});
  p.save(function(err, p){
    res.redirect("/");
  });
});

app.get('/delete/:id', adminAuth, function(req, res){
  Personas.eliminarAlumno(req.params.id, function(){
    res.redirect("/");
  });
});

app.get('/edit/:id', adminAuth, function(req, res){
  Personas.obtenerAlumno(req.params.id, function(pers){
    res.render('edit', { title: 'Editar',user: req.user, obj: pers });
  });
});

app.post('/edit/:id', adminAuth, function(req, res){
  Personas.editarAlumno(req.params.id, req.body.nombre, function(pers){
    res.redirect("/");
  });
});

app.get('/admin', function(req, res){
    if(typeof req.user != "undefined"){
        res.redirect('/');
    }else{
        res.render('admin', { title: 'Ingreso', obj: {} });
    }
});
*/
