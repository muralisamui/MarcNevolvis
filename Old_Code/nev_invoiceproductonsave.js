function invoiceProductOnSave(executionContext) {
    let formContext = executionContext.getFormContext(), editStatusValue = 1;
    /*if(formContext.getAttribute('nev_editstatus') !== null){
        editStatusValue = formContext.getAttribute('nev_editstatus').setValue(editStatusValue);
    }*/
    formContext.getAttribute('nev_editstatus').setValue(editStatusValue);

    //console.log('edit status: ', editStatusValue);
}