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
        .view {
            height: 100%;
        }
        /* Navigation*/
        
        .navbar {
            background-color: transparent;
        }
        
        .scrolling-navbar {
            -webkit-transition: background .5s ease-in-out, padding .5s ease-in-out;
            -moz-transition: background .5s ease-in-out, padding .5s ease-in-out;
            transition: background .5s ease-in-out, padding .5s ease-in-out;
        }
        
        .top-nav-collapse {
            background-color: #1C2331;
        }
        
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
        
        .view {
            background: url("/includes/images/bg1.jpg")no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }
        
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

<body>

    <!--Navbar-->
        <nav class="navbar navbar-expand-lg fixed-top bg-faded">
            <div class="container">
                <a class="navbar-brand" href="<cfoutput>#application.cbcontroller.getconfigSettings().urls.homepage#</cfoutput>"><img src="/includes/special/images/logo.png" ></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto text-white">
                    	
                       <!--- <cfif event.getCurrentEvent() eq 'viewer.workbench'>
                            
                            <li class="nav-item" style="padding-left:2px;padding-right:2px">
                                <a class="nav-link orange darken-2" href="#" id="restore_btn"><i class="fa fa-undo fa-lg" aria-hidden="true"></i></a>
                            </li>
                            <li class="nav-item" style="padding-left:2px;padding-right:2px">
                                <a class="nav-link orange darken-2" href="#" id="delete_btn"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a>
                            </li>
                            <li class="nav-item text-white" style="padding-left:2px;padding-right:2px">
                                <a class="nav-link orange darken-2"  id="email_btn" data-toggle="modal" data-target="##myemail_modal"><i class="fa fa-envelope fa-lg" aria-hidden="true"></i></a>
                            </li>
                            <li class="nav-item" style="padding-left:2px;padding-right:2px">
                                <a class="nav-link disabled" href="#"><i class="fa fa-share fa-lg" aria-hidden="true"></i></a>
                            </li>
                        </cfif>
                       --->
                </div>
            </div>
        </nav>

    <!--/.Navbar-->
    <!--Mask-->
    
    <div class="view hm-black-light">
    	<div id="preload_div" class="progress invisible">
	        <div class="indeterminate bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
	    </div>
        <div class="full-bg-img flex-center">
            
        	<cfoutput><div class="container-fluid" style="padding-top:160px">#renderView()#</div></cfoutput>
            
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

    </footer>
    <!--/.Footer-->


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
		<div class="modal-dialog modal-sm" role="document">
			<!-- Modal content-->
			<div class="modal-content text-center">
				
				<h3><span id='action_label'>Loading</span>, please wait</h3>
                <div class="progress primary-color-dark orange darken-2">
                    <div class="indeterminate"></div>
                </div>
			</div>
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