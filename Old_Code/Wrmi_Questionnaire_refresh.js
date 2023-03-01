var wrContainer = null;
function reloadwebresource()
{
//Bei OnSave die Source speichern, bei OnLoad laden wenn Source in OnSave übergeben wurde, nötig bei erstellen neuer Datensatz

   var wrControl = Xrm.Page.ui.controls.get("WebResource_Questionnaire");
   var Source = wrControl.getSrc();
   
   if (Source.indexOf("blank.htm") == -1)
   {
		wrContainer = Source;
   }
   
   if (wrContainer != null)
   {
		wrControl.setSrc(wrContainer);
	}
}
