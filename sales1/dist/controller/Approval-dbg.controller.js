sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("sync.zec.sales1.controller.Approval", {
        /**
         * @override
         */
        onInit: function () {
            console.log("init도는중")
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("approval").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function (oEvent) {
            var oArguments = oEvent.getParameter("arguments");
            var sQuery = oArguments["?query"];
            if (sQuery && sQuery.pg_token) {
                this._processApproval(sQuery.pg_token);
            } else {
                console.error("No pg_token found in URL");
            }

            var oCartModel = this.getOwnerComponent().getModel("cart");
            this.getView().setModel(oCartModel, "cart");
        },

        _processApproval: function (pg_token) {
            console.log("Processing approval with pg_token:", pg_token);
            // pg_token을 이용해 필요한 처리를 수행합니다.
            // 예: 서버에 pg_token을 전송하여 결제 승인 처리
        },

        onApproval: function (oEvent) {
            console.log("Attempting to close window");
            window.close();
            console.log("Window close called");
        }
	});
});