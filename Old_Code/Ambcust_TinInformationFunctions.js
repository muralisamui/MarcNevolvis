var Ambit = Ambit || {};
Ambit.MAH = Ambit.MAH || {};
Ambit.MAH.WRM2013 = Ambit.MAH.WRM2013 || {};
Ambit.MAH.WRM2013.JS = Ambit.MAH.WRM2013.JS || {};
Ambit.MAH.WRM2013.JS.TinInformationFunctions = {
	OnLoad: function (executionContext)
	{
		var formContext = executionContext.getFormContext();
		if (formContext.ui.getFormType() === 1)
		{
			Ambit.MAH.WRM2013.JS.TinInformationFunctions.addOnChangeFunctions();
			Ambit.MAH.WRM2013.JS.TinInformationFunctions.setCompanyContactAsMandatory();
			
			Ambit.MAH.WRM2013.JS.TinInformationFunctions.clearCompanyDefaultValues();
		}
	},
	clearCompanyDefaultValues: function (executionContext)
	{
		var formContext = executionContext.getFormContext();
		if (formContext.getAttribute("ambcust_ficompany").getValue() !== null)
		{
			formContext.getAttribute("ambcust_ficompany").setValue(null);
		}
		if (formContext.getAttribute("ambcust_finahcompany").getValue() !== null)
		{
			formContext.getAttribute("ambcust_finahcompany").setValue(null);
		}
	},
	addOnChangeFunctions: function ()
	{
		Ambit.MAH.WRM2013.JS.TinInformationFunctions.AddOnChangeFunctionToAttribute("ambcust_companyid", Ambit.MAH.WRM2013.JS.TinInformationFunctions.setCompanyContactAsMandatory);
		Ambit.MAH.WRM2013.JS.TinInformationFunctions.AddOnChangeFunctionToAttribute("ambcust_contactid", Ambit.MAH.WRM2013.JS.TinInformationFunctions.setCompanyContactAsMandatory);
	},
	AddOnChangeFunctionToAttribute: function (executionContext, fieldname, functionname)
	{
		var formContext = executionContext.getFormContext();
		if (fieldname !== null && functionname !== null)
		{
			if (formContext.getAttribute(fieldname))
			{
				formContext.getAttribute(fieldname).addOnChange(functionname);
			}
		}
	},
	SetOneOfTwoFieldsMandatory: function (executionContext, fieldname1, fieldname2, onlyonefield)
	{
		var formContext = executionContext.getFormContext();
		if (formContext.getAttribute(fieldname1) && formContext.getAttribute(fieldname2))
		{
			Ambit.MAH.WRM2013.JS.TinInformationFunctions.setAttributeRequired(fieldname1, false);
			Ambit.MAH.WRM2013.JS.TinInformationFunctions.setAttributeRequired(fieldname2, false);
			var Value1 = formContext.getAttribute(fieldname1).getValue();
			var Value2 = formContext.getAttribute(fieldname2).getValue();
			if (Value1 === null && Value2 === null)
			{
				Ambit.MAH.WRM2013.JS.TinInformationFunctions.setAttributeRequired(fieldname1, true);
				Ambit.MAH.WRM2013.JS.TinInformationFunctions.setAttributeRequired(fieldname2, true);
				Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname1, false);
				Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname2, false);
			}
			if (onlyonefield === true)
			{
				if (Value1 === null && Value2 !== null)
				{
					Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname1, true);
					Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname2, false);
				}
				if (Value1 !== null && Value2 === null)
				{
					Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname1, false);
					Ambit.MAH.WRM2013.JS.TinInformationFunctions.setControlDisabled(fieldname2, true);
				}
			}
		}
	},
	findControl: function (executionContext, fieldname, checkonlybody)
	{
		var formContext = executionContext.getFormContext();
		if (formContext.getControl(fieldname) !== null)
		{
			return formContext.getControl(fieldname);
		}
		if (checkonlybody === false)
		{
			if (formContext.getControl("header_" + fieldname) !== null)
			{
				return formContext.getControl("header_" + fieldname);
			}
			if (Xrm.Page.getControl("footer_" + fieldname) !== null)
			{
				return Xrm.Page.getControl("footer_" + fieldname);
			}
		}
		return null;
	},
	setControlDisabled: function (fieldname, SetDisabled)
	{
		var control = Ambit.MAH.WRM2013.JS.TinInformationFunctions.findControl(fieldname, false);
		if (control !== null)
		{
			control.setDisabled(SetDisabled);
		}
	},
	setAttributeRequired: function (executionContext, fieldname, SetRequired)
	{
		var formContext = executionContext.getFormContext();
		var attr = formContext.getAttribute(fieldname);
		if (attr !== null)
		{
			if (SetRequired === true)
			{
				attr.setRequiredLevel("required");
			}
			if (SetRequired === false)
			{
				attr.setRequiredLevel("none");
			}
		}
	},
	setCompanyContactAsMandatory: function ()
	{
		Ambit.MAH.WRM2013.JS.TinInformationFunctions.SetOneOfTwoFieldsMandatory("ambcust_companyid", "ambcust_contactid", true);
	}
};