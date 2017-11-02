
function Main(){
	main = this;
	
	this.newuserpassword 	= $('#newuserpassword');
	
	
	
	/*this.fieldName				 = $('#fieldName');
	this.fileName				 = $('#fileName');*/
	//inputs
	this.url_input		= $('#url_input');
	this.uploaded_file 	= $('#uploaded_file');
	
	//button
	this.upload_pdf_btn = $('#upload_pdf_btn');	
	this.confirm_yes 	= $('#confirm_yes');
	this.urltoPDF_btn 	= $('#urltoPDF_btn');
	this.btnExpiredOk	= $('#btnExpiredOk');
	
	//modal
	this.confirmation_modal		= $('#confirmation_modal');
	this.fileUploadModal 		= $('#fileUploadModal');
	this.loading_modal			= $('#loading_modal');
	this.errorModalDanger		= $('#errorModalDanger');
	this.session_expired_modal 	= $('#session_expired_modal');
	
	//DIV/span/label
	this.fileUploadModal_body 	= $('#fileUploadModal_body');
	this.confirmation_text		= $('#confirmation_text');
	this.preload_div			= $("#preload_div");
	this.action_label			= $("#action_label");
	this.errorModalMessage		= $('#errorModalMessage');

	this.setEventListeners();
	
}

//Defined application configuration and make is part of main object	
Main.prototype.config = new Config(); 

Main.prototype.setEventListeners = function(event){
	

	/*main.upload_pdf_btn.on('click', function(){
		if( main.uploaded_file.val().length == 0 ){
			toastr.error('Please select a file then upload.');			    			
		}else{	
			var view_model = { 'files[]' : main.uploaded_file.val()};
			main.action_label.html('Uploading');
			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});
			var url = main.config.urls.main.uploadFiles;
			$.ajax(	{
	        	type: "post",
	        	url: url,		
	        	data: view_model,
	       		beforeSend: function( xhr ){  
					main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
				},
	    		success: function( data ){
					main.loading_modal.modal('hide');
	    			
	    			self.location = main.config.urls.root;
	    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
	    		},
				error: function( objRequest, strError ){
					main.loading_modal.modal('hide');
	        		console.log(objRequest);   
	        		console.log(strError);   
	        	},
	       	 	async: true
	    	});		
	    }
	});*/

	/*main.urltoPDF_btn.on('click', function(){
		var view_model = { url_input : main.url_input.val()};
		
		var url = main.config.urls.main.urlToPDF;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){  
       			main.action_label.html('Converting to PDF');
				main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
			},
    		success: function( data ){
				main.loading_modal.modal('hide');
    			
    			self.location = main.config.urls.root;
    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
    		},
			error: function( objRequest, strError ){
				main.loading_modal.modal('hide');
        		console.log(objRequest);   
        		console.log(strError);   
        	},
       	 	async: true
    	});		
	});*/

	main.btnExpiredOk.on('click',function(){
		self.location = main.config.urls.root;
	});
	
	
	main.loading_modal.on('hidden.bs.modal', function () {
	    $(this).data('bs.modal', null);
	});
	
	/*main.fileUploadModal.on('shown.bs.modal', function (){
	  	var url = main.config.urls.main.fileUploadForm;
		$.ajax(	{
        	type: "get",
        	url: url,		
       		beforeSend: function( xhr ){  	 
			},
    		success: function( data ){
    			main.fileUploadModal_body.html(data);
    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
    		},
			error: function( objRequest, strError ){
        		console.log(objRequest);   
        		console.log(strError);   
        	},
       	 	async: true
    	});		
	});*/
	
	
	
	main.confirmation_modal.on('shown.bs.modal', function (){
		
			redact = new Redact();
			
	});
	
}

