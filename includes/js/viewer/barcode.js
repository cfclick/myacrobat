function Barcode(){
	barcode = this;
	
	//buttons
	this.add_barcode_btn = $('#add_barcode_btn');
	
	//inputs
	this.b_page = $("#b_page");
	this.textToEncode = $("#textToEncode");
	
	this.setEventListeners();
}


Barcode.prototype.setEventListeners = function(event){
	
	barcode.add_barcode_btn.on('click',function(e){
		
			var view_model = { pages:barcode.b_page.val()
								,fileName:workBench.fileName.val()
								,textToEncode:barcode.textToEncode.val()
							  };
							  
			msg = barcode.validate( view_model );
			if( msg == ""){
				
				var url = main.config.urls.barcode.add;
				
				$.ajax(	{
		        	type: "post",
		        	url: url,		
		        	data: view_model,
		       		beforeSend: function( xhr ){  
		       			main.action_label.html('Adding Barcode');
		       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
					},
		    		success: function( data ){
		    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
		    			if(data.fileName)
		    				var fileName = data.fileName;
		    			else
		    				var fileName = data.FILENAME;
					
						if( data.success ){
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
						main.errorModalDanger.modal('show');
						main.errorModalMessage.html(strError);
		        	},
		       	 	async: true
		    	});
			    	
			}else{
				toastr.error(msg);
			}			
	});
								
}

Barcode.prototype.validate = function( model ){

	var message = "";
    if (model.textToEncode == "") {
        message+="Text To Encode is required<br>";
        
    }

    if (model.pages == "" ) {
        message+="Number of pages to apply the barcode is required.<br>";        
    }
    
	return message;
}

