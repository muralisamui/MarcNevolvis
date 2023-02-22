if (!this.Wrm){
    "strict mode";
	debugger;
	Wrm = function () {};
}

Wrm.PortfolioRelationship = function (executionContext) {
    "strict mode";
	debugger;
    var onLoad = function (executionContext) {
		debugger;


        let formContext = executionContext.getFormContext();
		debugger;

		if(formContext.ui.getFormType() === 1 || formContext.ui.getFormType() === 2){
			formContext.getControl("wrmb_contactid").setDisabled(true);
			formContext.getControl("wrmb_companyid").setDisabled(true);
			formContext.getControl("wrmb_portfolioid").setDisabled(true);
			formContext.getControl("wrmb_portfoliorelationshiptypeid").setDisabled(true);
		}
    };
	
    var onChangeContact = function (executionContext) {
        "strict mode";
		debugger;

        let formContext = executionContext.getFormContext();

		if(formContext.getAttribute("wrmb_contactid").getValue() !== null){
			formContext.getAttribute("wrmb_companyid").setValue(null);
			formContext.getAttribute("wrmb_companyid").setSubmitMode("always"); 
			formContext.getControl("wrmb_companyid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_companyid").setDisabled(false);
		}
    };
	
    var onChangeCompany = function (executionContext) {
        "strict mode";
		debugger;

        let formContext = executionContext.getFormContext();
		debugger;
 
		if(formContext.getAttribute("wrmb_companyid").getValue() !== null){
			formContext.getAttribute("wrmb_contactid").setValue(null);
			formContext.getAttribute("wrmb_contactid").setSubmitMode("always"); 
			formContext.getControl("wrmb_contactid").setDisabled(true);
		}else{
			formContext.getControl("wrmb_contactid").setDisabled(false);
		}
    };

    return {
        OnLoad: onLoad,
        OnChangeContact: onChangeContact,
        OnChangeCompany: onChangeCompany
    };
} ();