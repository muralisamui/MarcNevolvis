if (!this.Wrm){
    "use strict";
	Wrm = function () {};
}

Wrm.CashAccount = function () {
    "use strict";
    var onLoad = function (executionContext) {
        "use strict";
        var formContext = executionContext.getFormContext();
        if(Wrm.CashAccount.IsInterfaceSyncronized(executionContext)){
			Wrm.Common.DisableAllControlsOnFormV2(formContext); //function defined in wrmb_BaseFunction
		}
    };
	
    var isInterfaceSyncronized = function (executionContext) {
        "use strict";
        var formContext = executionContext.getFormContext();
        var SyncValue = formContext.getAttribute("wrmb_isinterfacesynchronized").getValue();
		if(SyncValue === null || SyncValue === false){
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