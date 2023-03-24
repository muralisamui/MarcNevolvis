if (!this.Wrm){
	Wrm = function () {};
}

Wrm.Answer = function () {

	var QuestionTypes = {
		SINGLE: 849170000,
		MULTIPLE: 849170001
	};
	
    var onLoad = function () {
        if(Wrm.Answer.IsSingleAnswer()){
			// Hide Section with multiple answer subgrid (createdonbehalfby was needed to have a control in this section, because the subgrid is not working well as control
			Xrm.Page.getControl("createdonbehalfby").getParent().setVisible(false);
		}
        if(Wrm.Answer.IsMultipleAnswer()){
			// Hide Section with single answer
			Xrm.Page.getControl("wrmi_answertemplateid").getParent().setVisible(false);
		}
    };
	
	var isSingleAnswer = function () {
		if(Xrm.Page.getAttribute("wrmi_questiontemplateid") == null)
			return false;
			
		var QuestionValue = Xrm.Page.getAttribute("wrmi_questiontemplateid").getValue();
		if(QuestionValue == null || QuestionValue.length == 0)
			return false;
		
		var myQuestionTemplate = Wrm.Answer.GetQuestionTemplateById(QuestionValue[0].id);
		
		if(myQuestionTemplate == null || myQuestionTemplate.wrmi_type == null || myQuestionTemplate.wrmi_type.Value == null)
			return false;
		
		if(myQuestionTemplate.wrmi_type.Value == QuestionTypes.SINGLE){
			return true;
		} else {
			return false;
		}
	};
	
	var isMultipleAnswer = function () {
		if(Xrm.Page.getAttribute("wrmi_questiontemplateid") == null)
			return false;
			
		var QuestionValue = Xrm.Page.getAttribute("wrmi_questiontemplateid").getValue();
		if(QuestionValue == null || QuestionValue.length == 0)
			return false;
		
		var myQuestionTemplate = Wrm.Answer.GetQuestionTemplateById(QuestionValue[0].id);
		
		if(myQuestionTemplate == null || myQuestionTemplate.wrmi_type == null || myQuestionTemplate.wrmi_type.Value == null)
			return false;
		
		if(myQuestionTemplate.wrmi_type.Value == QuestionTypes.MULTIPLE){
			return true;
		} else {
			return false;
		}
	};
	
    var getQuestionTemplateById = function (qId) {
		var qT = null;
		XrmServiceToolkit.Rest.Retrieve(
			qId,
			"wrmi_questiontemplateSet",
			null, null,
			function (result) {
				qT = result;
			},
			function (error) {
				alert(error.message);
				qT = null;
			},
			false
		);
		return qT;
    };

    return {
        OnLoad: onLoad,
        IsSingleAnswer: isSingleAnswer,
		IsMultipleAnswer: isMultipleAnswer,
        GetQuestionTemplateById: getQuestionTemplateById
    };
} ();