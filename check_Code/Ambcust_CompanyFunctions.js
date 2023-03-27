if (!this.Mah) {
	"use strict";
	Mah = function () { };
}

Mah.Company = function (executionContext) {
	"use strict";
	var onLoad = function (executionContext) {
		/*if(formContext.getAttribute("wrmb_isclient") != null && formContext.getAttribute("wrmb_isclient").getValue() == true && XrmServiceToolkit.Soap.IsCurrentUserRole("MAH Data Management") == false){
			Mah.Company.DisableAllControlsInTab("GENERAL_TAB");
		}*/
		let formContext = executionContext.getFormContext();
		Mah.Company.SetPrincipalFieldEnabledDisabled(executionContext);

		if (formContext.getAttribute("wrmb_companytypeid") !== null) {
			formContext.getAttribute("wrmb_companytypeid").addOnChange(Mah.Company.SetPrincipalFieldEnabledDisabled);
		}
	};

	var disableAllControlsInTab = function (tabControlNo, formContext) {
		/// <summary>
		/// Disable all controls in a tab by tab number.
		/// </summary>
		/// <param name="tabControlNo" type="int">
		/// The number of the tab
		/// </param>
		/// <returns type="void" />
		var tabControl = formContext.ui.tabs.get(tabControlNo);
		if (tabControl !== null) {
			var allAttributes = formContext.data.entity.attributes.get();
			for (var i in allAttributes) {
				var myattribute = formContext.data.entity.attributes.get(allAttributes[i].getName());
				var myname = myattribute.getName();
				if ((myname === "statecode") || (myname === "wrmb_isclient") || (formContext.getControl(myname) === null) || (formContext.getControl(myname).getParent() === null))
					continue;
				var control = formContext.getControl(myname);
				if ((control.getParent().getParent() === tabControl) && (control.getControlType() !== "subgrid")) {
					control.setDisabled(true);
				}
			}
		}
	};

	var setPrincipalFieldEnabledDisabled = function (executionContext) {
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_isclient") !== null) {
			var userHasRoleForPrincipalChange = Mah.Company.GetUserHasRolesForPrincipalChange(formContext);
			var companyTypeEqualsSettings = Mah.Company.GetCompanyTypeEqualsSettingsEntries(formContext);
			if (userHasRoleForPrincipalChange) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
			}
			else if (!userHasRoleForPrincipalChange && companyTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(true);
			}
			else if (!userHasRoleForPrincipalChange && !companyTypeEqualsSettings) {
				formContext.getControl("wrmb_isclient").setDisabled(false);
			}
		}
	};

	var getCompanyTypeEqualsSettingsEntries = async (formContext) => {
		var acceptedCompanyTypesSetting = await Wrm.Common.GetWrmSettingV2("WRM.MAH.PrincipalManipulationCompanyTypes");
		var companyTypeMatchesSettings = false;

		if (acceptedCompanyTypesSetting !== null && acceptedCompanyTypesSetting !== "") {
			var acceptedCompanyTypes = acceptedCompanyTypesSetting.split(",");
			var companyTypeCurrent = formContext.getAttribute("wrmb_companytypeid").getValue();

			if (companyTypeCurrent === null || companyTypeCurrent[0] === null || companyTypeCurrent[0].name === null || companyTypeCurrent[0].name.trim() === "") {
				return false;
			}

			if (acceptedCompanyTypes.length > 0) {
				for (var i = 0; i < acceptedCompanyTypes.length; i++) {
					if (acceptedCompanyTypes[i].trim() === companyTypeCurrent[0].name.trim()) {
						companyTypeMatchesSettings = true;
					}
				}
			}
		}

		return companyTypeMatchesSettings;
	};

	var getUserHasRolesForPrincipalChange = async (formContext) => {
		//WRM.MAH.PrincipalManipulationRoles

		var acceptedUserRolesSettings = await Wrm.Common.GetWrmSettingV2("WRM.MAH.PrincipalManipulationRoles");
		console.log(acceptedUserRolesSettings);
		if (acceptedUserRolesSettings !== null && acceptedUserRolesSettings !== "") {
			console.log(acceptedUserRolesSettings);
			var acceptedUserRoles = acceptedUserRolesSettings.split(",");
			debugger;
			if (acceptedUserRoles.length > 0) {

				// async function xrmAsyncFetch(){
				// 	let fetchUserAssociatedRoles = "<fetch>" +
				// "<entity name='role' >" +
				// "<attribute name='roleidunique' />" +
				// "<filter type='and' >" +
				// "<condition attribute='name' operator='in' >";

				// for (var i = 0; i < acceptedUserRoles.length; i++) {
				// 	fetchUserAssociatedRoles += "<value>" + acceptedUserRoles[i].trim() + "</value>";
				// }

				// fetchUserAssociatedRoles += "</condition>" +
				// 	"</filter>" +
				// 	"<link-entity name='systemuserroles' from='roleid' to='roleid' intersect='true' >" +
				// 	"<link-entity name='systemuser' from='systemuserid' to='systemuserid' >" +
				// 	"<filter type='and' >" +
				// 	"<condition attribute='systemuserid' operator='eq-userid' />" +
				// 	"</filter>" +
				// 	"</link-entity>" +
				// 	"</link-entity>" +
				// 	"</entity>" +
				// 	"</fetch>";
				// //debugger;
				// let retrievedRole = await XrmServiceToolkit.Soap.Fetch(fetchUserAssociatedRoles);
				// //debugger;
				// return retrievedRole;
				// }

				async function xrmAsyncFetch() {
					let fetchUserAssociatedRoles = "<fetch>" +
						"<entity name='role'>" +
						"<attribute name='roleidunique' />" +
						"<filter type='and'>" +
						"<condition attribute='name' operator='in'>";

					for (let i = 0; i < acceptedUserRoles.length; i++) {
						fetchUserAssociatedRoles += "<value>" + acceptedUserRoles[i].trim() + "</value>";
					}

					fetchUserAssociatedRoles += "</condition>" +
						"</filter>" +
						"<link-entity name='systemuserroles' from='roleid' to='roleid' intersect='true'>" +
						"<link-entity name='systemuser' from='systemuserid' to='systemuserid'>" +
						"<filter type='and'>" +
						"<condition attribute='systemuserid' operator='eq-userid' />" +
						"</filter>" +
						"</link-entity>" +
						"</link-entity>" +
						"</entity>" +
						"</fetch>";

					try {
						let results = await Xrm.WebApi.retrieveMultipleRecords("role", "?fetchXml=" + encodeURIComponent(fetchUserAssociatedRoles));
						return results;
					} catch (error) {
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
		GetCompanyTypeEqualsSettingsEntries: getCompanyTypeEqualsSettingsEntries,
	};
}();