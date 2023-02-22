if (!this.Mah){
	Mah = function () {};
}

Mah.AuditReportFunctions = function () {
	var openReport = function () {
		var fileName = "MAH_AuditHistory.rdl";
		var fileId = "A0390B8C-374D-E411-80C6-00155D006C06";
		var action = "run"; //filter
		var RecordId = Xrm.Page.data.entity.getId();
		var RecordEntityName = Xrm.Page.data.entity.getEntityName();
		var RecordDisplayName = "";
		if(RecordEntityName == "contact"){
			RecordDisplayName = Xrm.Page.getAttribute("fullname").getValue();
		}
		if(RecordEntityName == "account"){
			RecordDisplayName = Xrm.Page.getAttribute("name").getValue();
		}
		if(RecordEntityName == "wrmb_portfolio"){
			RecordDisplayName = Xrm.Page.getAttribute("wrmb_id").getValue();
		}
		if(RecordEntityName == "wrmb_identificationdocument"){
			RecordDisplayName = Xrm.Page.getAttribute("wrmb_documentnumber").getValue();
		}
		
		var orgUrl = GetGlobalContext().getClientUrl();
		var reportUrl = orgUrl + 
		"/crmreports/viewer/viewer.aspx?action=" +
		encodeURIComponent(action) +
		"&helpID=" +
		encodeURIComponent(fileName) +
		"&id=%7b" +
		encodeURIComponent(fileId) +
		"%7d" +
		"&p:RecordId=" +
		encodeURIComponent(RecordId) +
		"&p:RecordEntityName=" +
		encodeURIComponent(RecordEntityName) +
		"&p:RecordDisplayName=" +
		encodeURIComponent(RecordDisplayName);
		
		window.open(reportUrl, "reportwindow", "resizable=1,width=950,height=700");
		//alert(RecordId + "\n" + RecordEntityName + "\n" + RecordDisplayName + "\n" + reportUrl);
		//http://wrm:5555/MAH/crmreports/viewer/viewer.aspx?action=filter&helpID=MAH_AuditHistory.rdl&id=%7b16D4934C-274D-E411-80C6-00155D006C06%7d
		
	};
	
	var isLegacyButtonVisible = function () {
		if(Xrm.Page.getAttribute("ambcust_importid") != null && Xrm.Page.getAttribute("ambcust_importid").getValue() != null && Xrm.Page.getAttribute("ambcust_importid").getValue() != ""){
			return true;
		}else{
			return false;
		}
	};
	
    return {
        OpenReport: openReport,
        IsLegacyButtonVisible: isLegacyButtonVisible
    };
} ();