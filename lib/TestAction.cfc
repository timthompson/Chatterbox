/**
 *@extdirect true
 */
component {

	/**
	 *@extdirect true
	 */
	function getUserName( )
	{
		var result = {
			"name"  = GetAuthUser( )
		};
		
		return result;
	}
		
	/**
	 *@extdirect true
	 */
	function create( data )
	{
		var messages = [ ];
		
		if ( !isArray( arguments.data ) ){
			arguments.data = [ arguments.data ];
		};
			
		for( var i = 1; i lte ArrayLen( data ); i++ )
		{
			if ( data[ i ].messageId eq 0 ){
				var message = EntityNew( "Message" );
				
				message.setUserName( data[ i ].userName );
				message.setMessage( data[ i ].message );
				
				EntitySave( message );				
				ArrayAppend( messages, message );
			};
			
		};

		var result = {
			"success"  = true,
			"count"    = ArrayLen( messages ),
			"messages" = messages
		};
		
		return result;
	};
	
	/**
	 *@extdirect true
	 */
	function read( )
	{
		var messages = OrmExecuteQuery( "from Message" );
				
		var result = {
			"success"  = true,
			"count"    = ArrayLen( messages ),
			"messages" = messages
		};
		
		return result;
	};
	
	/**
	 *@extdirect true
	 */
	function destroy( data )
	{
		var messages = [ ];
		
		if ( !isArray( arguments.data ) ){
			arguments.data = [ arguments.data ];
		};
		
		for( var i = 1; i lte ArrayLen( data ); i++ ){
			ORMExecuteQuery( "delete from Message where messageId = :id", { id = arguments.data[ i ].messageId } );			
		};

		var result = {
			"success"  = true
		};
		
		return result;		
	}
	
	/**
	 *@extdirect true
	 */
	function loadNewMessages( obj )
	{
		var messages = [ ];
		
		if ( isNull( arguments ) ){
		//	messages = OrmExecuteQuery( "from Message" );
		} else {
			messages = OrmExecuteQuery( "from Message where posted > :posted and username != :username", { posted = ISOToDateTime( arguments.obj.posted ), username = arguments.obj.username } );
		};
						
		var result = {
			"success"  = true,
			"count"    = ArrayLen( messages ),
			"messages" = messages
		};
		
		return result;		
	}
	
	function ISOToDateTime( date )
	{
		return ARGUMENTS.Date.ReplaceFirst( "^.*?(\d{4})-?(\d{2})-?(\d{2})T([\d:]+).*$", "$1-$2-$3 $4" );
	}
}