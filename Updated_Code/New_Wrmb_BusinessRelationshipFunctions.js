if (!this.Wrm){
	Wrm = function () {};
}

Wrm.BusinessRelationship = function (executionContext) {
    var onLoad = function (executionContext) {
		var formContext = executionContext.getFormContext();
		if (formContext.ui.getFormType() === 1 || formContext.ui.getFormType() === 2){
			formContext.getControl("wrmb_party1_contactid").setDisabled(true);
			formContext.getControl("wrmb_party2_contactid").setDisabled(true);
			formContext.getControl("wrmb_party1_companyid").setDisabled(true);
			formContext.getControl("wrmb_party2_companyid").setDisabled(true);
			formContext.getControl("wrmb_party1_businessrelationshiptypeid").setDisabled(true);
			formContext.getControl("wrmb_party2_businessrelationshiptypeid").setDisabled(true);
		}
    };
	
    var onChangeParty2Contact = function (executionContext) {
		var formContext = executionContext.getFormContext();
		if(formContext.getAttribute("wrmb_party2_contactid").getValue() !== null){
			formContext.getAttribute("wrmb_party2_companyid").setValue(null);
			formContext.getAttribute("wrmb_party2_companyid").setSubmitMode("always"); 
			formContext.getControl("wrmb_party2_companyid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_party2_companyid").setDisabled(false);
		}
    };
	
    var onChangeParty2Company = function (executionContext) {
		var formContext = executionContext.getFormContext();
		if(formContext.getAttribute("wrmb_party2_companyid").getValue() !== null){
			formContext.getAttribute("wrmb_party2_contactid").setValue(null);
			formContext.getAttribute("wrmb_party2_contactid").setSubmitMode("always"); 
			formContext.getControl("wrmb_party2_contactid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_party2_contactid").setDisabled(false);
		}
    };
	
    var onChangeParty1Contact = function (executionContext) {
		var formContext = executionContext.getFormContext();
		if(formContext.getAttribute("wrmb_party1_contactid").getValue() !== null){
			formContext.getAttribute("wrmb_party1_companyid").setValue(null);
			formContext.getAttribute("wrmb_party1_companyid").setSubmitMode("always"); 
			formContext.getControl("wrmb_party1_companyid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_party1_companyid").setDisabled(false);
		}
    };
	
    var onChangeParty1Company = function (executionContext) {
		var formContext = executionContext.getFormContext();
		if(formContext.getAttribute("wrmb_party1_companyid").getValue() !== null){
			formContext.getAttribute("wrmb_party1_contactid").setValue(null);
			formContext.getAttribute("wrmb_party1_contactid").setSubmitMode("always"); 
			formContext.getControl("wrmb_party1_contactid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_party1_contactid").setDisabled(false);
		}
    };
	
    return {
        OnLoad: onLoad,
        OnChangeParty2Contact: onChangeParty2Contact,
        OnChangeParty2Company: onChangeParty2Company,
        OnChangeParty1Contact: onChangeParty1Contact,
        OnChangeParty1Company: onChangeParty1Company
    };
} ();