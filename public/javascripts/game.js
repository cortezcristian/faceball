/**
 * Util Functions
 */
    var getOffsetWin = function(){
        console.log(250*($("div[id*=user-chat-]:visible").size()-1));    
        return 250*($("div[id*=user-chat-]:visible").size()-1);    
    }
    var closedWin = function(id){
        //console.log("closed>>>", id);
        //Re arrange windows
        $("div[id*=user-chat-]:visible").each(function(i,v){ //console.log(i,v)
           $(this).chatbox("option", "offset", 250*i)
        })
		//$("#" + showList[i]).chatbox("option", "offset", offset - diff);
    }

/**
 * Sockets
 */
    var port = (window.location.port=="")?":3200":"";
    var socket = io.connect('http://'+window.location.host+port,{'sync disconnect on unload': true });

jQuery(document).ready(function(){
    window.chatWindows = [];

    //Receive chat
	socket.on('chatIn', function (username, data) {
		console.log('chatIn>>',data);
        //$('body').append('<b>'+username + ':</b> ' + data.msg + '<br>');
        //$("#single-chat").chatbox("option", "boxManager").addMsg("Mr. Foo", data.msg);

        //If the chat window is not open
        $('ul#users li a').each(function(i,v){
            if($(v).html()==username){
                $(this).click();    
            }    
        });
        console.log("++",$("div[id*=user-chat-]:visible").size())
        //var size = ($("div[id*=user-chat-]:visible").size()==1)?0:$("div[id*=user-chat-]:visible").size();
        //$("#user-chat-"+username).chatbox("option", "offset", 250*size)
        $("#user-chat-"+username).chatbox("option", "boxManager").addMsg(username, data.msg);
       
        // Mark Message as read 
	    socket.emit('readMsg', data.msgid);
	}); 

    //new user joins
	socket.on('joinedUser', function (username) {
		console.log('joinedUser>>',username);
	    socket.emit('askUserList');
	}); 

    //user left the site
	socket.on('logoutUser', function (username) {
		console.log('logoutUser>>',username);
	    socket.emit('askUserList');
	}); 

    //receive user list
	socket.on('receiveUserList', function (list) {
		console.log('UserList>>',list, typeof list);
        if($('.AppNavigation #users').size()==0){
            //Create the list
            $('.AppNavigation').append('<ul id="users"><li><h3>Zurmo Chat</h3></li></ul>');
        }else{
            //Update it
            $('.AppNavigation #users').empty().append('<li><h3>Zurmo Chat</h3></li>');
        }
        //$(list[0]).each(function(i,v){console.log(v.username)});
        $(list).each(function(i,v){
            if(v.username!=superGlobal){
                if(v.isonline==1){
                    $('.AppNavigation #users').append("<li><a class='isonline' href='#'>"+v.username+"</a></li>");
                }else{
                    $('.AppNavigation #users').append("<li><a href='#'>"+v.username+"</a></li>");
                }
            }
        });
	}); 

    //receive open windows
	socket.on('receiveOpenWindows', function (data) {
		console.log('receiveOpenWindows>>',data);
        var listOpen = data.split(',');
        $('ul#users li a').each(function(i,v){
            $.each(listOpen, function(j,k){
                if($(v).html()==k){
                    $(v).click();    
                }    
            });
        });
	});

    //receive chat history
	socket.on('receiveChatHistory', function (username, data) {
		console.log('receiveChatHistory>>', username, data);
        $.each(data, function(i,v){
            $("#user-chat-"+username).chatbox("option", "boxManager").addMsg(v.from, v.message);
        });
	});


    // Join Room
	socket.emit('joinRoom', superGlobal);
	socket.emit('askUserList');
	socket.emit('askOpenWindows');
	//socket.emit('sendChat', { msg: 'User connected!' });
    $("#userId").html(superGlobal);

    //ChatBox Manager
    var counter = 0, idList = new Array();

    /*
      var broadcastMessageCallback = function(from, msg) {
          console.log("broadcast called",from,msg);
          for(var i = 0; i < idList.length; i ++) {
              chatboxManager.addBox(idList[i]);
              $("#" + idList[i]).chatbox("option", "boxManager").addMsg(from, msg);
          }
      }
        */

      // chatboxManager is excerpt from the original project
      // the code is not very clean, I just want to reuse it to manage multiple chatboxes
      //chatboxManager.init({messageSent : broadcastMessageCallback});
      /*
      $("#link_add").click(function(event, ui) {
          counter ++;
          var id = "box" + counter;
          idList.push(id);
          chatboxManager.addBox(id, 
                                  {dest:"dest" + counter, // not used in demo
                                   title:"box" + counter,
                                   first_name:"First" + counter,
                                   last_name:"Last" + counter
                                   //you can add your own options too
                                  });
          event.preventDefault();
      });
      */
   
    // Select user to chat with
    $('ul#users li a').on("click",function(e){
       e.preventDefault();
       e.stopPropagation();
       if($("#user-chat-"+$(this).html()).size()==0){
            $("body").append("<div id='user-chat-"+$(this).html()+"'></div>")
            $("body").find("#user-chat-"+$(this).html()).chatbox({
                  user: $(this).html(),
                  title: $(this).html(),
                  offset: getOffsetWin,
			      boxClosed : closedWin,
                  messageSent: function(id, user, msg){
	                socket.emit('sendChat', { msg: msg, user: user});
                    $("#user-chat-"+user).chatbox("option", "boxManager").addMsg(superGlobal, msg);
            }});
	        socket.emit('askChatHistory', $(this).html());
       }else{
           
           //$(this).chatbox("option", "offset", 250*$("div[id*=user-chat-]:visible").size())
           /*
           console.log("re-arrange", $("#user-chat-"+$(this).html()))
           $("#user-chat-"+$(this).html()).show();
           */
            console.log("already exist");
            var size = ($("div[id*=user-chat-]:visible").size()==1)?0:$("div[id*=user-chat-]:visible").size();
            $("#user-chat-"+$(this).html()).show().parent().show().parent().show();//.chatbox("option", "offset", 250*size);
            $("div[id*=user-chat-]:visible").each(function(i,v){ //console.log(i,v)
               $(this).chatbox("option", "offset", 250*i)
            });
       }

	    socket.emit('openWindow', $(this).html());
    });

    $('.ui-icon.ui-icon-closethick').on('click', function(e){
        var userclose = $(this).closest('div').children('span').html();
	    socket.emit('closeWindow', userclose);
    });

    console.log("ready loaded")
});

