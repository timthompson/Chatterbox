<cfcomponent>
	<cfscript>
		this.name       = hash( ExpandPath( '.' ) & "v0.01" );
		this.datasource = "Chat";
		this.ormenabled = true;
		this.ormsettings = {
			dbcreate      = "dropcreate",
			dialect       = "derby",
			cfclocation   = "models"
		};
	</cfscript>
</cfcomponent>