if (!this.Wrm){
	Wrm = function () {};
}

Wrm.KycConfigurationProfile = function () {
    var publish = function () {
		if(Xrm.Page.getAttribute("statuscode") != null){
			Xrm.Page.getAttribute("statuscode").setValue(1);
			Xrm.Page.getAttribute("statuscode").setSubmitMode("always"); 
			Xrm.Page.data.entity.save();
		}
    };
	
    var unpublish = function () {
		if(Xrm.Page.getAttribute("statuscode") != null){
			Xrm.Page.getAttribute("statuscode").setValue(320560000);
			Xrm.Page.getAttribute("statuscode").setSubmitMode("always"); 
			Xrm.Page.data.entity.save();
		}
    };
	
    var revise = function () {
		var entityId = Xrm.Page.data.entity.getId();
		var entityName = Xrm.Page.data.entity.getEntityName();
		var requestName = "wrmr_createrevisionaction_configurationprofile";
		
		// Creating the request XML for calling the Action
		var requestXML = ""
		requestXML += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
		requestXML += "  <s:Body>";
		requestXML += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
		requestXML += "      <request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
		requestXML += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
		requestXML += "          <a:KeyValuePairOfstringanyType>";
		requestXML += "            <b:key>Target</b:key>";
		requestXML += "            <b:value i:type=\"a:EntityReference\">";
		requestXML += "              <a:Id>" + entityId + "</a:Id>";
		requestXML += "              <a:LogicalName>" + entityName + "</a:LogicalName>";
		requestXML += "              <a:Name i:nil=\"true\" />";
		requestXML += "            </b:value>";
		requestXML += "          </a:KeyValuePairOfstringanyType>";
		requestXML += "        </a:Parameters>";
		requestXML += "        <a:RequestId i:nil=\"true\" />";
		requestXML += "        <a:RequestName>" + requestName + "</a:RequestName>";
		requestXML += "      </request>";
		requestXML += "    </Execute>";
		requestXML += "  </s:Body>";
		requestXML += "</s:Envelope>";
		
		CustomActionExecutor.Execute(
		{
		  requestXml : requestXML,
		  async : false,
		  successCallback : function(result)
		  {
			Xrm.Utility.openEntityForm(entityName, result.NewProfileId);
		  },
		  errorCallback : function (e)
		  {
			 Xrm.Utility.alert(e);
		  }
		});
    };
	
    var isPublished = function () {
		if(Xrm.Page.getAttribute("statuscode") != null && Xrm.Page.getAttribute("statuscode").getValue() == 1){
			return true;
		}
		
		return false;
    };
	
    return {
        Publish: publish,
        Unpublish: unpublish,
		Revise: revise,
        IsPublished: isPublished
    };
} ();
