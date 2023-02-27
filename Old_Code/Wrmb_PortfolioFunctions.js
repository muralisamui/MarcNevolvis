if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Portfolio = function () {
    var onLoad = function () {
        /*if(Wrm.Portfolio.IsInterfaceSyncronized()){
			Wrm.Common.DisableAllControlsOnForm();
		}
		
		if(!Wrm.Common.IsPortfolioNetEnabled()){
			Wrm.Portfolio.HidePortfolioNetComponents();
		}*/
    };
	
	var hidePortfolioNetComponents = function () {
		// tbd
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
        OnLoad: onLoad,
        HidePortfolioNetComponents: hidePortfolioNetComponents
    };
} ();