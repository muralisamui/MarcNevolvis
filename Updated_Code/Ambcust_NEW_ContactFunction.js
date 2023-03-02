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
		debugger;
		Mah.Contact.SetPrincipalFieldEnabledDisabled(executionContext);
		debugger;
		if (formContext.getAttribute("wrmb_type") != null) {
			formContext.getAttribute("wrmb_type").addOnChange(Mah.Contact.SetPrincipalFieldEnabledDisabled);
			debugger;
		}
	};

	var disableAllControlsInTab = function (tabControlNo, executionContext) {
		debugger;
		let formContext = executionContext.getFormContext();
		var tabControl = formContext.ui.tabs.get(tabControlNo);
		debugger;
		if (tabControl != null) {
			var allAttributes = formContext.data.entity.attributes.get();
			debugger;
			for (var i in allAttributes) {
				var myattribute = formContext.data.entity.attributes.get(allAttributes[i].getName());
				var myname = myattribute.getName();
				debugger;
				if (myname === "statecode" || myname === "wrmb_isclient" || formContext.getControl(myname) === null || formContext.getControl(myname).getParent() === null)
					continue;
				debugger;
				var control = formContext.getControl(myname);
				if (control.getParent().getParent() === tabControl && control.getControlType() !== "subgrid") {
					control.setDisabled(true);
				}
				debugger;
			}
		}
	};

	var setPrincipalFieldEnabledDisabled = function (executionContext) {
		
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_isclient") !== null) {
			var userHasRoleForPrincipalChange = Mah.Contact.GetUserHasRolesForPrincipalChange(formContext);
			debugger;
			var contactTypeEqualsSettings = Mah.Contact.GetContactTypeEqualsSettingsEntries(formContext);
			debugger;
			if (userHasRoleForPrincipalChange) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
				debugger;
			}
			else if (!userHasRoleForPrincipalChange && contactTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(true);
				debugger;
			}
			else if (!userHasRoleForPrincipalChange && !contactTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
				debugger;
			}
		}
	};

	var getContactTypeEqualsSettingsEntries = async function (formContext) {
		debugger;
		var acceptedContactTypesSetting = await Wrm.Common.GetWrmSettingV2("WRM.MAH.PrincipalManipulationContactTypes");
		var contactTypeMatchesSettings = false;
		debugger;
		if (acceptedContactTypesSetting !== null && acceptedContactTypesSetting !== "") {
			var acceptedContactTypes = acceptedContactTypesSetting.split(",");
			var contactTypeCurrent = formContext.getAttribute("wrmb_type").getValue();
			debugger;
			if (contactTypeCurrent === null || contactTypeCurrent[0] === null || contactTypeCurrent[0].name === null || contactTypeCurrent[0].name.trim() === "") {
				return false;
			}
			debugger;
			if (acceptedContactTypes.length > 0) {
				for (var i = 0; i < acceptedContactTypes.length; i++) {
					if (acceptedContactTypes[i].trim() === contactTypeCurrent[0].name.trim()) {
						contactTypeMatchesSettings = true;
						debugger;
					}
				}
			}
		}

		return contactTypeMatchesSettings;
		debugger;
	};

	var getUserHasRolesForPrincipalChange = async function (formContext) {

		var acceptedUserRolesSettings = await Wrm.Common.GetWrmSettingV2("WRM.MAH.PrincipalManipulationRoles");
		debugger;
		if (acceptedUserRolesSettings !== null && acceptedUserRolesSettings !== "") {
			var acceptedUserRoles = acceptedUserRolesSettings.split(",");
			debugger;
			if (acceptedUserRoles.length > 0) {
				debugger;
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
						console.log(results);
						debugger;
						return results;
					} catch (err) {
						
						console.error(error);
					}
				}

				let retrievedRoles = xrmAsyncFetch().then(function (response) {
					console.log(response);
					debugger;
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