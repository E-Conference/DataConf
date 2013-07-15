  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan, Nicolas ARMANDO
 *   Description: Command store for the reasoner. 
 *   Version: 1.2
 *   Tags:  REASONING, ONTOLOGY
 **/
 var ReasonerCommandStore = {
  
  
	getLessSpecificKeywords: {
	
		ModelCallBack : function(parameters){ 
			var el = parameters.contentEl;
			var keyword = Reasoner.labelToUri(parameters.currentUri);
			var queryText = 'PREFIX owl: <http://www.w3.org/2002/07/owl#> select ?o { <#KeywordClass_'+keyword+'> <owl:SubClassOf>  ?o }';
			var query = jsw.sparql.parse(queryText);

			var results = Reasoner.reasoner.answerQuery(query);

			var JSONfile = {};
			
			for(var i=0; i<results.length; i++){
				var keywordRes = Reasoner.UriToLabel(results[i].object);
				
				if(Reasoner.filterResult(keyword,keywordRes)){
					
					var JSONToken = {};
					JSONToken.label = keywordRes;
					JSONfile[i] = JSONToken;
				}
			}
				
			StorageManager.pushCommandToStorage(parameters.currentUri,"getMoreSpecificKeywords",JSONfile);
			return JSONfile;
			
		},
		
		ViewCallBack : function (parameters){
			if(parameters.JSONdata != null ){
		
				if(_.size(parameters.JSONdata) > 0 ){
					if(ViewAdapter.mode == "text"){
						parameters.contentEl.append($('<h2>Upper Level Keywords</h2>'));
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Text.appendButton(parameters.contentEl,'#keyword/'+Encoder.encode(keyword.label),keyword.label,{tiny:true});
						});
					}else{
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Graph.addNode("Upper level keyword : "+keyword.label,'#keyword/'+Encoder.encode(keyword.label),{color:"#FF4399"});
						});
					}
				}
			}
		}
	},
	   
	getMoreSpecificKeywords: {
		ModelCallBack : function(parameters){   
			
			var keyword = Reasoner.labelToUri(parameters.currentUri);
		
			var queryText = 'PREFIX owl: <http://www.w3.org/2002/07/owl#> select ?o { ?o  <owl:SubClassOf> <#KeywordClass_'+keyword+'> }';
			var query = jsw.sparql.parse(queryText);
			
			var results = Reasoner.reasoner.answerQuery(query);
			var JSONfile = {};
			for(var i=0; i<results.length; i++){
				var keywordRes = Reasoner.UriToLabel(results[i].subject);
				if(Reasoner.filterResult(keyword,keywordRes)){
					var JSONToken = {};
					JSONToken.label = keywordRes;
					JSONfile[i] = JSONToken;
				}
			}
			
			StorageManager.pushCommandToStorage(parameters.currentUri,"getLessSpecificKeywords",JSONfile);
			return JSONfile;
		},
		
		ViewCallBack : function (parameters){
			if(parameters.JSONdata != null ){
				if(_.size(parameters.JSONdata) > 0 ){
					if(ViewAdapter.mode == "text"){
						parameters.contentEl.append($('<h2>Lower Level Keywords</h2>'));
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Text.appendButton(parameters.contentEl,'#keyword/'+Encoder.encode(keyword.label),keyword.label,{tiny:true});
						});
					}else{
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Graph.addNode("Lower level keyword : "+keyword.label,'#keyword/'+Encoder.encode(keyword.label),{color:"#FF9999"});
						});
					}
				}
			}
		}
	}
	
	
};