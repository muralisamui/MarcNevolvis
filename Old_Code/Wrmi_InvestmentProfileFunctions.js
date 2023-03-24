if (!this.Wrm){
	Wrm = function () {};
}

Wrm.InvestmentProfile = function () {
    var onLoad = function () {
		if(Xrm.Page.ui.getFormType() == 2){
			Xrm.Page.getControl("wrmi_profiletemplateid").setDisabled(true);
			if(Wrm.Common.IsLockTimeoutReached()){
				Wrm.Common.DisableAllControlsOnForm();
				Xrm.Page.ui.setFormNotification('This record is locked because editing timeout is reached!', 'INFO', 'invprofile_NOTIFY');
			}
		}
		
		if(Xrm.Page.ui.getFormType() == 1){
			if (Xrm.Page.getAttribute("wrmi_date") != null)
			{
				Xrm.Page.getAttribute("wrmi_date").setValue(new Date());
			}
		}
    };
	
    var isReadOnly = function () {
		if(Wrm.Common.IsLockTimeoutReached() || Xrm.Page.ui.getFormType() == 3 || Xrm.Page.ui.getFormType() == 4 || Xrm.Page.ui.getFormType() == 5 || Xrm.Page.ui.getFormType() == 6){
			return true;
		}
		
		return false;
    };

    return {
        OnLoad: onLoad,
        IsReadOnly: isReadOnly
    };
} ();
