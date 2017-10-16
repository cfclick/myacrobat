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
		
	function add(event,rc,prc){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		switch( trim(rc.type)) {
			
			case "Paid":			
			case "Classified":			
			case "Rejected":{
				addCustomeStump(rc );
				break;
			}
			
			default:{
				
				cfpdf(action="addstamp"
						, source=source
						, destination=destination
						, overwrite=true ) {
		 	 				cfpdfparam(iconname=rc.type, coordinates="#rc.x1#,#rc.y1#,#rc.x2#,#rc.y2#", pages=rc.pages, note=rc.note);
	  					};
  		
			}
		}
		
		
  		sleep(500);
		filecopy(destination,source);
		rc.success = true;	
		rc["fileName"]= rc.fileName;
		event.renderData( data=rc, type="json" ).nolayout();
		
	}	
	
	private function addCustomeStump(rc ){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		
		reader = createobject("java","com.lowagie.text.pdf.PdfReader").init( source );
		fileOutputStream = CreateObject("java", "java.io.FileOutputStream").init( destination );
		stamper = createobject("java","com.lowagie.text.pdf.PdfStamper").init( reader, fileOutputStream );	
   		image = createobject("java","com.lowagie.text.Image");
   		pdfName = createobject("java","com.lowagie.text.pdf.PdfName");
   		
    	img = image.getInstance( expandpath("includes/images/#rc.typeValue#" ));
    	
   		w = img.getScaledWidth();
    	h = img.getScaledHeight();
    	
    	rectangle = createobject("java","com.lowagie.text.Rectangle");              
       	pdfAnnotation = createobject("java","com.lowagie.text.pdf.PdfAnnotation");
       	//location = rectangle.init(36, 770 - h, 36 + w, 770);
    	location = rectangle.init(rc.x1,rc.y1,rc.x2,rc.y2);
        stamp = pdfAnnotation.createStamp(stamper.getWriter(), location, javacast("null",''), "ITEXT");                     
    	img.setAbsolutePosition(0, 0);
    	cb = stamper.getOverContent(1);
    	app = cb.createAppearance(w, h);
    	app.addImage(img);
    	
    	stamp.setAppearance(pdfName.N, app);
    	
    	stamp.setFlags(PdfAnnotation.FLAGS_PRINT);
    	stamper.addAnnotation(stamp, rc.pages);
    	stamper.close();
    	reader.close();
	}


	
}
