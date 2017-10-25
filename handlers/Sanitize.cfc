/**
* I am a new handler
*/
component{
	property name="sessionStorage" inject="sessionStorage@cbstorages";
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
		
	function apply(event,rc,prc){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		var selectedPDF = arrayfilter( sessionStorage.getVar('files'), function(ele){
			return ele.name == rc.fileName;
		});
		
		//writeDump(destination);
		//writeDump(source);abort;
		cfpdf( action="sanitize" ,source=destination, overwrite="yes", password=selectedPDF[1].password );
		cfpdf( action="sanitize" ,source=source, 	 overwrite="yes", password=selectedPDF[1].password );
		rc.success = true;	
		rc["fileName"]= rc.fileName;
		event.renderData( data=rc, type="json" ).nolayout();
		
	}	


	
}
