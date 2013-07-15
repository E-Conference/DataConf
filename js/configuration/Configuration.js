 /**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This JSON object contains all the configurations of the application. It is a crutial part of the system, it desribes :
*				-> The conference informations, the uri, the logo uri and the name.
*				-> All the datasources defined by their uris, the cross domain  mode they use, and the commandStore (see /model) related to them.
*				   This command store contains the definition of all the command (a specific parameters+query+callback implementation) that can be send on it.
*				-> All the routes that the app will use. Each route is configured to display a specific view, if a template exist for this view name (see /templates)
				   it is rendered, otherwise a generic view is used. The commands we want to send are specified in a "command" array to explicit which command has to be send when the route is catched
				   
*   Tags:  JSON, ENDPOINT, SPARQL
**/
 var Configuration = {
			//Defnition of the conference
			"conference" : {
				"name": "WWW'2012",
				"logoUri": "http://data.semanticweb.org/images/logo_www2012.jpg",
				"website": "http://www2012.wwwconference.org/",
				"baseUri": "http://data.semanticweb.org/conference/www/2012",
			},
			
			//Defnition of the datasources 
			// uri : It correspond to the uri to be used to access the service
			// crossDomainMode : "CORS" or "JSONP" explicits the cross domain technique to be used on the service 
			// commands : Name of the json var that implements all the commands that can be used on the service
			"datasources" : {
				"SemanticWebConferenceDatasource" : {
					"uri" : "http://posters.www2012.org:8080/sparql/",
					"crossDomainMode" : "CORS",
					"commands" : SWDFCommandStore, 
				},
				
				"DblpDatasource" : {
					"uri" : "http://dblp.rkbexplorer.com/sparql/",
					"crossDomainMode" : "CORS",
					"commands" : DBLPCommandStore,
				},

				"DuckDuckGoDatasource" : {   
					"uri" : "http://api.duckduckgo.com/",
					"crossDomainMode" : "JSONP",
					"commands" : DDGoCommandStore,
				},
				
				"GoogleDataSource" : {   
					"uri" : "https://ajax.googleapis.com/ajax/services/search/web",
					"crossDomainMode" : "JSONP",
					"commands" : GoogleCommandStore,
				},
				"eventDatasource" : {
					"uri" : "http://calendar.labs.idci.fr/api/schedule_event.jsonp?",
					"crossDomainMode" : "JSONP",
					"commands" : "conferenceDatasourceCommands",
				},
				"DataPaperDatasource" : {
					"uri" : "http://dataconf.liris.cnrs.fr:5984/datapaper/_design/public/_view/by_type",
					"crossDomainMode" : "JSONP",
					"commands" : DPCommandStore, 
				},
				"ReasonerDatasource" : {
					"uri" : "local",
					"commands" : ReasonerCommandStore, 
				}

			}, 
			//Declaration of all the routes to be used by the router
			// hash : url to be catched by the router
			// view : the name of the view to display when catching the route (if a template in /templates matches the name, it is used, otherwise a generic view is used)
			// title : the title to display on the header when showing the view
			// commands : array of datasource/name to precise which command of which datasource to send when catching the route
			"routes" : {
		    "Home" : {
					"hash" : "",
					"view" : "home",
					"graphView" : "no",
					"title": "WWW'2012 - publications",
					"commands" : [ 
						{
						    "datasource" : "SemanticWebConferenceDatasource",
						    "name" : "getConferenceMainTrackEvent",
						},
						{
						    "datasource" : "SemanticWebConferenceDatasource",
						    "name" : "getConferenceKeynoteEvent",
						},
					]
				}, 
		    "Schedule" : {
					"hash" : "schedule/*locationLabel",
					"view" : "schedule",
					"graphView" : "no",
					"title": "Conference schedule",
					"commands" : [
						{
						    "datasource" : "SemanticWebConferenceDatasource",
						    "name" : "getConferenceSchedule",
						},
					]
				}, 
			    "qrScan" : {
					"hash" : "qrcScan",
					"view" : "qrcScan",
					"graphView" : "no",
					"title": "Qr-code scanner",
					"commands" : [ 
					]
				}, 
				"Proceedings-search-by-author-list" : { 
					"hash" : "search/search-by-author-choice/*uri",
					"view" : "authorLetterList",
					"graphView" : "no",
					"title": "Author search",
					"commands" : [
					]
				},
				"Proceedings-search-by-keyword-list" : { 
					"hash" : "search/search-by-keyword-choice/*uri",
					"view" : "keywordLetterList",
					"graphView" : "no",
					"title": "Keyword search",
					"commands" : [
					]
				},
			    "Proceedings-search-by-author" : { 
					"hash" : "search/by-author/:name/*uri",
					"view" : "searchFormAuthor",
					"graphView" : "no",
					"title": "Search by author",
					"commands" : [
					    {
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getAllAuthors",
						} 
					]
				},
			    "Proceedings-search-by-keyword" : { 
					"hash" : "search/by-keyword/:name/*uri",
					"view" : "searchFormKeyword",
					"graphView" : "no",
					"title": "Search by keywords",
					"commands" : [
					    {
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getAllKeyword",
						} 
					]
				},
			    "Proceedings-search-by-title" : { 
					"hash" : "search/by-title/*uri",
					"view" : "searchFormTitle",
					"graphView" : "no",
					"title": "Search by title",
					"commands" : [
					    {
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getAllTitle",
						} 
					]
				},
				"Event" : { 
					"hash" : "event/*uri",
					"view" : "event",
					"graphView" : "yes",
					"title": "Search in event",
					"commands" : [
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getEvent",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getSessionSubEvent",
						
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getTrackSubEvent",
						
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getEventPublications",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getConferenceMainSessionEvent",
						}
					]
				},
				"Publication" : { 
					"hash" : "publication/*uri",
					"view" : "publication",
					"graphView" : "yes",
					"title": "Publication",
					"commands" : [
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getPublicationInfo",
						},
						{
							"datasource" : "DataPaperDatasource",
							"name" : "getDataPaperRessource",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getPublicationAuthor",
						},	
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getPublicationKeywords",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getEventRelatedPublication",
						},
					]
				},
				"Author" : {
					"hash" : "author/:name/*uri",
					"view" : "author",
					"graphView" : "yes",
					"title": "Author",
					"commands" : [
						{
							"datasource" : "DataPaperDatasource",
							"name" : "getDataPaperAuthor",
						},
						{
							"datasource" : "DataPaperDatasource",
							"name" : "getDataPaperRessource",
						},
						{
							"datasource" : "GoogleDataSource",
							"name" : "getAuthorPersonalPage",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getAuthorsProceedings",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getAuthorOrganization",
						},
					    {
							"datasource" : "DblpDatasource",
							"name" : "getAuthorPublications",
						},
					]
				},
				"ExternPublication" : {
					"hash" : "externPublication/*uri",
					"view" : "externPublication",
					"graphView" : "yes",
					"title": "External publication",
					"commands" : [
					    {
							"datasource" : "DblpDatasource",
							"name" : "getExternPublicationInfo",
						},
						{
							"datasource" : "DblpDatasource",
							"name" : "getExternPublicationAuthors",
						}
					]
				},
				"Keyword" : {
					"hash" : "keyword/*uri",
					"view" : "keyword",
					"graphView" : "yes",
					"title": "Keyword",
					"commands" : [
					    {
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getPublicationsByKeyword",
						},
						{
							"datasource" : "ReasonerDatasource",
							"name" : "getMoreSpecificKeywords",
						},
						{
							"datasource" : "ReasonerDatasource",
							"name" : "getLessSpecificKeywords",
						},
					]
				},
				"Organization" : {
					"hash" : "organization/:name/*uri",
					"view" : "organization",
					"graphView" : "yes",
					"title": "Organization",
					"commands" : [
						{
							"datasource" : "DuckDuckGoDatasource",
							"name" : "getResultOrganization",
						},
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getOrganization",
						}
					]
				},
				"Recommendation" : {
					"hash" : "recommendation",
					"view" : "recommendation",
					"graphView" : "no",
					"title": "Recommendation",
					"commands" : [
						{
							"datasource" : "SemanticWebConferenceDatasource",
							"name" : "getRecommendedPublications",
						}
					]
				},
			}
		};
