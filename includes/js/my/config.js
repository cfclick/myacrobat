function Config() { 
		var config = this;
		var theActualServer = window.location.host;//with port number
		var protocol = "http://";
		var appFolder = "/";
		var CGIScriptName = "";
		
		this.urls = {};
		this.urls.main = { 
	
			index 						: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.index", 
			fileUploadForm				: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.fileUploadForm",
			uploadFiles					: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.uploadFiles",
			passwordProtect				: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.passwordProtect",
			readMetadata				: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.readMetadata",			
			ping						: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.ping",
			urlToPDF					: protocol + theActualServer + appFolder + CGIScriptName + "?event=main.urlToPDF"
		 };
		 
		 this.urls.digitalsignature = {
		 	addField	: protocol + theActualServer + appFolder + CGIScriptName + "?event=digitalsignature.addField"
		 };
		 
		 this.urls.stamp = {
		 	add	: protocol + theActualServer + appFolder + CGIScriptName + "?event=stamp.add"
		 };
		 
		 this.urls.sanitize = {
		 	apply	: protocol + theActualServer + appFolder + CGIScriptName + "?event=sanitize.apply"
		 };
		 
		 this.urls.redact = {
		 	add	: protocol + theActualServer + appFolder + CGIScriptName + "?event=redact.add"
		 };
		 
		 this.urls.barcode = {
		 	add	: protocol + theActualServer + appFolder + CGIScriptName + "?event=barcode.add"
		 };
		 
		 this.urls.properties = {
		 	index			: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.index",
		 	add				: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.add",
		 	delete			: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.delete",
		 	save 			: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.save",
		 	export		 	: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.exportMeta",
		 	import		 	: protocol + theActualServer + appFolder + CGIScriptName + "?event=properties.importMeta"
		 };
		 
		 this.urls.viewer = {
			 preview	: protocol + theActualServer + appFolder + CGIScriptName + "?event=viewer.preview",
			 delete		: protocol + theActualServer + appFolder + CGIScriptName + "?event=viewer.delete",
			 restore	: protocol + theActualServer + appFolder + CGIScriptName + "?event=viewer.restore",
			 email		: protocol + theActualServer + appFolder + CGIScriptName + "?event=viewer.email"
		 };
		 
		 this.urls.root   =  protocol + theActualServer + appFolder + CGIScriptName ;
	}
