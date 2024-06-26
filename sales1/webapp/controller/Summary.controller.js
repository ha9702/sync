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
            oCartModel.attachRequestCompleted(function () {
                this._onDataLoaded();
            }.bind(this));

            this.getView().setModel(oCartModel, "cart");

            // 부모 창에서 접근 가능한 함수 설정
            window.setApprovalFlag = function (flag) {
                var oGlobalModel = this.getOwnerComponent().getModel("globalModel");
                oGlobalModel.setProperty("/approval", flag);
                oGlobalModel.refresh(true); // 변경 사항 즉시 반영
                console.log("Approval flag set in globalModel from popup");
            }.bind(this);

        },

        _onDataLoaded: function () {
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
            var kunnr = oCartModel.oData.Kunnr.substr(0, 10);
            console.log(kunnr);
            // var oCartModel = this.getView()
            var oSummaryData = {
                Vbeln: "",
                Kunnr: kunnr,
                Subcmon: oCartModel.oData.Submonth.toString(),
                toItem: oCartItems.map(function (item) {
                    return {

                        Matnr: item.Matnr,
                        Netpr: parseFloat(item.Netpr).toFixed(2),
                        Menge: parseFloat(item.Quantity).toFixed(2) // 타입 변환
                    };

                })

            };
            console.log(oSummaryData);

            return oSummaryData;

        },

        _callKakaoPayAPI: function (oSummaryData) {
            console.log("Calling KakaoPay API with data:", oSummaryData);

            var totalAmount = oSummaryData.toItem.reduce(function (sum, item) {
                return sum + (parseFloat(item.Netpr) * parseFloat(item.Menge));
            }, 0);
            var vatAmount = totalAmount * 0.1;

            var resourcePath = window.location.href.split('summary')[0];
            // var resourcePath = window.location.href;
            // var resourcePath = jQuery.sap.getResourcePath("sync.zec.sales1"); // resource root
            console.log(resourcePath);
            
            var apporvalPath = resourcePath + 'approval';
            var cancelPath = resourcePath + 'cancel';
            var failPath = resourcePath + 'fail';
            
            const YOUR_ADMIN_KEY = '08b7e210754118e01e7f8cd100c48fc7'; // 카카오페이 Admin Key
            $.ajax({
                url: 'https://kapi.kakao.com/v1/payment/ready',
                method: 'POST',
                contentType: "application/json",
                data: {
                    cid: 'TC0ONETIME', // 테스트용 CID
                    partner_order_id: 'partner_order_id',
                    partner_user_id: 'partner_user_id',
                    item_name: "SSP 영양제",
                    quantity: 1,
                    total_amount: totalAmount,
                    vat_amount: vatAmount,
                    tax_free_amount: 0,
                    approval_url: apporvalPath , // 변경된 포트 번호 사용
                    cancel_url: cancelPath, // 변경된 포트 번호 사용
                    fail_url: failPath, // 변경된 포트 번호 사용
                },
                headers: {
                    Authorization: `KakaoAK ${YOUR_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                success: function (response) {
                    console.log("KakaoPay API response:", response);
                    if (response.next_redirect_pc_url) {
                        this._openPopup(response.next_redirect_pc_url);
                    } else {
                        sap.m.MessageBox.error("Failed to initiate KakaoPay payment.");
                    }
                }.bind(this),
                error: function (oError) {
                    console.error("Error during KakaoPay API call:", oError);
                    sap.m.MessageBox.error("Payment initiation failed: " + oError.responseText);
                }
            });


            // $.ajax({
            //     url: "http://localhost:3000/pay",
            //     method: "POST",
            //     contentType: "application/json",
            //     data: JSON.stringify({
            //         amount: oSummaryData.toItem.reduce(function (sum, item) {
            //             return sum + (parseFloat(item.Netpr) * parseFloat(item.Menge));
            //         }, 0),
            //         item_name: "SSP 영양제"
            //     }),
            //     success: function (response) {
            //         console.log("KakaoPay API response:", response);
            //         if (response.next_redirect_pc_url) {
            //             this._openPopup(response.next_redirect_pc_url);
            //         } else {
            //             sap.m.MessageBox.error("Failed to initiate KakaoPay payment.");
            //         }
            //     }.bind(this),
            //     error: function (error) {
            //         console.error("Error during KakaoPay API call:", error);
            //         sap.m.MessageBox.error("Payment initiation failed: " + error.responseText);
            //     }
            // });
        },

        _openPopup: function (url) {
            var popup = window.open(url, "KakaoPayPopup", "width=500,height=600");

            var popupTick = setInterval(function () {
                if (popup.closed) {
                    clearInterval(popupTick);
                    this._handlePopupClose();
                }
            }.bind(this), 500);
        },

        _handlePopupClose: function () {
            console.log("Popup closed");
            var oGlobalModel = this.getOwnerComponent().getModel("globalModel");
            var bApproval = oGlobalModel.getProperty("/approval");
            console.log("Approval flag value from globalModel:", bApproval) ;

            if (bApproval === "approval") {
                console.log("Approval flag approval");
                this._createEntityAndNavigateToSuccess();
            } else if (bApproval === "fail") {
                console.log("Approval flag fail");
                MessageBox.error("결제에 실패했습니다.");
            } else {
                console.log("Approval flag null");
                MessageBox.information("결제가 취소되었습니다.");
            }
            
        },

        _createEntityAndNavigateToSuccess: function () {

            var oSummaryData = JSON.parse(localStorage.getItem("summaryData")); // 로컬 스토리지에서 데이터 가져오기

            if (oSummaryData) {
                console.log("Creating entity with data:", oSummaryData);

                var oModel = this.getOwnerComponent().getModel();
                var oView = this.getView();
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