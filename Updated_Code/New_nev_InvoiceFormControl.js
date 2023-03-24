if (typeof InvoiceFormControl === 'undefined') { InvoiceFormControl = { __namespace: true }; }

InvoiceFormControl.jScript = {
    onLoad: function (executionContext) {
        this.statusControlCheck(executionContext);
    },
    onChangeOfStatusReason: function (executionContext) {
        this.statusControlCheck(executionContext);
    },

    /// Status Control Check
    statusControlCheck: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var statusControl = formContext.getControl("statuscode");
        var statusValue = statusControl.getAttribute().getValue();
        var statusOptions = [];
        console.log(statusValue);
        switch (statusValue) {
            case 1: // To be charged
                statusOptions = [1, 2]; // Created
                break;
            case 2: // Created
                statusOptions = [2, 1, 4, 6]; // To be charged, Sent, Not Invoiced
                break;
            case 4: // Sent
                statusOptions = [4, 9, 5, 8, 6]; // On Hold, Paid, Reminded, Not Invoiced 
                break;
            case 8: // Reminded
                statusOptions = [8, 10]; //Paid late
                break;
            case 9: //On Hold
                statusOptions = [9, 4, 5, 6]; //Sent, Paid,Not Invoiced
                break;
            default: // for any other status value
                break;
        }
        if (statusOptions.length > 0) {
            var optionsToKeep = [];
            var allOptions = statusControl.getOptions();
            console.log(allOptions);
            for (var i = 0; i < allOptions.length; i++) {
                var option = allOptions[i];
                if (statusOptions.indexOf(option.value) > -1) {
                    optionsToKeep.push(option);
                }
            }
            statusControl.clearOptions();
            for (var j = 0; j < optionsToKeep.length; j++) {
                statusControl.addOption(optionsToKeep[j]);
            }
        }
        formContext.getControl("customerid").setEntityTypes(['contact']);
        if (statusValue !== 1 /* the value of the "To be charged" option */) {
            formContext.ui.controls.forEach(function (control) {
                if (control.getName() !== "statuscode") {
                    control.setDisabled(true);
                }
            });

            //
            formContext.data.entity.addOnLoad(Nev.InvoiceProduct.InvoiceProductOnSave);
            formContext.getAttribute("statuscode").addOnChange(Nev.InvoiceProduct.InvoiceProductOnSave);
        }

        // to unhide the hidden feild nev_invoicesent, nev_invoicepaid, nev_invoiceonhold, nev_invoicecreated if they have data
        var invoiceSentControl = formContext.getControl("nev_invoicesent");
        if (invoiceSentControl.getAttribute().getValue()) {
            invoiceSentControl.setVisible(true);
        }

        var invoicePaidControl = formContext.getControl("nev_invoicepaid");
        if (invoicePaidControl.getAttribute().getValue()) {
            invoicePaidControl.setVisible(true);
        }

        var invoiceOnHoldControl = formContext.getControl("nev_invoiceonhold");
        if (invoiceOnHoldControl.getAttribute().getValue()) {
            invoiceOnHoldControl.setVisible(true);
        }

        var invoiceCreatedControl = formContext.getControl("nev_invoicecreated");
        if (invoiceCreatedControl.getAttribute().getValue()) {
            invoiceCreatedControl.setVisible(true);
        }
    }
}



