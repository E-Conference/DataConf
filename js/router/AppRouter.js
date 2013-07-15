 /**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This file contains the implementation of the application's router. It has three main role :
*				INITIALIZATION:
*					-> The router is initialized to use the route declared in the configuration file (see configuration.js).
*					-> For each route, the action is prepared and setted to retrieve all commands that have been declared for the route and send an AJAX request.
*				RUNTIME:
*					-> Using the powerfull routing system of backbone, the router catch url changes. If a change occurs, the router execute the action prepared at initialization time
*					and process the view changes plus the AJAX call.
*	Version: 1.2				   
*   Tags:  BACKBONE, AJAX, ROUTING
**/
AppRouter = Backbone.Router.extend({

		/** Initialization function, launched at the start of the application.
		*	It reads the configuration file and prepare all the routes and their action it will use on runtime
		*/
		initialize: function (options){
			var self = this;
			//Catching configuration file in parameters
			this.configuration = options.configuration;
			
			//Saving the conference definition
			this.conference = this.configuration.conference;
			//Saving the datasources definition
			this.datasources = this.configuration.datasources;
			//Saving the routes definition
			this.routes = this.configuration.routes; 

			$.each(this.datasources,function(i,datasourceItem){
				console.log("******* DATASOURCE ********");
				console.log(datasourceItem);
			});
	
		
			//Initialize storage manager
			StorageManager.initialize(this.conference.name);
			//Initialize ViewAdapter to text mode
			ViewAdapter.initialize("text");
			//Initialize Reasonner with the keywords ontology
			Reasoner.initialize('http://dataconf.liris.cnrs.fr/iswc2012/ontology/ontoKeyword_min.owl');
			
		
			//Preparing all the routes and their actions
		    $.each(this.routes,function(i,routeItem){
				
				console.log("******* ROUTE ********");
				console.log(routeItem);
				
				
				//Preparing the function to use when catching the current route
				self.route(routeItem.hash, function(name, uri) {
						
		
					var title = "";
					if(name !== undefined){
						name = Encoder.decode(name);
						title = name;
					}
					if(uri == undefined){
						title = routeItem.title;	
						uri = name;
					}else{
						uri = Encoder.decode(uri);
					}
					
					if(name == undefined && uri == undefined){
						uri = self.conference.baseUri;
					}
					 
					//Appending button and keeping track of new route in case the mode changes
					var currentPage = ViewAdapter.update(routeItem ,title, self.conference, self.datasources,uri,name); 
					
					//We try if informations are in the local storage before call getQuery and executeCommand
					var JSONdata = StorageManager.pullCommandFromStorage(uri);
				  
					//Prepare AJAX call according to the commands declared
					$.each(routeItem.commands,function(i,commandItem){
					
						var currentDatasource = self.datasources[commandItem.datasource];
						var currentCommand    = currentDatasource.commands[commandItem.name];
						
						if(currentDatasource.uri == "local"){
							$("#textHeader > h1").html(uri);
							var data = currentCommand.ModelCallBack({currentUri : uri});
							currentCommand.ViewCallBack({JSONdata : data, contentEl : currentPage.find("#"+commandItem.name),currentUri : uri});
						}else{
							var doRequest = true;
							if(JSONdata != null){
								if(JSONdata.hasOwnProperty(commandItem.name)){
									doRequest = false;
									console.log("CAll : "+commandItem.name+" ON Storage");
									//Informations already exists so we directly call the command callBack view to render them 
									currentCommand.ViewCallBack({JSONdata : JSONdata[commandItem.name], contentEl : currentPage.find("#"+commandItem.name), name : name});
									
								}
							}
							if(doRequest){
								console.log("CAll : "+commandItem.name+" ON "+commandItem.datasource);
								//Retrieveing the query built by the command function "getQuery"
								var ajaxData   = currentCommand.getQuery({conferenceUri : self.conference.baseUri, uri : uri, name : name});
								//Preparing Ajax call 
								self.executeCommand({datasource : currentDatasource, command : currentCommand,data : ajaxData, currentUri : uri, contentEl :  currentPage.find("#"+commandItem.name), name : name});
							}
						
						}
					});
					
					ViewAdapter.generateJQMobileElement();
					
					console.log("most viewed keyword");
					console.log(StorageAnalyser.getMostViewKeyword());
					
				});
			});
	
		},

		/************************************************      COMMANDS EXECUTION            **************************************/
		/** Ajax query launcher function 
		* It organise all AJAX call according to a command and a datasource specifications
		* paramaters : Contains the command to be launched, and the datasource to use
		* data       : Contains the query built previously by the getQuery command's function
		**/
		executeCommand: function (parameters) {

			var self = this;
			//Catching the datasource
			var datasource = parameters.datasource;
			
			//Catching the command
			var command    = parameters.command;
			
			var contentEl = parameters.contentEl;
			//Catching the data
			var data    = parameters.data;
			//Catching the current uri searched
			var currentUri    = parameters.currentUri;
			var name = parameters.name;
			//Preparing the cross domain technic according to datasource definition
			if(datasource.crossDomainMode == "CORS"){
				jQuery.support.cors = true;
			}else{
				jQuery.support.cors = false;	
			} 
			$.mobile.loading( 'show' );
			//Sending AJAX request on the datasource
			$.ajax({
				url: datasource.uri,
				type: command.method,
				cache: false,
				dataType: command.dataType,
				data: data,	
				success: function(data){data = command.ModelCallBack(data,self.conference.baseUri,datasource.uri,currentUri,name);
										$.mobile.loading( 'hide' );
										command.ViewCallBack({JSONdata : data, contentEl : contentEl,name : name});
										ViewAdapter.generateJQMobileElement();
										
										},
				error: function(jqXHR, textStatus, errorThrown) { 
					console.log(errorThrown);
					$.mobile.loading( 'hide' );
				}
			});
		}

});
