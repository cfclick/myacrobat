<cfoutput>
	<table class="table">
	
		<!--Table head-->
		<thead class="mdb-color darken-3">
			<tr class="text-white">
				<th>
					##
				</th>
				<th>
					Name
				</th>
				<th>
					Value
				</th>
				<th>
				</th>
			</tr>
		</thead>
		<!--Table head-->
		
		<!--Table body-->
		<tbody>
			<cfloop collection="#rc.pdf.Properties#" item="prop">
				<tr>
					<td>
						#prop#
					</td>
					<td>
						#rc.pdf.Properties[prop]#
					</td>
					<td>
						<a href="##" onclick="properties.deleteCustomProperty('#prop#')" class="btn orange darken-2">delete</a>
					</td>
				</tr>
			</cfloop>
		</tbody>
		<!--Table body-->
	</table><!--Table-->
</cfoutput>