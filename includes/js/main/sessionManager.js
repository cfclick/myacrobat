function SessionManager(){
	sessionManager = this;
	
	this.sessServerAliveTime = 10 * 60 * 4;
	this.sessionTimeout = 1 * 60000;
	this.sessLastActivity;
	this.idleTimer;
	this.remainingTimer;
	this.isTimout = false;
	
	this.sess_intervalID;
	this.idleIntervalID;
	this.sess_lastActivity;
	this.timer;
	this.isIdleTimerOn = false;
	
	//buttons
	this.btnOk = $("#btnOk");
	this.btnLogoutNow = $("#btnLogoutNow");
	this.btnSessionExpiredCancelled = $("#btnSessionExpiredCancelled");
	
	//modals
	this.session_expire_warning_modal = $("#session_expire_warning_modal");
	this.session_expired_modal = $("#session_expired_modal");
	
	
	localStorage.setItem('sessionSlide', 'isStarted');
	this.setEventListener();
	this.initSessionMonitor();
	
}

SessionManager.prototype.setEventListener = function(){
	
	sessionManager.btnOk.click(function () {
	    
	    $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
	    sessionManager.startIdleTime();
	    clearInterval(sessionManager.remainingTimer);
	    sessionManager.isTimout = true;
	    clearInterval(sessionManager.sess_intervalID);
        clearInterval(sessionManager.idleIntervalID);
	    localStorage.setItem('sessionSlide', 'isStarted');
	   /* Manually */
		$('.modal').remove();
		//$('.modal-backdrop').remove();
		//$('body').removeClass( "modal-open" );
	    
	});
	
	sessionManager.btnLogoutNow.click(function () {
	    localStorage.setItem('sessionSlide', 'loggedOut');
	    
	    sessionManager.sessLogOut();
	    /* Manually */
		$('.modal').remove();
		//$('.modal-backdrop').remove();
		//$('body').removeClass( "modal-open" );
		window.location = main.config.urls.root;
	
	});
	
	sessionManager.btnSessionExpiredCancelled.click(function () {
	    $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
	    
	});
	
	sessionManager.session_expired_modal.on("click", sessionManager.sessionExpiredClicked, false);
	
	sessionManager.session_expired_modal.on('shown.bs.modal', function () {
	     sessionManager.session_expire_warning_modal.modal('hide');
	    $(this).before($('.modal-backdrop'));
	    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
	});
	
	sessionManager.session_expired_modal.on("hidden.bs.modal", function () {
	    window.location = main.config.urls.root;
	});
	
	 sessionManager.session_expire_warning_modal.on('shown.bs.modal', function () {
	     sessionManager.session_expire_warning_modal.modal('show');
	    $(this).before($('.modal-backdrop'));
	    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
	});

}

SessionManager.prototype.sessPingServer = function() {
    if (!sessionManager.isTimout) {
    	var url = main.config.urls.main.ping;
        $.ajax({
            url: url,
            dataType: "json",
            async: false,
            type: "POST"
        });

        return true;
    }
}

SessionManager.prototype.sessServerAlive = function() {
    sessionManager.sess_intervalID = setInterval('sessionManager.sessPingServer()', sessionManager.sessServerAliveTime);
}

SessionManager.prototype.initSessionMonitor = function() {
    $(document).bind('keypress.session', function (ed, e) {
        sessionManager.sessKeyPressed(ed, e);
    });
    $(document).bind('mousedown keydown', function (ed, e) {

        sessionManager.sessKeyPressed(ed, e);
    });
    sessionManager.sessServerAlive();
    sessionManager.startIdleTime();
}

$(window).scroll(function (e) {
    localStorage.setItem('sessionSlide', 'isStarted');
    sessionManager.startIdleTime();
});

SessionManager.prototype.sessKeyPressed = function(ed, e) {
    var target = ed ? ed.target : window.event.srcElement;
    var sessionTarget = $(target).parents("#session_expire_warning_modal").length;

    if (sessionTarget != null && sessionTarget != undefined) {
        if (ed.target.id != "btnSessionExpiredCancelled" && ed.target.id != "btnSessionModal" && ed.currentTarget.activeElement.id != "session_expire_warning_modal" && ed.target.id != "btnExpiredOk"
             && ed.currentTarget.activeElement.className != "modal fade modal-overflow in" && ed.currentTarget.activeElement.className != 'modal-header'
    && sessionTarget != 1 && ed.target.id != "session_expire_warning_modal") {
            localStorage.setItem('sessionSlide', 'isStarted');
            sessionManager.startIdleTime();
        }
    }
}

SessionManager.prototype.startIdleTime = function() {
    sessionManager.stopIdleTime();
    localStorage.setItem("sessIdleTimeCounter", $.now());
    sessionManager.idleIntervalID = setInterval('sessionManager.checkIdleTimeout()', 1000);
    sessionManager.isIdleTimerOn = false;
}


SessionManager.prototype.sessionExpiredClicked = function(evt) {
    window.location = main.config.urls.root;
}


SessionManager.prototype.stopIdleTime = function() {
    clearInterval(sessionManager.idleIntervalID);
    clearInterval(sessionManager.remainingTimer);
}

SessionManager.prototype.checkIdleTimeout = function() {
     // $('#sessionValue').val() * 60000;
    var idleTime = (parseInt(localStorage.getItem('sessIdleTimeCounter')) + (sessionManager.sessionTimeout)); 
    if ($.now() > idleTime + 60000) {
        $("#session_expire_warning_modal").modal('hide');
        $("#session_expired_modal").modal('show');
        clearInterval(sessionManager.sess_intervalID);
        clearInterval(sessionManager.idleIntervalID);

        $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 100);
        $("#session_expired_modal").css('z-index', 2000);
        $('#btnExpiredOk').css('background-color', '#428bca');
        $('#btnExpiredOk').css('color', '#fff');

        sessionManager.isTimout = true;

        sessionManager.sessLogOut();

    }
    else if ($.now() > idleTime) {
        ////var isDialogOpen = $("#session_expire_warning_modal").is(":visible");
        if (!sessionManager.isIdleTimerOn) {
            ////alert('Reached idle');
            localStorage.setItem('sessionSlide', false);
            sessionManager.countdownDisplay();

            $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 500);
            $('#session_expire_warning_modal').css('z-index', 1500);
            $('#btnOk').css('background-color', '#428bca');
            $('#btnOk').css('color', '#fff');
            $('#btnSessionExpiredCancelled').css('background-color', '#428bca');
            $('#btnSessionExpiredCancelled').css('color', '#fff');
            $('#btnLogoutNow').css('background-color', '#428bca');
            $('#btnLogoutNow').css('color', '#fff');

            $("#seconds-timer").empty();
            $("#session_expire_warning_modal").modal('show');

            sessionManager.isIdleTimerOn = true;
        }
    }
}


SessionManager.prototype.countdownDisplay = function() {

    var dialogDisplaySeconds = 60;

    sessionManager.remainingTimer = setInterval(function () {
        if (localStorage.getItem('sessionSlide') == "isStarted") {
            $("#session_expire_warning_modal").modal('hide');
            sessionManager.startIdleTime();
            clearInterval(sessionManager.remainingTimer);
        }
        else if (localStorage.getItem('sessionSlide') == "loggedOut") {         
            $("#session_expire_warning_modal").modal('hide');
            $("#session_expired_modal").modal('show');
        }
        else {

            $('#seconds-timer').html(dialogDisplaySeconds);
            dialogDisplaySeconds -= 1;
        }
    }
    , 1000);
};

SessionManager.prototype.sessLogOut = function() {
	var url = main.config.urls.main.logout;
   $.ajax({
        url: url,
       dataType: "json",
       async: false,
       type: "POST"
   });
    
    window.location = main.config.urls.root;
}