/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: Implémentation of the worker which process query to the reasoner. This worker is only used for this purpose, it has two main functions, start the reasoner, and query it.
*	Version: 1.2				   
*   Tags:  WEB WORKERS, DEDICATED WORKER
**/

/**
* Main task
*/
function startReasoner(jsonString) {
	send(new Date().toTimeString() + " -> start");

/**
* OWL ontology parsing **from JSON** using OWLReasoner
*/
	var json;
	try {
	json = eval(jsonString);
	} catch (ex) {
	json = eval("(" + jsonString + ")");
	}

	send(new Date().toTimeString() + " -> JSON string parsed: " + typeof(json));
	var ontology = jsw.owl.json.parse({"childNodes":[]});
	send(new Date().toTimeString() + " -> OWL ontology parsed: " + ontology.axioms.length + " axioms");

/**
* Creating a reasoner object for the given ontology
*/
	reasoner = new jsw.owl.BrandT(ontology);
	
	//send(new Date().toTimeString() + " -> Reasoner initialized: " + reasoner.aBox.database.ClassAssertion.length + " class assertions, " + reasoner.aBox.database.ObjectPropertyAssertion.length + " object property assertions, ");
	
	reasoner.aBox.database = json.database;
	reasoner.classHierarchy = json.classHierarchy;
	reasoner.classSubsumers = json.classSubsumers;
	//	reasoner.objectPropertyHierarchy = json.objectPropertyHierarchy;
	//	reasoner.objectPropertySubsumers = json.objectPropertySubsumers;
	reasoner.originalOntology = json.originalOntology;
	//	reasoner.timeInfo = json.timeInfo;

	send(new Date().toTimeString() + " -> Reasoner filled: " + reasoner.aBox.database.ClassAssertion.length + " class assertions, " + reasoner.aBox.database.ObjectPropertyAssertion.length + " object property assertions, ");
}

function queryReasoner(parameters) {
/**
* Creating SPARQL query
*/
	var query = jsw.sparql.parse(parameters.queryString);
	send(new Date().toTimeString() + " -> query: " + parameters.queryString + " -> " + query.triples.length + " triple(s), " + query.variables.length + " variable(s)");

/**
* Querying the reasoner
*/
	var results = reasoner.answerQuery(query);
	if(parameters.filter == true){
		results = filterParentClassTab(results); 
	}
	
	send({results : results, param: parameters.param,callback :parameters.callback});
}
function filterParentClassTab(classTab) {
	var JSONfile = {};
	for(var i=0; i < classTab.length; i++){
		send(classTab[i].object);
		//var query = jsw.sparql.parse('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select ?o { <'+classTab[i].object+'>  <rdf:type> ?o }');
		var query = jsw.sparql.parse('PREFIX owl: <http://www.w3.org/2002/07/owl#> select ?o { <'+classTab[i].object+'> <owl:SubClassOf>  ?o }');
		var resultsTab = reasoner.answerQuery(query);
		send("super class");
		send(resultsTab);
		send(classTab);
		
		if(resultsTab.length == classTab.length-1 || resultsTab.length == classTab.length){
			if(classTab[i].object != "http://www.w3.org/2002/07/owlThing" && classTab[i].object != "http://www.w3.org/2002/07/owl#Thing" && classTab[i].object!="http://proton.semanticweb.org/2005/04/protontObject"  && classTab[i].object != "http://proton.semanticweb.org/2005/04/protont#Object"){
				var keywordRes = classTab[i].object;			
				
				var JSONToken = {};
				JSONToken.Class = keywordRes;
				JSONfile[i] = JSONToken;
			}
			
		}
	}
	
	return JSONfile;
}

