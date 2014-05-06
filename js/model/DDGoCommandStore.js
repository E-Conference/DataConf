/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object contains a json definition of all the commands that will prepare all the queries we want to send on the DuckDuckGo endpoint.
*				 Each one of those commands declare the datatype, the method, the query string it is supposed to use on the endpoint and provide the Callback function used to parse the results.		
*				 To declare a request, each commands can use the parameters declared for the route they are called in (see Configuration.js). This parameter can be a name or an uri and represents
*				 the entity which we want informations on. After calling a command, the results are parsed with it own callback function. It is the role of the router to call those commands according to the configuration file.
*   Version: 1.2
*   Tags:  JSON, SPARQL, AJAX
**/
define(['jquery', 'underscore', 'encoder','view/ViewAdapter', 'view/ViewAdapterText', 'localStorage/localStorageManager', 'labels'], function($, _, Encoder, ViewAdapter, ViewAdapterText, StorageManager, labels){
	var DDGoCommandStore = {
	 
		getResultOrganization : {
			dataType : "JSONP",
			method : "GET",
			serviceUri : "",
			getQuery : function(parameters){ 
				var authorName = parameters.name.split("_").join(" ");
				var  ajaxData = { q : authorName, format : "json",pretty : 1, no_redirect : 1  , output : "json"};
				return ajaxData ; 
			},
			ModelCallBack : function (dataJSON,conferenceUri,datasourceUri, currentUri){

				var JSONfile = {};
				var JSONToken = {};
				JSONToken.Heading        = dataJSON.Heading;
				JSONToken.Image          = dataJSON.Image;
				JSONToken.AbstractText   = dataJSON.AbstractText;
				
				if( dataJSON.Results.length > 0 ){
					JSONToken.FirstURL   = dataJSON.Results[0].FirstURL;
				}
				JSONfile[0] = JSONToken;
			
			//	StorageManager.pushCommandToStorage(currentUri,"getResultOrganization",JSONfile);
				return JSONfile;									
			},
			
			ViewCallBack : function(parameters){

				if(parameters.JSONdata != null){
					var organizationInfo = parameters.JSONdata;
					if(_.size(organizationInfo) > 0 ){
						if(parameters.mode == "text"){
									  
							var Heading  = organizationInfo[0].Heading;				
							var Image  = organizationInfo[0].Image;	
							var AbstractText  = organizationInfo[0].AbstractText;	
							var FirstURL  = organizationInfo[0].FirstURL;	
							
						
							if(Heading != ""){  
								parameters.contentEl.append('<img src="'+Image+'">');
							} 
							if(Image != ""){ 
								parameters.contentEl.append('<p>'+Heading+'</p>'); 
							}
							if(AbstractText != ""){ 
	 							parameters.contentEl.append('<h2>'+labels[parameters.conference.lang].organization.abstract+'</h2>');
								parameters.contentEl.append('<p>'+AbstractText+'</p>'); 
							}
							if(FirstURL !== undefined){ 
	 							parameters.contentEl.append('<h2>'+labels[parameters.conference.lang].organization.homepage+'</h2>');
								parameters.contentEl.append('<a href="'+FirstURL+'">'+FirstURL+'</a>'); 
							}
						}else{
						 
						 var AbstractText  = organizationInfo[0].AbstractText;	
							var FirstURL  = organizationInfo[0].FirstURL;	
							
						 	if(AbstractText != ""){ 
								ViewAdapterGraph.addLeaf("Abstract :"+AbstractText);
							}
							if(FirstURL !== undefined){ 
								ViewAdapterGraph.addLeaf("Homepage :"+FirstURL);
							}
						
						}
					}
				}
			
			}
		}
  };
	return DDGoCommandStore;
});


   
