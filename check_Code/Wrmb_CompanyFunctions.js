if (!this.Wrm) {
	"strict mode";
	Wrm = function () { };
}

Wrm.Company = function (executionContext) {
	"strict mode";
	async function checkIdentificationDocumentsAsync(DocTypeToCheck) {
		if (DocTypeToCheck !== null && DocTypeToCheck !== "") {
			var docTypes = DocTypeToCheck.split(",");
			if (docTypes.length > 0) {
				var fetchDocTypeCheck =
					"<fetch mapping='logical'>" +
					"  <entity name='wrmb_identificationdocument'>" +
					"	<attribute name='wrmb_identificationdocumentid' />" +
					"	<filter type='and'>" +
					"	  <condition attribute='statecode' operator='eq' value='0' />" +
					"	  <condition attribute='wrmb_companyid' operator='eq' value='" + formContext.data.entity.getId() + "' />" +
					"	</filter>" +
					"	<link-entity name='wrmb_identificationdocumenttype' from='wrmb_identificationdocumenttypeid' to='wrmb_typeid' alias='aq'>" +
					"	  <filter type='or'>";

				for (var i = 0; i < docTypes.length; i++) {
					fetchDocTypeCheck += "<condition attribute='wrmb_name' operator='eq' value='" + docTypes[i].trim() + "' />";
				}

				fetchDocTypeCheck += "</filter>" +
					"	</link-entity>" +
					"  </entity>" +
					"</fetch>";

				try {
					const retrievedDocs = await new Promise((resolve, reject) => {
						XrmServiceToolkit.Soap.Fetch(fetchDocTypeCheck, null, (result) => {
							resolve(result);
						}, (error) => {
							reject(error);
						});
					});

					if (retrievedDocs === null || retrievedDocs.length === 0) {
						formContext.ui.setFormNotification('No valid Identification Document assigned to this record!', 'WARNING', 'identitydocument_NOTIFY');
					}
				} catch (error) {
					console.log(error);
					console.log("api called 4");
				}
			}
		}
	}

	var BankTypeName = null;
	var onLoad = async (executionContext) => {
		"strict mode";
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_companytypeid") !== null) {
			BankTypeName = await Wrm.Common.GetWrmSettingV2("WRM.Company.Bank.Type");
			formContext.getAttribute("wrmb_companytypeid").addOnChange(Wrm.Company.OnChangeCompanyType);
			Wrm.Company.CheckBankTab(formContext);
		}
		if (formContext.ui.getFormType() === 2 || formContext.ui.getFormType() === 3 || formContext.ui.getFormType() === 4 || formContext.ui.getFormType() === 11) {
			if (formContext.getAttribute("wrmb_namecheck") !== null && formContext.getAttribute("wrmb_namecheck").getValue() === true) {
				formContext.ui.setFormNotification('Active Name Check on this record detected!', 'WARNING', 'wrmb_namecheck_NOTIFY');
			}
			if (formContext.getAttribute("wrmb_isclient") !== null && formContext.getAttribute("wrmb_isclient").getValue() === true) {
				Wrm.Common.GetWrmSettingV2("WRM.IdentificationDocument.CompanyIdentification.Types").then(
					checkIdentificationDocumentsAsync()
				).catch((error) => {
					console.log(error);
				});
			}
		}
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phonecountryid", "telephone1", formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxcountryid", "fax", formContext);

		Wrm.Common.SetAddressCountryOnChangeV2("wrmb_address1_countryid",
			["wrmb_address1_addresssalutation",
				"address1_name",
				"wrmb_address1_addresslettersalutation",
				"wrmb_address1_co",
				"address1_line1",
				"address1_line2",
				"address1_postofficebox",
				"address1_postalcode",
				"address1_city",
				"address1_stateorprovince"
			],
			formContext
		);

		Wrm.Common.SetAddressCountryOnChangeV2("wrmb_taxdom_countryid",
			["wrmb_taxdom_addresssalutation",
				"wrmb_taxdom_addressname",
				"wrmb_taxdom_addresslettersalutation",
				"wrmb_taxdom_co",
				"wrmb_taxdom_street1",
				"wrmb_taxdom_street2",
				"wrmb_taxdom_postofficebox",
				"wrmb_taxdom_postalcode",
				"wrmb_taxdom_city",
				"wrmb_taxdom_state"
			],
			formContext
		);
	};

	// var onLoad = function (executionContext) {
	//     let formContext = executionContext.getFormContext();
	// 	if(formContext.getAttribute("wrmb_companytypeid") != null){
	// 		BankTypeName = Wrm.Common.GetWrmSetting("WRM.Company.Bank.Type");
	// 		formContext.getAttribute("wrmb_companytypeid").addOnChange(Wrm.Company.OnChangeCompanyType);
	// 		Wrm.Company.CheckBankTab(formContext);
	// 	}
	// 	if(formContext.ui.getFormType() == 2 || formContext.ui.getFormType() == 3 || formContext.ui.getFormType() == 4 || formContext.ui.getFormType() == 11){
	// 		if(formContext.getAttribute("wrmb_namecheck") != null && formContext.getAttribute("wrmb_namecheck").getValue() == true){
	// 			formContext.ui.setFormNotification('Active Name Check on this record detected!', 'WARNING', 'wrmb_namecheck_NOTIFY');
	// 		}
	// 		if(formContext.getAttribute("wrmb_isclient") != null && formContext.getAttribute("wrmb_isclient").getValue() == true){
	//             Wrm.Common.GetWrmSetting("WRM.IdentificationDocument.CompanyIdentification.Types")
	//                 .then(async (DocTypeToCheck) => {
	//                     await checkIdentificationDocumentsAsync(DocTypeToCheck, formContext);
	//                 })
	//                 .catch((error) => {
	//                     console.log(error);
	//                 });
	// 		}
	// 	}
	// }

	// async function checkIdentificationDocumentsAsync(DocTypeToCheck, formContext) {
	//     console.log("api called");
	//     if (DocTypeToCheck !== null && DocTypeToCheck !== "") {
	//         var docTypes = DocTypeToCheck.split(",");
	//         console.log("api called 1");
	//         if (docTypes.length > 0) {
	//             var fetchDocTypeCheck =
	//                 "<fetch mapping='logical'>" +
	//                 "  <entity name='wrmb_identificationdocument'>" +
	//                 "	<attribute name='wrmb_identificationdocumentid' />" +
	//                 "	<filter type='and'>" +
	//                 "	  <condition attribute='statecode' operator='eq' value='0' />" +
	//                 "	  <condition attribute='wrmb_companyid' operator='eq' value='" + formContext.data.entity.getId() + "' />" +
	//                 "	</filter>" +
	//                 "	<link-entity name='wrmb_identificationdocumenttype' from='wrmb_identificationdocumenttypeid' to='wrmb_typeid' alias='aq'>" +
	//                 "	  <filter type='or'>";

	//             for (var i = 0; i < docTypes.length; i++) {
	//                 fetchDocTypeCheck += "<condition attribute='wrmb_name' operator='eq' value='" + docTypes[i].trim() + "' />";
	//             }

	//             fetchDocTypeCheck += "</filter>" +
	//                 "	</link-entity>" +
	//                 "  </entity>" +
	//                 "</fetch>";

	//             try {
	//                 const retrievedDocs = await new Promise((resolve, reject) => {
	//                     XrmServiceToolkit.Soap.Fetch(fetchDocTypeCheck, null, (result) => {
	//                         resolve(result);
	//                         console.log("api called 2");
	//                     }, (error) => {
	//                         reject(error);
	//                         console.log("api called 3");
	//                     });
	//                 });

	//                 if (retrievedDocs === null || retrievedDocs.length === 0) {
	//                     formContext.ui.setFormNotification('No valid Identification Document assigned to this record!', 'WARNING', 'identitydocument_NOTIFY');
	//                 }
	//             } catch (error) {
	//                 console.log(error)
	//             }
	//         }
	//     }
	// }

	var onChangeCompanyType = function (executionContext) {
		"strict mode";

		let formContext = executionContext.getFormContext();
		Wrm.Company.CheckBankTab(formContext);

		if (formContext.getAttribute("wrmb_companysubtypeid").getValue() !== null) {
			formContext.getAttribute("wrmb_companysubtypeid").setValue(null);
			formContext.getAttribute("wrmb_companysubtypeid").setSubmitMode("always");
		}
	};

	var checkBankTab = function (formContext) {
		"strict mode";

		if (formContext.ui.tabs.get("wrmb_tab_bank") !== null) {
			if (formContext.getAttribute("wrmb_companytypeid").getValue() !== null && formContext.getAttribute("wrmb_companytypeid").getValue()[0].name === BankTypeName) {
				formContext.ui.tabs.get("wrmb_tab_bank").setVisible(true);
			} else {
				formContext.ui.tabs.get("wrmb_tab_bank").setVisible(false);
			}
		}
	};
	return {
		OnLoad: onLoad,
		OnChangeCompanyType: onChangeCompanyType,
		CheckBankTab: checkBankTab,
	};
}();