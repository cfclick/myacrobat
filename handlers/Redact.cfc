/**
* I am a new handler
*/
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
	
	/**
	IMPLICIT FUNCTIONS: Uncomment to use
	function preHandler(event,rc,prc,action,eventArguments){
		var rc = event.getCollection();
	}
	function postHandler(event,rc,prc,action,eventArguments){
		var rc = event.getCollection();
	}
	function aroundHandler(event,rc,prc,targetAction,eventArguments){
		var rc = event.getCollection();
		// executed targeted action
		arguments.targetAction(event);
	}
	function onMissingAction(event,rc,prc,missingAction,eventArguments){
		var rc = event.getCollection();
	}
	function onError(event,rc,prc,faultAction,exception,eventArguments){
		var rc = event.getCollection();
	}
	*/
		
	function index(event,rc,prc){
		event.setView("Redact/index");
	}	


	function add( event, rc, prc ){
		rc.cord = "#rc.x1#,#rc.y1#,#rc.x2#,#rc.y2#";
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		sleep(1000);
		if( fileExists( source) ){
			cfpdf( action="redact"
				, source=source
				, destination=destination
				, overwrite=true ) {
	 	 			cfpdfparam( coordinates=rc.cord, pages=rc.page);
  				};
		
			cffile(action="copy",
			       source=destination,
			       destination=source, mode="644");
		
			event.renderData( data=rc.fileName, type="json" ).nolayout();
		}else{
			event.renderData( data="File #rc.fileName# not found.", type="json" ).nolayout();

		}
		
	}
}
