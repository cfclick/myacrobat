<cfoutput>

	<div id="main_properties_body">
		<dl class="row" style="color:black">
			<dt class="col-sm-3">
				File Name
			</dt>
			<dd class="col-sm-9">
				#rc.fileName#
			</dd>
		</dl>
		<!--First row-->
		<div class="row">
			<!--First column-->
			<div class="col-md-12">
				<div class="md-form">
					<input type="text" id="title_input" class="form-control " value="#rc.pdf.title#">
					<label for="title_input">
						Title
					</label>
				</div>
			</div>
		</div>
		<!--/.First row-->
		
		<!--Second row-->
		<div class="row">
			<div class="col-md-12">
				<div class="md-form">
					<input type="text" id="author_input" class="form-control " value="#rc.pdf.author#">
					<label for="author_input">
						Author
					</label>
				</div>
			</div>
			<div class="col-md-12">
				<div class="md-form">
					<input type="text" id="subject_input" class="form-control " value="#rc.pdf.subject#">
					<label for="subject_input">
						Subject
					</label>
				</div>
			</div>
			<div class="col-md-12">
				<div class="md-form">
					<textarea type="text" id="keywords_input" class="md-textarea">#rc.pdf.keywords#</textarea>
					<label for="keywords_input">Keywords</label>
				</div>
			</div>
		</div>
		<!--/.Second row-->
		
		<!--Third row-->
		<div class="row">
			<dl class="row" style="color:black">
				<dt class="col-sm-3">
					Created
				</dt>
				<dd class="col-sm-9">
					#rc.pdf.Created#
				</dd>
				<dt class="col-sm-3">
					Modified
				</dt>
				<dd class="col-sm-9">
					#rc.pdf.Modified#
				</dd>
				<dt class="col-sm-3">
					Application
				</dt>
				<dd class="col-sm-9">
					#rc.pdf.Application#
				</dd>
			</dl>
		</div>
	</div>
		<!--/.Third row-->
		
</cfoutput>