/**   
* Copyright <c> Claude Bernard - University Lyon 1 -  2013
*  License : This file is part of the DataConf application, which is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. See details at : http://liris.cnrs.fr/lionel.medini/wiki/doku.php?id=dataconf&#licensing 
*   Author: Lionel MEDINI(supervisor), Florian BACLE, Fiona LEPEUTREC, Benoît DURANT-DE-LA-PASTELLIERE, NGUYEN Hoang Duy Tan
*   Description: This object is a sort of view conrollers, it is in charge of changing the page and the switch between the two available view (graph or text)
*                It is directly connected to the ViewAdapter.Graph and ViewAdapter.Text on which it will trigger event in right order.
*   Version: 1.2
*   Tags:  arborjs   
**/
var ViewAdapter = {

	initialize : function(mode){
		ViewAdapter.mode = mode;
		ViewAdapter.Graph.initSystem();
	},
	update : function(routeItem,title,conference,datasources,uri,name){
		ViewAdapter.currentPage = ViewAdapter.changePage(new AbstractView({templateName :  routeItem.view ,title : title, model : conference }));
		ViewAdapter.template = routeItem.view;
		ViewAdapter.graphView = routeItem.graphView;
		ViewAdapter.title = title;
		ViewAdapter.conference = conference;
		ViewAdapter.datasources = datasources;
		ViewAdapter.commands = routeItem.commands;
		ViewAdapter.uri = uri;
		ViewAdapter.name = name;
		ViewAdapter.initPage(ViewAdapter.graphView);
		return ViewAdapter.currentPage ;
	},

	/** Chaning page handling, call the rendering of the page and execute transition **/
	changePage : function (page, transitionEffect) {
		
		$(page.el).attr('data-role', 'page');
		page.render();
		$('body').append($(page.el));
		var transition = $.mobile.defaultPageTransition;
		if(transitionEffect !== undefined){
			transition = transitionEffect;
		}
		$.mobile.changePage($(page.el), {changeHash:false, transition: transition});
		
		$(page.el).bind('pagehide', function(event, data) {
			$(event.currentTarget).remove();
		});
		
		return $(page.el);
	},
	
	initPage : function (showButton){
		
		if(ViewAdapter.mode == "text" || showButton == "no"){
			if(showButton == "yes"){
				ViewAdapter.addswitchButton();
			}
			ViewAdapter.mode = "text";
			$.each(ViewAdapter.commands,function(i,commandItem){
				ViewAdapter.Text.generateContainer(ViewAdapter.currentPage,commandItem.name);	
			});
		}else{
			ViewAdapter.currentPage.find(".content").empty();
			ViewAdapter.addswitchButton();
			ViewAdapter.Graph.initContainer(ViewAdapter.currentPage.find(".content"),ViewAdapter.uri,ViewAdapter.name);
		}
	},
	addswitchButton : function (){
		var btnLabel = "";
		if(ViewAdapter.mode == "text"){
			btnlabel = "Graph View";
		}else{
			btnlabel = "Text View";
		}

		switchViewBtn = ViewAdapter.Text.appendButton(ViewAdapter.currentPage.find(".content"),'javascript:void(0)',btnlabel,{tiny:true,theme:"a",prepend:true, align : "right",margin: "20px"}) ;
		switchViewBtn.css("margin"," 0px");   
		switchViewBtn.css("z-index","20"); 
		switchViewBtn.trigger("create");

		switchViewBtn.click(function(){  
			ViewAdapter.changeMode();
		});
	},
	changeMode : function(){
	
		if(ViewAdapter.mode == "text"){
			ViewAdapter.mode = "graph";
		}else{
			ViewAdapter.mode = "text";
		}
		ViewAdapter.currentPage = ViewAdapter.changePage(new AbstractView({templateName :  ViewAdapter.template ,title : ViewAdapter.title, model : ViewAdapter.conference }), "flip");
		ViewAdapter.initPage(ViewAdapter.graphView);
		
		var JSONdata = StorageManager.pullCommandFromStorage(ViewAdapter.uri);
		$.each(ViewAdapter.commands,function(i,commandItem){
		
			var currentDatasource = ViewAdapter.datasources[commandItem.datasource];
			var currentCommand    = currentDatasource.commands[commandItem.name];
			if(JSONdata != null){
				if(JSONdata.hasOwnProperty(commandItem.name)){
					currentCommand.ViewCallBack({JSONdata : JSONdata[commandItem.name],contentEl : ViewAdapter.currentPage.find("#"+commandItem.name), name : ViewAdapter.name, currentUri : ViewAdapter.uri});
				}
			}
		});
		ViewAdapter.generateJQMobileElement();
	},
	
	generateJQMobileElement : function(){
		ViewAdapter.currentPage.trigger("create");
	}
	
};

