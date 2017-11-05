<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <title>My Acrobat</title>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Bootstrap core CSS -->
    <link href="/includes/MDB/css/bootstrap.min.css" rel="stylesheet">

    <!-- Material Design Bootstrap -->
    <link href="/includes/MDB/css/mdb.min.css" rel="stylesheet">

    <!-- Template styles -->
    <style rel="stylesheet">
        /* TEMPLATE STYLES */
        
        html,
        body,
        .view
         {
            height: 100%;
            background-color:#2c2f34;
            background: url("/includes/images/bg1.jpg")no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
            left: 225px;
		  	top: 0;
		  	
		  	margin: 0;
		  	height: 100%;
		  	height: -webkit-calc(100%+ 60px);
		  	height: calc(100%+ 60px);
		  	height: -moz-calc(100%);
           
        }
        /* Navigation*/
        
        .navbar {
            background-color: #2c2f34;
        }
        
       /* .scrolling-navbar {
            -webkit-transition: background .5s ease-in-out, padding .5s ease-in-out;
            -moz-transition: background .5s ease-in-out, padding .5s ease-in-out;
            transition: background .5s ease-in-out, padding .5s ease-in-out;
        }
        
        .top-nav-collapse {
            background-color: #1C2331;
        }*/
        
        footer.page-footer {
            background-color: #1C2331;
            margin-top: -1px;
        }
        
        @media only screen and (max-width: 768px) {
            .navbar {
                background-color: #1C2331;
            }
        }
        .navbar .btn-group .dropdown-menu a:hover {
            color: #000 !important;
        }
        .navbar .btn-group .dropdown-menu a:active {
            color: #fff !important;
        }
        /*Call to action*/
        
        .flex-center {
            color: #fff;
        }
        
       /* .view {
            background: url("/includes/images/bg1.jpg")no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
            left: 225px;
		  	top: 0;
		  	
		  	margin: 0;
		  	height: 100%;
		  	height: -webkit-calc(100%+ 60px);
		  	height: calc(100%+ 60px);
		  	height: -moz-calc(100%);
		  	/*width: 100%;
		  	width: -webkit-calc(100%+ 60px);
		  	width: calc(100%+ 60px);
		  	width: -moz-calc(100%);
		  	padding-bottom: 60px;*/
        }*/
        
        input[type=text],
    input[type=password],
    input[type=email],
    input[type=url],
    input[type=time],
    input[type=date],
    input[type=datetime-local],
    input[type=tel],
    input[type=number],
    input[type=search-md] {
        height: 1rem;
    }
    
    
    .side-navc {
  position: fixed;
  /*width: 225px;*/
  left: 0;
  top: 0;
  margin: 0;
  /*-webkit-transform: translateX(-100%);
  -ms-transform: translateX(-100%);
  transform: translateX(-100%);*/
  height: 100%;
  height: -webkit-calc(100%+ 60px);
  height: calc(100%+ 60px);
  height: -moz-calc(100%);
  padding-bottom: 60px;
  color: #d8d8d8;
  background-color: #2c2f34;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 999;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow-y: auto;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-transform: translateX(-105%);
  -ms-transform: translateX(-105%);
  transform: translateX(-105%);
  list-style-type: none;
  padding: 0; }
  .side-navc ul {
    list-style-type: none; }
    .side-navc ul li {
      padding: 0; }
  .side-navc.right-aligned {
    right: 0;
    left: auto;
    -webkit-transform: translateX(100%);
    -ms-transform: translateX(100%);
    transform: translateX(100%); }
  .side-navc .collapsible {
    margin: 0;
    padding: 0; }
    .side-navc .collapsible li a:hover {
      background-color: rgba(0, 0, 0, 0.15); }
    .side-navc .collapsible > li {
      border-radius: 2px; }
      .side-navc .collapsible > li a.collapsible-header:hover {
        background-color: rgba(255, 255, 255, 0.15); }
      .side-navc .collapsible > li a.collapsible-header.active {
        background-color: rgba(255, 255, 255, 0.15); }
    .side-navc .collapsible ul {
      padding: 0;
      list-style-type: none; }
    .side-navc .collapsible a {
      color: #fff;
      font-weight: 300;
      font-size: 0.8rem;
      height: 36px;
      line-height: 36px; }
      .side-navc .collapsible a.active, .side-navc .collapsible a:hover {
        border-radius: 2px; }
    .side-navc .collapsible .fa {
      font-size: 0.8rem;
      margin-right: 13px; }
  .side-navc .collapsible-body a {
    padding-left: 47px;
    height: 36px;
    line-height: 36px;
    background-color: rgba(0, 0, 0, 0.15); }
  .side-navc a {
    display: block;
    font-size: 1rem;
    height: 56px;
    line-height: 56px;
    padding-left: 20px; }
  .side-navc .logo-wrapper {
    height: 140px; }
    .side-navc .logo-wrapper a {
      height: 140px;
      width: 240px;
      padding: 0; }
    .side-navc .logo-wrapper img {
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 20%;
      padding-bottom: 20%;
      height: auto; }
  @media (max-height: 992px) {
    .side-navc .logo-wrapper {
      height: 80px; }
      .side-navc .logo-wrapper a {
        height: 80px; }
      .side-navc .logo-wrapper img {
        padding-left: 50px;
        padding-right: 50px;
        padding-top: 7%;
        padding-bottom: 7%; } }
  .side-navc .about {
    padding: 1rem;
    border-bottom: 1px solid rgba(153, 153, 153, 0.3); }
    .side-navc .about p {
      margin-bottom: 0;
      text-align: center; }
  .side-navc .social {
    padding: 0;
    text-align: center;
    border-bottom: 1px solid rgba(153, 153, 153, 0.3); }
    .side-navc .social li {
      display: inline-block;
      padding: 0;
      margin: 0; }
    .side-navc .social a {
      padding: 0;
      margin: 0;
      padding-right: 0.6rem;
      padding-left: 0.6rem; }
    .side-navc .social .fa {
      color: #dbe4e7; }
  .side-navc .search-form {
    padding: 0; }
    .side-navc .search-form input[type=text] {
      border-bottom: 1px solid #fff;
      font-weight: 300;
      padding-left: 30px; }
  .side-navc .sn-avatar-wrapper {
    padding-left: 33%;
    padding-right: 33%;
    padding-top: 10%; }
    .side-navc .sn-avatar-wrapper img {
      margin: 0;
      padding: 0;
      max-width: 90px;
      border-radius: 5rem; }
  @media only screen and (max-height: 992px) {
    .side-navc .sn-avatar-wrapper {
      padding-left: 40%;
      padding-right: 40%;
      padding-top: 3%; }
      .side-navc .sn-avatar-wrapper img {
        max-width: 50px; } }
  .side-navc .sn-ad-avatar-wrapper {
    height: auto;
    margin-bottom: 0; }
    .side-navc .sn-ad-avatar-wrapper img {
      max-width: 60px;
      padding: 20px 10px;
      float: left; }
    .side-navc .sn-ad-avatar-wrapper p {
      font-size: 15px;
      padding-top: 20px;
      padding-bottom: 20px;
      margin: 0; }
  .side-navc .user-box {
    padding: 20px 10px 0 10px; }
    .side-navc .user-box img {
      margin: 0 auto 10px auto;
      max-width: 80px; }
  .side-navc .fa-angle-down.rotate-icon {
    position: absolute;
    right: 0;
    top: 13px;
    margin-right: 20px; }
  .side-navc .sidenav-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 240px;
    z-index: -1;
    background-attachment: fixed; }
    .side-navc .sidenav-bg:after {
      width: 100%;
      display: block;
      content: "";
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      margin-bottom: -99999px;
      padding-bottom: 99999px; }
  .side-navc.fixed {
    left: 0;
    -webkit-transform: translateX(0);
    -ms-transform: translateX(0);
    transform: translateX(0);
    position: fixed; }
    .side-navc.fixed.right-aligned {
      right: 0;
      left: auto; }
  .side-navc.side-navc-light {
    background-color: #e5e5e5; }
    .side-navc.side-navc-light a {
      color: #555;
      font-weight: 400; }
    .side-navc.side-navc-light .social .fa {
      color: #555; }
    .side-navc.side-navc-light .collapsible-body a {
      background-color: rgba(0, 0, 0, 0.1); }
    .side-navc.side-navc-light .collapsible li .collapsible-header:hover {
      background-color: rgba(0, 0, 0, 0.05); }
    .side-navc.side-navc-light .collapsible li .collapsible-header.active {
      color: #4285F4;
      background-color: transparent; }
      
      

    </style>
	
	
	 <!-- JQuery -->
    <script type="text/javascript" src="/includes/js/jquery-3.2.1.min.js"></script>
	
	
</head>

<body >
<script type="text/javascript" src="https://cdn.ywxi.net/js/1.js" async></script>
    <!--Navbar-->
    
  
   	<!-- Sidebar navigation style="width:250px"-->
    <ul id="slide-out" class="side-navc fixed custom-scrollbar" >
        <!-- Logo -->
        <li>
            <div class="logo-wrapper waves-light black">
                <a class="navbar-brand" href="<cfoutput>#application.cbcontroller.getconfigSettings().urls.homepage#</cfoutput>"><img src="/includes/images/logo40.png" ></a>    
            </div>
        </li>
        <!--/. Logo -->
        <!--Social-->
       <li>
            <ul class="social">
                <li><a class="icons-sm fb-ic"><i class="fa fa-facebook"> </i></a></li>
                <li><a class="icons-sm pin-ic"><i class="fa fa-pinterest"> </i></a></li>
                <li><a class="icons-sm gplus-ic"><i class="fa fa-google-plus"> </i></a></li>
                <li><a class="icons-sm tw-ic"><i class="fa fa-twitter"> </i></a></li>
            </ul>
        </li>
        <!--/Social-->
        <!--Search Form-->
       <!--- <li>
            <form class="search-form" role="search">
                <div class="form-group waves-light">
                    <input type="text" class="form-control" placeholder="Search">
                </div>
            </form>
        </li>--->
        <!--/.Search Form-->
        <!-- Side navigation links -->
        <cfoutput>
        <li>
           <ul class="collapsible collapsible-accordion">
                <li>               	
                	<a href="#cgi.scRIPT_NAME#" class="collapsible-header waves-effect arrow-r" >
						Home 
					</a>                 
                </li>
                <cfif comparenocase(event.getcurrentEvent(),'viewer.workbench') eq 0 >
	                <li>
	                	<a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" 
					        data-target="##digital_signature_modal">
							Signature
						</a>
	                </li>
	                <li>
	                	<a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" data-target="##password_modal">
							Password
						</a>
	                </li>
	                <li>
	                	<a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" data-target="##redact_modal">
							Redact
						</a>
	                </li>
	                <li>
	                	<a id="sanitize_btn" http="##" class="collapsible-header waves-effect arrow-r" >
							Sanitize
						</a>	
	                </li>
	                <li>
	                	<a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" data-target="##stamp_modal">
							Stamp
						</a>
	                </li>
	                <li>
	                	<a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" data-target="##barcode_modal">
							Barcode
						</a>
	                </li>
	                <li>
	                	<a id="property_btn" http="##" class="collapsible-header waves-effect arrow-r" >
							Properties
						</a>
	                </li>
	             </cfif>   
            </ul>
       </li>
        </cfoutput>
        <!--/. Side navigation links -->
        <div class="sidenav-bg mask-strong">
        	
        	
        	
        </div>
    </ul>
    <!--/. Sidebar navigation -->
   
   

   		<!--Main Layout-->
		
		        	<cfoutput><div class="conatiner-fluid"  >#renderView()#</div></cfoutput>           
		       
<!--Main Layout-->

  
        <!--- <nav class="navbar navbar-expand-lg fixed-top bg-faded">
            <div class="container">
                <a class="navbar-brand" href="<cfoutput>#application.cbcontroller.getconfigSettings().urls.homepage#</cfoutput>"><img src="/includes/images/logo.png" ></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto text-white">
                    	
                       
                    </ul>
                </div>
            </div>
        </nav>--->

    <!--/.Navbar-->
    <!--Mask-->
    
   <!--- <div class="view hm-black-light">
        <div class="full-bg-img flex-center">   
        	<a class="navbar-brand" href="<cfoutput>#application.cbcontroller.getconfigSettings().urls.homepage#</cfoutput>"><img src="/includes/images/logo.png" ></a>    
        	<cfoutput><div class="container-fluid" >#renderView()#</div></cfoutput>           
        </div>
    </div>
    <!--/.Mask-->

    <!--Footer-->
    <footer class="page-footer center-on-small-only">
       <!--Footer links-->  
        <hr class="orange darken-2">
        <!--Copyright-->
        <div class="footer-copyright">
            <div class="container-fluid">
                © 2017 Copyright: <a href="https://www.myacrobat.com"> myacrobat.com </a>

            </div>
        </div>
        <!--/.Copyright-->

    </footer>--->
    <!--/.Footer-->
    
    <!--Double navigation-->

    
    <!-- Navbar -->
    <!---<nav class="navbar navbar-toggleable-md navbar-expand-lg scrolling-navbar double-nav">
        <!-- SideNav slide-out button -->
        <div class="float-left">
            <a href="#" data-activates="slide-out" class="button-collapse"><i class="fa fa-bars"></i></a>
        </div>
        <!-- Breadcrumb-->
        <div class="breadcrumb-dn mr-auto">
            
        </div>
        <ul class="nav navbar-nav nav-flex-icons ml-auto">
        	<cfif comparenocase(event.getcurrentEvent(),'viewer.workbench') eq 0 >
            <li class="nav-item">
            	<a id="restore_btn" href="##" class="btn-floating btn-sm bg-primary"><i class="fa fa-undo fa-lg" aria-hidden="true"></i></a>
                <!---<a class="nav-link"><i class="fa fa-envelope"></i> <span class="clearfix d-none d-sm-inline-block">Contact</span></a>--->
            </li>
            <li class="nav-item">
            	<a id="delete_btn" href="##" class="btn-floating btn-sm orange"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a>
               <!--- <a class="nav-link"><i class="fa fa-comments-o"></i> <span class="clearfix d-none d-sm-inline-block">Support</span></a>--->
            </li>
            <li class="nav-item">
            	<a id="email_btn" href="##" class="btn-floating btn-sm orange" data-toggle="modal" data-target="##myemail_modal"><i class="fa fa-envelope fa-lg" aria-hidden="true"></i></a>
                <!---<a class="nav-link"><i class="fa fa-user"></i> <span class="clearfix d-none d-sm-inline-block">Account</span></a>--->
            </li>
            <li class="nav-item dropdown">
                <!---<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                </a>
                <div class="dropdown-menu dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>
                </div>--->
            </li>
            </cfif>
        </ul>
    </nav>--->
   
    <!-- /.Navbar -->

<!--/.Double navigation-->


<!---<footer class="page-footer center-on-small-only">
       <!--Footer links-->  
     <!---  <hr class="orange darken-2">--->
        <!--Copyright-->
        <div class="footer-copyright">
            <div class="container-fluid">
                © 2017 Copyright: <a href="https://www.myacrobat.com"> myacrobat.com </a>

            </div>
        </div>
        <!--/.Copyright-->

    </footer>--->

    <!-- SCRIPTS -->

   
    <!-- Bootstrap dropdown -->
    <script type="text/javascript" src="/includes/MDB/js/popper.min.js"></script>

    <!-- Bootstrap core JavaScript -->
    <script type="text/javascript" src="/includes/MDB/js/bootstrap.min.js"></script>

    <!-- MDB core JavaScript -->
    <script type="text/javascript" src="/includes/MDB/js/mdb.min.js"></script>

	<script src="/includes/js/my/config.js"></script>
	<script src="/includes/js/main/main.js"></script>
	<!---<script src="includes/js/main/sessionManager.js"></script>--->
	
	<script>
	$(function() {
		// activate all drop downs
		$('.dropdown-toggle').dropdown();
		// Tooltips
		$("[rel=tooltip]").tooltip();
	});
	

		$(document).ready( function() {
			
			$(".button-collapse").sideNav();
			application = this;
			
			if( !application.main )
				application.main = new Main();
			
			/*if( !application.sessionManager )
				application.sessionManager = new SessionManager();*/
			
			$('.popover-dismiss').popover({
				  trigger: 'focus'
				})
			
		});
	</script>

<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="js/cors/jquery.xdr-transport.js"></script>
<![endif]-->
<!-- Modal -->
<div class="modal fade top" id="confirmation_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-notify modal-warning" role="document">
        <!--Content-->
        <div class="modal-content">
            <!--Header-->
            <div class="modal-header">
                <h4 class="modal-title w-100" id="myModalLabel">Confirmation</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <!--Body-->
            <div class="modal-body">
                <p id="confirmation_text"></p>
            </div>
            <!--Footer-->
            <div class="modal-footer">
                <button type="button" class="btn orange darken-2" data-dismiss="modal">No</button>
                <button id="confirm_yes" type="button" class="btn orange darken-2">Yes</button>
            </div>
        </div>
        <!--/.Content-->
    </div>
</div>
<!-- Modal -->


<!-- session expire modal -->
<div class="modal fade" id="session_expire_warning_modal" aria-hidden="true" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">

    <div class="modal-dialog" role="document">

        <div class="modal-content">

            <div class="modal-header">                 

                <h4 class="modal-title">Session Expire Warning</h4>

            </div>

            <div class="modal-body">

                Your session will expire in <span id="seconds-timer"></span> seconds. Do you want to extend the session?

            </div>

            <div class="modal-footer">

                <button id="btnOk" type="button" class="btn btn-default" style="padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; border: 1px solid transparent; border-radius: 4px;  background-color: #428bca; color: #FFF;">Ok</button>

                <button id="btnSessionExpiredCancelled" type="button" class="btn btn-default" data-dismiss="modal" style="padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; border: 1px solid transparent; border-radius: 4px; background-color: #428bca; color: #FFF;">Cancel</button>

                <button id="btnLogoutNow" type="button" class="btn btn-default" style="padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; border: 1px solid transparent; border-radius: 4px;  background-color: #428bca; color: #FFF;">Logout now</button>

            </div>

        </div>

    </div>
</div>

    <!--End Show Session Expire Warning Popup here -->

    <!--Start Show Session Expire Popup here -->

    <div class="modal fade" id="session_expired_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">

        <div class="modal-dialog" role="document">

            <div class="modal-content">

                <div class="modal-header">

                    <h4 class="modal-title">Session Expired</h4>

                </div>

                <div class="modal-body">

                    Your session is expired.

                </div>

                <div class="modal-footer">

                    <button id="btnExpiredOk" onclick="sessionExpiredRedirect()" type="button" class="btn btn-primary" data-dismiss="modal" style="padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; border: 1px solid transparent; border-radius: 4px; background-color: #428bca; color: #FFF;">Ok</button>

                </div>

            </div>

        </div>

    </div>

<!-- ================================================PROPERTIES MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="loading_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
	     
		<div class="modal-dialog modal-sm text-center justify-content-center" role="document">
		<img src="/includes/images/ajax-loader.gif">
			<span class="text-white" id='action_label'>Loading, please wait.</span>
			<!-- Modal content-->
			<!---<div class="modal-content text-center">
				
				<h3><span id='action_label'>Loading, please wait</span></h3>
                <div class="progress primary-color-dark orange darken-2">
                    <div class="indeterminate"></div>
                </div>
			</div>--->
			<!-- /.Modal content-->
		</div>
	</div> <!--/ Modal -->
	<!-- ==============================================END PROPERTIES MODAL================================================ -->


    <!-- Central Modal Medium Danger -->
<div class="modal fade" id="errorModalDanger" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-notify modal-danger" role="document">
        <!--Content-->
        <div class="modal-content">
            <!--Header-->
            <div class="modal-header">
                <p class="heading lead">Error</p>

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" class="white-text">&times;</span>
                </button>
            </div>

            <!--Body-->
            <div class="modal-body">
                <div class="text-center">
                    <i class="fa fa-exclamation-triangle fa-4x mb-3 animated rotateIn"></i>
                    <p id="errorModalMessage"></p>
                </div>
            </div>

            <!--Footer-->
            <div class="modal-footer justify-content-center">
                <a type="button" class="btn btn-outline-secondary-modal waves-effect" data-dismiss="modal">Okay</a>
            </div>
        </div>
        <!--/.Content-->
    </div>
</div>
<!-- Central Modal Medium Danger-->


</body>

</html>