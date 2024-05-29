sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sync.zec.recservice.controller.rec_service2", {
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel("selectionModel");
            this.getView().setModel(oModel, "selectionModel");

            // 이벤트 등록
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("rec_service2").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
            var oModel = this.getView().getModel("selectionModel");
            var aSelectedItems = oModel.getProperty("/selectedItems");
        },

        onShowResult: function() {
            var oModel = this.getView().getModel("selectionModel");
            var sName = this.byId("idNameInput").getValue(); // 입력된 이름 가져오기
            oModel.setProperty("/userName", sName); // 이름 저장            
            var aSelectedItems = oModel.getProperty("/selectedItems");

            MessageToast.show("결과 확인 페이지로 이동합니다.");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("rec_result");
        }
    });
});