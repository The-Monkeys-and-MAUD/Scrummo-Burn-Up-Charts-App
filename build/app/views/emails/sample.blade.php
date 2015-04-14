@extends('emails.layouts.common')

@section('title')
	Your Title Here
@stop

@section('emailbody')

		<!-- Tables are the most common way to format your email consistently. Set your table widths inside cells and in most cases reset cellpadding, cellspacing, and border to zero. Use nested tables as a way to space effectively in your message. -->
		<table cellpadding="0" cellspacing="0" border="0" align="center">
			<tr>
				<td width="200" valign="top"></td>
				<td width="200" valign="top"></td>
				<td width="200" valign="top"></td>
			</tr>
		</table>
		<!-- End example table -->

		<!-- Yahoo Link color fix updated: Simply bring your link styling inline. -->
		<a href="http://htmlemailboilerplate.com" target ="_blank" title="Styling Links" style="color: orange; text-decoration: none;">Coloring Links appropriately</a>

		<!-- Gmail/Hotmail image display fix -->
		<img class="image_fix" src="full path to image" alt="Your alt text" title="Your title text" width="x" height="x" />

		<!-- Working with telephone numbers (including sms prompts).  Use the "mobile" class to style appropriately in desktop clients
		versus mobile clients. -->
		<span class="mobile_link">123-456-7890</span>
@stop
