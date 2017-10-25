function DigitalSignature(){
	digitalSignature = this;
	
	//buttons
	this.add_signature_field_btn = $('#add_signature_field_btn');
	
	//inputs
	this.fileName = $('#fileName');
	this.d_x1 = $("#d_x1");
	this.d_y1 = $("#d_y1");
	this.d_x2 = $("#d_x2");
	this.d_y2 = $("#d_y2");
	this.page = $("#page");
	this.fieldName = $("#fieldName");
	
	//form
	//this.digital_signature_form = $("#digital_signature_form");
	
	this.setEventListeners();
}

//Defined application configuration and make is part of main object	 

DigitalSignature.prototype.setEventListeners = function(event){
	
	
	digitalSignature.add_signature_field_btn.on('click',function(e){
			
			var view_model = {
						newuserpassword: main.newuserpassword.val()
						,x1:digitalSignature.d_x1.val()
						,y1:digitalSignature.d_y1.val()
						,x2:digitalSignature.d_x2.val()
						,y2:digitalSignature.d_y2.val()
						,page:digitalSignature.page.val()
						,fieldName:digitalSignature.fieldName.val()
						,fileName:workBench.fileName.val()
					};
			
			msg = digitalSignature.validate( view_model );
			if( msg == ""){
				var url = main.config.urls.digitalsignature.addField;
					
					$.ajax(	{
			        	type: "post",
			        	url: url,		
			        	data: view_model,
			       		beforeSend: function( xhr ){  
			       			main.action_label.html('Adding signature field');
			       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
						},
			    		success: function( data ){
			    			//setTimeout(function (){main.loading_modal.modal('hide');},1500);
			    			//console.log(fileName);
							//workBench.preview( fileName, true );
							
			    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
			    			if(data.fileName)
			    				var fileName = data.fileName;
			    			else
			    				var fileName = data.FILENAME;
						
							if( data.success ){
								workBench.preview( fileName, true );
								toastr.info('Signature field will not show up if you are using Chrome/Firefox/Safari browesers! download the PDF and open it using Adobe Acrobat Reader.');
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

DigitalSignature.prototype.validate = function( model ){
	
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
	
	if (model.fieldName == "") {
        message+="Signature field name is required<br>";
        
    }
    
    if (model.page == "" ) {
        message+="Page number is required.<br>";        
    }
    
    if ( Number(model.page) <= 0) {
        message+="Enter a positive number for page.<br>";        
    }
	return message;
}


