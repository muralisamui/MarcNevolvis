if (!this.Wrm){
	Wrm = function () {};
}

Wrm.RelatedDocument = function () {
    var onLoad = function () {
		if(Xrm.Page.getAttribute("wrmb_typeid") != null){
			Xrm.Page.getAttribute("wrmb_typeid").addOnChange(Wrm.RelatedDocument.OnChangeType);
		}
    };

    var onChangeType = function () {
		if(Xrm.Page.getAttribute("wrmb_subtypeid").getValue() != null)
		{
			Xrm.Page.getAttribute("wrmb_subtypeid").setValue(null);
			Xrm.Page.getAttribute("wrmb_subtypeid").setSubmitMode("always");
		}
    };
	
    return {
        OnLoad: onLoad,
		OnChangeType: onChangeType
    };
} ();
