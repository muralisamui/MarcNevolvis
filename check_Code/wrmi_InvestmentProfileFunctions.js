if (!this.Wrm){
	Wrm = function () {};
}

Wrm.InvestmentProfile = function () {
    var onLoad = function (executionContext) {
        let formContext = executionContext.getFormContext();
		if(formContext.ui.getFormType() === 2){
			formContext.getControl("wrmi_profiletemplateid").setDisabled(true);
			if(Wrm.Common.IsLockTimeoutReachedV2()){
				Wrm.Common.DisableAllControlsOnFormV2(formContext);
				formContext.ui.setFormNotification('This record is locked because editing timeout is reached!', 'INFO', 'invprofile_NOTIFY');
			}
		}
		
		if(formContext.ui.getFormType() == 1){
			if (formContext.getAttribute("wrmi_date") !== null)
			{
				formContext.getAttribute("wrmi_date").setValue(new Date());
			}
		}
    };
	
    var isReadOnly = function () {
		if(Wrm.Common.IsLockTimeoutReachedV2() || formContext.ui.getFormType() === 3 || formContext.ui.getFormType() === 4 || formContext.ui.getFormType() === 5 || formContext.ui.getFormType() === 6){
			return true;
		}
		return false;
    };

    return {
        OnLoad: onLoad,
        IsReadOnly: isReadOnly
    };
} ();