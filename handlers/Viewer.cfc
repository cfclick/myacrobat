
component{
	
	// OPTIONAL HANDLER PROPERTIES
	this.prehandler_only 	= "";
	this.prehandler_except 	= "";
	this.posthandler_only 	= "";
	this.posthandler_except = "";
	this.aroundHandler_only = "";
	this.aroundHandler_except = "";		
	// REST Allowed HTTP Methods Ex: this.allowedMethods = {delete='POST,DELETE',index='GET'}
	this.allowedMethods = {};
	
	function preview( event, rc, prc ){
		
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;

		if( fileexists( rc.pathAndName ) ){
			var binaryobj = filereadBinary( rc.pathAndName  );
			event.renderData( data=binaryobj, type="PDF" ).nolayout();
		}else{
			     
			throw(message:"file #rc.fileName# not found.");
		}
		
	}


	function restore( event, rc, prc ){
		
		rc.originalFile = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\original\" & rc.fileName;
		rc.destination1 = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		rc.destination2 = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\";

		thread name="restoreThread01" action="run" priority="high" src=rc.originalFile dest=rc.destination1 {
			try{
					cffile(action="copy",
					source=src,
					destination=dest, mode="644");
			}catch( any e ){
				throw( e );
			}
			
		}

		thread action="sleep" duration="300";
		
		thread name="restoreThread03" action="run" priority="high" src=rc.originalFile dest=rc.destination2 {
			try{
					cffile(action="copy",
					source=src,
					destination=dest, mode="644");
			}catch( any e ){
				throw( e );
			}
		}

		thread name="restoreThread01,restoreThread03" action="join";
		
		rc.success = true;
		rc['fileName'] = rc.fileName;
		sleep(2000);
		event.renderData( data=rc, type="json" ).nolayout();
	}


	function delete( event, rc, prc ){
		
		rc.originalFile 	= application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\original\" & rc.fileName;
		rc.thumbnailFolder 	= application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\thumbnail\";
		rc.tempWorkFile 	= GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		rc.workFile 		= application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;

		filedelete( rc.originalFile );
		filedelete( rc.tempWorkFile );
		filedelete( rc.workFile );
		cfdirectory( directory=rc.thumbnailFolder, action="delete", recurse="true");
		rc.success = true; 
		event.renderData( data=rc, type="json" ).nolayout();
	}
	
	
	function email( event, rc, prc ){
		
		rc.workFile 		= application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;	
		
		 /* create mailer service */ 
	    mailerService = new mail(); 
	    if(IsDefined("rc.mailto")) 
	    { 
	        
	            savecontent variable="mailBody"{ 
	                WriteOutput("This message was sent by an automatic mailer from MyAcrobat:" & "<br><br>" & rc.message); 
	            } 
	            /* set mail attributes using implicit setters provided */ 
	            mailerService.setTo(rc.mailto); 
	            mailerService.setFrom( application.cbcontroller.getconfigSettings().emailFrom ); 
	            mailerService.setSubject(rc.subject); 
	            mailerService.setType("html"); 
	            /* add mailparams */ 
	            mailerService.addParam(file= rc.workFile,type="text/plain",remove=false);         
	            /* send mail using send(). Attribute values specified in an end action like "send" will not persist after the action is performed */ 
	            mailerService.send(body=mailBody); 
	            	        
	    } 
		event.renderData( data="success", type="json" ).nolayout();
	}
		
	
	function workbench(event,rc,prc){
		rc.homepage = application.cbcontroller.getconfigSettings().urls.homepage;
		rc.pathtosave = GetTempDirectory() & session.sessionID & '\'; // application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\";
		rc.pathAndName = rc.pathtosave & rc.fileName;
		
		if( fileexists( rc.pathAndName ) )
			event.setView("viewer/index");
		else
			setNextEvent(event='main.index');
	}
	
}
