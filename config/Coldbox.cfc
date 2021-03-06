﻿component{

	// Configure ColdBox Application
	function configure(){
		cfroot					= getColdFusionRootPath();
		// coldbox directives
		coldbox = {
			//Application Setup
			appName 				= "myAcrobat",
			eventName 				= "event",

			//Development Settings
			reinitPassword			= "",
			handlersIndexAutoReload = true,

			//Implicit Events
			defaultEvent			= "",
			requestStartHandler		= "Main.onRequestStart",
			requestEndHandler		= "",
			applicationStartHandler = "Main.onAppInit",
			applicationEndHandler	= "",
			sessionStartHandler 	= "",
			sessionEndHandler		= "",
			missingTemplateHandler	= "",

			//Extension Points
			applicationHelper 			= "includes/helpers/ApplicationHelper.cfm",
			viewsHelper					= "",
			modulesExternalLocation		= [],
			viewsExternalLocation		= "",
			layoutsExternalLocation 	= "",
			handlersExternalLocation  	= "",
			requestContextDecorator 	= "",
			controllerDecorator			= "",

			//Error/Exception Handling
			exceptionHandler		= "",
			onInvalidEvent			= "",
			customErrorTemplate		= "/coldbox/system/includes/BugReport.cfm",

			//Application Aspects
			handlerCaching 			= false,
			eventCaching			= false,
			proxyReturnCollection 	= false,
			
			urls					= { homepage: "http://#CGI.SERVER_NAME#:#CGI.SERVER_PORT#/index.cfm",
									workingpdf: "http://#CGI.SERVER_NAME#:#CGI.SERVER_PORT#/uploads/Work/" },
		environment				= "Development",
		
		uploadFolder			= cfroot & "uploads\",
		workFolder				= cfroot & "uploads\Work\",
		blankPDF				= cfroot & "uploads\blank.pdf",
		emailFrom				= "info@myacrobat.com"
		};

		// custom settings
		settings = {

		};

		// environment settings, create a detectEnvironment() method to detect it yourself.
		// create a function with the name of the environment so it can be executed if that environment is detected
		// the value of the environment is a list of regex patterns to match the cgi.http_host.
		environments = {
			shirak = "^shirak",
			Development = "localhost,^dev.,^local.,^dev,^local",
			QA = "^QA.,^QA,^QA-",
			Research = "^res.,^res",
			Stage = "^stage.,^test.,^stg.,^stage,^test,^stg",
			Prod = "^suite.,^suite,",
			Secure = "^secure.,^secure,"
		};

		// Module Directives
		modules = {
			//Turn to false in production
			autoReload = true,
			// An array of modules names to load, empty means all of them
			include = [],
			// An array of modules names to NOT load, empty means none
			exclude = []
		};

		//LogBox DSL
		logBox = {
			// Define Appenders
			appenders = {
				coldboxTracer = { class="coldbox.system.logging.appenders.ConsoleAppender" }
			},
			// Root Logger
			root = { levelmax="INFO", appenders="*" },
			// Implicit Level Categories
			info = [ "coldbox.system" ]
		};

		//Layout Settings
		layoutSettings = {
			defaultLayout = "",
			defaultView   = ""
		};

		//Interceptor Settings
		interceptorSettings = {
			throwOnInvalidStates = false,
			customInterceptionPoints = ""
		};

		//Register interceptors as an array, we need order
		interceptors = [
			//SES
			{class="coldbox.system.interceptors.SES",
			 properties={}
			},
			{class="interceptors.SecurityInterceptor", name="ApplicationSecurity", properties={
				// Security properties go here.
			}}/*,
			{ class = "interceptors.ExceptionHandler", properties = {} }*/
		];

		/*
		// flash scope configuration
		flash = {
			scope = "session,client,cluster,ColdboxCache,or full path",
			properties = {}, // constructor properties for the flash scope implementation
			inflateToRC = true, // automatically inflate flash data into the RC scope
			inflateToPRC = false, // automatically inflate flash data into the PRC scope
			autoPurge = true, // automatically purge flash data for you
			autoSave = true // automatically save flash scopes at end of a request and on relocations.
		};

		//Register Layouts
		layouts = [
			{ name = "login",
		 	  file = "Layout.tester.cfm",
			  views = "vwLogin,test",
			  folders = "tags,pdf/single"
			}
		];

		//Conventions
		conventions = {
			handlersLocation = "handlers",
			viewsLocation 	 = "views",
			layoutsLocation  = "layouts",
			modelsLocation 	 = "models",
			eventAction 	 = "index"
		};

		//Datasources
		datasources = {
			mysite   = {name="mySite", dbType="mysql", username="root", password="pass"},
			blog_dsn = {name="myBlog", dbType="oracle", username="root", password="pass"}
		};
		*/

	}

	/**
	* Development environment
	*/
	function shirak(){
		coldbox.settings.email = { from='info@myacrobat.com', to='info@myacrobat.com' };
		coldbox.reinitPassword = '';
		coldbox.customErrorTemplate = "/views/_templates/generic_error.cfm";
		coldbox.debugMode = true;
	    coldbox.debugPassword = "";
		coldbox.handlersIndexAutoReload = true;
		coldbox.settings.release = "1.0.0";
	}
	
	
	public string function getColdFusionRootPath( base_path="./" ){
		var actual_path = ExpandPath(arguments.base_path);
		if( FileExists( ExpandPath(arguments.base_path & "Application.cfc"))){
			return replaceNoCase(actual_path,'CFSummit2017\PDFViewer\','');;
		}else if( REFind(".*[/\\].*[/\\].*", actual_path) ){
			var rootpath = getColdFusionRootPath("../#arguments.base_path#");		
			return replaceNoCase(rootpath,'CFSummit2017\PDFViewer\','');
		}else{
			cfthrow(message="Unable to determine Application Root Path", detail="#actual_path#");
		}
	}

}

  