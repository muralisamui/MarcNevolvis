if (!this.Nev) {
    "use strict";
    Nev = function () { };
}

Nev.InvoiceProduct = function () {
    let invoiceProductOnSave = async (executionContext) => {
        let RetrieveRecord = async (entityLogicalName, recordId, options = '') => {
            let record_obj;
            return Xrm.WebApi.retrieveRecord(entityLogicalName, recordId, options).then(
                function success(result) {
                    record_obj = result;
                    console.log("Record retrieved: ", result);
                    return result;
                },
                function error(err) {
                    return err;
                });
        }

        let formContext = executionContext.getFormContext();
        var invoiceId = formContext.getAttribute("invoiceid").getValue();
        var lookupId = invoiceId[0].id.replace('{', '').replace('}', '').toLowerCase();
        console.log(lookupId);

        let temp = await RetrieveRecord("invoice",
            lookupId,
            "?$select=statuscode"
        );
        console.log(temp.statuscode);
        if (temp && temp.statuscode !== 1 /* 'To Be Charged' */) {
            // Get all fields in the Invoice Product form and disable them
            var invoiceProductFields = formContext.ui.controls.get();
            console.log(invoiceProductFields);
            for (var i = 0; i < invoiceProductFields.length; i++) {
                invoiceProductFields[i].setDisabled(true);
                console.log(invoiceProductFields[i]);
            }
        }
    }
    return {
        InvoiceProductOnSave: invoiceProductOnSave
    }
}();
