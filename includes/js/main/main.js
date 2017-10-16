
function Main(){
	main = this;
	
	this.add_password_btn 	= $('#add_password_btn');
	this.newuserpassword 	= $('#newuserpassword');
	
	
	
	/*this.fieldName				 = $('#fieldName');
	this.fileName				 = $('#fileName');*/
	//inputs
	this.url_input	= $('#url_input');
	this.uploaded_file = $('#uploaded_file');
	
	//button
	this.upload_pdf_btn = $('#upload_pdf_btn');	
	this.confirm_yes = $('#confirm_yes');
	this.urltoPDF_btn = $('#urltoPDF_btn');
	
	//modal
	this.confirmation_modal	= $('#confirmation_modal');
	this.fileUploadModal 	= $('#fileUploadModal');
	this.loading_modal		= $('#loading_modal');
	this.errorModalDanger	= $('#errorModalDanger');
	
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
	
	
	main.add_password_btn.on('click', function(){
		var view_model = {};
		view_model.newuserpassword = main.newuserpassword.val();
		view_model.pdfFile = main.pdfFile.val();
		var url = main.config.urls.main.passwordProtect;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){  	 
			},
    		success: function( data ){
    			console.log(data);
    			main.loadPDF(data);
    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
    		},
			error: function( objRequest, strError ){
        		console.log(objRequest);   
        		console.log(strError);   
        	},
       	 	async: true
    	});		
	});
	
	main.add_password_btn.on('click', function(){
		var view_model = {};
		view_model.newuserpassword = main.newuserpassword.val();
		view_model.pdfFile = main.pdfFile.val();
		var url = main.config.urls.main.passwordProtect;
		$.ajax(	{
        	type: "post",
        	url: url,		
        	data: view_model,
       		beforeSend: function( xhr ){  	 
			},
    		success: function( data ){
    			console.log(data);
    			main.loadPDF(data);
    			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
    		},
			error: function( objRequest, strError ){
        		console.log(objRequest);   
        		console.log(strError);   
        	},
       	 	async: true
    	});		
	});
	
	

	main.upload_pdf_btn.on('click', function(){
		var view_model = { 'files[]' : main.uploaded_file.val()};
		main.action_label.html('Uploading');
		main.loading_modal.modal({show:true,backdrop: 'static',keyboard: false});
		/*var url = main.config.urls.main.uploadFiles;
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
    	});	*/	
	});

	main.urltoPDF_btn.on('click', function(){
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
	});

/*
	main.urltoPDF_btn.on('click', function(){
		var view_model = { url_input : main.url_input.val()};
		
		var url = main.config.urls.main.urlToPDF;
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
	});*/
	
	main.loading_modal.on('shown.bs.modal', function(){
		
		//setTimeout(main.loading_modal.modal('hide'),950);
		
	});
	
	main.loading_modal.on('hidden.bs.modal', function () {
	    $(this).data('bs.modal', null);
	});
	
	main.fileUploadModal.on('shown.bs.modal', function (){
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
	});
	
	
	
	main.confirmation_modal.on('shown.bs.modal', function (){
		
			redact = new Redact();
			
	});
	
	

	
}
/*
Main.prototype.loadPDF = function( pdfobj ){
	
    if( !pdfobj )
     	file=main.pdfFile.val();
    else
     	file=pdfobj.PDFFILE;
     	
    var url = main.config.urls.main.preview + "&pdfFile=" + file +'&newuserpassword=' + main.newuserpassword.val();	
	main.pdfLink.html(file);
	main.pdfFile.val(file);
	main.myIframe.attr("src", url);

}
*/
/*
Main.prototype.readMetadata = function(){
	var view_model = {};
	view_model.newuserpassword = main.newuserpassword.val();
	view_model.pdfFile = main.pdfFile.val();
	var url = main.config.urls.main.readMetadata;
	$.ajax(	{
    	type: "post",
    	url: url,		
    	data: view_model,
   		beforeSend: function( xhr ){  	 
		},
		success: function( data ){
			console.log(data);
			$('#rc_reader_author').val( data.reader.Author );
			$('#rc_reader_subject').val( data.reader.Subject );
			$('#rc_reader_title').val( data.reader.Title );
			$('#rc_reader_keywords').val( data.reader.Keywords );
			
			$('#rc_reader_created').html( data.reader.Created );
			$('#rc_reader_modified').html( data.reader.Modified );
			$('#rc_reader_created').html( data.reader.Producer );
			$('#rc_reader_application').html( data.reader.Application );
			$('#rc_reader_version').html( data.reader.Version );
			
			$('#rc_reader_CenterWindowOnScreen').html(data.reader.CenterWindowOnScreen);
			$('#rc_reader_ChangingDocument').html(data.reader.ChangingDocument);
			$('#rc_reader_Commenting').html(data.reader.Commenting);
			$('#rc_reader_ContentExtraction').html(data.reader.ContentExtraction);
			$('#rc_reader_CopyContent').html(data.reader.CopyContent);
			$('#rc_reader_DocumentAssembly').html(data.reader.DocumentAssembly);
			$('#rc_reader_Encryption').html(data.reader.Encryption);
			$('#rc_reader_FillingForm').html(data.reader.FillingForm);
			$('#rc_reader_FitToWindow').html(data.reader.FitToWindow);
			$('#rc_reader_HideMenubar').html(data.reader.HideMenubar);
			$('#rc_reader_HideToolbar').html(data.reader.HideToolbar);
			$('#rc_reader_HideWindowUI').html(data.reader.HideWindowUI);
			
			//$('#tab'+nextTab).html( data ).append( new Client( main.loggedInIdentity, viewModel ) );
		},
		error: function( objRequest, strError ){
    		console.log(objRequest);   
    		console.log(strError);   
    	},
   	 	async: true
	});		
}
*/
