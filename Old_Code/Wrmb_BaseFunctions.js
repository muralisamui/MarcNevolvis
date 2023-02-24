if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Common = function () {
	var getWrmSetting = function(SettingKey, callback) {
		var SettingValue = "";
        var async = !!callback;
		// Check for system
		XrmServiceToolkit.Rest.RetrieveMultiple(
			"wrmb_wrmsettingSet",
			"$select=wrmb_wrmsettingId, wrmb_name, wrmb_value&$filter=(wrmb_name eq '" + SettingKey + "' and statecode/Value eq 0)",
			function (results) {
				SettingValue = "";
				if(results != null && results.length > 0){
					SettingValue = results[0].wrmb_value;
				}
				
				if (async)
					callback(SettingValue);
			},
			function (error) {
				//equal(true, false, error.message);
				alert(error.message);
			},
			function onComplete() {},
			async
		);
		
		if (!async){
			return SettingValue;
		}
	};
	
    var isPortfolioNetEnabled = function () {
		var EnabledReturn = false;
		
		// Check for system
		XrmServiceToolkit.Rest.RetrieveMultiple(
			"wrmb_wrmsettingSet",
			"$select=wrmb_wrmsettingId, wrmb_name, wrmb_value&$filter=(wrmb_name eq 'WRM.PortfolioSystem') and (wrmb_value eq 'PortfolioNet')",
			function (results) {
				if(results != null && results.length > 0){
					// Check for customernumber
					XrmServiceToolkit.Rest.RetrieveMultiple(
						"wrmb_wrmsettingSet",
						"$select=wrmb_wrmsettingId, wrmb_name, wrmb_value&$filter=(wrmb_name eq 'WRM.PortfolioSystem.CustomerNumber') and (wrmb_value ne null)",
						function (results) {
							if(results != null && results.length > 0){
								EnabledReturn = true;
							}else{
								EnabledReturn = false;
							}
						},
						function (error) {
							//equal(true, false, error.message);
							alert(error.message);
							EnabledReturn = false;
						},
						function onComplete() {},
						false
					);
				}else{
					EnabledReturn = false;
				}
			},
			function (error) {
				//equal(true, false, error.message);
				alert(error.message);
				EnabledReturn = false;
			},
			function onComplete() {},
			false
		);
		
		return EnabledReturn;
    };
	
    var disableAllControlsOnForm = function () {
		var allAttributes = Xrm.Page.data.entity.attributes.get();
		for (var i in allAttributes) {
			var myattribute = Xrm.Page.data.entity.attributes.get(allAttributes[i].getName());
			var myname = myattribute.getName();  
			if(myname == "statecode" || Xrm.Page.getControl(myname) == null)
				continue;
				
			Xrm.Page.getControl(myname).setDisabled(true); 
		}
    };
	
	var lockFormOnRecordLockTimeoutReached = function (DateTimeFieldName) {
		DateTimeFieldName = typeof DateTimeFieldName !== 'undefined' ? DateTimeFieldName : 'createdon';
		if(Wrm.Common.IsLockTimeoutReached(DateTimeFieldName)){
			Wrm.Common.DisableAllControlsOnForm();
		}
	};
	
	var isLockTimeoutReached = function (DateTimeFieldName) {
		DateTimeFieldName = typeof DateTimeFieldName !== 'undefined' ? DateTimeFieldName : 'createdon';
		if(Xrm.Page.getAttribute(DateTimeFieldName) == null || Xrm.Page.getAttribute(DateTimeFieldName).getValue() == null || XrmServiceToolkit.Soap.IsCurrentUserRole("WRM Exclude from Lock-Out Time")){
			return false;
		}
		var LockTimeout = Wrm.Common.GetWrmSetting("WRM.General.RecordLockTimeout");
		if(LockTimeout != null && LockTimeout != ""){
			var nowDate = new Date(); // Now
			var crDate = Xrm.Page.getAttribute(DateTimeFieldName).getValue();
			var DateDiffInMinutes = Math.round((Math.round((nowDate-crDate)/1000)/60));
			if(DateDiffInMinutes > parseInt(LockTimeout)){
				return true;
			}
		}
		return false;
	};

	var getCountryPhonePrefix = function(countryid) {
		var PhonePrefix = "";		
		XrmServiceToolkit.Rest.Retrieve(
			countryid,
			"wrmb_countrySet",
			null,
			null,
			function (results) {
				if(results != null){
					PhonePrefix = results.wrmb_phonecountrycode;
				}
			},
			function (error) {
				//equal(true, false, error.message);
				alert(error.message);
			},
			false
		);
		
		return PhonePrefix;
	};
	
	var updatePhoneNumberCountryCode = function(countryfieldname, phonefieldname) {
		var SelectedCountry = "";
		var CurrentPhoneNumber = "";
		var CountryPhonePrefix = "";
		
		if(Xrm.Page.getControl(countryfieldname)!=null)
		{
		  SelectedCountry = Xrm.Page.getAttribute(countryfieldname).getValue()[0].id;
		}
		CountryPhonePrefix = Wrm.Common.GetCountryPhonePrefix(SelectedCountry);
		
		if(Xrm.Page.getAttribute(phonefieldname)!=null)
		{
		  CurrentPhoneNumber = Xrm.Page.getAttribute(phonefieldname).getValue();
		}
		
		if(CountryPhonePrefix!="")
		{
			if(CurrentPhoneNumber!="" && CurrentPhoneNumber != null)
			{
				if(CurrentPhoneNumber.indexOf(CountryPhonePrefix) != 0)
				{
					Xrm.Page.getAttribute(phonefieldname).setValue(CountryPhonePrefix);
				}
			}
			else
			{
				Xrm.Page.getAttribute(phonefieldname).setValue(CountryPhonePrefix);
			}
		}
	};
	
	var setPhoneNumberCountryOnChange = function(countryfieldname, phonefieldname) {
		if (Xrm.Page.getAttribute(countryfieldname)!=null && Xrm.Page.getAttribute(phonefieldname)!=null)
		{	
			Xrm.Page.getAttribute(countryfieldname).addOnChange(function(){
				Wrm.Common.UpdatePhoneNumberCountryCode(countryfieldname, phonefieldname);
			});
		};
	}
	
	var setAddressCountryOnChange = function(countryFieldName, addressFields){
		for(var i = 0; i < addressFields.length; i++)
		{
			if (Xrm.Page.getAttribute(addressFields[i])!=null)
			{	
				Xrm.Page.getAttribute(addressFields[i]).addOnChange(function(){
					checkAddressCountry(countryFieldName, addressFields);
				});
			};
		}
		Wrm.Common.CheckAddressCountry(countryFieldName, addressFields);
	}
	
	var checkAddressCountry = function(countryFieldName, addressFields){
		if (Xrm.Page.getAttribute(countryFieldName) == null){
			return;
		}
		
		Xrm.Page.getAttribute(countryFieldName).setRequiredLevel("none");
		for(var i = 0; i < addressFields.length; i++)
		{
			if (Xrm.Page.getAttribute(addressFields[i])!=null && Xrm.Page.getAttribute(addressFields[i]) != null && Xrm.Page.getAttribute(addressFields[i]).getValue() != null)
			{	
				Xrm.Page.getAttribute(countryFieldName).setRequiredLevel("required");
				return;
			};
		}
	}
	
	var populateDynamicAddressMenu = function(commandProperties, entityType, entityIds) {
		commandProperties["PopulationXML"] =  '<Menu Id="wrmb.account.AddressToClipboard.Button.Menu">';
		commandProperties["PopulationXML"] += '<MenuSection Id="wrmb.account.AccountAddress.Section" Sequence="10" DisplayMode="Menu16">';
		commandProperties["PopulationXML"] += '<Controls Id="wrmb.account.AccountAddress.Section.Controls">';			
			
		var entityTypeName = "";
		var clickEventName = "";
		
		if(entityType == 1)
		{
		 	entityTypeName = "wrmb_companyid";
		 	clickEventName = "wrmb.account.AddressItemClicked.Command";
		}
		else if(entityType == 2)
		{
			entityTypeName = "wrmb_contactid";
			clickEventName = "wrmb.contact.AddressItemClicked.Command";
		}
		else
		{
			return;
		}					
		
		XrmServiceToolkit.Rest.RetrieveMultiple(
				"wrmb_addressSet",
				"$select=wrmb_addressId, wrmb_typeid, wrmb_street1&$filter=("+ entityTypeName +"/Id eq (guid'" + entityIds[0].replace('{','').replace('}','') + "') and statecode/Value eq 0)",
				function (results) {
					if(results != null && results.length > 0){
						for(var i = 0; i < results.length; i++)
						{
							if(results[i].wrmb_street1 != null && results[i].wrmb_street1.length > 0)
							{
								var menuText = ": " + results[i].wrmb_street1;
								commandProperties["PopulationXML"] += '<Button Command="'+ clickEventName +'" Id="' + results[i].wrmb_addressId + '" LabelText="' + results[i].wrmb_typeid.Name + menuText + '" Sequence="20" />';
							}								
							
						}							
					}
				},
				function (error) {
					//equal(true, false, error.message);
					alert(error.message);
				},
				function onComplete() {},
				false
			);
		
		commandProperties["PopulationXML"] += '</Controls></MenuSection></Menu>';
	}
	
	var populateDynamicEmailMenu = function(commandProperties, entityType, entityIds) {
		commandProperties["PopulationXML"] =  '<Menu Id="wrmb.account.AddressToClipboard.Button.Menu">';
		commandProperties["PopulationXML"] += '<MenuSection Id="wrmb.account.AccountAddress.Section" Sequence="10" DisplayMode="Menu16">';
		commandProperties["PopulationXML"] += '<Controls Id="wrmb.account.AccountAddress.Section.Controls">';
		
		var entityTypeName = "";
		var clickEventName = "";
		
		if(entityType == 1)
		{
		 	entityTypeName = "wrmb_companyid";
		 	clickEventName = "wrmb.account.EmailItemClicked.Command"
		}
		else if(entityType == 2)
		{
			entityTypeName = "wrmb_contactid";
			clickEventName = "wrmb.contact.EmailItemClicked.Command"
		}
		else
		{
			return;
		}					
		
		XrmServiceToolkit.Rest.RetrieveMultiple(
				"wrmb_addressSet",
				"$select=wrmb_emailaddress1&$filter=("+ entityTypeName +"/Id eq (guid'" + entityIds[0].replace('{','').replace('}','') + "') and statecode/Value eq 0)",
				function (results) {
					if(results != null && results.length > 0){
						for(var i = 0; i < results.length; i++)
						{
							if(results[i].wrmb_emailaddress1 != null && results[i].wrmb_emailaddress1.length > 0)
							{							
								commandProperties["PopulationXML"] += '<Button Command="'+ clickEventName +'" Id="' + results[i].wrmb_emailaddress1 + '" LabelText="' + results[i].wrmb_emailaddress1 + '" Sequence="20" />';
							}
						}
					}
				},
				function (error) {
					//equal(true, false, error.message);
					alert(error.message);
				},
				function onComplete() {},
				false
			);
		
		commandProperties["PopulationXML"] += '</Controls></MenuSection></Menu>';
	}

	var addressItemClicked = function(commandProperties) {
		var addressId = commandProperties.SourceControlId;
		
		XrmServiceToolkit.Rest.Retrieve(
			addressId,
			"wrmb_addressSet",
			null,
			null,
			function (result) {					
					var fullAddress = "";
					
					if(result.wrmb_salutation != null && result.wrmb_salutation.length > 0)
						fullAddress += result.wrmb_salutation + "\n";
						
					if(result.wrmb_name != null && result.wrmb_name.length > 0)
						fullAddress += result.wrmb_name + "\n";
						
					if(result.wrmb_co != null && result.wrmb_co.length > 0)
						fullAddress += "c/o " + result.wrmb_co + "\n";
					
					if(result.wrmb_street1 != null && result.wrmb_street1.length > 0)
						fullAddress += result.wrmb_street1 + "\n";
						
					if(result.wrmb_street2 != null && result.wrmb_street2.length > 0)
						fullAddress += result.wrmb_street2 + "\n";
						
					if(result.wrmb_postofficebox != null && result.wrmb_postofficebox.length > 0)
						fullAddress += result.wrmb_postofficebox + "\n";
						
					if(result.wrmb_postalcode != null && result.wrmb_postalcode.length > 0)
						fullAddress += result.wrmb_postalcode + " ";
						
					if(result.wrmb_city != null && result.wrmb_city.length > 0)
						fullAddress += result.wrmb_city + "\n";
						
					if(result.wrmb_countryid != null && result.wrmb_countryid.Name != null && result.wrmb_countryid.Name.length > 0)
						fullAddress += result.wrmb_countryid.Name;					
					
					window.clipboardData.setData("Text",fullAddress);				
			},
			function (error) {
				alert(error.message);
			},
			false
		);					
	}
	
	var emailItemClicked = function(commandProperties) {
		var email = commandProperties.SourceControlId;
		window.clipboardData.setData("Text",email);
	}
	
	var isAddressEmailCopyEnabled = function() {
		if(Wrm.Common.GetWrmSetting("WRM.AddressEmailCopy.IsEnabled") == "1")
		{
			return true;
		}
		
		return false;
	}
	
	var openConnectionGraph = function() {
		//Daten werden in Modal-Dialog-HTML geladen
		var WinSettingsOpen = "resizable=no,titlebar=no,menubar=no,scrollbars=no,toolbar=no,height=705px,width=905px";
		var WinSettings = "center:yes;titlebar=no;toolbar=no;resizable:no;dialogHeight:705px;dialogWidth:905px";
		var WinParams = new Object();
		WinParams.id = Xrm.Page.data.entity.getId();
		WinParams.entityname = Xrm.Page.data.entity.getEntityName();
		WinParams.name = "Current Item";
		if(WinParams.entityname == "contact")
		{
			WinParams.name = Xrm.Page.getAttribute("fullname").getValue();
		}
		if(WinParams.entityname == "account")
		{
			WinParams.name = Xrm.Page.getAttribute("name").getValue();
		}
		
		var resUrl = Xrm.Page.context.prependOrgName("/WebResources/wrmb_/ConnectionGraph.html");
		var paramEncode = encodeURIComponent("id=" + WinParams.id + "&entityname=" + WinParams.entityname + "&name=" + WinParams.name);
		
		var openWindow = window.open(resUrl + "?data=" + paramEncode, "_blank", WinSettingsOpen);
		//var ModDialog = window.showModalDialog(resUrl, WinParams, WinSettings);
	}

	var isConnectionGraphEnabled = function() {
		if(Wrm.Common.GetWrmSetting("WRM.ConnectionGraph.IsEnabled") == "1")
		{
			return true;
		}
		
		return false;
	}
	
    return {
        IsPortfolioNetEnabled: isPortfolioNetEnabled,
        DisableAllControlsOnForm: disableAllControlsOnForm,
		GetWrmSetting: getWrmSetting,
		LockFormOnRecordLockTimeoutReached: lockFormOnRecordLockTimeoutReached,
		IsLockTimeoutReached: isLockTimeoutReached,
		GetCountryPhonePrefix: getCountryPhonePrefix,
		UpdatePhoneNumberCountryCode: updatePhoneNumberCountryCode,
		SetPhoneNumberCountryOnChange: setPhoneNumberCountryOnChange,
		SetAddressCountryOnChange: setAddressCountryOnChange,
		CheckAddressCountry: checkAddressCountry,
        PopulateDynamicAddressMenu: populateDynamicAddressMenu,
        PopulateDynamicEmailMenu: populateDynamicEmailMenu,
        AddressItemClicked: addressItemClicked,
        EmailItemClicked: emailItemClicked,
		IsAddressEmailCopyEnabled: isAddressEmailCopyEnabled,
        OpenConnectionGraph: openConnectionGraph,
		IsConnectionGraphEnabled: isConnectionGraphEnabled
    };
} ();