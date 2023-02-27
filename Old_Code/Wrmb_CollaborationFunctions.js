if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Collaboration = function () {
	var startCifAssistant = function () {
		var entityId = Xrm.Page.data.entity.getId();
		var entityName = Xrm.Page.data.entity.getEntityName();
		var dialogId ="4BAAE15A-81A5-4D84-AC19-4E512A1F6B39";
		
		var url = Xrm.Page.context.getClientUrl() +
		"/cs/dialog/rundialog.aspx?DialogId=" +
		dialogId + "&EntityName=" +
		entityName + "&ObjectId=" +
		entityId;
		var new_window = window.open(url);
		
		var timer = setInterval(function() {   
		    if(new_window.closed) {  
		        clearInterval(timer);		        
    			var wrControlComp = Xrm.Page.ui.controls.get("WebResource_collab_comprel");
    			wrControlComp.setSrc(wrControlComp.getSrc())
    			var wrControlCont = Xrm.Page.ui.controls.get("WebResource_collab_contrel");
    			wrControlCont.setSrc(wrControlCont.getSrc())
    			var wrControlPort = Xrm.Page.ui.controls.get("WebResource_collab_portrel");
    			wrControlPort.setSrc(wrControlPort.getSrc())
		    }
		}, 1000);
	};
    
    return {
        StartCifAssistant: startCifAssistant
    };
} ();