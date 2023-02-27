if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Lead = function () {
    var qualifyLead = function (primaryItemId, selectedItemIds, statusCode, selectedControl) {			
		var itemIds = new Array();
   
   var isCalledFromGrid = primaryItemId.length == 0 ? true : false;
   
   if(isCalledFromGrid)
   {
   		for(var i=0; i < selectedItemIds.length;i++)
   		{
   		   itemIds.push(selectedItemIds[i]);
   		}
   }
   else
   {
   		itemIds.push(primaryItemId);
   }
   
   for(var i=0;i<itemIds.length;i++)
   {
   		var requestName = "wrmb_LeadQualify";
    
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
	    requestXML += "              <a:Id>" + itemIds[i] + "</a:Id>";
	    requestXML += "              <a:LogicalName>lead</a:LogicalName>";
	    requestXML += "              <a:Name i:nil=\"true\" />";
	    requestXML += "            </b:value>";
	    requestXML += "          </a:KeyValuePairOfstringanyType>";
	    requestXML += "          <a:KeyValuePairOfstringanyType>";
	    requestXML += "            <b:key>StatusCode</b:key>";
	    requestXML += "            <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">"
	    requestXML +=                 statusCode.toString() + "</b:value>";
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
	        requestXml: requestXML,
	        async: false,
	        successCallback: function(result){
	        	   if(isCalledFromGrid)
				   {
				   		selectedControl.refresh();
				   }
				   else
				   {
		               var createdAccount = result.CreatedCompany;
		               var createdContact = result.CreatedContact;
		               var createdOpportunity = result.CreatedOpportunity;
		               
		               var guid = Xrm.Page.data.entity.getId();
				       var entityname = Xrm.Page.data.entity.getEntityName();
		               
					   if(createdAccount != null){
							guid = createdAccount.id;
							entityname = createdAccount.entityType;
					   }
					   
					   if(createdContact != null){
							guid = createdContact.id;
							entityname = createdContact.entityType;
					   }
					   Xrm.Utility.openEntityForm(entityname,guid);
				   }
	        },
	        errorCallback: function (e) {
				Xrm.Utility.alertDialog(e,function(){})
	        }
	    });
   }						
	};
	
    return {
        QualifyLead: qualifyLead
    };
} ();