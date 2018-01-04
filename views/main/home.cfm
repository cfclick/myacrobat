<style >
	::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  		color: #ffffff;
  		font-style:italic;
	}
	::-moz-placeholder { /* Firefox 19+ */
	  	color: #ffffff;
	  	font-style:italic;
	}
	:-ms-input-placeholder { /* IE 10+ */
	  	color: #ffffff;
	  	font-style:italic;
	}
	:-moz-placeholder { /* Firefox 18- */
	  	color: #ffffff;
	  	font-style:italic;
	}
	
	h2 {
    text-shadow: 2px 2px #000000;
}
</style>

       
        <div class="flex-center">  
<div class="container"  style="padding-top:55px">
	 
        	    
        
	<!--First row-->
	<div class="row wow fadeIn" data-wow-delay="0.2s">
		<div class="col-md-12">
			<ul class="animated fadeInUp">
				<li>
					<center>
					<img src="/includes/images/banner.png" align="center"/>
					</center>
				</li>
				<!---<li>
					<h1 class="h1-responsive font-bold">
						My Acrobat ColdFusion Way
					</h1>
				</li>--->
				<li>
					<h2>
						This application is in beta version, feel free to play around. The services provided by myAcrobat.com on an "AS IS" BASIS.
If you are interested in batch (production) services, please contact us at info@myacrobat.com
					</h2>
				</li>
				<br><br>
				<li>
					<h2><p id="greeting">Loading ...</p></h2>
				</li>
				<!---<li>
					<p>
						Convert any website to PDF
					</p>
					<div class="pt-1 pb-4">
						<!--- <form id="urlForm" action="?event=Main.urlToPDF" method="POST"  > --->
						<div class="input-group md-form form-sm form-2 pl-0">
						    <input id="url_input" name="url_input" class="form-control my-0 py-1 red-border text-white " type="text" placeholder="http://qbillc.com" aria-label="Search">
						    <button class="input-group-addon red text-white waves-effect orange darken-2" style="cursor:pointer" id="urltoPDF_btn"><i class="fa fa-file-pdf-o fa-lg" aria-hidden="true"></i> &nbsp; Convert to PDF</a>
						</div>
						<!--- </form> --->
					</div>
				</li>--->
				<li>
					<div class="pt-1 pb-4 ">
						<cfif isdefined("rc.showerror") and len(rc.showerror)>
							<div class="alert alert-danger">
								<cfoutput>#rc.showerror#</cfoutput>
							</div>
						</cfif>
						<form id="fileupload" action="?event=Main.uploadFiles" method="POST" enctype="multipart/form-data" onsubmit="return beforeUpload();">
							<div class="file-field">
								<div class="btn orange darken-2 btn-sm">
									<span>Choose file</span>
									<input type="file" id="uploaded_file" name="files[]"  ><!---multiple--->
								</div>
								<div class="file-path-wrapper">
									<input id="filename" class="file-path validate text-white" type="text" placeholder="Upload your file" required="yes">
									<label for="filename" data-error="invalid" data-success="valid">Select file to upload</label>
								</div>
								<br><br>
									<!---	<div class="file-path-wrapper">--->
									<div class="md-form form-group">
										<input type="password" id="password" name="password" class="text-white" placeholder="Enter Password if the PDF is protected" />
										<label for="password">
											 Password
										</label>
									</div>
								<!---</div>--->
								
								<br><br>
								<button id="upload_pdf_btn" type="submit" class="btn orange darken-2">
									<i class="glyphicon glyphicon-upload"></i>
									<span>Start upload</span>
								</button>
							</div>

							
						</form>
					</div>
				</li>
				
				
			</ul>
		</div>
	</div>
	<!--/.First row-->
	<hr class="extra-margins">
	
	<div class="row">
	
		<cfoutput >
		 	#myPDFFiles()#
		</cfoutput>
	</div>
	
</div>

</div>
 
<!--/.Main layout-->
    
   
	