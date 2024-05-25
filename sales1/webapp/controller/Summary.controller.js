sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("sync.zec.sales1.controller.Summary", {
        onInit: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteSummary").attachPatternMatched(this._onPatternMatched, this);

            // 데이터 로드 후에 추가 설정
            oCartModel.attachRequestCompleted(function() {
                this._onDataLoaded();
            }.bind(this));

            this.getView().setModel(oCartModel, "cart");
        },

        _onDataLoaded: function() {
            console.log("Data loaded successfully");
            // 데이터 로드 후 실행할 추가 코드
        },

        _onPatternMatched: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var oSummaryData = oCartModel.getProperty("/summaryData");
            if (!oSummaryData) {
                console.error("Summary data is missing!");
                return;
            }

            // 필요한 경우 summaryData를 사용하여 추가 작업을 수행할 수 있습니다.
        },

        _navBackToStep: function (oEvent) {
            var oButton = oEvent.getSource();
            var sStepId = oButton.data("navBackTo");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oCartModel = this.getOwnerComponent().getModel("cart");

            // 페이지 이동과 함께 단계 ID를 전달
            oRouter.navTo("RoutePayment", {
                cartItems: encodeURIComponent(JSON.stringify(oCartModel.getProperty("/cartItems"))),
                stepId: sStepId
            });
        },

        handleWizardCancel: function () {
            MessageBox.confirm("Are you sure you want to cancel the order?", {
                title: "Cancel Order",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        var oCartModel = this.getOwnerComponent().getModel("cart");

                        // Navigate to Home
                        oRouter.navTo("RouteHome");
                    }
                }.bind(this)
            });
        },

        handleWizardSubmit: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            var sPaymentType = oCartModel.getProperty("/summaryData/selectedPaymentType");

            MessageBox.confirm("결제를 진행하시겠습니까?", {
                title: "결제 확인창",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        // summaryData 설정
                        var oSummaryData = this._prepareSummaryData(oCartModel);

                        localStorage.setItem("summaryData", JSON.stringify(oSummaryData)); // 데이터를 로컬 스토리지에 저장

                        if (sPaymentType === "KakaoPay") {
                            this._callKakaoPayAPI(oSummaryData);
                        } else if (sPaymentType === "Card") {
                            this._createEntityAndNavigateToSuccess();
                        }
                    }
                }.bind(this)
            });
        },

        _prepareSummaryData: function (oCartModel) {
            var oCartItems = oCartModel.getProperty("/cartItems");
            // var oCartModel = this.getView()
            var oSummaryData = {
                Vbeln: "",
                Kunnr: "CUS9999999",
                Subcmon: oCartModel.Submonth,
                toItem: oCartItems.map(function (item) {
                    return {
                        Matnr: item.selectedOption.key,
                        Netpr: item.Netpr,
                        Menge: parseFloat(item.Quantity).toFixed(2) // 타입 변환
                    };
                })
            };
            
            
            return oSummaryData;

        },

        _callKakaoPayAPI: function (oSummaryData) {
            console.log("Calling KakaoPay API with data:", oSummaryData);

            $.ajax({
                url: "http://localhost:3000/pay",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    amount: oSummaryData.toItem.reduce(function (sum, item) {
                        return sum + (parseFloat(item.Netpr) * parseFloat(item.Menge));
                    }, 0),
                    item_name: "SSP 영양제"
                }),
                success: function (response) {
                    console.log("KakaoPay API response:", response);
                    if (response.next_redirect_pc_url) {
                        window.location.href = response.next_redirect_pc_url;
                    } else {
                        sap.m.MessageBox.error("Failed to initiate KakaoPay payment.");
                    }
                },
                error: function (error) {
                    console.error("Error during KakaoPay API call:", error);
                    sap.m.MessageBox.error("Payment initiation failed: " + error.responseText);
                },
                complete: function (response) {
                    if (response.status === 200) { // Assuming 200 means success
                        this._createEntityAndNavigateToSuccess();
                    }
                }.bind(this)
            });
        },

        _createEntityAndNavigateToSuccess: function () {
            var oSummaryData = JSON.parse(localStorage.getItem("summaryData")); // 로컬 스토리지에서 데이터 가져오기

            if (oSummaryData) {
                console.log("Creating entity with data:", oSummaryData);

                var oModel = this.getOwnerComponent().getModel();
                var oView  = this.getView();
                oView.setModel(oModel);

                oModel.create("/SalesHeaderSet", oSummaryData, {
                    success: function (oData) {
                        console.log("Sales order created successfully:", oData);
                        
                        var oCartModel = this.getOwnerComponent().getModel("cart");
                        // Update the model with the new data
                        oCartModel.setProperty("/Vbeln", oData.Vbeln);
                        oCartModel.setProperty("/Amount", oData.Amount * 100);

                        // Navigate to the Success view
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteSuccess");
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error creating sales order:", oError);
                        sap.m.MessageBox.error("Order creation failed: " + oError.responseText);
                    }
                });
            } else {
                console.error("Invalid order information.");
            }
        }


    });
});