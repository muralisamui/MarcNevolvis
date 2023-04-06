if (!this.Wrm) {
	'use strict';
	Wrm = function () { };
}

Wrm.RiskSummaryApproval = function () {
	var onLoad = async function (executionContext) {
		'use strict';
		let formContext = executionContext.getFormContext();
		if (formContext.ui.getFormType() === 1) {
			// formContext.getAttribute("wrmr_advisordate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);
			// formContext.getAttribute("wrmr_compliancedate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);
			// formContext.getAttribute("wrmr_mgmtdate").addOnChange(Wrm.RiskSummaryApproval.CheckProcess);

			if (formContext.getAttribute("wrmr_advisordate") !== null && formContext.getAttribute("wrmr_advisordate").getValue() === null) {
				var d = new Date();
				d.setHours(0, 0, 0, 0);
				formContext.getAttribute("wrmr_advisordate").setValue(d);
			}
		}

		if (formContext.ui.getFormType() === 2) {
			if (formContext.getAttribute("statuscode") !== null) {
				if (formContext.getAttribute("statuscode").getValue() === 320560000 || formContext.getAttribute("statuscode").getValue() === 320560001) // Approved || Rejected
				{
					formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					if (formContext.getAttribute('wrmr_mgmtdate') !== null && formContext.getAttribute('wrmr_mgmtdate').getValue() !== null) {
						formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(true);
					}

					//Check for lockTimeout
					let isComplianceTimeOutReached = await Wrm.Common.IsLockTimeoutReachedV2('wrmr_compliancedate', formContext)
					let isMgmTimeOutReached = await Wrm.Common.IsLockTimeoutReachedV2('wrmr_mgmtdate', formContext)

					if (isComplianceTimeOutReached === true && isMgmTimeOutReached === true) {
						Wrm.Common.DisableAllControlsOnFormV2(formContext);
					}
				}
				else if (formContext.getAttribute("statuscode").getValue() === 1) // Requested (Compliance)
				{
					formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(false);
					Wrm.RiskSummaryApproval.ClearEmptyYesNoFields(formContext);
				}
				else if (formContext.getAttribute("statuscode").getValue() === 320560002) // Requested (Management)
				{
					formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_compliance").setVisible(true);
					formContext.ui.tabs.get("wrmb_tab_rsa_general").sections.get("wrmr_section_mgmt").setVisible(true);
					Wrm.RiskSummaryApproval.ClearEmptyYesNoFields(formContext);
				}
			}
		}
	};

	var clearEmptyYesNoFields = function (formContext) {
		if (formContext.getAttribute("wrmr_compliancedate") !== null && formContext.getAttribute("wrmr_compliancedate").getValue() === null) {
			if (formContext.getAttribute("wrmr_compliancebusrelshipcomplete") !== null) {
				formContext.getAttribute("wrmr_compliancebusrelshipcomplete").setValue();
			}

			if (formContext.getAttribute("wrmr_compliancebusrelshipapproved") !== null) {
				formContext.getAttribute("wrmr_compliancebusrelshipapproved").setValue();

				if (formContext.getAttribute("wrmr_compliancecommentapproved") !== null) {
					formContext.getAttribute("wrmr_compliancecommentapproved").setRequiredLevel("none");
				}
			}
		}

		if (formContext.getAttribute("wrmr_mgmtdate") !== null && formContext.getAttribute("wrmr_mgmtdate").getValue() === null) {
			if (formContext.getAttribute("wrmr_mgmtbusrelationshipapproved") !== null) {
				formContext.getAttribute("wrmr_mgmtbusrelationshipapproved").setValue();
			}
		}
	};

	return {
		OnLoad: onLoad,
		ClearEmptyYesNoFields: clearEmptyYesNoFields
	};
}();
