<cfoutput>
<cfparam name="rc.hasPass" default="false" type="boolean">
<cfparam name="rc.showerror" default="" type="any">

<div class="row">
    <div class="col-md-6">

		#renderView("Properties/defaultProperties")#

		<div class="row">
			<button id="save_properties_btn" class="btn orange darken-2">
				Save
			</button>
		</div>
	
	</div>
    <div class="col-md-6">
		
		<!--Accordion wrapper-->
		<div class="accordion" id="accordionEx" role="tablist" aria-multiselectable="true">
    		<!-- Accordion card -->
    		<div class="card">
        		<!-- Card header -->
		        <div class="card-header" role="tab" id="headingOne">
		            <a data-toggle="collapse" data-parent="##accordionEx" href="##collapseOne" aria-expanded="true" aria-controls="collapseOne">
		                <h5 class="mb-0">
		                    Advanced <i class="fa fa-angle-down rotate-icon"></i>
		                </h5>
		            </a>
		        </div>
        		<!-- Card body -->
        		<div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
            		<div class="card-body">              	
		        		<dl class="row" style="color:black">
							<dt class="col-sm-3">
								PDF Producer
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Producer#
							</dd>
							<dt class="col-sm-3">
								PDF Version
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Version#
							</dd>
							<dt class="col-sm-3">
								Location
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.FilePath#
							</dd>
							
							<dt class="col-sm-3">
								Page Size
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.PageSizes[1].width# W X #rc.pdf.PageSizes[1].height# H  
							</dd>
							<dt class="col-sm-3">
								Number Of Pages
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.TotalPages#
							</dd>
							<dt class="col-sm-3">
								Trapped
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Trapped#
							</dd>
							
						</dl>
						<hr>
						<dl class="row" style="color:black">
							<dt class="col-sm-3">
								Printing
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Printing#
							</dd>
							<dt class="col-sm-3">
								Document Assembly
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.DocumentAssembly#
							</dd>
							<dt class="col-sm-3">
								Content Copying
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.CopyContent#
							</dd>
							
							<dt class="col-sm-3">
								Page Extraction
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.ContentExtraction#
							</dd>
							<dt class="col-sm-3">
								Commenting
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Commenting#
							</dd>
							<dt class="col-sm-3">
								Filling for form fields
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.FillingForm#
							</dd>
							<dt class="col-sm-3">
								Signing
							</dt>
							<dd class="col-sm-9">
								#rc.pdf.Signing#
							</dd>				
							
						</dl>		   
            		</div>
        		</div>
    		</div>
   			<!-- Accordion card -->

    		<!-- Accordion card -->
    		<div class="card">
		        <!-- Card header -->
		        <div class="card-header" role="tab" id="headingTwo">
		            <a class="collapsed" data-toggle="collapse" data-parent="##accordionEx" href="##collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
		                <h5 class="mb-0">
		                    Custom <i class="fa fa-angle-down rotate-icon"></i>
		                </h5>
		            </a>
		        </div>

        		<!-- Card body -->
       		 	<div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
            		<div class="card-body">
						<cfif isdefined("rc.showerror") and len( rc.showerror )>
							<div class="alert alert-warning">
								#rc.showerror#
							</div>
						<cfelse>
							<div class="form-inline">
						    <div class="md-form form-group">
						        <input type="text" id="custome_prop_name" class="form-control">
						        <label for="custome_prop_name"  >Name</label>
						    </div>
					
						    <div class="md-form form-group">	
						        <input type="text" id="custome_prop_value" class="form-control">
						        <label for="custome_prop_value" >Valued</label>
						    </div>
							<cfif isdefined("rc.hasPass") and not rc.hasPass >
						    <div class="md-form form-group">
						        <button type="button"  id="add_custom_prop_btn" class="btn orange darken-2">Add</button>
						    </div>	
							</cfif>				
						</div>
						</cfif>
						
						<!--Table-->
						<div id="custom_prop_div">
							<div id="here_table"></div>
							<!---#renderView("Properties/customPropertyTable")#--->
						</div>
            		</div>
        		</div>
    		</div>
    		<!-- Accordion card -->  
		</div>
		<!--/.Accordion wrapper-->		
	</div>
</div>	
	
			



</cfoutput>
<style type="text/css">
    .popover{
        max-width:600px;
    }
</style>
