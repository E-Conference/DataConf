  /**   
 *   Copyright <c> Claude Bernard - University Lyon 1 -  2013
 *   Author: Lionnel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Beno�t DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan, Nicolas ARMANDO
 *   Description: Command store for the reasoner. 
 *   Version: 1.2
 *   Tags:  REASONING, ONTOLOGY
 **/
 var ReasonerCommandStore = {
  
  
	getLessSpecificKeywords: {
	
		ModelCallBack : function(parameters){ 
			var el = parameters.contentEl;
			var keyword = Reasoner.labelToUri(parameters.currentUri);
			/*var queryText = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select ?o { <'+keyword+'>  <rdf:type> ?o }';
			parameters.filter = true;
			Reasoner.sendRequest(queryText,true,parameters, function (results,parameters){
				
				console.log("classe : ");
				console.log(results[1].Class);
				var classe = results[1].Class;*/
				
				
				//if(classe != null){
					queryText = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select ?o { <'+keyword+'>  <rdf:type> ?o }';
					//parameters.currentUri =Reasoner.UriToLabel(parameters.currentUri);
					Reasoner.sendRequest(queryText,false,parameters, function (results,parameters){
						var JSONfile = {};
						console.log("UPPER LEVEL");
						console.log(results);
						for(var i=0; i < results.length; i++){
							console.log(results[i].o);
							var keywordRes = Reasoner.UriToLabel(results[i].o);
							
							if(Reasoner.filterResult(parameters.currentUri,keywordRes)){
								
								var JSONToken = {};
								JSONToken.label = keywordRes;
								JSONfile[i] = JSONToken;
							}
						}
						
						StorageManager.pushCommandToStorage(parameters.currentUri,"getLessSpecificKeywords",JSONfile);
						parameters.JSONdata = JSONfile;
						ReasonerCommandStore.getLessSpecificKeywords.ViewCallBack(parameters);	
						return JSONfile;
					});
				//}
			//});
		
			
		},
		
		ViewCallBack : function (parameters){
			if(parameters.JSONdata != null ){
				if(_.size(parameters.JSONdata) > 0 ){
					contentEl = ViewAdapter.currentPage.find("#getLessSpecificKeywords");
					if(ViewAdapter.mode == "text"){
						contentEl.append($('<h2>Upper Level Keywords</h2>'));
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Text.appendButton(contentEl,'#keyword/'+Encoder.encode(keyword.label),keyword.label,{tiny:true});
						});
						contentEl.trigger("create");
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
	
			var queryText = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> select ?o { ?o <rdf:type> <'+keyword+'> }';

			Reasoner.sendRequest(queryText,false,parameters, function (results,parameters){
				var JSONfile = {};
				console.log("LOWER LEVEL");
				console.log(results);
				for(var i=0; i<results.length; i++){
					console.log(results[i].o);
					var keywordRes = Reasoner.UriToLabel(results[i].o);
					if(Reasoner.filterResult(parameters.currentUri,keywordRes)){
						var JSONToken = {};
						JSONToken.label = keywordRes;
						JSONfile[i] = JSONToken;
					}
				}
				StorageManager.pushCommandToStorage(parameters.currentUri,"getMoreSpecificKeywords",JSONfile);
				parameters.JSONdata = JSONfile;
				ReasonerCommandStore.getMoreSpecificKeywords.ViewCallBack(parameters);	
				return JSONfile;
			});
	
		},
		
		ViewCallBack : function (parameters){
		
			if(parameters.JSONdata != null ){
				if(_.size(parameters.JSONdata) > 0 ){
					contentEl = ViewAdapter.currentPage.find("#getMoreSpecificKeywords");
					if(ViewAdapter.mode == "text"){
						contentEl.append($('<h2>Lower Level Keywords</h2>'));
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Text.appendButton(contentEl,'#keyword/'+Encoder.encode(keyword.label),keyword.label,{tiny:true});
						});
						contentEl.trigger("create");
					}else{
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Graph.addNode("Lower level keyword : "+keyword.label,'#keyword/'+Encoder.encode(keyword.label),{color:"#FF9999"});
						});
					}
				}
			}
		}
	},
	
	getClassToInstance: {
		ModelCallBack : function(parameters){   
			
			var keyword = Reasoner.labelToUri(parameters.currentUri);
		
			//var queryText = 'PREFIX owl: <http://www.w3.org/2002/07/owl#> select ?o { ?o <owl:SubClassOf>  <'+keyword+'> }';
			var queryText = 'PREFIX owl: <http://www.w3.org/2002/07/owl#> select ?o { ?o  <owl:sameAs> <'+keyword+'> }';
			parameters.filter = true;
			Reasoner.sendRequest(queryText,parameters, function (results,parameters){
				var JSONfile = {};
				console.log("EQUIVALENT");
				console.log(results);
				for(var i=0; i<results.length; i++){
					console.log(results[i].subject);
					var keywordRes = Reasoner.UriToLabel(results[i].subject);
					if(Reasoner.filterResult(parameters.currentUri,keywordRes)){
						var JSONToken = {};
						JSONToken.label = keywordRes;
						JSONfile[i] = JSONToken;
					}
				}
				return JSONfile;
			});
		},
		
		ViewCallBack : function (parameters){
		
			if(parameters.JSONdata != null ){
				if(_.size(parameters.JSONdata) > 0 ){
					contentEl = ViewAdapter.currentPage.find("#getClassToInstance");
					if(ViewAdapter.mode == "text"){
						contentEl.append($('<h2>Lower Level Keywords</h2>'));
						$.each(parameters.JSONdata, function(i,keyword){
							ViewAdapter.Text.appendButton(contentEl,'#keyword/'+Encoder.encode(keyword.label),keyword.label,{tiny:true});
						});
						contentEl.trigger("create");
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