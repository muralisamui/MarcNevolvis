if (!this.Wrm){
	Wrm = function () {};
}

Wrm.CompanyRelationship = function () {
    var onLoad = function () {
		if(Xrm.Page.ui.getFormType() == 1 || Xrm.Page.ui.getFormType() == 2){
			Wrm.CompanyRelationship.OnChangeContact();
			Wrm.CompanyRelationship.OnChangeCompany();
			Wrm.CompanyRelationship.OnChangeParentContact();
			Wrm.CompanyRelationship.OnChangeParentCompany();
			
			Xrm.Page.getAttribute("wrmb_contactid").addOnChange(Wrm.CompanyRelationship.OnChangeContact);
			Xrm.Page.getAttribute("wrmb_companyid").addOnChange(Wrm.CompanyRelationship.OnChangeCompany);
			Xrm.Page.getAttribute("wrmb_parentcontactid").addOnChange(Wrm.CompanyRelationship.OnChangeParentContact);
			Xrm.Page.getAttribute("wrmb_parentcompanyid").addOnChange(Wrm.CompanyRelationship.OnChangeParentCompany);
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
	
    var onChangeParentContact = function () {
		if(Xrm.Page.getAttribute("wrmb_parentcontactid").getValue() != null){
			Xrm.Page.getAttribute("wrmb_parentcompanyid").setValue(null);
			Xrm.Page.getAttribute("wrmb_parentcompanyid").setSubmitMode("always"); 
			Xrm.Page.getControl("wrmb_parentcompanyid").setDisabled(true);
		}else{
			Xrm.Page.getControl("wrmb_parentcompanyid").setDisabled(false);
		}
    };
	
    var onChangeParentCompany = function () {
		if(Xrm.Page.getAttribute("wrmb_parentcompanyid").getValue() != null){
			Xrm.Page.getAttribute("wrmb_parentcontactid").setValue(null);
			Xrm.Page.getAttribute("wrmb_parentcontactid").setSubmitMode("always"); 
			Xrm.Page.getControl("wrmb_parentcontactid").setDisabled(true);
		}else{
			Xrm.Page.getControl("wrmb_parentcontactid").setDisabled(false);
		}
    };

    return {
        OnLoad: onLoad,
        OnChangeContact: onChangeContact,
        OnChangeCompany: onChangeCompany,
        OnChangeParentContact: onChangeParentContact,
        OnChangeParentCompany: onChangeParentCompany
    };
} ();