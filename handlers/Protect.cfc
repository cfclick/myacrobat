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
		
	public any function passwordProtect( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
	
		if( isArray( sessionStorage.getVar('files') ) ){
			var selectedPDF = arrayfilter(sessionStorage.getVar('files'), function(ele){
				return ele.name == rc.fileName;
			});
			
			local.pass = selectedPDF[1].password;
			
		}else{
			local.pass = "";
		}
		
		if( fileExists( source) ){
			
			if( len( rc['PERMISSIONS[]'] ) ){
				var permissionList = rc['PERMISSIONS[]'];
				
				
			}else{
				var permissionList = 'All';
			}
			
			if( len( local.pass )){
				
					rc.hasPass = true;
					rc.showerror = "The PDF already password protected.";
					
					rc.success = false;	
			}else{
				if( isdefined("rc.owner_pass") && len( rc.owner_pass ) && isdefined("rc.user_pass") && len( rc.user_pass )){
					cfpdf( action="protect" 
						, source=source
						, destination=destination
						, newownerpassword=rc.owner_pass
						, newuserpassword = rc.user_pass
						, permissions = permissionList
						, overwrite="yes" );
						
						selectedPDF[1].password = rc.owner_pass;
						selectedPDF[1].user_password = rc.user_pass;
		
				}else if( isdefined("rc.owner_pass") && len( rc.owner_pass ) ){
					
					cfpdf( action="protect" 
						, source=source
						, destination=destination
						, newownerpassword=rc.owner_pass
						, permissions = permissionList
						, overwrite="yes" );
						
						selectedPDF[1].password = rc.owner_pass;
						
					
				}else if( isdefined("rc.user_pass") && len( rc.user_pass ) ){
					
					cfpdf( action="protect" 
						, source=source
						, destination=destination
						, newuserpassword = rc.user_pass
						, permissions = permissionList
						, password = local.pass
						, overwrite="yes" );
					
					selectedPDF[1].user_password = rc.user_pass;
				}
				
				rc.success = true;
				sleep(500);
				filecopy(destination,source);
			}
		
		}
		//TODO: Continue work on password
		var files = sessionStorage.getVar('files');
		rc["fileName"]= rc.fileName;
		event.renderData(type='json',data=rc ).nolayout();

	}
}
