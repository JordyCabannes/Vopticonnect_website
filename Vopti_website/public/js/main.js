// ......................................................
// .......................UI Code........................
// ......................................................
    var chatContainer = document.querySelector('.chat-output');
    var tabTimeMessage = new Array();
    var tabPseudo = new Array();
    var haut = $(window).height();
    var large = $(window).width();
    var oldHaut=haut;
    var oldWidth=large;
    var roomOpened=false;
    var initiator = false;
    var msgReceived = false;
    var clignote=false;
    var sharedFile=false;
    var cptVideo=0;
    var largebis=0;
    var hautbis=0;
    var hautbisChoice=0;
    var pictureWidth;
    var xold=0;
    var x;
    var pseudoChoisi=false;
    var pseudo;
    var btnReduce=false;
    var biggestHeightDesk = haut;
    var biggestHeightPhone = haut;
    var firstPicture;

    //function which runs when the app is launched
    function display_chat_video(){
        document.getElementById("chat-container-bis").style.visibility="hidden";
        /*if(large<400){
            document.getElementById("chat-container-bis").style.width=large+"px";
            //document.getElementById("chat-container-bis").style.height=haut+"px";
        }*/
        document.getElementById("footerChatBox").style.visibility="hidden";
        document.getElementById("leave").style.visibility="hidden";
        var hautChat =100-((52*100)/haut);
        document.getElementById("corpsChat").style.height=hautChat+"%";
    }

    /*********** code written by VoptiConnect ***********/
    document.getElementById('open-room').onclick = function() {
        this.disabled = true;
        connection.open(document.getElementById('room-id').value);
    };

    document.getElementById('join-room').onclick = function() {
        this.disabled = true;
        connection.join(document.getElementById('room-id').value);
    };

    document.getElementById('open-or-join-room').onclick = function() {
    /**********************************************************/
        /****** My code ******/
        if(document.getElementById('room-id').value!==""){ 
        /********************/                  
            this.disabled = true;
            connection.openOrJoin(document.getElementById('room-id').value);
            /****** My code ******/   
            document.getElementById("initialisation").style.visibility="hidden";
            document.getElementById("creation2").style.visibility="hidden";
            document.getElementById("sectionSite").style.visibility="visible";                
        }
        else{
            alert("You have to type a room-id");
        }
        /*********************/
    };

    document.getElementById('btn-leave-room').onclick = function() {
        this.disabled = true;
        var video;
        if(connection.isInitiator) {
            connection.closeEntireSession(function() {
                document.querySelector('h1').innerHTML = 'Entire session has been closed';
            });

        }
        /****** My code ******/ 
        else {
            connection.leave();
            connection.attachStreams.forEach(function(stream) {
                stream.stop();
            });
        }
        /*********************/
        leaveRoom();
    };

// ......................................................
// ................FileSharing/TextChat Code.............
// ......................................................

    document.getElementById('share-file').onclick = function() {
        var fileSelector = new FileSelector();
            
        fileSelector.selectSingleFile(function(file) {
            connection.send(file);
        });
        /****** My code ******/
        sharedFile=true;
        /********************/
    };

    document.getElementById('input-text-chat').onkeyup = function(e) {
        if (e.keyCode != 13) return;

        // removing trailing/leading whitespace
        if(document.getElementById('btn-chat').disabled === false){
            this.value = this.value.replace(/^\s+|\s+$/g, '');
            if (!this.value.length) return;
            /****** My code ******/
            if(!initiator){
                connection.userid=pseudo;
            }
            /********************/
            connection.send(this.value);
            appendDIV(this.value);
            this.value = '';
        }
    };

    function appendDIV(event) {
        /************** My code **************/
        var maDate = new Date();
        var indice = tabTimeMessage.length;
        nTemps = maDate.getTime();
        tabTimeMessage.push(nTemps);

        var li = document.createElement('li');
        /*************************************/
        msg = event.data || event;
        /************** My code **************/
        li.className="right clearfix";
        /*************************************/
        chatContainer.insertBefore(li, chatContainer.lastChild);
        /************** My code **************/
        li.innerHTML = "<span class='chat-img pull-right'><img src='http://placehold.it/50/FA6F57/fff&text=ME' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><small class=' text-muted'><span class='glyphicon glyphicon-time'>&nbsp</span><span class='time'></span></small><strong class='pull-right primary-font'>"+connection.userid+"</strong></div><p>"+msg+"</p></div>";
        /*************************************/
    }

    /************************ My code ************************/
    function appendDIVFile(){
        var maDateF = new Date();
        var indiceF = tabTimeMessage.length;
        nTempsF = maDateF.getTime();
        tabTimeMessage.push(nTempsF);

        var elt=document.getElementById("file-container").firstChild;
        var monTexte = elt.innerHTML;
        $('#file-container').empty();
        var li = document.createElement('li');
                
        if(sharedFile){
            li.className="right clearfix";
            li.innerHTML="<span class='chat-img pull-right'><img src='http://placehold.it/50/FA6F57/fff&text=ME' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><small class=' text-muted'><span class='glyphicon glyphicon-time'>&nbsp</span><span class='time'></span></small><strong class='pull-right primary-font'>"+connection.userid+"</strong></div><p>"+monTexte+"</p></div>";
            sharedFile=false;
        }
        else{
            if(document.getElementById("chat-container-bis").style.visibility==="hidden"){
                msgReceived=true;
            }
            li.className="left clearfix";
            li.innerHTML="<span class='chat-img pull-left'>"+
                            "<img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' />"+
                        "</span>"+
                        "<div class='chat-body clearfix'>"+
                            "<div class='header'>"+
                                "<strong class='primary-font'>Shared file</strong> <small class='pull-right text-muted'>"+
                                    "<span class='glyphicon glyphicon-time'>&nbsp</span><span class='time'></span></small>"+
                            "</div><p>"+monTexte+"</p></div>";
        }
        chatContainer.insertBefore(li, chatContainer.lastChild);
    }
    /***********************************************************/

    // ......................................................
    // ..................RTCMultiConnection Code.............
    // ......................................................

    var connection = new RTCMultiConnection();
        
    connection.socketURL = '/';

    connection.socketMessageEvent = 'audio-video-file-chat-demo';
    localStorage.clear('rmc-room-id');
    var roomid = '';
    if(localStorage.getItem('rmc-room-id')) {
        roomid = localStorage.getItem('rmc-room-id');
    }
    /*else {
        roomid = connection.token();
    }*/
    document.getElementById('room-id').value = roomid;
    document.getElementById('room-id').onkeyup = function() {
        localStorage.setItem('rmc-room-id', this.value);
    };

    connection.enableFileSharing = true; // by default, it is "false".

    connection.session = {
        audio: true,
        video: true,
        data: true
    };

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    connection.videosContainer = document.getElementById('videos-container');
    connection.onstream = function(event) {
        connection.videosContainer.appendChild(event.mediaElement);
        event.mediaElement.play();
        setTimeout(function() {
            event.mediaElement.play();
        }, 5000);
    };

    connection.onmessage = function appendDIVReceive(event) {
        /****** My code ******/
        var maDateRep = new Date();
        var indiceRep = tabTimeMessage.length;
        nTempsRep = maDateRep.getTime();
        tabTimeMessage.push(nTempsRep);

        if(document.getElementById("chat-container-bis").style.visibility==="hidden"){
            msgReceived = true;
        }
        clignote=false;
        var li = document.createElement('li');
        li.className="left clearfix";
        /*********************/
        chatContainer.insertBefore(li, chatContainer.lastChild);
        var msg = event.data || event;
        /****** My code ******/
        li.innerHTML ="<span class='chat-img pull-left'>"+
                            "<img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' />"+
                        "</span>"+
                        "<div class='chat-body clearfix'>"+
                            "<div class='header'>"+
                                "<strong class='primary-font'>"+event.userid+ "</strong> <small class='pull-right text-muted'>"+
                                    "<span class='glyphicon glyphicon-time'>&nbsp</span><span class='time'></span></small>"+
                            "</div><p>"+msg+"</p></div>";
        /*********************/
        chatContainer.insertBefore(li, chatContainer.lastChild);
    };

    connection.filesContainer = document.getElementById('file-container');

    connection.onopen = function() {
        document.getElementById('share-file').disabled = false;
        document.getElementById('input-text-chat').disabled = false;
        document.getElementById('btn-leave-room').disabled = false;
        document.getElementById('btn-chat').disabled = false;
        document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
    };

    connection.onclose = function() {
        if(connection.getAllParticipants().length) {
            document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
        }
        else {
            /****** My code ******/
            connection.leave();
            connection.attachStreams.forEach(function(stream) {
                stream.stop();
            });
            /*********************/
            document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left';
            /****** My code ******/
            leaveRoom();
            /*********************/
        }
    };

    connection.onEntireSessionClosed = function(event) {
        document.getElementById('share-file').disabled = true;
        document.getElementById('input-text-chat').disabled = true;
        document.getElementById('btn-leave-room').disabled = true;
        document.getElementById('btn-chat').disabled = true;

        document.getElementById('open-or-join-room').disabled = false;
        document.getElementById('open-room').disabled = false;
        document.getElementById('join-room').disabled = false;
        document.getElementById('room-id').disabled = false;

        connection.attachStreams.forEach(function(stream) {
            stream.stop();
        });

        // don't display alert for moderator
        if(connection.userid === event.userid) return;
        document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
        leaveRoom();

    };

    connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
        // seems room is already opened
        connection.join(useridAlreadyTaken);
    };


/******* end of code written by VoptiConnect *********/



/********** My code **********/

    
    /**** Function which manages website behavior when participants leave the room ****/

    function leaveRoom(){
        cptVideo=0;
        document.getElementById("sectionSite").style.visibility="hidden";
        document.getElementById("leave").style.visibility="visible";
        document.getElementById("footerChatBox").style.visibility="hidden";
        document.getElementById("chat-container-bis").style.visibility="hidden";
        document.getElementById("divBtn").style.visibility="hidden";
    }
    /************************************************************************************/   

    /**** Function for the pseudo ****/
    function getPseudo(){
        pseudo= document.getElementById("pseudo").value;
        pseudoChoisi=true;
        connection.userid=pseudo;
        document.getElementById("creation3").style.visibility="hidden";
        document.getElementById("creation2").style.visibility="visible";
        document.getElementById("footerChatBox").style.zIndex="1";
        document.getElementById("room-id").focus();
    }
    /***********************************/

    /**** Function for the pseudo which enables to press enter to validate pseudo ****/
    function saisiePseudo(){
        if(!roomOpened){
            document.getElementById('pseudo').onkeyup = function(e) {
                if (e.keyCode != 13) return;
                getPseudo();
            };
        }
    }
    /***********************************************************************************/   

    /**** Function for the pseudo which enables to press enter to validate the room-id ****/
    function saisieRoomId(){
        if(!roomOpened && pseudoChoisi){
            document.getElementById('room-id').onkeyup = function(e) {
                if (e.keyCode != 13) return;
                if(document.getElementById('room-id').value!==""){                   
                    this.disabled = true;
                    connection.openOrJoin(document.getElementById('room-id').value);
                    document.getElementById("initialisation").style.visibility="hidden";
                    document.getElementById("creation2").style.visibility="hidden";
                    document.getElementById("sectionSite").style.visibility="visible";                
                }
                else{
                    alert("You have to type a room-id");
                }
            };
        }
    }
    /***********************************************************************************/

    /**** Functions which manages the pictures when we open the website ****/
    function displayImages(){
        var active=$('#galerie .active');
        var next;
        var newHaut=$(window).height(), haut, large, newWidth=$(window).width();
        var offsetWidth, offsetHeight;

        haut=$(window).height();
        large=$(window).width();
        if(active.next().length>0){
            firstPicture=false;
            next=active.next();
            if(large>600){
                next.height(biggestHeightDesk);
                next.width(2.13*next.height());
            }
            else{
                next.height(biggestHeightPhone);
                next.width(0.9*next.height());
            }  
        }

        if(active.next().length===0){
            firstPicture=true;
            next=$('#galerie img:first');
            if(large<=600){
                next.height(biggestHeightPhone);
                next.width(next.height()*0.9);
            }
            else{
                next.height(biggestHeightDesk+biggestHeightDesk/3);
                next.width(next.height()*1.5);
            }
        }
            
        if(large>600){
            if(next.width()<large){
                next.width(large);
                if(!firstPicture){
                    next.height(next.width()/2.13);
                }
                else{   
                    next.height(next.width()/1.5);
                }
            }
        }
        else{
             if(next.width()<large){
                next.width(large);
                next.height(next.width()/0.9);
            }
        }


        offsetWidth = (next.width()-$(window).width())/2;
        offsetHeight = (next.height()-$(window).height())/2;
        next.css("left", "-"+offsetWidth+"px");
        next.css("top", "-"+offsetHeight+"px");

        active.fadeOut(function(){
            active.removeClass('active');
            next.fadeIn().addClass('active');
        });
    }

    function picturesChoice(){
        haut=$(window).height();
        large=$(window).width();
        if(!roomOpened){
            if(large!==largebis || haut!==hautbis){
                if(large>600){
                    document.getElementById("creation").style.height="140px";
                    document.getElementById("galerie").innerHTML="<img src='./pictures/canstockphoto15927760.jpg' class='active' />"
                                +"<img src='./pictures/Chromebox-for-meetings.png'/>"
                                +"<img src='./pictures/Happy-Android-Device-user-gms-advantage (1).jpg'/>"
                                +"<img src='./pictures/ipad-iphone-ios9-facetime-hero.jpg'/>"
                                +"<img src='./pictures/o-SMARTPHONE-facebook.jpg'/>"
                        
                    $('#galerie img:first').height(haut+haut/3);
                    $('#galerie img:first').width($('#galerie img:first').height()*1.5);
                    if( $('#galerie img:first').width()<large){
                        $('#galerie img:first').width(large);
                        $('#galerie img:first').height(large/1.5);
                    }
                }
                else{
                    document.getElementById("creation").style.height="180px";
                    document.getElementById("galerie").innerHTML="<img src='./pictures/1.jpg' class='active' />"
                                +"<img src='./pictures/14207846263_7f5630ecb7_b.jpg'/>"
                                +"<img src='./pictures/man-checking-phone.jpg'/>"
                                +"<img src='./pictures/article-2320841-19AA4D2C000005DC-553_634x424.jpg'/>"
                                +"<img src='./pictures/Man-looking-happily-at-phone-Betsie-Van-Der-Meer-Taxi-Getty.jpg'/>"
                                +"<img src='./pictures/relationship-759.jpg'/> ";
                    $('#galerie img:first').height(haut);
                    $('#galerie img:first').width($('#galerie img:first').height()*0.9);
                    if( $('#galerie img:first').width()<large){
                        $('#galerie img:first').width(large);
                        $('#galerie img:first').height(large/0.9);
                    }
                }
                offsetWidth = ($('#galerie img:first').width()-large)/2;
                offsetHeight = ($('#galerie img:first').height()-haut)/2;
                $('#galerie img:first').css("left", "-"+offsetWidth+"px");
                $('#galerie img:first').css("top", "-"+offsetHeight+"px");   
            }
            largebis=large;
            hautbis=haut;
            if(large<600){
                biggestHeightPhone=haut;
            }
            else{
                biggestHeightDesk=haut;
            }
        }  
    }
    /***********************************/

    /**** Function which sets how videos are displayed ****/
    function layoutVideos(){
        var i, j;
        var video;
        var large1, nouvelleHauteur, placeVideosContainer, widthVideo, widthCadreVideo, offsetCadreVideo, heightVideo, offsetCadreVideoHeight, heightVideoCaller;

        x = document.getElementsByTagName("video");
     	//S'il y en a qui s'en vont, xold nombre de gens avant, x.length nombre de gens maintenant
        if(xold>=x.length){
     		video = document.getElementsByClassName("cadreVideo");
     		for (j = 0; j < video.length && cptVideo>0; j++) {
     			if(video[j].childElementCount===0){
     				video[j].parentNode.removeChild(video[j]);
                    cptVideo--;
     			}
     		}
     	}
        large1 = $('#videos-container').width();
        large = $(window).width();
        nouvelleHauteur = (3/4)*large1;
        document.getElementById("videos-container").style.height="100%";
        document.getElementById("videos-container").style.marginTop='0px';
        if($(window).width()>768){
            if(nouvelleHauteur<=$(window).height()){
                placeVideosContainer=($(window).height()-nouvelleHauteur)/2;
                document.getElementById("videos-container").style.marginTop=placeVideosContainer+'px';
                document.getElementById("videos-container").style.height=nouvelleHauteur+ "px";
            }
            else{
                document.getElementById("videos-container").style.height=$(window).height()+"px";
            }
        }
        //On met les vidéos dans un div, cause l'erreur de stop and play, mais plus facile pour la mise en page
        for(i=x.length-1; i>=cptVideo; i--){
            var div = document.createElement('div');
            div.appendChild(x[i]);
            div.className = "cadreVideo";
            document.getElementById("videos-container").appendChild(div);
            cptVideo++;
        }
        video = document.getElementsByClassName("cadreVideo");
        if(x.length===1){
            video[0].setAttribute("id", "video-0bis");
            video[0].firstChild.setAttribute("id", "video0");

            document.getElementById("video0").style.top="0px";
            document.getElementById("video0").style.left="0px";

            document.getElementById("video-0bis").className = "cadreVideo video";
            document.getElementById("video-0bis").style.height=$('#videos-container').height()+"px";
            document.getElementById("video0").style.position="relative";
            

            if($(window).width()<=768){
                widthVideo = $('#video-0bis').height()*(4/3);
                if(widthVideo<large1){
                    widthVideo=large1;
                    heightVideo = (3/4)*widthVideo;
                    offsetCadreVideoHeight = (heightVideo-$('#videos-container').height())/2;
                    document.getElementById("video-0bis").style.height=heightVideo+"px";
                    document.getElementById("video0").style.height=heightVideo+"px";
                    document.getElementById("video0").style.width=widthVideo+"px";
                    document.getElementById("video0").style.top="-"+offsetCadreVideoHeight+"px";
                    document.getElementById("video0").style.left="0px";
                }
                else{
                    document.getElementById("video0").style.height=$('#videos-container').height()+"px";
                    document.getElementById("video0").style.width=widthVideo+"px";

                    offsetCadreVideo = (widthVideo-large1)/2;
                    document.getElementById("video0").style.top="0px";
                    document.getElementById("video0").style.left="-"+offsetCadreVideo+"px";
                }
            }
            else{
                document.getElementById("video0").style.height=nouvelleHauteur + "px";
                document.getElementById("video0").style.width=$('#videos-container').width()+"px";
                document.getElementById("video0").style.left="0px";
                if($('#videos-container').height()<nouvelleHauteur){
                    offsetCadreVideoHeight = (nouvelleHauteur-$('#videos-container').height())/2;
                    document.getElementById("video0").style.top="-"+offsetCadreVideoHeight+"px";
                }
                else{
                    document.getElementById("video0").style.top="0px";
                }
            }
            if($(window).width()<400){
                widthVideo = $(window).width();
                heightVideo = $(window).height();
                offset=((heightVideo*0.7)-widthVideo)/2;

                document.getElementById("video-0bis").style.height=heightVideo+"px";
                document.getElementById("video0").style.height=heightVideo+"px";
                document.getElementById("video0").style.width=(heightVideo*0.7)+"px";
                document.getElementById("video0").style.top="0px";
                document.getElementById("video0").style.left="-"+offset+"px";
            }
            
            document.getElementById("video-0bis").style.overflow="hidden";
            document.getElementById("video0").style.overflow="hidden";       
        }
        else if(x.length===2){
            video[0].setAttribute("id", "video-0bis2people");
            video[0].firstChild.setAttribute("id", "video02people"); 
            video[1].setAttribute("id", "video-1bis");
            video[1].firstChild.setAttribute("id", "video1");

            document.getElementById("video02people").style.top="0px";
            document.getElementById("video02people").style.left="0px";

            document.getElementById("video1").style.top="0px";
            document.getElementById("video1").style.left="0px";

            document.getElementById("video-1bis").className = "cadreVideo video";
            document.getElementById("video-1bis").style.width=$('#videos-container').width()+"px";
            $('#video-0bis2people').width("");

            if(document.getElementById("chat-container-bis").style.visibility==="hidden"){
                document.getElementById("video-0bis2people").className="cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-3 placement";
            }
            else{
                document.getElementById("video-0bis2people").className = "cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-3 placement";
            }
            if ($(window).height()<300){
                heightVideoCaller = $(window).height()*0.45;
                document.getElementById("video-0bis2people").style.width="30%";
            } 
            else{
                heightVideoCaller = ($('#video-0bis2people').width()*(3/4));
            }
            document.getElementById("video-0bis2people").style.height=heightVideoCaller+'px';
            document.getElementById("video02people").style.height=heightVideoCaller+'px';
            document.getElementById("video02people").style.width=$('#video-0bis2people').width()+'px';        

            
            if(large1<=768){
                document.getElementById("video1").style.position="relative";
                document.getElementById("video-1bis").style.height=$('#videos-container').height()+"px";
                widthVideo = $('#video-1bis').height()*(4/3);

                if(widthVideo<large1){
                    widthVideo=large1;
                    heightVideo = (3/4)*widthVideo;
                    offsetCadreVideoHeight = (heightVideo-$('#videos-container').height())/2;
                    document.getElementById("video-1bis").style.height=heightVideo+"px";
                    document.getElementById("video1").style.height=heightVideo+"px";
                    document.getElementById("video1").style.width=widthVideo+"px";
                    document.getElementById("video1").style.top="-"+offsetCadreVideoHeight+"px";
                    document.getElementById("video1").style.left="0px";
                }
                else{
                    document.getElementById("video1").style.height=$('#videos-container').height()+"px";
                    document.getElementById("video1").style.width=widthVideo+"px";

                    offsetCadreVideo = (widthVideo-large1)/2;
                    document.getElementById("video1").style.top="0px";
                    document.getElementById("video1").style.left="-"+offsetCadreVideo+"px";
                }
            }
            else{
                document.getElementById("video1").style.position="relative";
                document.getElementById("video1").style.width=$('#videos-container').width()+"px";
                document.getElementById("video1").style.left="0%";
                document.getElementById("video-1bis").style.height=nouvelleHauteur+"px";
                document.getElementById("video1").style.height=nouvelleHauteur+"px";

                if($('#videos-container').height()<nouvelleHauteur){
                    offsetCadreVideoHeight = (nouvelleHauteur-$('#videos-container').height())/2;
                    document.getElementById("video1").style.top="-"+offsetCadreVideoHeight+"px";
                }
                else{
                    document.getElementById("video1").style.top="0px";
                }
            }
            if(large1<400){
                document.getElementById("video-0bis2people").style.height="30%";
                document.getElementById("video-0bis2people").style.width=($("#video-0bis2people").height()*0.7)+"px";
                document.getElementById("video02people").style.height=$("#video-0bis2people").height()+"px";
                document.getElementById("video02people").style.width=($("#video-0bis2people").height()*0.7)+"px";

                offset=($("#video02people").width()-large1)/2;
                document.getElementById("video02people").style.left="-"+offset+"px";
            }
            document.getElementById("video-1bis").style.overflow="hidden";
            document.getElementById("video1").style.overflow="hidden";
        }
        else if(x.length===3){    
            video[0].setAttribute("id", "video-0bis3people");
            video[0].firstChild.setAttribute("id", "video03people");

            video[1].setAttribute("id", "video-1bis3people");
            video[1].firstChild.setAttribute("id", "video13people");

            video[2].setAttribute("id", "video-2bis");
            video[2].firstChild.setAttribute("id", "video2");

            document.getElementById("video03people").style.top="0px";
            document.getElementById("video03people").style.left="0px"; 

            document.getElementById("video13people").style.top="0px";
            document.getElementById("video13people").style.left="0px"; 

            $('#video-0bis3people').width("");
                

            if(document.getElementById("chat-container-bis").style.visibility==="hidden"){
                document.getElementById("videos-container").className="col-xs-12 col-sm-12 col-md-12 col-lg-12 centreVerticalement";
                document.getElementById("video-0bis3people").className = "cadreVideo video col-xs-4 col-sm-3 col-md-3 col-lg-2 col-lg-push-5 col-sm-push-perso-chat col-xs-push-4 col-md-push-perso col-placement-perso";
            }
            else{
                document.getElementById("videos-container").className = "centreVerticalement col-sm-7 col-md-8 col-lg-9 hideVideo";
                document.getElementById("video-0bis3people").className = "cadreVideo video col-xs-push-perso-chat col-xs-3 col-sm-push-perso-chat col-sm-3 col-md-push-perso col-md-3 col-lg-push-5 col-lg-2 col-placement-perso";
            }

            large1 = $('#videos-container').width();
            nouvelleHauteur = (3/4)*large1;

            document.getElementById("video-1bis3people").className="cadreVideo video col-xs-6";
            document.getElementById("video-2bis").className="cadreVideo video col-xs-6";
            document.getElementById("video13people").style.position="relative";                
            widthCadreVideo = large1/2;
            offsetCadreVideo = (large1-widthCadreVideo)/2;
            
            if ($(window).height()<300){
                heightVideoCaller = $(window).height()*0.45;
            } 
            else{
                heightVideoCaller = ($('#video-0bis3people').width()*(3/4));
            }

            document.getElementById("video-0bis3people").style.height=heightVideoCaller+"px";
            document.getElementById("video03people").style.width=$('#video-0bis3people').width()+"px";
            document.getElementById("video03people").style.height=heightVideoCaller+"px";

            
            if(large1<=768){
                document.getElementById("video-1bis3people").style.height="100%";
                document.getElementById("video-2bis").style.height="100%";
                widthVideo=(4/3)*$("#video-1bis3people").height();

                if(widthVideo<(large1/2)){
                    widthVideo=large1/2;
                    heightVideo = (3/4)*widthVideo;
                    offsetCadreVideoHeight = (heightVideo-$('#videos-container').height())/2;
                    document.getElementById("video13people").style.height=heightVideo+"px";
                    document.getElementById("video2").style.height=heightVideo+"px";
                    document.getElementById("video13people").style.top="-"+offsetCadreVideoHeight+"px";
                    document.getElementById("video2").style.top="-"+offsetCadreVideoHeight+"px";
                }
                else{
                    document.getElementById("video13people").style.height="100%";
                    document.getElementById("video2").style.height="100%";
                    document.getElementById("video13people").style.top="0px";
                    document.getElementById("video2").style.top="0px";
                }
                document.getElementById("video-1bis3people").style.width=widthVideo+"px";
                document.getElementById("video-2bis").style.width=widthVideo+"px";
                document.getElementById("video13people").style.width=widthVideo+"px";
                document.getElementById("video2").style.width=widthVideo+"px";
                        
                offsetCadreVideo = (widthVideo-widthCadreVideo)/2;
                document.getElementById("video13people").style.left="-"+offsetCadreVideo+"px";
                document.getElementById("video2").style.left="-"+offsetCadreVideo+"px";
            }
            else{
                document.getElementById("video-1bis3people").style.height=$('#videos-container').height()+ "px";
                document.getElementById("video-2bis").style.height=$('#videos-container').height()+ "px";
                document.getElementById("video-1bis3people").style.width=large1+"px";
                document.getElementById("video-2bis").style.width=large1+"px";
                document.getElementById("video13people").style.height=nouvelleHauteur+ "px";
                document.getElementById("video2").style.height=nouvelleHauteur+ "px";  
                document.getElementById("video2").style.width=large1+"px";
                document.getElementById("video13people").style.width=large1+ "px"; 
                document.getElementById("video2").style.left="-"+offsetCadreVideo+"px";
                document.getElementById("video13people").style.left="-"+offsetCadreVideo+"px";
                if($('#videos-container').height()<nouvelleHauteur){
                    offsetCadreVideoHeight = (nouvelleHauteur-$('#videos-container').height())/2;
                    document.getElementById("video13people").style.top="-"+offsetCadreVideoHeight+"px";
                    document.getElementById("video2").style.top="-"+offsetCadreVideoHeight+"px";
                }
                else{
                    document.getElementById("video13people").style.top="0px";
                    document.getElementById("video2").style.top="0px";
                }
            }

            if(large1<400){
                document.getElementById("video-0bis3people").style.height="30%";
                document.getElementById("video-0bis3people").style.width=($("#video-0bis3people").height()*0.7)+"px";
                document.getElementById("video03people").style.height=$("#video-0bis3people").height()+"px";
                document.getElementById("video03people").style.width=($("#video-0bis3people").height()*0.7)+"px";

                offset=($("#video03people").width()-large1)/2;
                document.getElementById("video03people").style.left="-"+offset+"px";
            }
            document.getElementById("video-1bis3people").style.overflow="hidden";
            document.getElementById("video13people").style.overflow="hidden";
            document.getElementById("video-2bis").style.overflow="hidden";
            document.getElementById("video2").style.overflow="hidden";
        }
        document.getElementById("corps").style.overflow="hidden";
        document.getElementById("sousCorps").style.overflow="hidden";
        document.getElementById("page").style.overflow="hidden";
        document.getElementById("sectionSite").style.overflow="hidden";
        document.getElementById("main").style.overflow="hidden";
        document.getElementById("insideMain").style.overflow="hidden";
        document.getElementById("videos-container").style.overflow="hidden";
        xold=x.length;
    }
    /**************************************************************************************/

    /**** Function which calculates the time for each sending message ****/
    function calculTemps(){
        var maDateBis = new Date();
        nTempsBis = maDateBis.getTime();
        var i;
        var res;
        tabChat = document.getElementsByClassName("time");
        for (i = 0; i < tabChat.length; i++) {
            res=(nTempsBis-tabTimeMessage[i])/60000;
            tabChat[i].innerHTML=Math.floor(res) + " mins ago";     
        }
    }
    /*********************************************************************/

    /**** Function which indicates with the chat button that we have received a message ****/
    function alertMsg(){
        if(msgReceived){
            if(clignote){
                document.getElementById("chat").style.color="blue";
                document.getElementById("chat").style.backgroundColor="white";
                clignote=false;
            }
            else{
                if(msgReceived){
                    clignote=true;
                    document.getElementById("chat").style.color="white";
                    document.getElementById("chat").style.backgroundColor="blue";
                }             
            }
        }
    }
    /***************************************************************************************/


    /**** Function which displays the chatbox ****/
    function displayChatbox(){
        var i;
        var heightVideoContainer;
        y = document.getElementsByTagName("video");
        if(msgReceived){
            msgReceived=false;
            document.getElementById("chat").style.color="white";
            document.getElementById("chat").style.backgroundColor="blue";
        }
        $('#input-text-chat').focus();
        if(document.getElementById("chat-container-bis").style.visibility==="hidden"){
            document.getElementById("videos-container").className = "col-sm-7 col-md-8 col-lg-9 hideVideo";
            if(y.length==2){
                document.getElementById("video-0bis2people").className = "cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-3 placement";
            }
            else if(y.length==3){
                document.getElementById("videos-container").className = "centreVerticalement col-sm-7 col-md-8 col-lg-9 hideVideo";
                document.getElementById("video-0bis3people").className = "cadreVideo video col-xs-push-perso-chat col-xs-3 col-sm-push-perso-chat col-sm-3 col-md-push-perso col-md-3 col-lg-push-5 col-lg-2 col-placement-perso";
            }
            document.getElementById("collapseOne").className+= " hideVideo";
            document.getElementById("divBtn").className="col-xs-push-2 col-xs-8 col-sm-push-1 col-sm-5 col-md-push-2 col-md-4 pushBtnChat col-lg-4";   
            document.getElementById("chat-container-bis").style.visibility="visible";
            document.getElementById("footerChatBox").style.visibility="visible";    
        }
        else{
            document.getElementById("divBtn").className="col-xs-push-2 col-xs-8 col-sm-push-perso-btn col-sm-5 col-md-push-4 col-md-4 col-lg-push-4 col-lg-4";  
            document.getElementById("chat-container-bis").style.visibility="hidden";
            document.getElementById("footerChatBox").style.visibility="hidden";
            document.getElementById("videos-container").className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";

            if(y.length==2){                    
                document.getElementById("video-0bis2people").className="cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-3 placement";
            }
            else if(y.length==3){
                document.getElementById("videos-container").className="col-xs-12 col-sm-12 col-md-12 col-lg-12 centreVerticalement";
                document.getElementById("video-0bis3people").className = "cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-2 col-lg-push-5 col-sm-push-4 col-xs-push-perso col-md-push-perso col-placement-perso";
            }
            document.getElementById("collapseOne").className = "panel-collapse collapse col-xs-12";
        }
    }
    /******************************************************/


    /**** Function which creates the button to reduce chatbox on a smartphone ****/
    function btnReduceChatBox(){
        var placeBtn, btn ;

        large = $(window).width();
        if(large<=768){
            if(!btnReduce){
                //Ajout du bouton
                placeBtn = document.getElementById("btns-chat");
                btn = document.createElement('button');
                btn.className="btn btn-sm";
                btn.setAttribute("id", "btnReduce");
                btn.setAttribute("onclick", "reduceChatBox()");
                btn.innerHTML="<span class='glyphicon glyphicon-comment' id='reduceIcone'></span>"                  
                placeBtn.insertBefore(btn, placeBtn.lastChild);
                btnReduce=true;
            }
        }
        else{
            if(btnReduce){
                //Suppression du btn 
                document.getElementById("btns-chat").removeChild(document.getElementById("btnReduce")); 
            }
            btnReduce=false;
        }
    }
    /******************************************************************************/
        
    /**** Function which implements the behavior of the button which reduces the chatbox on smartphone ****/
    function reduceChatBox(){
        if(document.getElementById("chat-container-bis").style.visibility==="visible"){
            document.getElementById("chat-container-bis").style.visibility="hidden";
            document.getElementById("footerChatBox").style.visibility="hidden";                
            document.getElementById("videos-container").className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
            document.getElementById("divBtn").className="col-xs-push-2 col-xs-8 col-sm-push-perso-btn col-sm-5 col-md-push-4 col-md-4 col-lg-push-4 col-lg-4";  
            if(x.length==2){
                    document.getElementById("video-0bis2people").className="cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-3 placement";
            }
            else if(x.length==3){
                document.getElementById("videos-container").className="col-xs-12 col-sm-12 col-md-12 col-lg-12 centreVerticalement";
                document.getElementById("video-0bis3people").className = "cadreVideo video col-xs-5 col-sm-4 col-md-3 col-lg-2 col-lg-push-5 col-sm-push-4 col-xs-push-perso col-md-push-perso col-placement-perso";
            }
            document.getElementById("collapseOne").className = "panel-collapse collapse col-xs-12";
        }
    }
    /******************************************************************************************************/

    /**** Function which adds in the chatbox the file which has sent ****/
    function fileSent(){
        var fileContainer;
        var firstEnfant;

        fileContainer=document.getElementById("file-container");
        if(fileContainer.children.length>0){
            firstEnfant = fileContainer.firstChild;
            if(firstEnfant.firstChild.nodeName==="A"){
                appendDIVFile();
            }
        }
    }
    /*********************************************************************/

    /**** Function which sends our message when we click on the sending button ****/
    function sendMsg(){
        var message = document.getElementById('input-text-chat');
        message.value = message.value.replace(/^\s+|\s+$/g, '');
        if (!message.value.length) return;
        localStorage.setItem('sender', pseudo);
        connection.send(message.value);
        appendDIV(message.value);
        message.value = '';
    }
    /*******************************************************************************/

    /**** Function which dynamically resizes the chatBox  ****/
    function sizeChatBox(){
        var haut3 = $(window).height();
        var hautChat2 =100-((52*100)/haut3);

        /*if($(window).width()<400){
            document.getElementById("chat-container-bis").style.height=$("#insideMain").height()+"px";
            //document.getElementById("chat-container-bis").style.width=$("#insideMain").width()+"px";
        }*/
        document.getElementById("corpsChat").style.height=hautChat2+"%";
    }
    /********************************************************/

    /**** Function which reloads the website page ****/
    function reloadPage(){
        location.reload();
    }
    /*************************************************/

    jQuery(document).ready(function(){
        setInterval(picturesChoice, 10);
    });

    jQuery(document).ready(function(){
        setInterval(displayImages, 3000);
    });

    jQuery(document).ready(function(){
        setInterval(layoutVideos, 100);
    });

    jQuery(document).ready(function(){
        setInterval(calculTemps, 100);
    });

    jQuery(document).ready(function(){
        setInterval(alertMsg, 1000);
    });

    jQuery(document).ready(function(){
        setInterval(fileSent, 100);
    });

    jQuery(document).ready(function(){
        setInterval(btnReduceChatBox, 100);
    });

    jQuery(document).ready(function(){
        setInterval(sizeChatBox, 100);
    });
        
    jQuery(document).ready(function(){
        setInterval(saisiePseudo, 100);
    });
    
    jQuery(document).ready(function(){
        setInterval(saisieRoomId, 100);
    }); 
/********** end of my code **********/
