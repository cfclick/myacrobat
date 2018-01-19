function Protect(){
	protect = this;
	
	//buttons
	this.password_apply_btn = $('#password_apply_btn');
	
	//inputs
	this.owner_pass = $('#owner_pass');
	this.user_pass  = $('#user_pass');
	this.permissions_type = $('#permissions_type');
		
	this.setEventListeners();
}

//Defined application configuration and make is part of main object	 

Protect.prototype.setEventListeners = function(event){
	
	protect.password_apply_btn.on('click', function(){
		var view_model = { owner_pass : protect.owner_pass.val()
							, user_pass : protect.user_pass.val()
							, fileName:workBench.fileName.val()
							, permissions:protect.permissions_type.val()};
		
		var url = main.config.urls.protect.passwordProtect;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){  
       			main.action_label.html('Password Protecting');
				main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 	 
			},
    		success: function( data ){
				setTimeout(function (){main.loading_modal.modal('hide');},1500);
    			if(data.fileName)
    				var fileName = data.fileName;
    			else
    				var fileName = data.FILENAME;
			
				if( data.success || data.SUCCESS ){
					workBench.preview( fileName, true );
				}else{
					main.errorModalDanger.modal('show');
					if( data.showerror )
						main.errorModalMessage.html(data.showerror);
					else
						main.errorModalMessage.html(data);
				}
    		},
			error: function( objRequest, strError ){
				setTimeout(function (){main.loading_modal.modal('hide');},1500); 
        	},
       	 	async: true
    	});		
	});
								
}

Protect.prototype.validate = function( model ){
	console.log(model);
	var message = "";
    if (model.x1 == "") {
        message+="X1 conrdinate is required<br>";
        
    }
    if (model.y1 == "") {
        message+="Y1 conrdinate is required<br>";
        
    }
    if (model.x2 == "") {
        message+="X2 conrdinate is required<br>";
        
    }
    
    if (model.y2 == "") {
        message+="Y2 conrdinate is required<br>";
        
    }

    if (model.page == "" ) {
        message+="Page number is required.<br>";        
    }
    
    if ( Number(model.page) <= 0) {
        message+="Enter a positive number for page.<br>";        
    }
	return message;
}

