function Redact(){
	redact = this;
	
	//buttons
	this.redact_apply_btn = $('#redact_apply_btn');
	
	//inputs
	this.fileName = $('#fileName');
	this.fieldName = $('#fieldName');
	this.r_x1 = $("#r_x1");
	this.r_y1 = $("#r_y1");
	this.r_x2 = $("#r_x2");
	this.r_y2 = $("#r_y2");
	this.r_page = $("#r_page");
	
	
	this.setEventListeners();
}

//Defined application configuration and make is part of main object	 

Redact.prototype.setEventListeners = function(event){
	
	redact.redact_apply_btn.on('click',function(e){
			var view_model = {
						newuserpassword: main.newuserpassword.val()
						,x1:redact.r_x1.val()
						,y1:redact.r_y1.val()
						,x2:redact.r_x2.val()
						,y2:redact.r_y2.val()
						,page:redact.r_page.val()
						,fileName:workBench.fileName.val()
					};
			
			msg = redact.validate( view_model );
			if( msg == ""){
				var url = main.config.urls.redact.add;
					
				$.ajax(	{
		        	type: "post",
		        	url: url,		
		        	data: view_model,
		       		beforeSend: function( xhr ){  
		       			main.action_label.html('Redacting');
						  main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
					},
		    		success: function( data ){
		    			//setTimeout(function (){main.loading_modal.modal('hide');},1500);
		    			//workBench.preview( fileName, true );
		    			
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
		        		console.log(objRequest);   
		        		console.log(strError);   
		        	},
		       	 	async: true
		    	});		
			}else{
				toastr.error(msg);
			}			
	});
								
}

Redact.prototype.validate = function( model ){
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

