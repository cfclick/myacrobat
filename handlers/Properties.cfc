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
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		if( fileExists( source) ){
			cfpdf( action="getinfo" ,name="reader", source=source);
			reader.Created = formatPDFdate( reader.Created );
			reader.Modified = formatPDFdate( reader.Modified );
			rc.pdf = reader;
			
			rc.Created = "D:" & DateFormat(now(), "YYYYMMDD") & TimeFormat(now(), "HHmmss") & "-00'00'";
			event.setView("Properties/index").nolayout();
		}else{			
			event.renderData( data="File #rc.fileName# not found.", type="json" ).nolayout();
		}
		
	}	
	
	function add( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		var fileOutputStream = CreateObject("java", "java.io.FileOutputStream").init( destination );
		//Read the source
		var reader = createobject("java","com.lowagie.text.pdf.PdfReader").init( source );
		//Initialize the stamper
    	var stamper = createobject("java","com.lowagie.text.pdf.PdfStamper").init( reader, fileOutputStream);
    	//Read source file   
    	info = reader.getInfo();
    	//Create custom property (tracking number )
    	info.put(rc.name, rc.value);
    	//Pushing data 
	    stamper.setMoreInfo(info);
	    stamper.close();  
   		
   		cffile(action="copy",
			   source=destination,
			   destination=source, mode="644");
			       
   		cfpdf( action="getinfo" ,name="reader", source=source);
		rc.pdf = reader;
		
		event.setView("Properties/customPropertyTable").nolayout();
	}
	
	
	function delete( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		var fileOutputStream = CreateObject("java", "java.io.FileOutputStream").init( destination );
		//Read the source
		var reader = createobject("java","com.lowagie.text.pdf.PdfReader").init( source );
		//Initialize the stamper
    	var stamper = createobject("java","com.lowagie.text.pdf.PdfStamper").init( reader, fileOutputStream);
    	//Read source file   
    	info = reader.getInfo();
    	//Create custom property (tracking number )
    	info.put(rc.name, javacast('null',''));
    	//Pushing data 
	    stamper.setMoreInfo(info);
	    stamper.close();  
   		
   		cffile(action="copy",
			   source=destination,
			   destination=source, mode="644");
			       
   		cfpdf( action="getinfo" ,name="reader", source=source);
		rc.pdf = reader;
		
		event.setView("Properties/customPropertyTable").nolayout();
	}
	
	
	function save( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
   		str = {};
   		str['Title'] = rc.Title;
   		str['Author'] = rc.Author;
   		str['Subject'] = rc.Subject;
   		str['Keywords'] = rc.Keywords;
   		cfpdf( action="setinfo" ,info=str, source=source, destination=destination, overwrite="yes" );
   		
   		cffile(action="copy",
			   source=destination,
			   destination=source, mode="644");
			       
   		cfpdf( action="getinfo" ,name="reader", source=source);
		rc.pdf = reader;
		
		event.setView("Properties/defaultProperties").nolayout();
	}
	
	
	function exportMeta( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\#rc.fileName#.xmp";
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		cfpdf( action="export", type="metadata", source=source, exportTo=destination);
   		rc.success = true;
		rc['fileName'] = rc.fileName;
		sleep(2000);
		event.renderData( data=rc, type="json" ).nolayout();
	}
	
	
	function importMeta( event, rc, prc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\#rc.fileName#";
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );	
		cfpdf( action="import", type="metadata", source=source, importFrom=rc.xmpfile, destination=destination);
		rc.success = true;
		rc['fileName'] = rc.fileName;		
		event.renderData( data=rc, type="json" ).nolayout();
	}
	
	private string function formatPDFdate( required string psdDateString ){
		
		var temp = replace( psdDateString,'D:','');		
		return dateFormat(createDateTime( left( temp,4), mid( temp,5,2), mid( temp,7,2), mid( temp,9,2), mid( temp,11,2),mid( temp,13,2) ), 'mm/dd/yyyy hh:mm:ss');
	}
	
	
}
