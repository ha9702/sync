sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("sync.zec.sales1.controller.Fail", {
        onInit: function () {
            console.log("init도는중")
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("fail").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function (oEvent) {
            var oArguments = oEvent.getParameter("arguments");
            var sQuery = oArguments["?query"];
            if (sQuery && sQuery.pg_token) {
            } else {
                console.error("No pg_token found in URL");
            }

            if (window.opener && typeof window.opener.setApprovalFlag === "function") {
                window.opener.setApprovalFlag("fail");
                console.log("Approval flag set in globalModel from popup");
            } else {
                console.error("No opener window or setApprovalFlag function found");
            }

            window.close();

        }

	});
});