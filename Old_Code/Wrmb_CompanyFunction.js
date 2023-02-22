if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Company = function () {
	var BankTypeName = null;
    var onLoad = function () {
		if(Xrm.Page.getAttribute("wrmb_companytypeid") != null){
			BankTypeName = Wrm.Common.GetWrmSetting("WRM.Company.Bank.Type");
			Xrm.Page.getAttribute("wrmb_companytypeid").addOnChange(Wrm.Company.OnChangeCompanyType);
			Wrm.Company.CheckBankTab();
		}
		if(Xrm.Page.ui.getFormType() == 2 || Xrm.Page.ui.getFormType() == 3 || Xrm.Page.ui.getFormType() == 4 || Xrm.Page.ui.getFormType() == 11){
			if(Xrm.Page.getAttribute("wrmb_namecheck") != null && Xrm.Page.getAttribute("wrmb_namecheck").getValue() == true){
				Xrm.Page.ui.setFormNotification('Active Name Check on this record detected!', 'WARNING', 'wrmb_namecheck_NOTIFY');
			}
			if(Xrm.Page.getAttribute("wrmb_isclient") != null && Xrm.Page.getAttribute("wrmb_isclient").getValue() == true){
			Wrm.Common.GetWrmSetting("WRM.IdentificationDocument.CompanyIdentification.Types",
				function(DocTypeToCheck){
					if(DocTypeToCheck != null && DocTypeToCheck != ""){
						var docTypes = DocTypeToCheck.split(",");
						if(docTypes.length > 0){
							var fetchDocTypeCheck =
								"<fetch mapping='logical'>" +
								"  <entity name='wrmb_identificationdocument'>" +
								"	<attribute name='wrmb_identificationdocumentid' />" +
								"	<filter type='and'>" +
								"	  <condition attribute='statecode' operator='eq' value='0' />" +
								"	  <condition attribute='wrmb_companyid' operator='eq' value='" + Xrm.Page.data.entity.getId() + "' />" +
								"	</filter>" +
								"	<link-entity name='wrmb_identificationdocumenttype' from='wrmb_identificationdocumenttypeid' to='wrmb_typeid' alias='aq'>" +
								"	  <filter type='or'>";
							
							for(var i = 0; i < docTypes.length; i++){
								fetchDocTypeCheck += "<condition attribute='wrmb_name' operator='eq' value='" + docTypes[i].trim() + "' />" ;
							}
								
							fetchDocTypeCheck += "</filter>" +
								"	</link-entity>" +
								"  </entity>" +
								"</fetch>";
							XrmServiceToolkit.Soap.Fetch(fetchDocTypeCheck, null, function(retrievedDocs){
								if(retrievedDocs == null || retrievedDocs.length == 0){
									Xrm.Page.ui.setFormNotification('No valid Identification Document assigned to this record!', 'WARNING', 'identitydocument_NOTIFY');
								}
							});
						}
					}
				});
			}
		}
		Wrm.Common.SetPhoneNumberCountryOnChange("wrmb_phonecountryid", "telephone1");
		Wrm.Common.SetPhoneNumberCountryOnChange("wrmb_faxcountryid", "fax");
		
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
	
    var onChangeCompanyType = function () {
		Wrm.Company.CheckBankTab();
		
		if(Xrm.Page.getAttribute("wrmb_companysubtypeid").getValue() != null)
		{
			Xrm.Page.getAttribute("wrmb_companysubtypeid").setValue(null);
			Xrm.Page.getAttribute("wrmb_companysubtypeid").setSubmitMode("always");
		}
    };
	
    var checkBankTab = function () {
		if(Xrm.Page.ui.tabs.get("wrmb_tab_bank") != null){
			if(Xrm.Page.getAttribute("wrmb_companytypeid").getValue() != null && Xrm.Page.getAttribute("wrmb_companytypeid").getValue()[0].name == BankTypeName){
				Xrm.Page.ui.tabs.get("wrmb_tab_bank").setVisible(true);
			}else{
				Xrm.Page.ui.tabs.get("wrmb_tab_bank").setVisible(false);
			}
		}
    };

    return {
        OnLoad: onLoad,
		OnChangeCompanyType: onChangeCompanyType,
		CheckBankTab: checkBankTab
    };
} ();