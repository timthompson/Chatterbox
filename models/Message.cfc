/**
 *@persistent true
 */
component {
	/**
	 *@fieldtype id
	 *@generator identity
	 */
	property messageId;
	
	property string message;
	property string username;
	property string token;
	
	/**
	 *@ormtype timestamp
	 */
	property date posted;
	
	function init( ){
		variables.posted = now( );
	}
}