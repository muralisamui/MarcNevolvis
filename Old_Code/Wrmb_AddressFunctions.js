if (!this.Wrm) {
	"use strict";
	debugger;
	Wrm = function () { };
}

Wrm.Address = function (executionContext) {
	"use strict";
	debugger;
	var onLoad = function (executionContext) {
		debugger;
		let formContext = executionContext.getFormContext();
		console.log(formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phonecountryid", "wrmb_telephone1", formContext);
		console.log(Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phonecountryid", "wrmb_telephone1", formContext));
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_mobilephone1countryid", "wrmb_mobilephone1", formContext);
		console.log(Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_mobilephone1countryid", "wrmb_mobilephone1", formContext));
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxcountryid", "wrmb_fax1", formContext);
		console.log(Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxcountryid", "wrmb_fax1", formContext));


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
				"wrmb_state"],
			formContext);
		console.log(Wrm.Common.SetAddressCountryOnChange("wrmb_countryid",
			["wrmb_salutation",
				"wrmb_name",
				"wrmb_lettersalutation",
				"wrmb_co",
				"wrmb_street1",
				"wrmb_street2",
				"wrmb_postofficebox",
				"wrmb_postalcode",
				"wrmb_city",
				"wrmb_state"],
			formContext));


	};

	return {
		OnLoad: onLoad
	};
}();