// Success.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller,
	ODataModel) {
    "use strict";

    return Controller.extend("sync.zec.sales1.controller.Success", {
        onInit: function () {
            // this._createEntity();
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var oView  = this.getView();
            oView.setModel(oCartModel);
        },

        onNavHome: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
    
            // Reset cartItems and summaryData to initial state
            // oCartModel.setProperty("/cartItems", []);
            // oCartModel.setProperty("/summaryData", null);
            // oCartModel.setProperty("/totalPrice", 0);
            // Reset cart model data to initial state
            // oCartModel.setData({
            //     cartItems: [],
            //     selectedProduct: {},
            //     editMode: false,
            //     totalPrice: 0,
            //     SelectedPayment: "Card",
            //     Submonth: 0,
            //     summaryData: null
            // });
            
            // // Clear local storage if needed
            // localStorage.removeItem("summaryData");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain");
            window.location.reload();
        }

        // _createEntity: function () {
        //     var oSummaryData = JSON.parse(localStorage.getItem("summaryData")); // 로컬 스토리지에서 데이터 가져오기

        //     if (oSummaryData) {
        //         console.log("Creating entity with data:", oSummaryData);

        //         var oModel = this.getOwnerComponent().getModel();
        //         var oView  = this.getView();
        //         oView.setModel(oModel);
        //         // this.getView().setModel(oModel);
        //         oModel.create("/SalesHeaderSet", oSummaryData, {
        //             success: function (oData) {
        //                 console.log("판매오더가 정상적으로 생성되었습니다.:", oData);
                        
        //                 // Update the model with the new data
        //                 oView.getModel().setProperty("/Vbeln", oData.Vbeln);
        //                 oView.getModel().setProperty("/Amount", oData.Amount * 100);
        //                 // Make the Text control visible
        //                 oView.byId("idVbeln").setVisible(true);
        //                 oView.byId("idAmount").setVisible(true);
        //             },
        //             error: function (oError) {
        //                 console.error("판매오더 생성 중 오류가 발생했습니다.:", oError);
        //                 sap.m.MessageBox.error("주문 생성 실패: " + oError.responseText);
        //             }
        //         });
        //     } else {
        //         console.error("주문 정보가 올바르지 않습니다.");
        //     }
        // }

    });
});
