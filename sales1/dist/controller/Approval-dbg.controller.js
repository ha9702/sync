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

            if (window.opener && typeof window.opener.setApprovalFlag === "function") {
                window.opener.setApprovalFlag("approval");
                console.log("Approval flag set in globalModel from popup");
            } else {
                console.error("No opener window or setApprovalFlag function found");
            }

            window.close();

            // 글로벌 모델에 값을 설정
            // var oCartModel = window.opener.sap.ui.getCore().getModel("cart");
            // oCartModel.setProperty("/Flag", "approval");
            // oCartModel.refresh(true); // 변경 사항 즉시 반영
            // console.log("Approval flag set in globalModel");

            // window.close();
        },

        _processApproval: function (pg_token) {
            console.log("Processing approval with pg_token:", pg_token);
            // pg_token을 이용해 필요한 처리를 수행합니다.
            // 예: 서버에 pg_token을 전송하여 결제 승인 처리
        }
	});
});