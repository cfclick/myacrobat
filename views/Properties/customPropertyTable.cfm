<cfoutput>
<div id="here_table"></div>
	<!---<table class="table">
	
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
		<cfif isdefined("rc.pdf.Properties") and isStruct( rc.pdf.Properties ) >
		
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
						<cfif isdefined("rc.hasPass") and not rc.hasPass >
							<a id="del_cust_prop_btn_#prop#"  href="##" data-prop="#prop#" class="btn orange darken-2 del">delete</a>
						</cfif>
					</td>
				</tr>
			</cfloop>
		</tbody>
		</cfif>
		<!--Table body-->
	</table><!--Table-->--->
</cfoutput>
<script>
wb = workBenchStart();
console.log(wb)
</script>