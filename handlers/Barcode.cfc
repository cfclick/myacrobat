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
		
	function add(event,rc,prc){		
		
		var pdfURL = application.cbcontroller.getconfigSettings().urls.homepage & "?event=viewer.render&id=#session.sessionID#&fileName=#rc.fileName#";
		var destination = application.cbcontroller.getconfigSettings().workFolder & session.sessionID & "\" & rc.fileName;
		rc.pathAndName = GetTempDirectory() & session.sessionID & '\' & rc.fileName;
		var source = trim( rc.pathAndName );
		//writeDump(sessionStorage.getVar('files'));abort;
		if( isArray( sessionStorage.getVar('files') ) ){
			var selectedPDF = arrayfilter(sessionStorage.getVar('files'), function(ele){
				return ele.name == rc.fileName;
			});
			
			local.pass = selectedPDF[1].password;
			
		}else{
			local.pass = "";
		}
		
		if( fileExists( source) ){
			if( len( local.pass )){
				rc.success = false;
				rc.hasPass = true;
				rc.showerror = "Adding barcode feature is not availabale with password protected PDFs.";
				event.renderData( data=rc, type="json" ).nolayout();
			
			}else{
				rc.textToencode = pdfURL & "&text=#rc.textToencode#";	
				if( len( rc.textToencode ) > 4296 )//maximum charaters for alpha numeric text
					throw(message="Max characters reached.");
				
				var writer = createobject("java","com.google.zxing.qrcode.QRCodeWriter").init();
				//Load Barcode types
				var barcodeFormat = createobject("java","com.google.zxing.BarcodeFormat");
				//representing encoded barcode image
				var bitMatrix = writer.encode( rc.textToencode, barcodeFormat.QR_CODE, rc.w?:80, rc.h?:80 );
				var matrixToImageWriter = createobject("java","com.google.zxing.client.j2se.MatrixToImageWriter");
				//Image buffer
				var buff = matrixToImageWriter.toBufferedImage( bitMatrix );
				var img = ImageNew( buff );
						
				cfpdf(action="addfooter"
					 , source=source
					 , destination=destination
					 , overwrite=true 
					 , align="right"
					 , image=img
					 , bottommargin="1.5");
		 	 				
	  			sleep(500);
				filecopy(destination,source);
		
				rc["fileName"]= rc.fileName;
	  					
	  			rc.hasPass = false;
				rc.success = true;
				
				event.renderData( data=rc, type="json" ).nolayout();
				
			}

		}else{			
			rc.success = false;
			event.renderData( data="File #rc.fileName# not found.", type="json" ).nolayout();
		}
	}	
	
	/*function any readBarcode(event, rc, prc ){
		buff = ImageGetBufferedImage( img );
		//prepare the image for decoding
		source 	  = createobject("java","com.google.zxing.client.j2se.BufferedImageLuminanceSource").init( buff );
		binarizer = createobject("java","com.google.zxing.common.GlobalHistogramBinarizer").init( source );
		bitmap 	  = createobject("java","com.google.zxing.BinaryBitmap").init( binarizer );
		reader 	  = createobject("java","com.google.zxing.qrcode.QRCodeReader").init();
		//decode the barcode
		decodedResult = reader.decode( bitmap, javacast("null", ""));
	}*/
}
