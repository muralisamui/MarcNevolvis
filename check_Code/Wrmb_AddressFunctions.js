if (!this.Wrm) {
	"use strict";
	debugger;
	Wrm = function () { };
}

Wrm.Address = function (executionContext) {
	"use strict";
	var onLoad = function (executionContext) {
		let formContext = executionContext.getFormContext();
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_phonecountryid", "wrmb_telephone1", formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_mobilephone1countryid", "wrmb_mobilephone1", formContext);
		Wrm.Common.SetPhoneNumberCountryOnChangeV2("wrmb_faxcountryid", "wrmb_fax1", formContext);

		Wrm.Common.SetAddressCountryOnChangeV2("wrmb_countryid",
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
		console.log(Wrm.Common.SetAddressCountryOnChangeV2("wrmb_countryid",
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