if (!this.Mah) {
	"strict mode";
	
	Mah = function () { };
}

Mah.Contact = function (executionContext) {
	"strict mode";
	
	var onLoad = function (executionContext) {
		/*if(Xrm.Page.getAttribute("wrmb_isclient") != null && Xrm.Page.getAttribute("wrmb_isclient").getValue() == true && XrmServiceToolkit.Soap.IsCurrentUserRole("MAH Data Management") == false){
			Mah.Contact.DisableAllControlsInTab("GENERAL_TAB");
		}*/
		
		let formContext = executionContext.getFormContext();
		
		Mah.Contact.SetPrincipalFieldEnabledDisabled(executionContext);

		if (formContext.getAttribute("wrmb_type") != null) {
			formContext.getAttribute("wrmb_type").addOnChange(Mah.Contact.SetPrincipalFieldEnabledDisabled);
		}
	};

	var disableAllControlsInTab = function (tabControlNo, executionContext) {
		
		let formContext = executionContext.getFormContext();
		var tabControl = formContext.ui.tabs.get(tabControlNo);
		if (tabControl != null) {
			var allAttributes = formContext.data.entity.attributes.get();
			for (var i in allAttributes) {
				var myattribute = formContext.data.entity.attributes.get(allAttributes[i].getName());
				var myname = myattribute.getName();
				if (myname === "statecode" || myname === "wrmb_isclient" || formContext.getControl(myname) === null || formContext.getControl(myname).getParent() === null)
					continue;

				var control = formContext.getControl(myname);
				if (control.getParent().getParent() === tabControl && control.getControlType() !== "subgrid") {
					control.setDisabled(true);
				}
			}
		}
	};

	var setPrincipalFieldEnabledDisabled = function (executionContext) {
		
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_isclient") !== null) {
			var userHasRoleForPrincipalChange = Mah.Contact.GetUserHasRolesForPrincipalChange(formContext);
			
			var contactTypeEqualsSettings = Mah.Contact.GetContactTypeEqualsSettingsEntries(formContext);
			
			if (userHasRoleForPrincipalChange) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
			}
			else if (!userHasRoleForPrincipalChange && contactTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(true);
			}
			else if (!userHasRoleForPrincipalChange && !contactTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
			}
		}
	};

	var getContactTypeEqualsSettingsEntries = function (formContext) {
		
		var acceptedContactTypesSetting = Wrm.Common.GetWrmSetting("WRM.MAH.PrincipalManipulationContactTypes");
		var contactTypeMatchesSettings = false;

		if (acceptedContactTypesSetting !== null && acceptedContactTypesSetting !== "") {
			var acceptedContactTypes = acceptedContactTypesSetting.split(",");
			var contactTypeCurrent = formContext.getAttribute("wrmb_type").getValue();

			if (contactTypeCurrent === null || contactTypeCurrent[0] === null || contactTypeCurrent[0].name === null || contactTypeCurrent[0].name.trim() === "") {
				return false;
			}

			if (acceptedContactTypes.length > 0) {
				for (var i = 0; i < acceptedContactTypes.length; i++) {
					if (acceptedContactTypes[i].trim() === contactTypeCurrent[0].name.trim()) {
						contactTypeMatchesSettings = true;
					}
				}
			}
		}

		return contactTypeMatchesSettings;
	};

	var getUserHasRolesForPrincipalChange = function (formContext) {

		var acceptedUserRolesSettings = Wrm.Common.GetWrmSetting("WRM.MAH.PrincipalManipulationRoles");
		
		if (acceptedUserRolesSettings !== null && acceptedUserRolesSettings !== "") {
			var acceptedUserRoles = acceptedUserRolesSettings.split(",");
			
			if (acceptedUserRoles.length > 0) {

				async function xrmAsyncFetch() {
					let fetchUserAssociatedRoles = "<fetch>" +
						"<entity name='role' >" +
						"<attribute name='roleidunique' />" +
						"<filter type='and' >" +
						"<condition attribute='name' operator='in' >";

					for (let i = 0; i < acceptedUserRoles.length; i++) {
						fetchUserAssociatedRoles += "<value>" + acceptedUserRoles[i].trim() + "</value>";
					}

					fetchUserAssociatedRoles += "</condition>" +
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
					try {
						let results = await Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + encodeURIComponent(fetchUserAssociatedRoles));
						
						return results;
					} catch (err) {
						
						console.error(error);
					}
				}

				let retrievedRoles = xrmAsyncFetch().then(function (response) {
					
					return response;
				})

				if (retrievedRoles.length > 0) {
					
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
}();