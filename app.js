Ext.require([
	'Ext.Date',
	'Ext.direct.*',
	'Ext.data.*',
	'Ext.view.*',
	'Ext.util.Format',
	'Ext.XTemplate'
]);

Ext.ns( 'com.acme' );

Ext.onReady( function( ){
	Ext.direct.Manager.addProvider( Ext.app.REMOTING_API );

	Ext.app.TestAction.getUserName( function( provider, result ){
		com.acme.user  = 'TIMTHOM';
	});

	Ext.define('Message', {
		extend : 'Ext.data.Model',
		fields : [
			{ name: 'messageId', type: 'int'    },
			{ name: 'message',   type: 'string' },
			{ name: 'username',  type: 'string' },
			{ name: 'posted',    type: 'date'   }
		]					
	});
					
	var messageTemplate = Ext.XTemplate.from( 'message',
		{
			disableFormats : true,
			// Any posts older than 12 hours will not display
			isLessThan12HoursOld : function( datetime, index ){
				var expired = !Ext.Date.between( datetime, Ext.Date.add( new Date( ), Ext.Date.HOUR, -12 ), new Date( ) );
				if ( expired ){
					store.removeAt( index - 1 );
				};
				return !expired;
			},
			showTime : function( datetime ){
				return Ext.Date.format( datetime, 'g:i a' );
			},
			// Encode output to prevent interpretaion of tags
			encodeString : function( input ){
				var output = '';
				
				for ( var i = 0; i < input.length; i++ ){								
					output += '&#' + ( input.charCodeAt( i )  ) + ";";
				};
				
				return output;
			}
		}
	);

	var store = Ext.create( 'Ext.data.DirectStore', {
		storeId     : 'messageStore',
		model       : 'Message',
		autoLoad    : true,
		autoSync    : true,
		autoDestroy : true,
		proxy       : {
			type : 'direct',
			api  : {
				create  : Ext.app.TestAction.create,
				read    : Ext.app.TestAction.read,
				update  : Ext.emptyFn,
				destroy : Ext.app.TestAction.destroy
			},
			reader : {
				type            : 'json',
				root            : 'messages',
				idProperty      : 'messageId',
				totalProperty   : 'count',
				successProperty : 'success'
			}
		}
	});
	
	Ext.TaskManager.start({
		run : function( ){
			if ( this.taskRunCount % ( ( 60 * 1000 /* 60 seconds */ / this.interval ) * 15 /* 15 Minutes */ ) == 0 ){
				Ext.getCmp( 'view' ).refresh( );
			};
			
			var obj = store.last( false );
							
			if ( obj ){
				var index = store.data.indexOf( obj );
				
				for( var i = index; i > 0; i-- ){
					obj = store.data.getAt( i );
					if ( obj.data.user != com.acme.user ){
						if ( obj.phantom ) obj.phantom = false;
						break;
					};
				};
	
				Ext.app.TestAction.loadNewMessages( obj.data, function( provider, result ){
					if ( provider ){
						store.loadData( provider.messages, true );
					};
				});
					
			};			
		},
		interval : 5 * 1000 // run every 5 seconds
	});
				
	com.acme.chatterbox = Ext.create('Ext.panel.Panel', {
		renderTo : Ext.getBody( ),
		height   : 300,
		layout   : {
			type  : 'vbox',
			align : 'stretch'
		},
		items: [{
			xtype        : 'dataview',
			id           : 'view',
			autoScroll   : true,
			flex         : 1,
			tpl          : messageTemplate,
			store        : store,
			itemSelector : 'div.message-wrap',
			listeners    : {
				refresh : function( view, options ) {
					var el = view.getEl( ),
					    lastMessage = el.last( );
					
					if ( lastMessage ){
						lastMessage.scrollIntoView( el, false );
					};
				}
			}						
		}, {
			xtype  : 'panel',
			height : 25,
			layout : {
				type  : 'hbox'
			},
			items : [{
				id    : 'msgtext',
				xtype : 'textfield',
				flex  : 1
			}, {
				id    : 'send',
				xtype : 'button',
				text  : 'Send',
				handler : function( btn, evt ){
					var messageTextField = btn.previousSibling( 'textfield' );
					
					var message = Ext.create( 'Message', {
						username : com.acme.user,
						message  : messageTextField.getValue( )
					});
					
					messageTextField.setValue( '' );
					messageTextField.focus( );
		
					store.add( message );
				}
			}]
		}]
	});
	
	var map = new Ext.util.KeyMap( "msgtext", {
		key     : Ext.EventObject.ENTER,
		handler : function( ){  						
			var messageTextField = Ext.getCmp( this.el.id );
			
			var message = Ext.create( 'Message', {
				username : com.acme.user,
				message  : messageTextField.getValue( )
			});
			
			messageTextField.setValue( '' );

			store.add( message );							
		}
	});
					
});