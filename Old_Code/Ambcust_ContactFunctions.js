if (!this.Mah){
	Mah = function () {};
}

Mah.Contact = function () {
	var onLoad = function () {
		/*if(Xrm.Page.getAttribute("wrmb_isclient") != null && Xrm.Page.getAttribute("wrmb_isclient").getValue() == true && XrmServiceToolkit.Soap.IsCurrentUserRole("MAH Data Management") == false){
			Mah.Contact.DisableAllControlsInTab("GENERAL_TAB");
		}*/
		
		Mah.Contact.SetPrincipalFieldEnabledDisabled();
		
		if(Xrm.Page.getAttribute("wrmb_type") != null)
		{
			Xrm.Page.getAttribute("wrmb_type").addOnChange(Mah.Contact.SetPrincipalFieldEnabledDisabled);
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
    		var userHasRoleForPrincipalChange = Mah.Contact.GetUserHasRolesForPrincipalChange();
    		var contactTypeEqualsSettings = Mah.Contact.GetContactTypeEqualsSettingsEntries();
    	
    		if(userHasRoleForPrincipalChange)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(false);
    		}
    		else if(!userHasRoleForPrincipalChange && contactTypeEqualsSettings)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(true);    			
    		}
    		else if(!userHasRoleForPrincipalChange && !contactTypeEqualsSettings)
    		{
    			Xrm.Page.getControl("wrmb_isclient").setDisabled(false);    			
    		}    		
    	}
    };
    
    var getContactTypeEqualsSettingsEntries = function () {	
    	var acceptedContactTypesSetting = Wrm.Common.GetWrmSetting("WRM.MAH.PrincipalManipulationContactTypes");
		var contactTypeMatchesSettings = false;
		
		if(acceptedContactTypesSetting != null && acceptedContactTypesSetting != "")
		{
			var acceptedContactTypes = acceptedContactTypesSetting.split(",");			
			var contactTypeCurrent = Xrm.Page.getAttribute("wrmb_type").getValue();
			
			if(contactTypeCurrent == null || contactTypeCurrent[0] == null || contactTypeCurrent[0].name == null || contactTypeCurrent[0].name.trim() == "")
			{
				return false;
			}			
			
			if(acceptedContactTypes.length > 0)
			{
				for(var i = 0; i < acceptedContactTypes.length; i++)
				{
					if(acceptedContactTypes[i].trim() == contactTypeCurrent[0].name.trim()){
						contactTypeMatchesSettings = true;
					}
				} 
			}		
		}
		
		return contactTypeMatchesSettings;
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
       	GetContactTypeEqualsSettingsEntries: getContactTypeEqualsSettingsEntries
    };
} ();