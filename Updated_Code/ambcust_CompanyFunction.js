if (!this.Mah) {
	"use strict";
	debugger;
	Mah = function () { };
}

Mah.Company = function (executionContext) {
	"use strict";
	debugger;
	var onLoad = function (executionContext) {
		/*if(formContext.getAttribute("wrmb_isclient") != null && formContext.getAttribute("wrmb_isclient").getValue() == true && XrmServiceToolkit.Soap.IsCurrentUserRole("MAH Data Management") == false){
			Mah.Company.DisableAllControlsInTab("GENERAL_TAB");
		}*/
		debugger;
		let formContext = executionContext.getFormContext();
		debugger;
		Mah.Company.SetPrincipalFieldEnabledDisabled(executionContext);

		if (formContext.getAttribute("wrmb_companytypeid") !== null) {
			debugger;
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
		debugger;
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_isclient") !== null) {
			var userHasRoleForPrincipalChange = Mah.Company.GetUserHasRolesForPrincipalChange(formContext);
			debugger;
			var companyTypeEqualsSettings = Mah.Company.GetCompanyTypeEqualsSettingsEntries(formContext);
			debugger;
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
		debugger;
		var acceptedCompanyTypesSetting = await Mah.Company.GetWrmSettingV2("WRM.MAH.PrincipalManipulationCompanyTypes");
		var companyTypeMatchesSettings = false;

		if (acceptedCompanyTypesSetting !== null && acceptedCompanyTypesSetting !== "") {
			var acceptedCompanyTypes = acceptedCompanyTypesSetting.split(",");
			var companyTypeCurrent = formContext.getAttribute("wrmb_companytypeid").getValue();
			debugger;

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

	var getUserHasRolesForPrincipalChange = async (formContext)=> {
        //WRM.MAH.PrincipalManipulationRoles

		var acceptedUserRolesSettings = await Mah.Company.GetWrmSettingV2("WRM.MAH.PrincipalManipulationRoles");
		console.log(acceptedUserRolesSettings);
		debugger;
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
						debugger;
						return results;
					} catch (error) {
						debugger;
						console.error(error);
					}
				}


				let retrievedRoles = xrmAsyncFetch().then(function (response) {
					debugger;
					return response;
				})

				if (retrievedRoles.length > 0) {
					debugger;
					return true;

				}
			}
		}

		return false;
	};
    // var getWrmSettingV2 = function (settingKey) {
    //     debugger;
    //     console.log('getwrmSetting called');
    //     var SettingValue = "";
    //     var filter = "wrmb_name eq '" + settingKey + "' and statecode/Value eq 0";
    //     let queryString = "?$select=wrmb_wrmsettingId, wrmb_name, wrmb_value" + filter;
    //     debugger;
    //     return Xrm.WebApi.retrieveMultipleRecords(
    //         "wrmb_wrmsetting",
    //         queryString
    //     ).then((results) => {
    //         debugger;
    //         console.log("records retrieved", results);
    //         if (results != null && results.entities.length > 0) {
    //             debugger;
    //             console.log(results);
    //             SettingValue = results.entities[0].wrmb_value;
    //         }
    //         else {
    //             return "";
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //         return "";
    //     });
    // };
    var getWrmSettingV2 = async (SettingKey) => {
        console.log('get wrm called 1');
        try {
            const result = await Xrm.WebApi.retrieveMultipleRecords("wrmb_wrmsetting", `?$select=wrmb_value&$filter=wrmb_name eq '${SettingKey}' and statecode eq 0`);
            if (result.entities.length > 0) {
                return result.entities[0].wrmb_value;
            } else {
                return "";
            }
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error retrieving wrm setting '${SettingKey}': ${error.message}`);
        }
    }
	debugger;
	return {

		OnLoad: onLoad,
		DisableAllControlsInTab: disableAllControlsInTab,
		GetUserHasRolesForPrincipalChange: getUserHasRolesForPrincipalChange,
		SetPrincipalFieldEnabledDisabled: setPrincipalFieldEnabledDisabled,
		GetCompanyTypeEqualsSettingsEntries: getCompanyTypeEqualsSettingsEntries,
        GetWrmSettingV2:getWrmSettingV2
	};
}();