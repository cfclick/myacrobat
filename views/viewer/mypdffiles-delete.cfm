<div class="container">
	
<cfoutput>
	
</cfoutput>
 <!--Main column-->
    <div class="col-sm-12 col-md-12 col-lg-12">       
        <!--First row-->
        <div class="row wow fadeIn" data-wow-delay="0.4s">
            <!--First slide-->           
            <cfoutput>
            	<cfloop query="rc.qry_workingfolder" >
                	<cfset noextFileName = replace(name, ".pdf", "") />
                	<cfset thumb_img = "#rc.currentWorkingURL#thumbnail/#noextFileName#/#noextFileName#_page_1.jpg" />
                	<div class="col-md-2">
                        <div class="card">
                        	<a href="viewer/workbench?fileName=#name#">
                            <img class="img-fluid" src="#thumb_img#" alt="Card image cap" />
                            </a>               
                        </div>
                    </div>                		
                </cfloop>
                <!--/.First slide-->               
            </cfoutput>  
        </div>
        <!--/.First row-->
        <br>
        <hr class="extra-margins">
    </div>
    <!--/.Main column-->
</div>