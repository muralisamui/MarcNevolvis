if (!this.Wrm){
	Wrm = function () {};
}

Wrm.CashAccount = function () {
    var onLoad = function () {
        if(Wrm.CashAccount.IsInterfaceSyncronized()){
			Wrm.Common.DisableAllControlsOnForm();
		}
    };
	
    var isInterfaceSyncronized = function () {
        var SyncValue = Xrm.Page.getAttribute("wrmb_isinterfacesynchronized").getValue();
		if(SyncValue == null || SyncValue == false){
			return false;
		}else{
			return true;
		}
    };

    return {
        IsInterfaceSyncronized: isInterfaceSyncronized,
        OnLoad: onLoad
    };
} ();