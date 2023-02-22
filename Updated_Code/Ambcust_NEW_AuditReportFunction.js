if (!this.Mah){
    "strict mode"
	Mah = function () {};
}

Mah.AuditReportFunctions = function () {
    "strict mode"
	var openReport = function (executionContext) {
        var formContext = executionContext.getFormContext();

		var fileName = "MAH_AuditHistory.rdl";
		var fileId = "A0390B8C-374D-E411-80C6-00155D006C06";
		var action = "run"; //filter
		var RecordId = formContext.data.entity.getId();
		var RecordEntityName = formContext.data.entity.getEntityName();
		var RecordDisplayName = "";
		if(RecordEntityName === "contact"){
			RecordDisplayName = formContext.getAttribute("fullname").getValue();
		}
		if(RecordEntityName === "account"){
			RecordDisplayName = formContext.getAttribute("name").getValue();
		}
		if(RecordEntityName === "wrmb_portfolio"){
			RecordDisplayName = formContext.getAttribute("wrmb_id").getValue();
		}
		if(RecordEntityName === "wrmb_identificationdocument"){
			RecordDisplayName = formContext.getAttribute("wrmb_documentnumber").getValue();
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
		if(formContext.getAttribute("ambcust_importid") !== null && formContext.getAttribute("ambcust_importid").getValue() !== null && formContext.getAttribute("ambcust_importid").getValue() !== ""){
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