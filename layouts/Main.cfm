﻿<!DOCTYPE html>
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
            background: url("/includes/images/bg_o.jpg")no-repeat center center fixed;
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
		  	width: 100%;
		  	width: -webkit-calc(100%+ 60px);
		  	width: calc(100%+ 60px);
		  	width: -moz-calc(100%);
		  	padding-bottom: 60px;
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
    
    
    

    </style>
	
	
	 <!-- JQuery -->
    <script type="text/javascript" src="/includes/js/jquery-3.2.1.min.js"></script>
	
	
</head>

<body class="fixed-sn">
<script type="text/javascript" src="https://cdn.ywxi.net/js/1.js" async></script>
    
 <!--Double navigation-->
<header>
    <!-- Sidebar navigation -->
    <div id="slide-out" class="side-nav sn-bg-4 fixed ">
        <ul class="custom-scrollbar list-unstyled elegant-color">
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
                  <li><a href="https://www.facebook.com/sharer/sharer.php?u=I%20found%20free%20PDF%20app%20online%20https%3A//myacrobat.com%2F&amp;src=sdkpreparse" target="_blank" class="icons-sm fb-ic"><i class="fa fa-facebook"> </i></a></li>
                    <li><a href="https://plus.google.com/share?url=I%20found%20free%20PDF%20app%20online%20https%3A//myacrobat.com" target="_blank" class="icons-sm gplus-ic"><i class="fa fa-google-plus"> </i></a></li>
                    <li><a href="https://twitter.com/intent/tweet?text=I%20found%20free%20PDF%20app%20online%20https%3A//myacrobat.com%20powered%20by%20%23ColdFusion" target="_blank" class="icons-sm tw-ic"><i class="fa fa-twitter"> </i></a></li>
                </ul>
            </li>
            <!--/Social-->
            <!--Search Form-->
            <!--<li>
                <form class="search-form" role="search">
                    <div class="form-group waves-light">
                        <input type="text" class="form-control" placeholder="Search">
                    </div>
                </form>
            </li>-->
            <!--/.Search Form-->
            <!-- Side navigation links -->
            <li>
                <ul class="collapsible collapsible-accordion">
                   <cfoutput>
                   <li>               	
                      <a href="#cgi.scRIPT_NAME#" class="collapsible-header waves-effect arrow-r" >Home</a>                 
                  </li>
                 
                  <cfif comparenocase(event.getcurrentEvent(),'viewer.workbench') eq 0 >
                      <li>
                          <a http="##" class="collapsible-header waves-effect arrow-r" data-toggle="modal" 
                             data-target="##digital_signature_modal">
                              Signature
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
                 
	             </cfif>   </cfoutput>
                   
                </ul>
            </li>
            <!--/. Side navigation links -->
        </ul>
        <div class="sidenav-bg mask-strong elegant-color" ></div>
    </div>
    <!--/. Sidebar navigation -->
    <!-- Navbar -->
    <nav class="navbar fixed-top navbar-toggleable-md navbar-expand-lg scrolling-navbar double-nav elegant-color">
        <!-- SideNav slide-out button -->
        <div class="float-left">
            <a href="##" data-activates="slide-out" class="button-collapse"><i class="fa fa-bars"></i></a>
        </div>
        <!-- Breadcrumb-->
        <div class="breadcrumb-dn mr-auto">
           <p> </p>
        </div>
        <ul class="nav navbar-nav nav-flex-icons ml-auto">
           <!--- <li class="nav-item">
                <a class="nav-link"><i class="fa fa-envelope"></i> <span class="clearfix d-none d-sm-inline-block">Contact</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"><i class="fa fa-comments-o"></i> <span class="clearfix d-none d-sm-inline-block">Support</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"><i class="fa fa-user"></i> <span class="clearfix d-none d-sm-inline-block">Account</span></a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="##" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="##">Action</a>
                    <a class="dropdown-item" href="##">Another action</a>
                    <a class="dropdown-item" href="##">Something else here</a>
                </div>
            </li>--->
        </ul>
    </nav>
    <!-- /.Navbar -->
</header>
<!--/.Double navigation-->

<!--Main Layout-->
<main>
    <div class="container-fluid">
      <cfoutput>#renderView()#</cfoutput>
        
    </div>
</main>
<!--Main Layout-->   

    <!-- SCRIPTS -->  
    <!-- Bootstrap dropdown -->
    <script type="text/javascript" src="/includes/MDB/js/popper.min.js"></script>

    <!-- Bootstrap core JavaScript -->
    <script type="text/javascript" src="/includes/MDB/js/bootstrap.min.js"></script>

    <!-- MDB core JavaScript -->
    <script type="text/javascript" src="/includes/MDB/js/mdb.min.js"></script>

	
	<script>
   
	$(function() {
		// activate all drop downs
		$('.dropdown-toggle').dropdown();
		// Tooltips
		$("[rel=tooltip]").tooltip();
	});
	

		$(document).ready( function() {
			// SideNav Initialization
      $(".button-collapse").sideNav();
					
			$('.popover-dismiss').popover({
				  trigger: 'focus'
				})
		});
	</script>
    <script src="../includes/js/bundle.js"  ></script>

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
            	<button id="confirm_yes" type="button" class="btn orange darken-3">Yes</button>
                <button type="button" class="btn orange darken-1" data-dismiss="modal">No</button>
                
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