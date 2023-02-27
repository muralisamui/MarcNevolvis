if (typeof CustomActionExecutor == 'undefined') {
    CustomActionExecutor = {
        Execute: function (opts) {
            var req = new XMLHttpRequest();
            req.open("POST", CustomActionExecutor.GetServiceUrl(), !!opts.async);

            try {
                req.responseType = 'msxml-document';
            } catch (e) { }
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.onreadystatechange = function () {
                if (req.readyState == 4) { // "complete"
                    if (req.status == 200) { // "OK"
                        CustomActionExecutor.ProcessSoapResponse(req.responseXML, opts.successCallback, opts.errorCallback);
                    } else {
                        opts.errorCallback(CustomActionExecutor.ProcessSoapError(req.responseXML));
                    }
                }
            };
            req.send(opts.requestXml);
        },
        ProcessSoapResponse: function (responseXml, successCallback) {
            try {
                var namespaces = [
                    "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
                    "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
                    "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
                    "xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'",
                    "xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'"];
                responseXml.setProperty("SelectionNamespaces", namespaces.join(" "));
            } catch (e) { }

            var resultNodes = CustomActionExecutor._selectNodes(responseXml, "//a:Results/a:KeyValuePairOfstringanyType");

            successCallback(CustomActionExecutor.ObjectifyNodes(resultNodes));
        },
        ProcessSoapError: function (responseXml) {
            try {
                var namespaces = [
                    "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
                    "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
                    "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
                    "xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'",
                    "xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'"];
                responseXml.setProperty("SelectionNamespaces", namespaces.join(" "));
            } catch (e) { }

            var errorNode = CustomActionExecutor._selectSingleNode(responseXml, "//s:Fault/faultstring");
            return new Error(CustomActionExecutor._getNodeText(errorNode));
        },
        ObjectifyNodes: function (nodes) {
            var result = {};

            for (var i = 0; i < nodes.length; i++) {
                var fieldName = CustomActionExecutor._getNodeText(nodes[i].firstChild);
                var fieldValue = nodes[i].childNodes[1];
                result[fieldName] = CustomActionExecutor.ObjectifyNode(fieldValue);
            }

            return result;
        },
        ObjectifyNode: function (node) {
            if (node.attributes != null) {
                if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue == "true") {
                    return null;
                }

                var nodeTypeName = node.attributes.getNamedItem("i:type") == null ? "c:string" : node.attributes.getNamedItem("i:type").nodeValue;

                switch (nodeTypeName) {
                    case "a:EntityReference":
                        return {
                            id: CustomActionExecutor._getNodeText(node.childNodes[0]),
                            entityType: CustomActionExecutor._getNodeText(node.childNodes[1])
                        };
                    case "a:Entity":
                        return CustomActionExecutor.ObjectifyRecord(node);
                    case "a:EntityCollection":
                        return CustomActionExecutor.ObjectifyCollection(node.firstChild);
                    case "c:dateTime":
                        return CustomActionExecutor.ParseIsoDate(CustomActionExecutor._getNodeText(node));
                    case "c:guid":
                    case "c:string":
                        return CustomActionExecutor._getNodeText(node);
                    case "c:int":
                        return parseInt(CustomActionExecutor._getNodeText(node));
                    case "a:OptionSetValue":
                        return parseInt(CustomActionExecutor._getNodeText(node.childNodes[0]));
                    case "c:boolean":
                        return CustomActionExecutor._getNodeText(node.childNodes[0]) == "true";
                    case "c:double":
                    case "c:decimal":
                    case "a:Money":
                        return parseFloat(CustomActionExecutor._getNodeText(node.childNodes[0]));
                    default:
                        return null;
                }
            }

            return null;
        },
        ObjectifyCollection: function (node) {
            var result = [];

            for (var i = 0; i < node.childNodes.length; i++) {
                result.push(CustomActionExecutor.ObjectifyRecord(node.childNodes[i]));
            }

            return result;
        },
        ObjectifyRecord: function (node) {
            var result = {};

            result.logicalName = (node.childNodes[4].text !== undefined) ? node.childNodes[4].text : node.childNodes[4].textContent;
            result.id = (node.childNodes[3].text !== undefined) ? node.childNodes[3].text : node.childNodes[3].textContent;

            result.attributes = CustomActionExecutor.ObjectifyNodes(node.childNodes[0].childNodes);
            result.formattedValues = CustomActionExecutor.ObjectifyNodes(node.childNodes[2].childNodes);

            return result;
        },
        ParseIsoDate: function (s) {
            if (s == null || !s.match(CustomActionExecutor.isoDateExpression))
                return null;

            var dateParts = CustomActionExecutor.isoDateExpression.exec(s);
            return new Date(Date.UTC(parseInt(dateParts[1], 10),
                parseInt(dateParts[2], 10) - 1,
                parseInt(dateParts[3], 10),
                parseInt(dateParts[4], 10) - (dateParts[8] == "" || dateParts[8] == "Z" ? 0 : parseInt(dateParts[8])),
                parseInt(dateParts[5], 10),
                parseInt(dateParts[6], 10)));
        },
        GetServiceUrl: function () {
            var context = null;

            if (typeof GetGlobalContext == 'function') {
                context = GetGlobalContext();
            } else if (typeof Xrm != 'undefined') {
                context = Xrm.Page.context;
            }

            return context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
        },
        _selectNodes: function (node, xPathExpression) {
            if (typeof (node.selectNodes) != "undefined") {
                return node.selectNodes(xPathExpression);
            }
            else {
                var output = [];
                var xPathResults = node.evaluate(xPathExpression, node, CustomActionExecutor._NSResolver, XPathResult.ANY_TYPE, null);
                var result = xPathResults.iterateNext();
                while (result) {
                    output.push(result);
                    result = xPathResults.iterateNext();
                }
                return output;
            }
        },
        _selectSingleNode: function (node, xpathExpr) {
            if (typeof (node.selectSingleNode) != "undefined") {
                return node.selectSingleNode(xpathExpr);
            }
            else {
                var xpe = new XPathEvaluator();
                var xPathNode = xpe.evaluate(xpathExpr, node, CustomActionExecutor._NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return (xPathNode != null) ? xPathNode.singleNodeValue : null;
            }
        },
        _getNodeText: function (node) {
            if (typeof (node.text) != "undefined") {
                return node.text;
            }
            else {
                return node.textContent;
            }
        },
        _isNodeNull: function (node) {
            if (node == null) {
                return true;
            }

            if ((node.attributes.getNamedItem("i:nil") != null) && (node.attributes.getNamedItem("i:nil").value == "true")) {
                return true;
            }
            return false;
        },
        _getNodeName: function (node) {
            if (typeof (node.baseName) != "undefined") {
                return node.baseName;
            }
            else {
                return node.localName;
            }
        },
        _NSResolver: function (prefix) {
            var ns = {
                "s": "http://schemas.xmlsoap.org/soap/envelope/",
                "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
                "i": "http://www.w3.org/2001/XMLSchema-instance",
                "b": "http://schemas.microsoft.com/crm/2011/Contracts",
                "c": "http://schemas.datacontract.org/2004/07/System.Collections.Generic"
            };
            return ns[prefix] || null;
        },
        isoDateExpression: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.?(\d*)?(Z|[+-]\d{2}?(:\d{2})?)?$/,
        __namespace: true
    };
}