/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the Google endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informat.lirs.cnrs.fr
ions on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 1.2
*   Tags:  JSON, AJAX
**/
define(['jquery', 'underscore', 'encoder', 'view/ViewAdapter', 'view/ViewAdapterText', 'localStorage/localStorageManager', 'labels'], function($, _, Encoder, ViewAdapter, ViewAdapterText, StorageManager, labels){
	 var GoogleCommandStore = {

		/** Command used to get and display the most probable homepage of a given author**/
		getAuthorPersonalPage : {
			dataType : "JSONP",
			method : "GET",
			serviceUri : "",
			getQuery : function(parameters){ 
				var searchValue = parameters.name;
				var  ajaxData = { q : searchValue, v : "1.0" };
				return ajaxData ; 
			},
			ModelCallBack : function (dataJSON,conferenceUri,datasourceUri, currentUri){									
				var JSONfile   = {};
				var JSONToken  = {};
				JSONToken.authorHomepage  = dataJSON.responseData.results[0].url;
				JSONfile[0] = JSONToken;
				//StorageManager.pushCommandToStorage(currentUri,"getAuthorPersonalPage",JSONfile);		
				return JSONfile;
			},
			
			ViewCallBack : function(parameters){
				if(parameters.JSONdata != null){
					var authorHomepage = parameters.JSONdata;
					if(_.size(authorHomepage) > 0 ){		  
						if(parameters.mode == "text"){
							var homepageUrl  = authorHomepage[0].authorHomepage;
							parameters.contentEl.append('<h2>'+labels[parameters.conference.lang].person.website+'</h2>');	
							parameters.contentEl.append('<a href="'+homepageUrl+'" >'+homepageUrl+'</a>');	
						}
					}
				}
			}
		}
	};
	return GoogleCommandStore;
});
   
