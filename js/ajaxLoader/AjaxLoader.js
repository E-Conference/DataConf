/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: Object in charge of executing commands
*   Version: 1.2
*   Tags:  JSON, SPARQL, AJAX
**/
var AjaxLoader = { 

	/************************************************      COMMANDS EXECUTION            **************************************/
	/** Ajax query launcher function 
	* It organise all AJAX call according to a command and a datasource specifications
	* paramaters : Contains the command to be launched, and the datasource to use
	* data       : Contains the query built previously by the getQuery command's function
	**/
	executeCommand: function (parameters) {

		var conference = parameters.conference;
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
			success: function(data){data = command.ModelCallBack(data, conference.baseUri,datasource.uri,currentUri,name);
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


}