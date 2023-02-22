if (!this.Wrm){
	Wrm = function () {};
}

Wrm.CallVisitProtocol = function () {
    var onLoad = function () {
		if(Xrm.Page.getAttribute("wrmb_typeid") != null){
			Xrm.Page.getAttribute("wrmb_typeid").addOnChange(Wrm.CallVisitProtocol.OnChangeType);
		}
		if(Xrm.Page.getAttribute("wrmb_date") != null && Xrm.Page.getAttribute("wrmb_date").getValue() == null){
			var d = new Date();
			d.setHours(0,0,0,0);
			Xrm.Page.getAttribute("wrmb_date").setValue(d);
		}
		
		if(Xrm.Page.ui.getFormType() == 1){
			var qVariables = Xrm.Page.context.getQueryStringParameters();
			if(qVariables["_CreateFromId"] != undefined && qVariables["_CreateFromType"] != undefined){
				Xrm.Page.getAttribute("wrmb_createfromid").setValue(qVariables["_CreateFromId"].toString());
				Xrm.Page.getAttribute("wrmb_createfromtype").setValue(qVariables["_CreateFromType"].toString());
			}
			
		}
		if(Xrm.Page.ui.getFormType() == 2){
			if(Xrm.Page.getAttribute("statuscode") != null && Xrm.Page.getAttribute("statuscode").getValue() == 986640000){
				Wrm.Common.DisableAllControlsOnForm();
			}
		}
    };
	
    var onChangeType = function () {
			if(Xrm.Page.getAttribute("wrmb_typeid").getValue() != null && Xrm.Page.getAttribute("wrmb_description").getValue() == null){
				var TemplateValue = "";
				// Check for system
				XrmServiceToolkit.Rest.RetrieveMultiple(
					"wrmb_callvisittypeSet",
					"$select=wrmb_callvisittypeId, wrmb_name, wrmb_template&$filter=(wrmb_callvisittypeId eq (guid'" + Xrm.Page.getAttribute("wrmb_typeid").getValue()[0].id + "'))",
					function (results) {
						if(results != null && results.length > 0){
							TemplateValue = results[0].wrmb_template;
						}
					},
					function (error) {
						//equal(true, false, error.message);
						alert(error.message);
					},
					function onComplete() {},
					false
				);
				Xrm.Page.getAttribute("wrmb_description").setValue(TemplateValue);
			}
    };
	
    var completeReport = function () {
		if(Xrm.Page.data.getIsValid()){
			// set to completed
			Xrm.Page.getAttribute("statuscode").setValue(986640000);
			Xrm.Page.data.save();
			Xrm.Page.ui.clearFormNotification('complete_NOTIFY'); 
			Wrm.Common.DisableAllControlsOnForm();
		}else{
			Xrm.Page.ui.setFormNotification('Please save the record in a valid state before completing.', 'WARNING', 'complete_NOTIFY');
		}
    };

    return {
        OnLoad: onLoad,
		OnChangeType: onChangeType,
		CompleteReport: completeReport
    };
} ();