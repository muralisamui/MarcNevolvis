if (!this.Wrm){
	Wrm = function () {};
}

Wrm.KycApprovalProcess = function () {
/*
statuscode:
1 = Requested (Compliance)
320560000 = approved
320560001 = rejected
320560002 = Requested (Management)
*/	
    var requestKycApproval = function (eid, etn) {
		var countActive = Wrm.KycApprovalProcess.CountActiveKycApproval(eid, etn);
		var countInProgress = Wrm.KycApprovalProcess.CountInProgressKycApproval(eid, etn);
		if(countInProgress == 0){
			// create a new one
			var kycapproval = {};
			if(countActive > 0){
				kycapproval.wrmr_type = { Value: 320560001 }; //review
			}else{
				kycapproval.wrmr_type = { Value: 320560000 }; //initial
			}
			
			if(Xrm.Page.getAttribute("wrmb_marketer") != null && Xrm.Page.getAttribute("wrmb_marketer").getValue() != null){
				kycapproval.wrmr_advisorid = { Id: Xrm.Page.getAttribute("wrmb_marketer").getValue()[0].id, LogicalName: "systemuser" }
			}else{
				kycapproval.wrmr_advisorid = { Id: Xrm.Page.context.getUserId(), LogicalName: "systemuser" }
			}
			
			if(etn.toLowerCase() == "contact"){
				kycapproval.wrmr_contactid = { Id: eid, LogicalName: etn.toLowerCase() };
			}
			if(etn.toLowerCase() == "account"){
				kycapproval.wrmr_companyid = { Id: eid, LogicalName: etn.toLowerCase() };
			}
			
			var curDate = new Date();
			curDate.setHours(0);
			curDate.setMinutes(0);
			curDate.setSeconds(0);
			curDate.setMilliseconds(0);
			kycapproval.wrmr_advisordate = curDate;
			
			XrmServiceToolkit.Rest.Create(
				kycapproval,
				"wrmr_risksummaryandapprovalSet",
				function (result) {
					newId = result.wrmr_risksummaryandapprovalId;
					Xrm.Utility.alertDialog("KYC Approval successfully requested!");
				},
				function (error) {
					Xrm.Utility.alertDialog("An error occured:\n" + error.message);
				},
				false //synchronous call
			);
			
		}
		if(countInProgress > 0){
			Xrm.Utility.alertDialog("There is already a pending KYC Approval on this record.");
		}
		if(countInProgress < 0){
			Xrm.Utility.alertDialog("An error occured. Please try again or contact your System Administrator.");
		}
    };
	
    var approveKycRequest = function() {
    	if (Xrm.Page.data.getIsValid() == false)
    	{
    		Xrm.Page.ui.setFormNotification("Please enter all required information", "ERROR");
    	}
    	else
    	{
    		if (Xrm.Page.getAttribute("statuscode") != null && Xrm.Page.getAttribute("statuscode").getValue() == 320560002)
    		{
    			Wrm.KycApprovalProcess.SetCurrentUserAndDateManagement();
    			Xrm.Page.data.setFormDirty(false);    			
    		}
    	
	    	Xrm.Page.data.entity.save();
	    	XrmServiceToolkit.Soap.SetState(
				Xrm.Page.data.entity.getEntityName(),
				Xrm.Page.data.entity.getId(),
				0,
				320560000
				);
			Xrm.Utility.alertDialog("KYC Approval successfully approved!");
			Xrm.Utility.openEntityForm(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());
		}
    };
    
    var rejectKycRequest = function() {
    	if (Xrm.Page.data.getIsValid() == false)
    	{
    		Xrm.Page.ui.setFormNotification("Please enter all required information", "ERROR");
    	}
    	else
    	{
    		if (Xrm.Page.getAttribute("statuscode") != null && Xrm.Page.getAttribute("statuscode").getValue() == 320560002)
    		{
    			Wrm.KycApprovalProcess.SetCurrentUserAndDateManagement();
    			Xrm.Page.data.setFormDirty(false);
    		}
    	
	    	Xrm.Page.data.entity.save();
	    	XrmServiceToolkit.Soap.SetState(
				Xrm.Page.data.entity.getEntityName(),
				Xrm.Page.data.entity.getId(),
				0,
				320560001
				);
			Xrm.Utility.alertDialog("KYC Approval rejected!");
			Xrm.Utility.openEntityForm(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());
		}
    };
    
    var requestMgmtApproval = function() {
    	if (Xrm.Page.data.getIsValid() == false)
    	{
    		Xrm.Page.ui.setFormNotification("Please enter all required information", "ERROR");
    	}
    	else
    	{
	    	Xrm.Page.data.entity.save();
	    	XrmServiceToolkit.Soap.SetState(
				Xrm.Page.data.entity.getEntityName(),
				Xrm.Page.data.entity.getId(),
				0,
				320560002
				);
			Xrm.Utility.alertDialog("Management approval requested!");
			Xrm.Utility.openEntityForm(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());
		}			
    };
	
	var getInProgressKycApproval = function(eid, etn) {
		var lookupField = "";
		
		if(etn.toLowerCase() == "contact"){
			lookupField = "wrmr_contactid";
		}
		if(etn.toLowerCase() == "account"){
			lookupField = "wrmr_companyid";
		}
		if(lookupField == ""){
			return null;
		}
		
		var fetchInProgress =
			"<fetch mapping='logical'>" +
			"  <entity name='wrmr_risksummaryandapproval'>" +
			"	<attribute name='wrmr_risksummaryandapprovalid' />" +
			"	<filter type='and'>" +
			"	  <filter type='or'>" +
			"	    <condition attribute='statuscode' operator='eq' value='1' />" +
			"	    <condition attribute='statuscode' operator='eq' value='320560002' />" +
			"	  </filter>" +
			"	  <condition attribute='" + lookupField + "' operator='eq' value='" + eid + "' />" +
			"   </filter>" +
			"  </entity>" +
			"</fetch>";
		var retrievedKycApprovals = XrmServiceToolkit.Soap.Fetch(fetchInProgress);
		return retrievedKycApprovals;
	};
	
	var countInProgressKycApproval = function(eid, etn) {
		var retrievedKycApprovals = Wrm.KycApprovalProcess.GetInProgressKycApproval(eid, etn);
		if(retrievedKycApprovals == null){
			return -1;
		}
		return retrievedKycApprovals.length;
	};
	
	var getActiveKycApproval = function(eid, etn) {
		var lookupField = "";
		
		if(etn.toLowerCase() == "contact"){
			lookupField = "wrmr_contactid";
		}
		if(etn.toLowerCase() == "account"){
			lookupField = "wrmr_companyid";
		}
		if(lookupField == ""){
			return null;
		}
		
		var fetchActive =
			"<fetch mapping='logical'>" +
			"  <entity name='wrmr_risksummaryandapproval'>" +
			"	<attribute name='wrmr_risksummaryandapprovalid' />" +
			"	<order descending='true' attribute='createdon' />" +
			"	<filter type='and'>" +
			"	  <condition attribute='statecode' operator='eq' value='0' />" +
			"	  <condition attribute='" + lookupField + "' operator='eq' value='" + eid + "' />" +
			"   </filter>" +
			"  </entity>" +
			"</fetch>";
		var retrievedKycApprovals = XrmServiceToolkit.Soap.Fetch(fetchActive);
		return retrievedKycApprovals;
	};
	
	var countActiveKycApproval = function(eid, etn) {
		var retrievedKycApprovals = Wrm.KycApprovalProcess.GetActiveKycApproval(eid, etn);
		if(retrievedKycApprovals == null){
			return -1;
		}
		return retrievedKycApprovals.length;
	};
	
	var isComplianceAllowed = function() {
		return XrmServiceToolkit.Soap.IsCurrentUserRole("WRM Compliance Officer");
	};
	
	var isManagementAllowed = function() {
		return XrmServiceToolkit.Soap.IsCurrentUserRole("WRM KYC Approval Manager");
	};
	
	var isRequestButtonAvailable = function() {
		if(Xrm.Page.getAttribute("wrmb_isclient") != null && Xrm.Page.getAttribute("wrmb_isclient").getValue() == true){
			return true;
		}else{
			return false;
		}
	};
	
	var setCurrentUserAndDateManagement = function () {

        if (Xrm.Page.getAttribute("wrmr_boardmemberid") != null && Xrm.Page.getAttribute("wrmr_boardmemberid").getValue() == null) {
            var lookupReference = [];
            lookupReference[0] = {};
            lookupReference[0].id = Xrm.Page.context.getUserId();
            lookupReference[0].entityType = "systemuser";
            lookupReference[0].name = Xrm.Page.context.getUserName();
            Xrm.Page.getAttribute("wrmr_boardmemberid").setValue(lookupReference);
            Xrm.Page.getAttribute("wrmr_boardmemberid").setSubmitMode("always");
        }

        if (Xrm.Page.getAttribute("wrmr_mgmtdate") != null && Xrm.Page.getAttribute("wrmr_mgmtdate").getValue() == null)
        { 
        	Xrm.Page.getAttribute("wrmr_mgmtdate").setValue(new Date()); 
        	Xrm.Page.getAttribute("wrmr_mgmtdate").setSubmitMode("always");
        	
        }
    };

    return {
        IsRequestButtonAvailable: isRequestButtonAvailable,
        IsComplianceAllowed: isComplianceAllowed,
        IsManagementAllowed: isManagementAllowed,
        CountActiveKycApproval: countActiveKycApproval,
        GetActiveKycApproval: getActiveKycApproval,
        RequestKycApproval: requestKycApproval,
        ApproveKycRequest: approveKycRequest,
        RejectKycRequest: rejectKycRequest,
        RequestMgmtApproval: requestMgmtApproval,
        GetInProgressKycApproval: getInProgressKycApproval,
        CountInProgressKycApproval: countInProgressKycApproval,
        SetCurrentUserAndDateManagement: setCurrentUserAndDateManagement
    };
} ();
