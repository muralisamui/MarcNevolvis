if (!this.Wrm){
	"use strict";
	Wrm = function () {};
}

Wrm.RelatedDocument = function (executionContext) {
	"use strict";
    var onLoad = function (executionContext) {
        let formContext = executionContext.getFormContext();
		"use strict";
		if(formContext.getAttribute("wrmb_typeid") !== null){
			formContext.getAttribute("wrmb_typeid").addOnChange(Wrm.RelatedDocument.OnChangeType);
		}
    };

    var onChangeType = function (executionContext) {
		"use strict";
		var formContext = executionContext.getFormContext();
		if(formContext.getAttribute("wrmb_subtypeid").getValue() !== null)
		{
			formContext.getAttribute("wrmb_subtypeid").setValue(null);
			formContext.getAttribute("wrmb_subtypeid").setSubmitMode("always");
		}
    };
	
    return {
        OnLoad: onLoad,
		OnChangeType: onChangeType
    };
} ();
