if (!this.Mah){
	Mah = function () {};
}

Mah.RsaSplitDetail = function () {
	var onLoad = function () {
		if (Xrm.Page.getAttribute("ambcust_userid") != null &&
		Xrm.Page.getAttribute("ambcust_ambassadorid") != null &&
		Xrm.Page.getAttribute("ambcust_locationid") != null)
		{
			Xrm.Page.getAttribute("ambcust_userid").addOnChange(Mah.RsaSplitDetail.OnlyOneLookupAllowed);
			Xrm.Page.getAttribute("ambcust_ambassadorid").addOnChange(Mah.RsaSplitDetail.OnlyOneLookupAllowed);
			Xrm.Page.getAttribute("ambcust_locationid").addOnChange(Mah.RsaSplitDetail.OnlyOneLookupAllowed);
			Mah.RsaSplitDetail.OnlyOneLookupAllowed();
		}
		
		if (Xrm.Page.getAttribute("ambcust_rsasplitid") != null)
		{
			Xrm.Page.getAttribute("ambcust_rsasplitid").addOnChange(Mah.RsaSplitDetail.RsaSplitIsRequired);
			Mah.RsaSplitDetail.RsaSplitIsRequired();
		}
	};
	
	var rsaSplitIsRequired = function () {
		var rsasplit = Xrm.Page.getAttribute("ambcust_rsasplitid").getValue();
		
		if (rsasplit == null)
		{
			Xrm.Page.getAttribute("ambcust_rsasplitid").setRequiredLevel("required");
			Xrm.Page.getControl("ambcust_rsasplitid").setDisabled(false);
		}
		else
		{
			if (Xrm.Page.ui.getFormType() != 1)
			{
				Xrm.Page.getControl("ambcust_rsasplitid").setDisabled(true);
			}
		}
	};
	
	var onlyOneLookupAllowed = function () {
		var user = Xrm.Page.getAttribute("ambcust_userid").getValue();
		var ambassador = Xrm.Page.getAttribute("ambcust_ambassadorid").getValue();
		var location = Xrm.Page.getAttribute("ambcust_locationid").getValue();
		
		if (user == null && ambassador == null && location == null)
		{
			Xrm.Page.getAttribute("ambcust_userid").setRequiredLevel("required");
			Xrm.Page.getAttribute("ambcust_ambassadorid").setRequiredLevel("required");
			Xrm.Page.getAttribute("ambcust_locationid").setRequiredLevel("required");
		}
		else
		{
			Xrm.Page.getAttribute("ambcust_userid").setRequiredLevel("none");
			Xrm.Page.getAttribute("ambcust_ambassadorid").setRequiredLevel("none");
			Xrm.Page.getAttribute("ambcust_locationid").setRequiredLevel("none");
		}
		
		if (user == null && ambassador == null && location != null)
		{
			Xrm.Page.getControl("ambcust_locationid").setDisabled(false);
			Xrm.Page.getControl("ambcust_userid").setDisabled(true);
			Xrm.Page.getControl("ambcust_ambassadorid").setDisabled(true);
			Xrm.Page.getAttribute("ambcust_userid").setSubmitMode("always");
			Xrm.Page.getAttribute("ambcust_ambassadorid").setSubmitMode("always");
		}
		else if (user == null && ambassador != null && location == null)
		{
			Xrm.Page.getControl("ambcust_ambassadorid").setDisabled(false);
			Xrm.Page.getControl("ambcust_userid").setDisabled(true);
			Xrm.Page.getControl("ambcust_locationid").setDisabled(true);
			Xrm.Page.getAttribute("ambcust_userid").setSubmitMode("always");
			Xrm.Page.getAttribute("ambcust_locationid").setSubmitMode("always");
		}
		else if (user != null && ambassador == null && location == null)
		{
			Xrm.Page.getControl("ambcust_userid").setDisabled(false);
			Xrm.Page.getControl("ambcust_ambassadorid").setDisabled(true);
			Xrm.Page.getControl("ambcust_locationid").setDisabled(true);
			Xrm.Page.getAttribute("ambcust_ambassadorid").setSubmitMode("always");
			Xrm.Page.getAttribute("ambcust_locationid").setSubmitMode("always");
		}
		else
		{
			Xrm.Page.getControl("ambcust_userid").setDisabled(false);
			Xrm.Page.getControl("ambcust_ambassadorid").setDisabled(false);
			Xrm.Page.getControl("ambcust_locationid").setDisabled(false);
		}
	};
	
    return {
        OnLoad: onLoad,
        OnlyOneLookupAllowed: onlyOneLookupAllowed,
        RsaSplitIsRequired: rsaSplitIsRequired
    };
} ();