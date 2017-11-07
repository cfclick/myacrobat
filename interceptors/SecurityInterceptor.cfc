/**
********************************************************************************
Copyright 2005-2007 ColdBox Framework by Luis Majano and Ortus Solutions, Corp
www.coldboxframework.com | www.luismajano.com | www.ortussolutions.com
********************************************************************************

Author     :	Luis Majano
Date        :	9/28/2007
Description :
	A simple security interceptor

	extends="coldbox.system.interceptor" by default because the framework
	knows its an interceptor by convension.
*/
component {
	// Pre execution process
	function preProcess( requird any event, required struct interceptData ) {
		var rc = Event.getCollection();
		var loggingIn = false;
		var sessionStorage = getInstance( 'sessionStorage@cbstorages' );
	//	var messageBox = getInstance( 'messagebox@cbmessagebox' );


		if ( event.getCurrentEvent() == "main.index" ) {
				loggingIn = true;				
		}
		
		if ( event.getCurrentEvent() == "Main.uploadFiles" ) {
				loggingIn = true;
		}
		
		//Are we logging In		
		//Login Check
		if( loggingIn ){
			//continue;
		}else if( not sessionStorage.exists("loggedin") or  sessionStorage.getVar("loggedin") == 'true' ){
			rc.showerror = "Your session timed out.";
			if( event.isAjax() ){
				cflocation(url="#CGI.scRIPT_NAME#");
			}else{
				Event.overrideEvent("Main.index");
			}
			
		}
	}
	

}