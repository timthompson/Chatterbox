<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Chatter Box</title>
    	
		<!--
		  -- Stylesheets
		  -->
		<link rel="stylesheet" type="text/css" href="../ext-4.0.2a/resources/css/ext-all.css">
		
		<!--
		  --  Ext JS Library
		  -->
    	<script type="text/javascript" src="../ext-4.0.2a/ext-debug.js"></script>
		
		<!--
		  -- Main JavaScript App file
		  -->
		<script type="text/javascript" src="app.js"></script>

		<!--
		  -- Ext Direct Remoting API file
		  -->
		<script type="text/javascript" src="lib/Api.cfm"></script>
	</head>

	<body>
		<textarea id = "message" style="display:none;">
			<tpl for=".">
				<tpl if="this.isLessThan12HoursOld( posted, xindex )">
					<div class="message-wrap">
						<p>({[this.showTime( values.posted )]})[{username}] : {[this.encodeString(values.message)]}</p>
					</div>
				</tpl>
			</tpl>
		</textarea>
	</body>
</html>
