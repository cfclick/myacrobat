function WorkBench(){
	workBench = this;
	
	//buttons
	this.reset_btn    = $('#reset_btn');
	this.delete_btn   = $('#delete_btn');
	this.email_btn	  = $('#email_btn');
	this.send_email_btn = $('#send_email_btn');
	this.restore_btn  = $('#restore_btn');
	this.sanitize_btn = $('#sanitize_btn');
	this.property_btn = $('#property_btn');
	
	//inputs
	this.fileName 		= $('#fileName');
	this.your_email 	= $('#your_email');
	this.your_subject 	= $('#your_subject');
	this.your_message 	= $('#your_message');
	
	
	//modals
	this.digital_signature_modal = $('#digital_signature_modal');
	this.stamp_modal 			 = $('#stamp_modal');
	this.redact_modal 			 = $('#redact_modal');
	this.property_modal 		 = $('#property_modal');
	this.email_modal			 = $('#email_modal');
	
	//other/DIV
	this.pdf_iframe = $('#pdf_iframe');
	this.property_modal_body = $('#property_modal_body');
	this.attached_fileName	= $('#attached_fileName');
	
	
	this.setEventListeners();
}

//Defined application configuration and make is part of main object	 

WorkBench.prototype.setEventListeners = function(event){
	
	workBench.digital_signature_modal.on('shown.bs.modal', function (){
		
			digitalSignature = new DigitalSignature();
			
	});
	
	workBench.redact_modal.on('shown.bs.modal', function (){
		
			redact = new Redact();
			
	});
	
	workBench.stamp_modal.on('shown.bs.modal', function (){
		
			stamp = new Stamp();
			
	});
	
	workBench.delete_btn.on('click', function(){
		
		var view_model = {
			fileName:workBench.fileName.val()
		};

		var url = main.config.urls.viewer.delete;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){
       			main.action_label.html('Deleting the file'); 
       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
			},
    		success: function( data ){
    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
				
				if( data.success )
					self.location = main.config.urls.root;
				else{
					main.errorModalDanger.modal('show');
					main.errorModalMessage.html(data);
				}
    			
    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
    		},
			error: function( objRequest, strError ){
				setTimeout(function (){main.loading_modal.modal('hide');},1500);
        		main.errorModalDanger.modal('show');
				main.errorModalMessage.html(objRequest); 
        	},
       	 	async: true
		});		
		
	});
	

	workBench.restore_btn.on('click', function(event){

		var view_model = {
			fileName:workBench.fileName.val()
		};

		var url = main.config.urls.viewer.restore;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){  
       			main.action_label.html('Restoring');	
       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});
			},
    		success: function( data ){
    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
    			
    			if(data.fileName)
    				var fileName = data.fileName;
    			else
    				var fileName = data.FILENAME;
			
				if( data.success )
					workBench.preview( fileName, true );
				else{
					main.errorModalDanger.modal('show');
					main.errorModalMessage.html(data);
				}

    		},
			error: function( objRequest, strError ){
				setTimeout(function (){main.loading_modal.modal('hide');},1500);
        		console.log(strError);   
        	},
       	 	async: true
    	});		
	});
	
	
	workBench.email_btn.on('click', function(){
		workBench.attached_fileName.html( workBench.fileName.val() );
		workBench.email_modal.modal('show');
	});
	
	workBench.send_email_btn.on('click', function(){
		
		
		var view_model = {
				fileName:workBench.fileName.val(),
				mailto: workBench.your_email.val(),
				subject:workBench.your_subject.val(),
				message:workBench.your_message.val()
			};
	
			var url = main.config.urls.viewer.email;
			$.ajax(	{
	        	type: "post",
	        	url: url,		
	        	data: view_model,
	       		beforeSend: function( xhr ){ 
	       			workBench.email_modal.modal('hide');
	       			main.action_label.html('Emailing');
	       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false}); 
				},
	    		success: function( fileName ){
	    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
	    		
	    			//workBench.email_modal.modal('hide');
	    			toastr.info('Email has been sent.');
	    		},
				error: function( objRequest, strError ){
					setTimeout(function (){main.loading_modal.modal('hide');},1500);
				
					workBench.email_modal.modal('hide');
					toastr.error('Unable to send the email.');
	        		console.log(objRequest);   
	        		console.log(strError);   
	        	},
	       	 	async: true
	    	});	
	    	
	});
	
	
	workBench.sanitize_btn.on('click', function(event){
		main.confirmation_text.html('Are you sure you want to Sanitize the PDF?');
		
		main.confirmation_modal.modal('show');
		
		main.confirm_yes.on('click', function(event){
			var view_model = {
				fileName:workBench.fileName.val()
			};
	
			var url = main.config.urls.sanitize.apply;
			$.ajax(	{
	        	type: "post",
	        	url: url,		
	        	data: view_model,
	       		beforeSend: function( xhr ){ 
	       			main.action_label.html('Sanitizing');
	       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});
				},
	    		success: function( data ){
	    		
	    			if(data.fileName)
	    				var fileName = data.fileName;
	    			else
	    				var fileName = data.FILENAME;
	    			
					setTimeout(function (){main.loading_modal.modal('hide');},1500);
					if( data.success )
						workBench.preview( fileName, true );
					else{
						main.errorModalDanger.modal('show');
						main.errorModalMessage.html(data);
					}
						
	    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
	    		},
				error: function( objRequest, strError ){
					setTimeout(function (){main.loading_modal.modal('hide');},1500);
	        		main.errorModalDanger.modal('show');
					main.errorModalMessage.html(objRequest);
	        	},
	       	 	async: true
	    	});	
	    	
	    	main.confirmation_modal.modal('hide');	
		});
	});
	
	workBench.property_btn.on('click', function(event){
		
	//	main.confirmation_modal.modal('show');
		
			var view_model = {
				fileName:workBench.fileName.val()
			};
	
			var url = main.config.urls.properties.index;
			$.ajax(	{
	        	type: "post",
	        	url: url,		
	        	data: view_model,
	       		beforeSend: function( xhr ){ 
	       			main.action_label.html('Loading');
	       			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
				},
	    		success: function( html ){
	    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
	    			workBench.property_modal_body.html( html );
	    			workBench.property_modal.modal('show');
	    			
	    			properties = new Properties();
	    		},
				error: function( objRequest, strError ){
	        		setTimeout(function (){main.loading_modal.modal('hide');},1500);  
	        	},
	       	 	async: true
	    	});	
	    	
	    	main.confirmation_modal.modal('hide');	
		});
			
}

WorkBench.prototype.preview = function( fileName, istemp ){
		    	
    var url = main.config.urls.viewer.preview + "&fileName=" + fileName + '&istemp=' + istemp;	
	workBench.pdf_iframe.attr("src", url);

}
