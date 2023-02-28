if (!this.Wrm){
    "strict mode";
    debugger;
	Wrm = function () {};
}

Wrm.Contact = function (executionContext) {
    "strict mode";
    debugger;
    var onLoad = function (executionContext) {	
        "strict mode";
        debugger;
        let formContext = executionContext.getFormContext();

		if(formContext.ui.getFormType() === 2 || formContext.ui.getFormType() === 3 || formContext.ui.getFormType() === 4 || formContext.ui.getFormType() === 11){
			if(formContext.getAttribute("wrmb_namecheck") !== null && formContext.getAttribute("wrmb_namecheck").getValue() === true){
				formContext.ui.setFormNotification('Active Name Check on this record detected!', 'WARNING', 'wrmb_namecheck_NOTIFY');
			}
			if(formContext.getAttribute("wrmb_isclient") !== null && formContext.getAttribute("wrmb_isclient").getValue() === true){
				console.log(formContext.getAttribute("wrmb_isclient").getValue());
				Wrm.Common.GetWrmSettingV2("WRM.IdentificationDocument.ContactIdentification.Types")
				console.log(Wrm.Common.GetWrmSettingV2("WRM.IdentificationDocument.ContactIdentification.Types"))
				.then( 
				function(DocTypeToCheck){
                    debugger;
					console.log(DocTypeToCheck);
                    if(DocTypeToCheck !== null && DocTypeToCheck !== ""){
                        var docTypes = DocTypeToCheck.split(",");
                        debugger;
                        if(docTypes.length > 0){
                            console.log('api called 0');
                            var fetchDocTypeCheck =
                                "<fetch mapping='logical'>" +
                                "  <entity name='wrmb_identificationdocument'>" +
                                "    <attribute name='wrmb_identificationdocumentid' />" +
                                "    <filter type='and'>" +
                                "      <condition attribute='statecode' operator='eq' value='0' />" +
                                "      <condition attribute='wrmb_contactid' operator='eq' value='" + formContext.data.entity.getId() + "' />" +
                                "    </filter>" +
                                "    <link-entity name='wrmb_identificationdocumenttype' from='wrmb_identificationdocumenttypeid' to='wrmb_typeid' alias='aq'>" +
                                "      <filter type='or'>";
                            for(var i = 0; i < docTypes.length; i++){
                                fetchDocTypeCheck += "<condition attribute='wrmb_name' operator='eq' value='" + docTypes[i].trim() + "' />" ;
                            }
                            fetchDocTypeCheck += "</filter>" +
                                "    </link-entity>" +
                                "  </entity>" +
                                "</fetch>";
                                                
                            Xrm.WebApi.retrieveMultipleRecords("wrmb_identificationdocument", "?fetchXml=" + fetchDocTypeCheck).then(
                                console.log('api called'),
                                function(results) {
                                    debugger;
                                    if (results.entities.length === 0) {
                                        console.log('api called 1');
                                        formContext.getControl("name").setNotification("No valid Identification Document assigned to this record!", "identitydocument_NOTIFY");
                                    }
                                },
                                function(error) {
                                    debugger;
                                    console.log(error.message);
                                }
                            );
                        }
                    }
				}
                )
				.catch((error) => {
					console.log(error);
				});
			}
		}
		
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phoneprivatecountryid", "telephone3",formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phonebusinesscountryid", "telephone1",formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_mobilephoneprivatecountryid", "mobilephone",formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_mobilephonebusinesscountryid", "wrmb_mobilephonebusiness",formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxprivatecountryid", "fax",formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxbusinesscountryid", "wrmb_faxbusiness",formContext);
		
		Wrm.Common.SetAddressCountryOnChange("wrmb_address1_countryid",
							["wrmb_address1_addresssalutation", 
							"address1_name", 
							"wrmb_address1_addresslettersalutation", 
							"wrmb_address1_co", 
							"address1_line1", 
							"address1_line2", 
							"address1_postofficebox", 
							"address1_postalcode", 
							"address1_city", 
							"address1_stateorprovince" ]);
							
		Wrm.Common.SetAddressCountryOnChange("wrmb_address2_countryid",
							["wrmb_address2_addresssalutation", 
							"address2_name", 
							"wrmb_address2_addresslettersalutation", 
							"wrmb_address2_co", 
							"address2_line1", 
							"address2_line2", 
							"address2_postofficebox", 
							"address2_postalcode", 
							"address2_city", 
							"address2_stateorprovince" ]);
							
		Wrm.Common.SetAddressCountryOnChange("wrmb_taxdom_countryid",
							["wrmb_taxdom_addresssalutation", 
							"wrmb_taxdom_addressname", 
							"wrmb_taxdom_addresslettersalutation", 
							"wrmb_taxdom_co", 
							"wrmb_taxdom_street1", 
							"wrmb_taxdom_street2", 
							"wrmb_taxdom_postofficebox", 
							"wrmb_taxdom_postalcode", 
							"wrmb_taxdom_city", 
							"wrmb_taxdom_state" ]);
	};
	
    return {
        OnLoad: onLoad
    };
} ();