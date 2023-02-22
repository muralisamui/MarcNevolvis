if (!this.Wrm){
	Wrm = function () {};
}

Wrm.PortfolioRelationship = function () {
    var onLoad = function () {
		if(Xrm.Page.ui.getFormType() == 1 || Xrm.Page.ui.getFormType() == 2){
			Xrm.Page.getControl("wrmb_contactid").setDisabled(true);
			Xrm.Page.getControl("wrmb_companyid").setDisabled(true);
			Xrm.Page.getControl("wrmb_portfolioid").setDisabled(true);
			Xrm.Page.getControl("wrmb_portfoliorelationshiptypeid").setDisabled(true);
		}
    };
	
    var onChangeContact = function () {
		if(Xrm.Page.getAttribute("wrmb_contactid").getValue() != null){
			Xrm.Page.getAttribute("wrmb_companyid").setValue(null);
			Xrm.Page.getAttribute("wrmb_companyid").setSubmitMode("always"); 
			Xrm.Page.getControl("wrmb_companyid").setDisabled(true);
		}else{
			Xrm.Page.getControl("wrmb_companyid").setDisabled(false);
		}
    };
	
    var onChangeCompany = function () {
		if(Xrm.Page.getAttribute("wrmb_companyid").getValue() != null){
			Xrm.Page.getAttribute("wrmb_contactid").setValue(null);
			Xrm.Page.getAttribute("wrmb_contactid").setSubmitMode("always"); 
			Xrm.Page.getControl("wrmb_contactid").setDisabled(true);
		}else{
			Xrm.Page.getControl("wrmb_contactid").setDisabled(false);
		}
    };

    return {
        OnLoad: onLoad,
        OnChangeContact: onChangeContact,
        OnChangeCompany: onChangeCompany
    };
} ();