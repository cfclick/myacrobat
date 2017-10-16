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
		event.setView("DigitalSignature/index");
	}	

	
	function addField(event,rc,prc){
		
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );

	//	rc.pathtosave = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\";
	//	rc.pathAndName = rc.pathtosave & rc.fileName;
	//	var source = trim( rc.pathAndName );
	//	var destination = GetTempDirectory() & session.sessionID & '_' & rc.fileName;//"C:\Temp\pdfs\_signfield.pdf";// trim( arguments.destinationPDFPath );
		var reader = createobject("java","com.lowagie.text.pdf.PdfReader").init( source );
		var fileOutputStream = CreateObject("java", "java.io.FileOutputStream").init( destination );
		var stamper = createobject("java","com.lowagie.text.pdf.PdfStamper").init( reader, fileOutputStream );		
    	// create a signature form field
        var pdfFormField = createobject("java","com.lowagie.text.pdf.PdfFormField");
        var field = pdfFormField.createSignature( stamper.getWriter() );
        field.setFieldName( rc.fieldName );
        // set the widget properties
        var rectangle = createobject("java","com.lowagie.text.Rectangle");              
       	var pdfAnnotation = createobject("java","com.lowagie.text.pdf.PdfAnnotation");
        field.setWidget( rectangle.init(rc.x1, rc.y1, rc.x2, rc.y2), pdfAnnotation.HIGHLIGHT_OUTLINE);
        field.setFlags( pdfAnnotation.FLAGS_PRINT );
        // add the annotation        
        var pdfAppearance = createobject("java","com.lowagie.text.pdf.PdfAppearance");
        stamper.addAnnotation( field, rc.page );
        // close the stamper
    	stamper.close();
		
		sleep(200);

		cffile(action="copy",
			   source=destination,
			   destination=source, mode="644");

		event.renderData( data=rc.fileName, type="json" ).nolayout();
	}
	
}
