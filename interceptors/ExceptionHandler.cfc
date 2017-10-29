/**
* Handle All type of exceptions
*/
component extends="coldbox.system.Interceptor"{
	
	void function configure(){
	
	}
	
	void function onException(event, interceptData, buffer){
		var rc = event.getCollection();
		var coldboxSettings = application.cbcontroller.getconfigSettings();
		var settings = coldboxSettings.settings;
		var appName = coldboxSettings.appName;
		// Get the exception
		var exception = arguments.interceptData.exception;
		var mailerService = new mail();    
		mailerService.setTo(  settings.email.to );  
		mailerService.setFrom( settings.email.from );                    
        var subject = appName & '-' & coldboxSettings.environment & '-Error-' & left(exception.message,50) & '-' & CGI.SERVER_NAME;          
        mailerService.setSubject( subject );                 
        mailerService.setType("html");                 
        savecontent variable="mailBody"{      
                           writeDump(exception);
        }   
                                  
        mailerService.send(body=mailBody);
        
		log.error( exception.message & exception.detail, exception );
		
	}	
}
