if (!this.Wrm) {
	"use strict";
	debugger;
	Wrm = function () { };
}

Wrm.CallVisitProtocol = function (executionContext) {
	"use strict";
	debugger;
	var onLoad = function (executionContext) {
		"use strict";
		debugger;
		let formContext = executionContext.getFormContext();
		
		if (formContext.getAttribute("wrmb_typeid") !== null) {
			formContext.getAttribute("wrmb_typeid").addOnChange(Wrm.CallVisitProtocol.OnChangeType);
		}
		if (formContext.getAttribute("wrmb_date") !== null && formContext.getAttribute("wrmb_date").getValue() === null) {
			var d = new Date();
			d.setHours(0, 0, 0, 0);
			formContext.getAttribute("wrmb_date").setValue(d);
		}

		if (formContext.ui.getFormType() === 1) {
			var qVariables = formContext.context.getQueryStringParameters();
			if (qVariables["_CreateFromId"] !== undefined && qVariables["_CreateFromType"] !== undefined) {
				formContext.getAttribute("wrmb_createfromid").setValue(qVariables["_CreateFromId"].toString());
				formContext.getAttribute("wrmb_createfromtype").setValue(qVariables["_CreateFromType"].toString());
			}

		}
		if (formContext.ui.getFormType() === 2) {
			if (formContext.getAttribute("statuscode") !== null && formContext.getAttribute("statuscode").getValue() === 986640000) {
				Wrm.Common.DisableAllControlsOnFormV2();
				console.log(Wrm.Common.DisableAllControlsOnFormV2(formContext));
			}
		}
	};

	var onChangeType = function (executionContext) {
		"use strict";
		debugger;
		let formContext = executionContext.getFormContext();

		if (formContext.getAttribute("wrmb_typeid").getValue() !== null && formContext.getAttribute("wrmb_description").getValue() === null) {
			var TemplateValue = "";
			// Check for system
			XrmServiceToolkit.Rest.RetrieveMultiple(
				"wrmb_callvisittypeSet",
				"$select=wrmb_callvisittypeId, wrmb_name, wrmb_template&$filter=(wrmb_callvisittypeId eq (guid'" + formContext.getAttribute("wrmb_typeid").getValue()[0].id + "'))",
				function (results) {
					if (results !== null && results.length > 0) {
						TemplateValue = results[0].wrmb_template;
					}
				},
				function (error) {
					//equal(true, false, error.message);
					alert(error.message);
				},
				function onComplete() { },
				false
			);
			formContext.getAttribute("wrmb_description").setValue(TemplateValue);
		}
	};
	// var onChangeType = function(executionContext) {
	// 	"use strict";
	// 	debugger;
	// 	let formContext = executionContext.getFormContext();
	// 	let typeId = formContext.getAttribute("wrmb_typeid").getValue();
	
	// 	if (typeId !== null && formContext.getAttribute("wrmb_description").getValue() === null) {
	// 		let query = "?$select=wrmb_template&$filter=wrmb_callvisittypeId eq " + typeId[0].id;
			
	// 		Xrm.WebApi.retrieveMultipleRecords("wrmb_callvisittype", query).then(
	// 			function success(results) {
	// 				if (results !== null && results.entities.length > 0) {
	// 					let templateValue = results.entities[0].wrmb_template;
	// 					formContext.getAttribute("wrmb_description").setValue(templateValue);
	// 				}
	// 			},
	// 			function(error) {
	// 				alert(error.message);
	// 			}
	// 		);
	// 	}
	// };
	

	var completeReport = function (executionContext) {
		"use strict";
		debugger;
		let formContext = executionContext.getFormContext();

		if (formContext.data.getIsValid()) {
			// set to completed
			formContext.getAttribute("statuscode").setValue(986640000);
			formContext.data.save();
			formContext.ui.clearFormNotification('complete_NOTIFY');
			Wrm.Common.DisableAllControlsOnFormV2(formContext);
			console.log(Wrm.Common.DisableAllControlsOnFormV2(formContext));
		} else {
			formContext.ui.setFormNotification('Please save the record in a valid state before completing.', 'WARNING', 'complete_NOTIFY');
		}
	};

	return {
		OnLoad: onLoad,
		OnChangeType: onChangeType,
		CompleteReport: completeReport
	};
}();
