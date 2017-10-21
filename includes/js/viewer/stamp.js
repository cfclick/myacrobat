function Stamp(){
	stamp = this;
	
	//buttons
	this.add_stamp_btn = $('#add_stamp_btn');
	
	//inputs
	//this.fileName = $('#fileName');
	this.s_x1 = $("#s_x1");
	this.s_y1 = $("#s_y1");
	this.s_x2 = $("#s_x2");
	this.s_y2 = $("#s_y2");
	this.s_page = $("#s_page");
	this.stamp_note = $("#stamp_note");
	this.stamp_type = $("#stamp_type");
	
	
	this.setEventListeners();
}

//Defined application configuration and make is part of main object	 

Stamp.prototype.setEventListeners = function(event){
	
	stamp.add_stamp_btn.on('click',function(e){
			var view_model = {
						newuserpassword: main.newuserpassword.val()
						,x1:stamp.s_x1.val()
						,y1:stamp.s_y1.val()
						,x2:stamp.s_x2.val()
						,y2:stamp.s_y2.val()
						,pages:stamp.s_page.val()
						,fileName:workBench.fileName.val()
						,type:$("#stamp_type").find(":selected").text()
						,typeValue:$("#stamp_type").find(":selected").val()
						,note:stamp.stamp_note.val()
					};
			msg = stamp.validate( view_model );
			if( msg == ""){
				
				var url = main.config.urls.stamp.add;
				
				$.ajax(	{
		        	type: "post",
		        	url: url,		
		        	data: view_model,
		       		beforeSend: function( xhr ){  
		       			main.action_label.html('Adding signature field');
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
			    	
			}else{
				toastr.error(msg);
			}			
	});
								
}

Stamp.prototype.validate = function( model ){
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

    if (model.pages == "" ) {
        message+="Number of pages to apply the stamp is required.<br>";        
    }
    
    if (model.typeValue == "" ) {
        message+="Stamp type is required.<br>";        
    }
    
	return message;
}

