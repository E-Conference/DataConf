/**   
*	Copyright <c> Claude Bernard - University Lyon 1 -  2013
* 	License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: Here is the interface we use to launch function of the reasoner. 
*   Version: 1.2
*   Tags:  mobile-reasoning
**/

var Reasoner = {

	ontologie : null,
	reasoner  : null,
	
    initialize : function(ontoUrl){		 
		Reasoner.ontology = jsw.owl.xml.parseUrl(ontoUrl);
		Reasoner.reasoner = new jsw.owl.BrandT(Reasoner.ontology);
		
    },

	filterResult : function (keywordLabel, resultLabel){
		if(resultLabel == "http://www.w3.org/2002/07/owl#Thing" || resultLabel == keywordLabel.split("_").join(" ") || resultLabel=="#Keyword" ){
			return false;
		}
		return true;
	},
	labelToUri:function(keywordLabel){
		return keywordLabel.toLowerCase().split(" ").join("_");
	},
	
	UriToLabel:function(keywordUri){
		return keywordUri.replace("#KeywordClass_","").split("_").join(" ");
	}
	
	
    
}