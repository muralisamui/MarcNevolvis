var Ambit = Ambit || {};
Ambit.WRM = {};
Ambit.WRM.CRM2013 = {};
Ambit.WRM.CRM2013.JS = {};
Ambit.WRM.CRM2013.JS.FtiResultFunctions = {

	OnLoad: function ()
	{
		Ambit.WRM.CRM2013.JS.FtiResultFunctions.setFieldRequirement();
		Ambit.WRM.CRM2013.JS.FtiResultFunctions.onChangeFunctions();
	},
	onChangeFunctions: function ()
	{
		if (Xrm.Page.getAttribute("wrmf_complianceofficerindicated") != null)
		{
			Xrm.Page.getAttribute("wrmf_complianceofficerindicated").addOnChange(Ambit.WRM.CRM2013.JS.FtiResultFunctions.setFieldRequirement);
		}
	},
	setFieldRequirement: function ()
	{
		if (Xrm.Page.getAttribute("wrmf_complianceofficerindicated").getValue() != Xrm.Page.getAttribute("wrmf_engineindicated").getValue())
		{
			Xrm.Page.getAttribute("wrmf_complianceofficercomment").setRequiredLevel("required");
		}
		else
		{
			Xrm.Page.getAttribute("wrmf_complianceofficercomment").setRequiredLevel("none");
		}
	}
};