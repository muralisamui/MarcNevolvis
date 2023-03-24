if (typeof ContactFormControl === 'undefined') { ContactFormControl = { __namespace: true }; }
var formContext;

ContactFormControl.jScript = {

    onLoad: function (executionContext) {
        debugger;
        formContext = executionContext.getFormContext();

        // limit to customer entity
        var control = formContext.getControl("ownerid");
        if (control != null) {
            control.setEntityTypes([
                'team']);
        }
    },

    filterTeamsAccounts : function () {
        // Only show accounts with the type 'Preferred Customer'
        var customerAccountFilter = "<filter type='and'><condition attribute='name' operator='like' value='%Rec own%'/></filter>";
        formContext.getControl("ownerid").addCustomFilter(customerAccountFilter, "team");
    },
    setParentAccountIdFilter: function (executionContext) {
        // Get the form context
        var formContext = executionContext.getFormContext();

        // Set the Owner field to null on form load
        formContext.getAttribute("ownerid").setValue(null);

        // Set the Owner field as required
        formContext.getAttribute("ownerid").setRequiredLevel("required");

        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            "<entity name='team'>" +
            "<attribute name='name' />" +
            "<filter type='and'>" +
            "<condition attribute='name' operator='like' value='%Rec own%' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        // Retrieve the teams that meet the criteria
        Xrm.WebApi.retrieveMultipleRecords("team", "?fetchXml=" + fetchXml)
            .then(function (results) {
                // Define the options array for the Owner field
                var options = [];
                console.log(results);
                // Loop through the results and add each team's name to the options array
                results.entities.forEach(function (team) {
                    options.push({
                        value: team["teamid"],
                        text: team["name"]
                    });
                });
                console.log(options);

                formContext.getControl("ownerid").addPreSearch(ContactFormControl.jScript.filterTeamsAccounts);

                var statusControl = formContext.getControl("ownerid");
                statusControl.clearOptions();
                for (var j = 0; j < options.length; j++) {
                    statusControl.addOption(options[j]);
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }


}