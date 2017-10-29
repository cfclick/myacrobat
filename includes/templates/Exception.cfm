<!---
********************************************************************************
Author   :	Shirak Avakian
Email   :	Shirak.Avakian@gmail.com
Company  : 	myAcrobat.com
Date    :	10/15/2017
Component Name : Exception.cfm
Description :
	Show nice exception page for end user
********************************************************************************
---->

<cfprocessingdirective suppresswhitespace="true" >
<link href="/includes/css/bootstrap.min.css" rel="stylesheet">
<div style="padding:25px">

	<div class="alert alert-danger" >
	<h4 class='text-error'>System Exception</h4><br>
	<p>A technical problem or unauthorized request prevents us from proceeding. </p> 
	
	Please <a class="btn btn-default" href="<cfoutput>#cgi.scRIPT_NAME#</cfoutput>" role="button">Click here </a> and try again.
	</div>
</div>
<!---<cfdump var="#arguments#"/>--->
</cfprocessingdirective>