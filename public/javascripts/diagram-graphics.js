/**
 _____              _           _ _ 
|  ___|_ _  ___ ___| |__   __ _| | |
| |_ / _` |/ __/ _ \ '_ \ / _` | | |
|  _| (_| | (_|  __/ |_) | (_| | | |
|_|  \__,_|\___\___|_.__/ \__,_|_|_|
                                    
* Graphics plugin
* @author Cristian Cortez  
* @requires KineticJS v4.7.a or above - http://www.kineticjs.com/
* 
*/

/**
 * xFballRenderer Global Namespace
 * @module xFballRenderer
 */
var xFball = {};
/*
 * xFballRenderer Version
 * @property ver
 * @type string
 */
xFball.ver = '1.0';

/*
 * xFballRenderer Extend utility
 * @namespace xFballRenderer
 * @method Extend
 * @param {Object} obj1 Child Class Object
 * @param {Object} obj2 Parent Class Object
 */
xFball.extend = function(obj1, obj2) {
    for(var key in obj2.prototype) {
        if(obj2.prototype.hasOwnProperty(key) && obj1.prototype[key] === undefined) {
            obj1.prototype[key] = obj2.prototype[key];
        }
    }
}

xFball.override = function(obj1, obj2) {
    for(var key in obj2) {
            obj1[key] = obj2[key];
    }
}

xFball.log = function(a){try{console.log(a);} catch(e) {}};

/*
    http://james.padolsey.com/javascript/get-document-height-cross-browser/
*/
xFball.getDocHeight = function() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

xFball.collidingCircles = function(obj1, obj2, rad) {
    var collision = false, h = 0;
    if(typeof obj1 != "undefined" && typeof obj2 != "undefined"){
        a = Math.abs(obj2.x - obj1.x);
        b = Math.abs(obj2.y - obj1.y);
        h = Math.sqrt((Math.pow(a,2)+Math.pow(b,2)));
        
        collision = (h<rad*2)?true:false;
    }
    return collision;
}

xFball.collidingCirclesDist = function(obj1, obj2, rad) {
    var distance = 0, h = 0;
    if(typeof obj1 != "undefined" && typeof obj2 != "undefined"){
        a = Math.abs(obj2.x - obj1.x);
        b = Math.abs(obj2.y - obj1.y);
        h = Math.sqrt((Math.pow(a,2)+Math.pow(b,2)));
        
        distance = h-rad*2;
    }
    return distance;
}
/**
* Global Objects
*/

xFball.stage = {};
xFball.bgLayer = {};
xFball.gameLayer = {};
xFball.player = {};
xFball.oponentsInfo = []; //Oponents Info
xFball.oponents = []; //Canvas Obj
xFball.ball = {};
xFball.WIDTH = "";
xFball.HEIGHT = "";
xFball.RAD = 15;
xFball.classes = [];
xFball.relations = [];

/**
* Global Gradient / Shadows Objects Mixin
*/
xFball.gradients = {};
xFball.shadows = {};
xFball.shadows.global = function(){
	return {
		  color: 'black',
		  blur: 1,
		  offset: [0, 2],
		  alpha: 0.3
		};
};
xFball.gradients.dark = function(){
    //xFball.desktop.getContext()
    var grad = {
        start: {
          x: -50,
          y: -50
        },
        end: {
          x: 50,
          y: -50
        },
        colorStops: [0, '#6d6b68', 0.3, "#595854",1, '#3c3b37']
      };
    return grad;
}
xFball.gradients.blue = function(){
    //xFball.desktop.getContext()
    var grad = {
        start: {
          x: -50,
          y: 0
        },
        end: {
          x: xFball.HEIGHT,
          y: xFball.WIDTH
        },
        colorStops: [0, '#164b69', 1, '#56b5ea']
      };
    return grad;
}
xFball.gradients.orange = function(){
    //xFball.desktop.getContext()
    var grad = {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 50
        },
        colorStops: [0, '#F16C3A', 0.1, "#F16C3A", 0.4, "#F84705", 1, '#F87240']
      };
    return grad;
}

/**
* Init Method
*/
xFball.init = function(o){
    //TODO: add right click support: document.oncontextmenu = function(e) {alert("a"); return false;} 
    var obj = {
        container: "container",
        width: window.innerWidth || window.screen.width,
        height: xFball.getDocHeight() || window.screen.height
    }
    xFball.override(obj, o);
   
    xFball.WIDTH = obj.width;
    xFball.HEIGHT = obj.height;
    //console.dir(obj);
     
    xFball.stage = new Kinetic.Stage({
        container: obj.container,
        width: obj.width,
        height: obj.height
    });
	
	xFball.fieldBg = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: xFball.WIDTH,
      height: xFball.HEIGHT,
	  fill: "green"
	});
    /*	
	var d = new Date(),
    h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()),
    m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()),
    s = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()),
    da = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()),
    mo = (d.getMonth() < 10 ? '0' + (d.getMonth() + 1): d.getMonth()),
    text = d.toString().substring(0,3) + ' ' + da + ' ' + d.toString().substring(4,7) + ', ' + h + ':' + m + ':' + s ;
    
    
    var clockLabel = new Kinetic.Text({
        x: xFball.WIDTH - 150,
        y: xFball.HEIGHT - 40,
        text: text,
        alpha: 0.9,
        fontSize: 10,
        fontFamily: "Arial",
        textFill: "#d1d1d1",
        padding: 15,
        align: "left",
        verticalAlign: "middle",
        name: "mainClock",
        fontStyle: "normal"
    });
	*/
    //Draw the background
    xFball.bgLayer  = new Kinetic.Layer({x:0});
    xFball.bgLayer.add(xFball.fieldBg);

    //Draw Rects
    var field = new Kinetic.Group(), halfArco=40;
    var lines = [
        {xStart:1, yStart:1, xEnd:xFball.WIDTH, yEnd:1,stroke:'gray'}, //field
        {xStart:xFball.WIDTH, yStart:1, xEnd:xFball.WIDTH, yEnd:xFball.HEIGHT,stroke:'gray'},
        {xStart:xFball.WIDTH, yStart:xFball.HEIGHT, xEnd:1, yEnd:xFball.HEIGHT,stroke:'gray'},
        {xStart:1, yStart:xFball.HEIGHT, xEnd:1, yEnd:1,stroke:'gray'},
        {xStart:xFball.WIDTH/2, yStart:xFball.HEIGHT, xEnd:xFball.WIDTH/2, yEnd:1,stroke:'gray'}, //middle 
        {xStart:1, yStart:(xFball.HEIGHT/2-halfArco), xEnd:1, yEnd:(xFball.HEIGHT/2+halfArco),stroke:'red'},
        {xStart:xFball.WIDTH, yStart:(xFball.HEIGHT/2-halfArco), xEnd:xFball.WIDTH, yEnd:(xFball.HEIGHT/2+halfArco),stroke:'blue'}//arcos
        //{xStart:1, yStart:1, xEnd:xFball.WIDTH, yEnd:xFball.HEIGHT},
        //{xStart:1, yStart:1, xEnd:xFball.WIDTH*-1, yEnd:xFball.HEIGHT*-1},

    ];
    
    $.each(lines, function(i,v){
        var line = new Kinetic.Line({
            points: [{x:v.xStart,y:v.yStart},{x:v.xEnd,y:v.yEnd}],
            stroke: v.stroke,
            strokeWidth: 10,
            lineJoin: "round",
            name: "line-field-"+i
        });
        field.add(line);
    });
    xFball.bgLayer.add(field);
    
    //Draw the Game Layer
    xFball.gameLayer  = new Kinetic.Layer({x:0});
    // Add the player
    //xFball.player  = new xFball.classPlayer({name:superGlobal,title:superGlobal,x:superGlobal*10, y:superGlobal*10});
    //xFball.gameLayer.add(xFball.player);

    // Add the oponents
    /*
    $.each(xFball.oponentsInfo, function(i,v){
        xFball.oponents[i] = new xFball.classPlayer({
            name:v.nombre,
            y:v.y,
            x:v.x});
        xFball.gameLayer.add(xFball.oponents[i]);
    });
    */

    //Add the ball
    xFball.ball  = new xFball.classBall();
    xFball.gameLayer.add(xFball.ball);

	//init apps
	xFball.apps.init();
}

/**
* Class Player
*/
xFball.classPlayer = function(o){ 
    this.conf = {
        name: "class-name",
        title: "Name",
        x:0,
        y:0,
        rectX: 0,
        rectY: 0,
        width: 150,
        height: 100
    };
    
    xFball.override(this.conf, o || {});

	var rectX = this.conf.rectX, rectY = this.conf.rectY;
		
    this.grp = new Kinetic.Group({
        //x: rectX,
        //y: rectY,
        x: this.conf.x,
        y: this.conf.y,
		stroke: "red",
		strokeWidth: 1,
        name: this.conf.name,
        draggable: true
    });
    
    var txtTitle = new Kinetic.Text({
        x: -14,
        y: 1,
        text: this.conf.title,
        alpha: 0.9,
        fontSize: 12,
        fontFamily: "Arial",
        textFill: "#d1d1d1",
        padding: 10,
        align: "left",
        verticalAlign: "middle",
        fontStyle: "bold"
    });
    var circle = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: xFball.RAD,
        fill: (this.conf.name%2==0)?'blue':'red',
        stroke: 'black',
        strokeWidth: 4
    });

/*
    var box = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: this.conf.width,
      height: this.conf.height,
      cornerRadius: 5,
      fill: xFball.gradients.dark(),
	  shadow: xFball.shadows.global(),
      stroke: "black",
      strokeWidth: 1,
      name: "box"
    });
  */  
    this.grp.add(circle);
    this.grp.add(txtTitle);
    this.grp.conf = this.conf;
    this.grp.mass = 4;
    this.grp.speed = 4;
    this.grp.direction = {x:1,y:1};

    this.grp.moveDown = function(playerSpeed) {
        if (this.attrs.y < xFball.HEIGHT) {
            this.attrs.y += this.speed;
            //socket.emit('move', {name:this.name, y:this.attrs.y, x:this.attrs.x});
            //socket.emit('move', {name:this.attrs.name, y:this.attrs.y, x:this.attrs.x});
        };
    };

    this.grp.moveUp = function(playerSpeed) {
        if (this.attrs.y > 0) {
            this.attrs.y -= this.speed;
            //socket.emit('move', {name:this.attrs.name, y:this.attrs.y, x:this.attrs.x});
        }
    };

    this.grp.moveLeft = function(playerSpeed) {
        if (this.attrs.x > 0) {
            this.attrs.x -= this.speed;
            //socket.emit('move', {name:this.attrs.name, y:this.attrs.y, x:this.attrs.x});
        }
    };

    this.grp.moveRight = function(playerSpeed) {
        if (this.attrs.x < xFball.WIDTH) {
            this.attrs.x += this.speed;
            //socket.emit('move', {name:this.attrs.name, y:this.attrs.y, x:this.attrs.x});
        };
    };            

    return this.grp;
}

/**
* Class Ball
*/
xFball.classBall = function(o){ 
    this.conf = {
        name: "ball",
        title: "Ball",
        rectX: 0,
        rectY: 0,
        width: 150,
        height: 100
    };
    
    xFball.override(this.conf, o || {});

	var rectX = this.conf.rectX, rectY = this.conf.rectY;
		
    this.grp = new Kinetic.Group({
        //x: rectX,
        //y: rectY,
        x: xFball.WIDTH / 2,
        y: xFball.HEIGHT / 2,
		//stroke: "white",
		//strokeWidth: 1,
        name: this.conf.name,
        draggable: true
    });
    
    var circle = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: xFball.RAD,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 2
    });

    this.grp.add(circle);

    this.grp.conf = this.conf;
    this.grp.mass = 1;
    this.grp.speed = 1;
    this.grp.direction = {x:0,y:0};
    this.grp.collidedWithPlayer = 0;
    this.grp.collidedWithWallY = 0;
    this.grp.collidedWithWallX = 0;
    this.grp.collidedWithOp = {};

    this.grp.move = function() {

       //Collision with walls
       if((this.attrs.y<=0 || this.attrs.y >= xFball.HEIGHT)&&!this.collidedWithWallY){
           this.direction.y *= -1;
           //try <
           //xFball.ball.attrs.x = (data.x>xFball.WIDTH)?xFball.WIDTH:((data.x<0)?0:data.x);
           this.y = (this.y>=xFball.HEIGHT)?xFball.HEIGHT:0;
           socket.emit("collisionWith", {direction:{x:this.direction.x,y:this.direction.y},x:this.attrs.x,y:this.attrs.y,wall:true,sentBy:superGlobal});
           this.collidedWithWallY = 1;     
       }else{
           this.collidedWithWallY = 0;     
       }

       //Collision with walls
       if((this.attrs.x<=0 || this.attrs.x >= xFball.WIDTH)&&!this.collidedWithWallY){
           this.direction.x *= -1;
           this.x = (this.x>=xFball.WIDTH)?xFball.WIDTH:0;
           //socket.emit("collisionWith", {direction:{x:this.direction.x,y:this.direction.y},x:this.attrs.x,y:this.attrs.y, wall:true});
           socket.emit("collisionWith", {direction:{x:this.direction.x,y:this.direction.y},x:this.attrs.x,y:this.attrs.y,wall:true,sentBy:superGlobal});
           this.collidedWithWallX = 1;     
       }else{
           this.collidedWithWallX = 0;     
       }

       //Collide with current player
       if(xFball.collidingCircles(xFball.player.attrs,xFball.ball.attrs,xFball.RAD)){
           //console.log("colision w player", this.direction)
           if(!this.collidedWithPlayer){
               this.collidedWithPlayer = 1;
               var sumMass = xFball.ball.mass+xFball.player.mass,
                  diffMass = xFball.ball.mass-xFball.player.mass;
               this.direction.x = ((this.direction.x*diffMass)+(2*xFball.player.mass*xFball.player.direction.x))/sumMass;
               this.direction.y = ((this.direction.y*diffMass)+(2*xFball.player.mass*xFball.player.direction.y))/sumMass;
               socket.emit("collisionWith", {direction:{x:this.direction.x,y:this.direction.y},x:this.attrs.x,y:this.attrs.y,wall:true,sentBy:superGlobal});
               //socket.emit("collisionWith", {direction:{x:this.direction.x,y:this.direction.y},x:this.attrs.x,y:this.attrs.y, wall:false});
               //socket.emit("collisionWithPLayer", {direction:{x:this.direction.x,y:this.direction.y}});
               socket.emit('move', {name:xFball.player.attrs.name, y:xFball.player.attrs.y, x:xFball.player.attrs.x});
           }
           //console.log("colision w player", this.direction)
       }else{
           this.collidedWithPlayer = 0;
       }
       var grp = this; 
       //Collide with other players
       $.each(xFball.oponents, function(i,v){
           if(typeof grp.collidedWithOp[v.name] == "undefined"){
            grp.collidedWithOp[v.name] = 0;    
           }
           if(xFball.collidingCircles(v.attrs,xFball.ball.attrs,xFball.RAD)){
               console.log("colision w oponent", grp.direction)
               if(!grp.collidedWithOp[v.name]){
                   grp.collidedWithOp[v.name] = 1;
                   var sumMass = xFball.ball.mass+v.mass,
                      diffMass = xFball.ball.mass-v.mass;
                   grp.direction.x = ((grp.direction.x*diffMass)+(2*v.mass*v.direction.x))/sumMass;
                   grp.direction.y = ((grp.direction.y*diffMass)+(2*v.mass*v.direction.y))/sumMass;
               }
               console.log("colision w oponent", grp.direction)
           }else{
               grp.collidedWithOp[v.name] = 0;
           }
       });

       this.attrs.y += this.speed * this.direction.y;
       this.attrs.x += this.speed * this.direction.x;
    }
    /*
    this.grp.moveDown = function(playerSpeed) {
        if (this.attrs.y < xFball.HEIGHT) {
            this.attrs.y += this.speed;
        };
    };

    this.grp.moveUp = function(playerSpeed) {
        if (this.attrs.y > 0)
        this.attrs.y -= this.speed;
    };

    this.grp.moveLeft = function(playerSpeed) {
        if (this.attrs.x > 0) {
            this.attrs.x -= this.speed;
        };
    };

    this.grp.moveRight = function(playerSpeed) {
        if (this.attrs.x < xFball.WIDTH) {
            this.attrs.x += this.speed;
        };
    };            
    */
    return this.grp;
}


/**
* Arrow
*/
xFball.relArrow = function(nameFrom,nameTo){
	var nFrom = nameFrom || xFball.selection.data.from,
	nTo = nameTo || xFball.selection.data.to,
	grpFrom = xFball.desktop.get("."+nFrom)[0],
	grpTo = xFball.desktop.get("."+nTo)[0],
	boxFrom = grpFrom.children[0].attrs,
	boxTo = grpTo.children[0].attrs,
	xStart = 0, yStart = 0, xEnd = 0, yEnd = 0;
	// console.log(xFball.desktop.get("."+nFrom)[0]);
	console.log(xFball.desktop.get("."+nFrom)[0].children[0].attrs);
	console.log(xFball.desktop.get("."+nTo)[0].children[0].attrs);
	
	if(grpFrom.attrs.x <= grpTo.attrs.x){ // F -> T
		// console.log(((grpFrom.attrs.x + boxFrom.width) <= (grpTo.attrs.x + Math.round(boxTo.width/2))));
		console.log((grpFrom.attrs.x + boxFrom.width) <= (grpTo.attrs.x + boxTo.width));
		if((grpFrom.attrs.x + boxFrom.width) <= grpTo.attrs.x){// Pm1 = Xo + Wo/2
			xStart = grpFrom.attrs.x + boxFrom.width;
			yStart = grpFrom.attrs.y + Math.round(boxFrom.height/2);
			xEnd = grpTo.attrs.x;
			yEnd = grpTo.attrs.y + Math.round(boxTo.height/2);
		}else{ //too close
			if(grpFrom.attrs.y < grpTo.attrs.y){ // bottom To
				xStart = grpFrom.attrs.x + Math.round(boxFrom.width/2);
				yStart = grpFrom.attrs.y + boxFrom.height;
				xEnd = grpTo.attrs.x + Math.round(boxTo.width/2);
				yEnd = grpTo.attrs.y;
			}else{ // bottom From
				xStart = grpFrom.attrs.x + Math.round(boxFrom.width/2);
				yStart = grpFrom.attrs.y;
				xEnd = grpTo.attrs.x + Math.round(boxTo.width/2);
				yEnd = grpTo.attrs.y + boxTo.height;
			}
		}
	}else if (grpFrom.attrs.x > grpTo.attrs.x) { // T <- F
		console.log(grpFrom.attrs.x >= (grpTo.attrs.x + Math.round(boxTo.width/2)));
		if(grpFrom.attrs.x >= (grpTo.attrs.x + boxTo.width)){
			xStart = grpFrom.attrs.x;
			yStart = grpFrom.attrs.y + Math.round(boxFrom.height/2);
			xEnd = grpTo.attrs.x + boxTo.width;
			yEnd = grpTo.attrs.y + Math.round(boxTo.height/2);
		}else{
			if(grpFrom.attrs.y <= grpTo.attrs.y){ // bottom To
				xStart = grpFrom.attrs.x + Math.round(boxFrom.width/2);
				yStart = grpFrom.attrs.y + boxFrom.height;
				xEnd = grpTo.attrs.x + Math.round(boxTo.width/2);
				yEnd = grpTo.attrs.y;
			}else{ // bottom From
				xStart = grpFrom.attrs.x + Math.round(boxFrom.width/2);
				yStart = grpFrom.attrs.y;
				xEnd = grpTo.attrs.x + Math.round(boxTo.width/2);
				yEnd = grpTo.attrs.y + boxTo.height;
			}
		}
	}
	
	console.log([xStart, yStart, xEnd, yEnd]);
	//Depends on position but...
	var line = new Kinetic.Line({
		points: [xStart, yStart, xEnd, yEnd],
		stroke: "black",
		strokeWidth: 2,
		name: "arrow",
		lineJoin: "round"
	});
	xFball.desktop.add(line);
    xFball.desktop.draw();
}

/**
* Applications
*/
//Namespace for apps
xFball.apps = {};

xFball.apps.init = function(){
	//xFball.apps.clock();
};

xFball.apps.clock = function(name){
	setInterval(function(){
	var d = new Date(),
	h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()),
	m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()),
	s = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()),
	da = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()),
	mo = (d.getMonth() < 10 ? '0' + (d.getMonth() + 1): d.getMonth()),
	text = d.toString().substring(0,3) + ' ' + da + ' ' + d.toString().substring(4,7) + ', ' + h + ':' + m + ':' + s ;
	//text = da + '-' + mo + '-' + d.getFullYear() + '   ' + h + ':' + m + ':' + s ;
	
	xFball.desktop.get(".mainClock")[0].setText(text);
	xFball.desktop.draw();
	},1000);
}


/**
* OnFrame
*/
// key events
var input = {};
document.addEventListener('keydown', function(e){
    
    //if (game.running == true) {
        //e.preventDefault();
    //};
    
    input[e.which] = true;
    
    // start game
    /*
    if (input[32] == true && game.over == false) {
        e.preventDefault();
        if (game.running == false) {
            foregroundLayer.remove(welcomeScreen);
            game.start();
            game.ball.stop();
            game.ball.setOnPlayerPosition(game.player);
        } else {
            if (game.turn == 1) {
                game.ball.start();
            };
        };
    };
    */
});
document.addEventListener('keyup', function(e){
    input[e.which] = false;
});

/**
* Renderer Method
*/

xFball.render = function(o){
    
    //adding stuff
    /*
    xFball.stage.add(xFball.desktopCon);
    xFball.stage.add(xFball.desktop);
    xFball.desktopBar.add(new xFball.mainBar());
    xFball.stage.add(xFball.desktopBar);
    */
    xFball.stage.add(xFball.bgLayer);
    xFball.stage.add(xFball.gameLayer);

    xFball.stage.onFrame(function(){
        var arrowDown = (input[40] == true || input[83] == true),
            arrowUp = (input[38] == true || input[87] == true),
            arrowLeft = (input[37] == true || input[65] == true),
            arrowRight = (input[39] == true || input[68] == true);

        if(arrowDown) {
            xFball.player.moveDown();
        }
        if (arrowUp) {
            xFball.player.moveUp();
        }
        if (arrowLeft) {
            xFball.player.moveLeft(); 
        }
        if (arrowRight) {
            xFball.player.moveRight();
        }; 
        xFball.ball.move();
        //Render Game
        xFball.bgLayer.draw();
        xFball.gameLayer.draw();
    });
}

/**
* Magic starts here :)
*/
window.onload = function() {
    xFball.init({
        container: "graph-container",
        width: 578,
        height: 300
    });
    xFball.render();
    xFball.stage.start();
    // Create new user
    socket.emit('joinGame', {name:superGlobal,title:superGlobal,x:superGlobal*10,y:superGlobal*10});
};



/**
* Socket IO: Receive events
*/

socket.on('updateBall', function (data) {
	//xFball.log("Update Ball", data);
    if(data.sendBy!=superGlobal){ 
        if(data.wall && (xFball.ball.direction.x != data.direction.x || xFball.ball.direction.y != data.direction.y)){
            xFball.ball.attrs.x = (data.x>=xFball.WIDTH)?xFball.WIDTH-1:((data.x<=0)?1:data.x);
            xFball.ball.attrs.y = (data.y>=xFball.HEIGHT)?xFball.HEIGHT-1:((data.y<=0)?1:data.y);
            //xFball.ball.attrs.y = data.y;
        }
        xFball.ball.direction.x = data.direction.x;
        xFball.ball.direction.y = data.direction.y;
    }
});

socket.on('updateScore', function (data) {
	console.log("Update Score", data);
    $('.score #blue').text(data.blue);
    $('.score #red').text(data.red);
});

socket.on('joined', function (data) {
	xFball.log("Event joinedPlayer");
    /*
    xFball.player  = new xFball.classPlayer({
        name:data.name,
        title:data.name,
        x:data.x,
        y:data.y});
    xFball.gameLayer.add(xFball.player);
    */
    /*
    var op = new xFball.classPlayer({
        name:data.name,
        title:data.name,
        x:data.x,
        y:data.y});
    if(data.name != superGlobal){
        xFball.gameLayer.add(op);
        xFball.oponents.push(op);
        //xFball.oponentsInfo.push(op);
    }*/
    console.log(data);
    xFball.player  = new xFball.classPlayer({name:data.name,title:data.name,x:data.x, y:data.y});
    xFball.gameLayer.add(xFball.player);

    socket.emit('askCanvas');

});

socket.on('drawCanvas', function (data) {
    //console.log(data.canvas.players);
    //Render oponents players
    var j = 0;
    $.each(data.canvas.players,function(i,v){
        if(v.name != superGlobal){
            if(typeof xFball.oponents[j] == "undefined"){
                var op = new xFball.classPlayer({
                    name:v.name,
                    title:v.name,
                    x:v.x,
                    y:v.y});
                xFball.gameLayer.add(op);
                xFball.oponents.push(op);
            }else{
                //Only change coords
                xFball.oponents[j].attrs.x = v.x;
                xFball.oponents[j].attrs.y = v.y;
            }
            j++;
        }else{
            xFball.player.attrs.x = v.x;
            xFball.player.attrs.y = v.y;
        }
    });

    //Update Score
    $('.score #blue').text(data.score.blue);
    $('.score #red').text(data.score.red);
}); 

//Report position every 2 sec
setInterval(function(){
    if(typeof xFball.player.attrs != "undefined")
        socket.emit('move', {name:xFball.player.attrs.name, y:xFball.player.attrs.y, x:xFball.player.attrs.x});
},1000);
