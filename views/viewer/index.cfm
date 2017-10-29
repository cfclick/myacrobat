<style>
	.fluidMedia {
	position: relative;
	padding-bottom: 93%; /* proportion value to aspect ratio 16:9 (9 / 16 = 0.5625 or 56.25%) */
	padding-top: 0px;
	height: 0;
	overflow: auto;
	}
	.fluidMedia iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 95%;
	}
	.modal-heade-black{
	color:#000000;
	}
	
	.modal-body {
    max-height: calc(100vh - 210px);
    overflow-y: auto;
    }
    
    li .active .selected{
    	color:#000;
    }
    
    select {
    	display:block!important;
    }

</style>
<cfoutput>

	<cfparam name="rc.password" type="string" default="">
	
	<div class="fixed-action-btn" style="padding-right:100px">
		<a class="btn-floating peach-gradient"><i class="fa fa-leaf"></i></a>

		<ul style="padding-right:100px">
			<li><a id="restore_btn" href="##" class="btn-floating btn-sm bg-primary"><i class="fa fa-undo fa-lg" aria-hidden="true"></i></a></li>
			<li><a id="delete_btn" href="##" class="btn-floating btn-sm orange"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></li>
			<li><a id="email_btn" href="##" class="btn-floating btn-sm orange" data-toggle="modal" data-target="##myemail_modal"><i class="fa fa-envelope fa-lg" aria-hidden="true"></i></a></li>
		</ul>
	</div>

	<input type="hidden" name="fileName" id="fileName" value="#rc.fileName#" />
	<input type="hidden" name="passPdf" id="passPdf"  value="#rc.password#" />
										
	<div class="container" style="padding-top:55px">
	
		<div class="row">
			<div class="col-sm-2 col-md-2 col-lg-2">
				<br><br><br>
				<a href="#cgi.scRIPT_NAME#" class="btn orange darken-2 waves-effect btn-block" >
					Home
				</a>
				<button type="button" class="btn orange darken-2 waves-effect btn-block" data-toggle="modal" 
				        data-target="##digital_signature_modal">
					Signature
				</button>
				<button type="button" class="btn orange darken-2 waves-effect btn-block" data-toggle="modal" data-target="##redact_modal">
					Redact
				</button>
				<button id="sanitize_btn" type="button" class="btn orange darken-2 waves-effect btn-block" >
					Sanitize
				</button>				
				<button type="button" class="btn orange darken-2 waves-effect btn-block" data-toggle="modal" data-target="##stamp_modal">
					Stamp
				</button>
				<button type="button" class="btn orange darken-2 waves-effect btn-block" data-toggle="modal" data-target="##barcode_modal">
					Barcode
				</button>				
				<button id="property_btn" type="button" class="btn orange darken-2 waves-effect btn-block" >
					Properties
				</button>
			</div>
			<div class="col-sm-10 col-md-10 col-lg-10">
				
				<div class="row wow fadeIn" data-wow-delay="0.4s">
					<div class="col-sm-12 col-md-12 col-lg-12">						
						<div class="fluidMedia">
							<iframe id="pdf_iframe" src="#rc.homepage#?event=viewer.preview&fileName=#rc.fileName#" frameborder="0">
							</iframe>
						</div>
					</div>
				</div>
				
				<br>
			</div>
		</div>
	</div>
	
	<!-- ============================================ SIGNATURE MODAL 
	=============================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="digital_signature_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-full-height modal-right" role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						<!---<i class="fa fa-file">
						</i>--->
						Digital Signature
					</h4>
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div class="modal-body" style="padding:40px 50px;">
					<div class="row">
						<form class="col-md-12">
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="d_x1" value="440" class="form-control" required="yes" style="width:40px"/>									       style="width:40px"/>
									
									<label for="d_x1" data-error="invalid" data-success="valid">
										x1
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="d_y1" value="75" class="form-control" required="yes"
									       style="width:40px"/>
									<label for="d_y1" data-error="invalid" data-success="valid">
										y1
									</label>
								</div>
							</div>
							
							<div class="row">
								<div style="width:300px;height:100px;border:1px solid ##000;margin-left:40px">
								</div>
							</div>
							<br>
							<br>
							<div class="row pull-right">
								<div class="md-form form-group form-sm">
									<input type="text" id="d_x2" value="570" class="form-control" required="yes"
									       style="width:40px"/>
									<label for="d_x2" data-error="invalid" data-success="valid">
										x2
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="d_y2" value="38" class="form-control" required="yes"
									       style="width:40px"/>
									<label for="d_y2" data-error="invalid" data-success="valid">
										y2
									</label>
								</div>
							</div>
							<br>
							<br>
							<br>
							<br>
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="fieldName" value="Signature1" class="form-control" required="yes"/>
									<label for="fieldName" data-error="invalid" data-success="valid">
										Signature Field Name
									</label>
								</div>
							</div>

							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="page" class="form-control" value="1" required="yes" />
									<label for="page" data-error="invalid" data-success="valid">
										Page Number
									</label>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!--Footer-->
				<div class="modal-footer">
					<button type="button" id="add_signature_field_btn" class="btn orange darken-2 pull-right">
						Add
					</button>
				</div>
				<!--/.Footer-->
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ========================================END SIGNATURE MODAL============================================= -->
	
	
	
	<!-- ================================================REDACT MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="redact_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-full-height modal-right" role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						<i class="fa fa-user">
						</i>
						Redact 
					</h4>
					
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div class="modal-body" style="padding:40px 50px;">
					<div class="row">
						<form class="col-md-12">
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="r_x1" value="440" class="form-control"
									       style="width:40px"/>
									<label for="r_x1">
										x1
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="r_y1" value="75" class="form-control"
									       style="width:40px"/>
									<label for="r_y1">
										y1
									</label>
								</div>
							</div>
							
							<div class="row">
								<div style="width:300px;height:100px;border:1px solid ##000;margin-left:10px">
								</div>
							</div>
							<br>
							<br>
							<div class="row pull-right">
								<div class="md-form form-group form-sm">
									<input type="text" id="r_x2" value="570" class="form-control"
									       style="width:40px"/>
									<label for="r_x2">
										x2
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="r_y2" value="38" class="form-control"
									       style="width:40px"/>
									<label for="r_y2">
										y2
									</label>
								</div>
							</div>
							
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="r_page" class="form-control" value="1" style="width:60px"/>
									<label for="r_page">
										Page Number
									</label>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!--Footer-->
				<div class="modal-footer">
					<button type="button" id="redact_apply_btn" class="btn orange darken-2 pull-right">
						Apply
					</button>
				</div>
				<!--/.Footer-->
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ==============================================END REDACT MODAL================================================ -->
	
	
	<!-- ================================================STAMP MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="stamp_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-full-height modal-right" role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						<i class="fa fa-file">
						</i>
						Stamp
					</h4>
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div class="modal-body" style="padding:40px 50px;">
					<div class="row">
						<form class="col-md-12">
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="s_x1" value="100" class="form-control" required
									       style="width:40px"/>
									<label for="s_x1">
										x1
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="s_y1" value="775" class="form-control" required
									       style="width:40px"/>
									<label for="s_y1">
										y1
									</label>
								</div>
							</div>
							
							<div class="row">
								<div style="width:300px;height:100px;border:1px solid ##000;margin-left:40px">
									
								</div>
							</div>
							<br>
							<br>
							<div class="row pull-right">
								<div class="md-form form-group form-sm">
									<input type="text" id="s_x2" value="270" class="form-control" required
									       style="width:40px"/>
									<label for="s_x2">
										x2
									</label>
								</div>
								
								<div class="md-form form-group form-sm">
									<input type="text" id="s_y2" value="738" class="form-control" required
									       style="width:40px"/>
									<label for="s_y2">
										y2
									</label>
								</div>
							</div>
							<br>
							<br>
							<br>
							<br>
							<div class="row">
								<div class="md-form form-group form-sm"><!--class="mdb-select"-->
									<select id="stamp_type" class="form-control" required>
										<option value="" selected>Choose your option</option>
											<option value="Approved">
												Approved
											</option>
											<option value="Experimental">
												Experimental
											</option>
											<option value="NotApproved">
												NotApproved
											</option>
											<option value="AsIs">
												AsIs
											</option>
											<option value="Expired">
												Expired
											</option>
											<option value="NotForPublicRelease">
												NotForPublicRelease
											</option>
											<option value="Confidential">
												Confidential
											</option>
											<option value="Final">
												Final
											</option>
											<option value="Sold">
												Sold
											</option>
											<option value="Departmental">
												Departmental
											</option>
											<option value="ForComment">
												ForComment
											</option>
											<option value="TopSecret">
												TopSecret
											</option>
											<option value="Draft">
												Draft
											</option>
											<option value="ForPublicRelease">
												ForPublicRelease
											</option>
											<option value="paid_stamp.png">
												Paid
											</option>
											<option value="classified-stamp.png">
												Classified
											</option>
											<option value="Rejected-Stamp.png">
												Rejected
											</option>
											
										</select>
								</div>
							</div>

							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="s_page" class="form-control" value="1" required/>
									<label for="s_page">
										Pages 
									</label>
								</div>
							</div>
							
							<div class="row">
								<div class="md-form form-group form-sm">
									<i class="fa fa-pencil prefix"></i>
									    <textarea type="text" id="stamp_note" class="md-textarea"></textarea>
									    <label for="form8">Note</label>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!--Footer-->
				<div class="modal-footer">
					<button type="button" id="add_stamp_btn" class="btn orange darken-2 pull-right">
						Add
					</button>
				</div>
				<!--/.Footer-->
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ==============================================END STAMP MODAL================================================ -->
	
	
	
	<!-- ================================================STAMP MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="barcode_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-full-height modal-right" role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						Barcode
					</h4>
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div class="modal-body" style="padding:40px 50px;">
					<div class="row">
						<form class="col-md-12">
							
							<div class="row">
								<div class="md-form form-group">
									<input type="text" id="textToEncode" class="form-control" required/>
									<label for="textToEncode">
										Text To Encode 
									</label>
								</div>
							</div>
							
							<div class="row">
								<div class="md-form form-group form-sm">
									<input type="text" id="b_page" class="form-control" value="1" required/>
									<label for="b_page">
										Page
									</label>
								</div>
							</div>
							
							
						</form>
					</div>
				</div>
				<!--Footer-->
				<div class="modal-footer">
					<button type="button" id="add_barcode_btn" class="btn orange darken-2 pull-right">
						Add
					</button>
				</div>
				<!--/.Footer-->
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ==============================================END BARCODE MODAL================================================ -->
	
	
	
	
	<!-- ================================================PROPERTIES MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="property_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-fluid" role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						<i class="fa fa-user">
						</i>
						Properties 
					</h4>
					
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div id="property_modal_body" class="modal-body" style="padding:40px 50px;">
					
				</div>
				
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ==============================================END PROPERTIES MODAL================================================ -->
	
	
	<!-- ================================================EMAIL MODAL================================================== -->
	<!-- Modal -->
	<div class="modal fade right" id="email_modal" tabindex="-1" role="dialog"
	     aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog " role="document">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header text-center modal-heade-black">
					<h4>
						<i class="fa fa-user">
						</i>
						Email 
					</h4>
					
					<button type="submit" class="btn orange darken-2 pull-right" data-dismiss="modal">
						X
					</button>
				</div>
				<div id="property_modal_body" class="modal-body" style="padding:40px 50px;">
					
					<blockquote class="blockquote bq-warning">
					    <p class="bq-title">Attached File</p>
					    <p style="color:##000000" id="attached_fileName"></p>
					</blockquote>

					<div class="md-form form-sm" style="color:##000000">
                        <i class="fa fa-envelope prefix"></i>
                        <input type="text" id="your_email" class="form-control">
                        <label for="your_email">Your email</label>
                    </div>
                    
                    <div class="md-form form-sm">                     
                        <input type="text" id="your_subject" class="form-control">
                        <label for="your_subject">Subject</label>
                    </div>
                    
                    <div class="md-form form-sm">                     
                        <textarea type="text" id="your_message" class="md-textarea" rows="3" cols="50"></textarea>
                        <label for="your_message">Message</label>
                    </div>
                    
                    <button class="btn orange darken-2" id="send_email_btn">Send</button>

				</div>
				
			</div>
			<!-- /.Modal content-->
		</div>
	</div><!--/ Modal -->
	<!-- ==============================================END EMAIL MODAL================================================ -->
</cfoutput>

<script src="/includes/js/viewer/workbench.js" 			type="application/javascript" ></script>
<script src="/includes/js/viewer/digitalsignature.js" 	type="application/javascript" ></script>
<script src="/includes/js/viewer/redact.js" 			type="application/javascript" ></script>
<script src="/includes/js/viewer/properties.js" 		type="application/javascript" ></script>
<script src="/includes/js/viewer/stamp.js" 				type="application/javascript" ></script>
<script src="/includes/js/viewer/barcode.js" 			type="application/javascript" ></script>

<script >

	$(document).ready( function() {
		
		//if( viewerIndex == 'undefined' )	
			workBench = new WorkBench();
			
			$('.mdb-select').material_select();
	});
</script>