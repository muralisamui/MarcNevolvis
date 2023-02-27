if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Address = function () {
    var onLoad = function () {			
		Wrm.Common.SetPhoneNumberCountryOnChange("wrmb_phonecountryid", "wrmb_telephone1");
		Wrm.Common.SetPhoneNumberCountryOnChange("wrmb_mobilephone1countryid", "wrmb_mobilephone1");
		Wrm.Common.SetPhoneNumberCountryOnChange("wrmb_faxcountryid", "wrmb_fax1");
		
		Wrm.Common.SetAddressCountryOnChange("wrmb_countryid",
							["wrmb_salutation", 
							"wrmb_name", 
							"wrmb_lettersalutation", 
							"wrmb_co", 
							"wrmb_street1", 
							"wrmb_street2", 
							"wrmb_postofficebox", 
							"wrmb_postalcode", 
							"wrmb_city", 
							"wrmb_state" ]);
							
	};
	
    return {
        OnLoad: onLoad
    };
} ();