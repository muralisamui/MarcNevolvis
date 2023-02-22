if (!this.Mah){
	Mah = function () {};
}

Mah.Company = function () {
	var onLoad = function () {
		/*if(Xrm.Page.getAttribute("wrmb_isclient") != null && Xrm.Page.getAttribute("wrmb_isclient").getValue() == true && XrmServiceToolkit.Soap.IsCurrentUserRole("MAH Data Management") == false){
			Mah.Company.DisableAllControlsInTab("GENERAL_TAB");
		}*/
		
		Mah.Company.SetPrincipalFieldEnabledDisabled();
		
		if(Xrm.Page.getAttribute("wrmb_companytypeid") != null)
		{
			Xrm.Page.getAttribute("wrmb_companytypeid").addOnChange(Mah.Company.SetPrincipalFieldEnabledDisabled);
		}
	};

    var disableAllControlsInTab = function (tabControlNo) {
        /// <summary>
        /// Disable all controls in a tab by tab number.
        /// </summary>
        /// <param name="tabControlNo" type="int">
        /// The number of the tab
        /// </param>
        /// <returns type="void" />
        var tabControl = Xrm.Page.ui.tabs.get(tabControlNo);
        if (tabControl != null) {		 
			var allAttributes = Xrm.Page.data.entity.attributes.get();
			for (var i in allAttributes) {
				var myattribute = Xrm.Page.data.entity.attributes.get(allAttributes[i].getName());
				var myname = myattribute.getName();  
				if(myname == "statecode" || myname == "wrmb_isclient" || Xrm.Page.getControl(myname) == null || Xrm.Page.getControl(myname).getParent() == null)
					continue;
				
				var control = Xrm.Page.getControl(myname);	
				 if (control.getParent().getParent() === tabControl && control.getControlType() != "subgrid") {
					 control.setDisabled(true);
				 }
			}
        }
    };
    
    var setPrincipalFieldEnabledDisabled = function () {	
    	if(Xrm.Page.getAttribute("wrmb_isclient") != null)
    	{ 
    		var userHasRoleForPrincipalChange = Mah.Company.GetUserHasRolesForPrincipalChange();
    		var companyTypeEqualsSettings = Mah.Company.GetCompanyTypeEqualsSettingsEntries();
    	
    		if(userHasRoleForPrincipalChange)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(false);
    		}
    		else if(!userHasRoleForPrincipalChange && companyTypeEqualsSettings)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(true);    			
    		}
    		else if(!userHasRoleForPrincipalChange && !companyTypeEqualsSettings)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(false);    			
    		}    		
    	}
    };
    
    var getCompanyTypeEqualsSettingsEntries = function () {	
    	var acceptedCompanyTypesSetting = Wrm.Common.GetWrmSetting("WRM.MAH.PrincipalManipulationCompanyTypes");
		var companyTypeMatchesSettings = false;
		
		if(acceptedCompanyTypesSetting != null && acceptedCompanyTypesSetting != "")
		{
			var acceptedCompanyTypes = acceptedCompanyTypesSetting.split(",");			
			var companyTypeCurrent = Xrm.Page.getAttribute("wrmb_companytypeid").getValue();
			
			if(companyTypeCurrent == null || companyTypeCurrent[0] == null || companyTypeCurrent[0].name == null || companyTypeCurrent[0].name.trim() == "")
			{
				return false;
			}			
			
			if(acceptedCompanyTypes.length > 0)
			{
				for(var i = 0; i < acceptedCompanyTypes.length; i++)
				{
					if(acceptedCompanyTypes[i].trim() == companyTypeCurrent[0].name.trim()){
						companyTypeMatchesSettings = true;
					}
				} 
			}		
		}
		
		return companyTypeMatchesSettings;
    };
    
    var getUserHasRolesForPrincipalChange = function () {	
			
		var acceptedUserRolesSettings = Wrm.Common.GetWrmSetting("WRM.MAH.PrincipalManipulationRoles");
		
		if(acceptedUserRolesSettings != null && acceptedUserRolesSettings != "")
		{
			var acceptedUserRoles = acceptedUserRolesSettings.split(",");
			
			if(acceptedUserRoles.length > 0)
			{
				var fetchUserAssociatedRoles ="<fetch>" +
										  "<entity name='role' >" +
										    "<attribute name='roleidunique' />" +
										    "<filter type='and' >" +
										      "<condition attribute='name' operator='in' >";
										      
										    for(var i = 0; i < acceptedUserRoles.length; i++)
										    {
													fetchUserAssociatedRoles += "<value>" + acceptedUserRoles[i].trim()  + "</value>";
											} 										      
										         
				fetchUserAssociatedRoles   +=  "</condition>" +
										    "</filter>" +
										    "<link-entity name='systemuserroles' from='roleid' to='roleid' intersect='true' >" +
										      "<link-entity name='systemuser' from='systemuserid' to='systemuserid' >" +
										        "<filter type='and' >" +
										          "<condition attribute='systemuserid' operator='eq-userid' />" +
										        "</filter>" +
										      "</link-entity>" +
										    "</link-entity>" +
										  "</entity>" +
										"</fetch>";			
			
				retrievedRoles = XrmServiceToolkit.Soap.Fetch(fetchUserAssociatedRoles);		
				
				if(retrievedRoles.length > 0)
				{
					return true;
				}	
			}			
		}
		
		return false;
	};	
	
    return {
        OnLoad: onLoad,
        DisableAllControlsInTab: disableAllControlsInTab,
        GetUserHasRolesForPrincipalChange: getUserHasRolesForPrincipalChange,
        SetPrincipalFieldEnabledDisabled: setPrincipalFieldEnabledDisabled,
       	GetCompanyTypeEqualsSettingsEntries: getCompanyTypeEqualsSettingsEntries
    };
} ();