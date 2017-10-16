<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>My Acrobat</title>

<link href="/includes/special/css/jquery.fancybox-1.3.4.css" rel="stylesheet" type="text/css" />
<link href="/includes/special/css/style.css" rel="stylesheet" type="text/css" />
<link href="/includes/special/css/layout.css" rel="stylesheet" type="text/css" />
<script src="/includes/special/js/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="/includes/special/js/bgSlider.js"></script>
<script type="text/javascript" src="/includes/special/js/sImg.js"></script>
<script type="text/javascript" src="/includes/special/js/swicher.js"></script>
<script type="text/javascript" src="/includes/special/js/forms.js"></script>
<script type="text/javascript" src="/includes/special/js/superfish.js"></script>
<script type="text/javascript" src="/includes/special/js/jquery.fancybox-1.3.4.pack.js"></script>
<script type="text/javascript" src="/includes/special/js/scripts.js"></script>
<!--[if lt IE 8]> <div class="alc" style=' clear: both; height: 59px; padding:0 0 0 15px; position: relative; z-index:9999'> <a href="http://www.microsoft.com/windows/internet-explorer/default.aspx?ocid=ie6_countdown_bannercode"><img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." /></a></div> <![endif]-->
<!--[if lt IE 9]><script src="js/html5.js" type="text/javascript"></script><![endif]-->
<!--[if IE]><link href="css/ie_style.css" rel="stylesheet" type="text/css" /><![endif]-->
</head>
<body>
<div id="gspinner"></div>
<div id="glob">
  <div class="aside-bg"></div>
  <div id="main">
    <h1><a href="index.html"><img src="/includes/special/images/logo.png" alt=""></a></h1>
    <nav>
    	
      <ul class="sf">
      	<cfif event.getCurrentEvent() eq 'viewer.workbench'>
                            
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
        <li><a href="#!/home">home<span></span></a></li>
       <!--- <li><a href="#!/about_us">about us<span></span></a></li>--->
        <li><a href="#!/services">services<span></span></a>
          <!---<ul>
            <li><a href="#readmore">&bull; web development</a></li>
            <li><a href="#readmore">&bull; Document Management System</a></li>
          </ul>--->
        </li>
       <!--- <li><a href="#!/portfolio">portfolio<span></span></a></li>--->
        <li><a href="#!/contacts">contacts<span></span></a></li>
      </ul>
    </nav>
    <a href="#" class="banner"><img src="/includes/special/images/banner.png" alt=""></a>
    <div class="bg-pags">
      <ul>
        <li class="active"><a href="#"></a></li>
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
        <li><a href="#"></a></li>
      </ul>
      <a href="#" class="play-bg paused"><span class="play">play</span><span class="stop">stop</span></a> </div>
    <div class="bg-spinner"></div>
    <article id="content">
      <ul>
        <li id="home">
          
          <cfoutput>#renderView()#</cfoutput>
        </li>
      
        <li id="services">

        	<h2>Coming Soon</h2>
          <h3>Crafting custom PDF serives</h3>
         
        </li>
       
        <li id="contacts">
        	<h2>Coming Soon</h2>
         
        </li>
        <li id="privacy">
          <h3>privacy policy</h3>
         
        </li>
      </ul>
    </article>
  </div>
  <footer>
    <div class="in">
      <pre class="privacy und">myacrobat &copy; 2017 | <a href="#!/privacy">Privacy policy</a></pre>
     
    </div>
  </footer>
</div>

<script type="text/javascript">
$.bgSlider('/includes/special/images/bg1.jpg').sImg({spinner:'.bg-spinner'})
</script>
<!--coded by pleazkin-->
</body>
</html>