if (!this.Wrm){
	Wrm = function () {};
}

Wrm.RiskSummaryApproval = function () {
    var onLoad = function () {
		if(Xrm.Page.ui.getFormType() == 1)
		{
			Xrm.Page.getAttribute("wrmr_advisordate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);
			Xrm.Page.getAttribute("wrmr_compliancedate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);
			Xrm.Page.getAttribute("wrmr_mgmtdate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);
			
			if(Xrm.Page.getAttribute("wrmr_advisordate") != null && Xrm.Page.getAttribute("wrmr_advisordate").getValue() == null){
				var d = new Date();
				d.setHours(0,0,0,0);
				Xrm.Page.getAttribute("wrmr_advisordate").setValue(d);
			}
		}
		
		if(Xrm.Page.ui.getFormType() == 2)
		{	
			if (Xrm.Page.getAttribute("statuscode") != null)
			{
				if (Xrm.Page.getAttribute("statuscode").getValue() == 320560000 || Xrm.Page.getAttribute("statuscode").getValue() == 320560001) // Approved || Rejected
				{
					Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					if (Xrm.Page.getAttribute('wrmr_mgmtdate') != null && Xrm.Page.getAttribute('wrmr_mgmtdate').getValue() != null)
					{
						Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(true);
					}
					if (Wrm.Common.IsLockTimeoutReached('wrmr_compliancedate') == true && Wrm.Common.IsLockTimeoutReached('wrmr_mgmtdate') == true)
					{
						Wrm.Common.DisableAllControlsOnForm();
					}
				}
				else if (Xrm.Page.getAttribute("statuscode").getValue() == 1) // Requested (Compliance)
				{
					Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(false);
					Wrm.RiskSummaryApproval.ClearEmptyYesNoFields();
				}
				else if (Xrm.Page.getAttribute("statuscode").getValue() == 320560002 ) // Requested (Management)
				{
					Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					Xrm.Page.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(true);
					Wrm.RiskSummaryApproval.ClearEmptyYesNoFields();
				}
			}
		}
    };
    
    var clearEmptyYesNoFields = function(){
    	if (Xrm.Page.getAttribute("wrmr_compliancedate") != null && Xrm.Page.getAttribute("wrmr_compliancedate").getValue() == null)
    	{
	    	if (Xrm.Page.getAttribute("wrmr_compliancebusrelshipcomplete") != null)
	    	{
	    		Xrm.Page.getAttribute("wrmr_compliancebusrelshipcomplete").setValue();
	    	}
	    	
	    	if (Xrm.Page.getAttribute("wrmr_compliancebusrelshipapproved") != null)
	    	{
	    		Xrm.Page.getAttribute("wrmr_compliancebusrelshipapproved").setValue();
	    		
	    		if (Xrm.Page.getAttribute("wrmr_compliancecommentapproved") != null)
	    		{
	    			Xrm.Page.getAttribute("wrmr_compliancecommentapproved").setRequiredLevel("none");
	    		}
	    	}
    	}
    	
    	if (Xrm.Page.getAttribute("wrmr_mgmtdate") != null && Xrm.Page.getAttribute("wrmr_mgmtdate").getValue() == null)
    	{
	    	if (Xrm.Page.getAttribute("wrmr_mgmtbusrelationshipapproved") != null)
	    	{
	    		Xrm.Page.getAttribute("wrmr_mgmtbusrelationshipapproved").setValue();
	    	}
    	}
    };

    return {
        OnLoad: onLoad,
        ClearEmptyYesNoFields: clearEmptyYesNoFields
    };
} ();
