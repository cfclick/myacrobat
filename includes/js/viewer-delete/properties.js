function Properties(){
	properties = this;
	
	//buttons
	this.add_custom_prop_btn 	= $('#add_custom_prop_btn');
	this.save_properties_btn 	= $('#save_properties_btn');
	this.export_meta_btn 		= $('#export_meta_btn');
	this.import_meta_btn 		= $('#import_meta_btn');
	
	//divs
	this.custom_prop_div = $('#custom_prop_div');
	this.main_properties_body = $('#main_properties_body');
	
	//inputs
	this.fileName 			= $('#fileName');
	this.fieldName 			= $('#fieldName');
	this.custome_prop_name 	= $('#custome_prop_name');
	this.custome_prop_value = $('#custome_prop_value');
	this.title_input 		= $('#title_input');
	this.author_input 		= $('#author_input');
	this.subject_input 		= $('#subject_input');
	this.keywords_input 	= $('#keywords_input');
	
	this.setEventListeners();
}

Properties.prototype.reinitInputs = function(){
	this.title_input 		= $('#title_input');
	this.author_input 		= $('#author_input');
	this.subject_input 		= $('#subject_input');
	this.keywords_input 	= $('#keywords_input');
}
//Defined application configuration and make is part of main object	 

Properties.prototype.setEventListeners = function(event){
	
	properties.add_custom_prop_btn.on('click',function(e){
			var view_model = {
						fileName:workBench.fileName.val(),
						name: properties.custome_prop_name.val(),
						value:properties.custome_prop_value.val()
					};
					var url = main.config.urls.properties.add;
					
					$.ajax(	{
			        	type: "post",
			        	url: url,		
			        	data: view_model,
			       		beforeSend: function( xhr ){  
			       			main.action_label.html('Adding');
							main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
						},
			    		success: function( html ){
			    			setTimeout(function (){main.loading_modal.modal('hide');},1500);			    			
			    			properties.custom_prop_div.html( html );
			    		},
						error: function( objRequest, strError ){
							setTimeout(function (){main.loading_modal.modal('hide');},1500);
							
							main.errorModalDanger.modal('show');
							main.errorModalMessage.html(objRequest);  
			        	},
			       	 	async: true
			    	});		
	});
	
	
	properties.save_properties_btn.on('click',function(e){
			
			properties.reinitInputs();
			var view_model = {
						fileName:workBench.fileName.val(),
						Title: properties.title_input.val(),
						Author:properties.author_input.val(),
						Subject:properties.subject_input.val(),
						Keywords:properties.keywords_input.val()
					};
					var url = main.config.urls.properties.save;
					
					$.ajax(	{
			        	type: "post",
			        	url: url,		
			        	data: view_model,
			       		beforeSend: function( xhr ){  
			       			main.action_label.html('Saving');
							main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
						},
			    		success: function( html ){
			    			setTimeout(function (){main.loading_modal.modal('hide');},1500);
			    			properties.main_properties_body.html( html );
			    		},
						error: function( objRequest, strError ){
							setTimeout(function (){main.loading_modal.modal('hide');},1500);							
							main.errorModalDanger.modal('show');
							main.errorModalMessage.html(objRequest);   
			        	},
			       	 	async: true
			    	});		
	});
	
	
	properties.export_meta_btn.on('click',function(e){
			
			properties.reinitInputs();
			var view_model = {
						fileName:workBench.fileName.val(),
						Title: properties.title_input.val(),
						Author:properties.author_input.val(),
						Subject:properties.subject_input.val(),
						Keywords:properties.keywords_input.val()
					};
					var url = main.config.urls.properties.export;
					
					$.ajax(	{
			        	type: "post",
			        	url: url,		
			        	data: view_model,
			       		beforeSend: function( xhr ){  
			       			main.action_label.html('Exporting');
							main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
						},
			    		success: function( data ){
			    			
			    			setTimeout(function (){main.loading_modal.modal('hide');},1500);			    			
						
							if( data.success ){
								toastr.success('Metadata expoted successfully');
							}else{
								main.errorModalDanger.modal('show');
								main.errorModalMessage.html(data);
							}
			    		},
						error: function( objRequest, strError ){
							setTimeout(function (){main.loading_modal.modal('hide');},1500);
							main.errorModalDanger.modal('show');
							main.errorModalMessage.html(objRequest); 
			        	},
			       	 	async: true
			    	});		
	});
								
}

Properties.prototype.deleteCustomProperty = function(prop){
	var view_model = {
		fileName:workBench.fileName.val(),
		name: prop 
		
	};
	var url = main.config.urls.properties.delete;
	
	$.ajax(	{
    	type: "post",
    	url: url,		
    	data: view_model,
   		beforeSend: function( xhr ){  
   			main.action_label.html('Deleting');
			main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});	 
		},
		success: function( html ){
			setTimeout(function (){main.loading_modal.modal('hide');},1500);
			properties.custom_prop_div.html( html );
		},
		error: function( objRequest, strError ){
			setTimeout(function (){main.loading_modal.modal('hide');},1500);
			main.errorModalDanger.modal('show');
			main.errorModalMessage.html(objRequest);   
    	},
   	 	async: true
	});		
}

