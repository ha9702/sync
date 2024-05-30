sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/ValidateException"
], function (Controller,
	JSONModel,
	MessageToast,
	ValidateException) {
    "use strict";

    return Controller.extend("sync.zec.sales1.controller.Payment", {
        onInit: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            this.getView().setModel(oCartModel);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oRoute = oRouter.getRoute("RoutePayment");

            if (oRoute) {
                oRoute.attachPatternMatched(this._onPatternMatched, this);
            }

            // Summary route
            var oSummaryRoute = oRouter.getRoute("RouteSummary");
            if (oSummaryRoute) {
                oSummaryRoute.attachPatternMatched(this._onSummaryPatternMatched, this);
            }
            
            // 결제 관련 모델 초기화
            oCartModel.setProperty("/cardOwner", "");
            oCartModel.setProperty("/cardNumber", "");
            oCartModel.setProperty("/cvc", "");
            oCartModel.setProperty("/expiryDate", "");

            // 결제 단계 모델 초기화
            oCartModel.setProperty("/selectedPaymentType", "Card");
            oCartModel.setProperty("/paymentTypeSelected", false);
            oCartModel.setProperty("/isCardInfoValid", false); // Initialize validation state

            // Daum Postcode API 스크립트 로드
            this._loadDaumPostcodeScript().then(() => {
                console.log("Daum Postcode script loaded successfully");
            }).catch((error) => {
                console.error("Failed to load Daum Postcode script:", error);
            });

        },

        // New method to handle summary route pattern matched
        _onSummaryPatternMatched: function (oEvent) {

        },

        _onPatternMatched: function (oEvent) {
            var sCartItems = oEvent.getParameter("arguments").cartItems;
            var aCartItems = JSON.parse(decodeURIComponent(sCartItems));
            var sSourceView = oEvent.getParameter("arguments").sourceView;

            var oCartModel = this.getView().getModel("cart");
            oCartModel.setProperty("/cartItems", aCartItems);
            oCartModel.setProperty("/sourceView", sSourceView);  // Store the source view

            var sStepId = oEvent.getParameter("arguments").stepId;
            if (sStepId) {
                this._goToStep(sStepId);
            }
        },

        _goToStep: function (sStepId) {
            var oWizard = this.byId("paymentWizard");
            var oStep = this.byId(sStepId);
            if (oStep) {
                oWizard.discardProgress(oStep);
                oWizard.goToStep(oStep);
            }
        },

        onPaymentTypeSelect: function (oEvent) {
            this.setPaymentMethod(oEvent);    
        },

        onNextStep: function (oEvent) {
            var oWizard = this.byId("paymentWizard");
            oWizard.nextStep();

            var oButton = oEvent.getSource();
            var sButtonId = oButton.getId();

            if (oButton) {
                oButton.setVisible(false);
            }

        },

        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oCartModel = this.getView().getModel("cart");
            var sSourceView = oCartModel.getProperty("/sourceView");
            var beforeView = oCartModel.oData.Before;
            console.log(beforeView);
            // Navigate back to the source view
            if (beforeView === "home") {
                oRouter.navTo("RouteHome");
            } else if (beforeView === "sub") {
                oRouter.navTo("RouteSub");
            } else {
                // Default to home if source view is not set or recognized
                oRouter.navTo("RouteHome");
            }
        },

        validateCardInfo: function () {
            var oView = this.getView();
            var bValid = oView.byId("creditCardHolderName").getValueState() === "None" && oView.byId("creditCardHolderName").getValue().trim() !== "" &&
                         oView.byId("creditCardNumber").getValueState() === "None" && oView.byId("creditCardNumber").getValue().trim() !== "" &&
                         oView.byId("creditCardSecurityNumber").getValueState() === "None" && oView.byId("creditCardSecurityNumber").getValue().trim() !== "" &&
                         oView.byId("creditCardExpirationDate").getValueState() === "None" && oView.byId("creditCardExpirationDate").getValue().trim() !== "";
        
            this.getView().getModel("cart").setProperty("/isCardInfoValid", bValid);
        },

        checkCardHolderName: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oRegex = /^[a-zA-Z가-힣]+$/;
            if (sValue.length >= 2 && oRegex.test(sValue)) {
                oInput.setValueState("None");
            } else {
                oInput.setValueState("Error");
            }
            this.validateCardInfo();
        },

        checkCardNumber: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oRegex = /^[0-9-]+$/;
            var isValid = sValue.length === 19 && oRegex.test(sValue); // 19 includes 16 digits + 3 hyphens
            
            if (isValid) {
                oInput.setValueState("None");
            } else {
                oInput.setValueState("Error");
                oInput.setValueStateText("유효한 카드번호를 입력해주세요.");
            }
            this.validateCardInfo();
        },

        checkSecurityCode: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oRegex = /^[0-9]{3}$/;
            var isValid = oRegex.test(sValue);
            
            if (isValid) {
                oInput.setValueState("None");
            } else {
                oInput.setValueState("Error");
                oInput.setValueStateText("3자리의 숫자만 입력해주세요.");
            }
            this.validateCardInfo();
        },

        checkExpirationDate: function(oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var isValidFormat = /^(0[1-9]|1[0-2])\/\d{4}$/.test(sValue); // Check if the format is MM/YYYY
        
            if (!isValidFormat) {
                oInput.setValueState("Error");
                oInput.setValueStateText("유효한 날짜를 입력해주세요.");
                return;
            }
        
            var aDateParts = sValue.split("/");
            var nInputMonth = parseInt(aDateParts[0], 10);
            var nInputYear = parseInt(aDateParts[1], 10);
        
            var oToday = new Date();
            var nCurrentMonth = oToday.getMonth() + 1; // getMonth() is 0-based
            var nCurrentYear = oToday.getFullYear();
        
            if (nInputYear < nCurrentYear || (nInputYear === nCurrentYear && nInputMonth < nCurrentMonth)) {
                oInput.setValueState("Error");
                oInput.setValueStateText("유효기간이 만료되었습니다.");
            } else {
                oInput.setValueState("None");
            }

            this.validateCardInfo();
        },

        _loadDaumPostcodeScript: function () {
            return new Promise((resolve, reject) => {
                if (typeof daum !== "undefined") {
                    // 이미 로드된 경우 바로 resolve
                    resolve();
                    return;
                }
                var script = document.createElement("script");
                script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
                script.onload = () => {
                    console.log("Daum Postcode script loaded");
                    resolve();
                };
                script.onerror = () => {
                    console.error("Failed to load Daum Postcode script");
                    reject(new Error("Failed to load Daum Postcode script"));
                };
                document.head.appendChild(script);
            });
        },

        onFindAddress: function () {
            console.log("onFindAddress 호출됨");
            if (typeof daum === "undefined") {
                console.error("Daum Postcode API 스크립트가 로드되지 않았습니다.");
                return;
            }
            new daum.Postcode({
                oncomplete: function(data) {
                    console.log("API 호출 후 데이터 반환: ", data);
                    var addr = ''; // 주소 변수
                    var extraAddr = ''; // 참고항목 변수

                    if (data.userSelectedType === 'R') { // 도로명 주소
                        addr = data.roadAddress;
                    } else { // 지번 주소
                        addr = data.jibunAddress;
                    }

                    if(data.userSelectedType === 'R'){
                        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                            extraAddr += data.bname;
                        }
                        if(data.buildingName !== '' && data.apartment === 'Y'){
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        if(extraAddr !== ''){
                            extraAddr = ' (' + extraAddr + ')';
                        }
                        this.getView().byId("idExtraAddress").setValue(extraAddr);
                    } else {
                        this.getView().byId("idExtraAddress").setValue('');
                    }

                    this.getView().byId('idPostcode').setValue(data.zonecode);
                    this.getView().byId("idAddress").setValue(addr);
                    this.getView().byId("idDetailAddress").focus();
                }.bind(this)
            }).open();
        },
        onCheck: function () {
            var oCartModel = this.getView().getModel("cart");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            var oSummaryData = {
                cartItems: oCartModel.getProperty("/cartItems"),
                selectedPaymentType: oCartModel.getProperty("/SelectedPayment"),
                cardOwner: oCartModel.getProperty("/cardOwner"),
                cardNumber: oCartModel.getProperty("/cardNumber"),
                cvc: oCartModel.getProperty("/cvc"),
                expiryDate: oCartModel.getProperty("/expiryDate"),
                totalPrice: oCartModel.getProperty("/totalPrice"),
                deliveryAddress: {
                    postcode: this.getView().byId("idPostcode").getValue(),
                    address: this.getView().byId("idAddress").getValue(),
                    detailAddress: this.getView().byId("idDetailAddress").getValue(),
                    extraAddress: this.getView().byId("idExtraAddress").getValue()
                }
            };

            // cart 모델에 summaryData를 설정합니다.
            oCartModel.setProperty("/summaryData", oSummaryData);

            // 페이지 이동
            oRouter.navTo("RouteSummary");
        },
        
        _calculateTotal: function (aCartItems) {
            return aCartItems.reduce(function (acc, item) {
                return acc + (item.price * item.quantity);
            }, 0);
        },

        onInputChange: function () {
            var bAllFilled = this._checkAllInputFilled();
            this.getView().byId("checkButton").setEnabled(bAllFilled);
        },

        _checkAllInputFilled: function () {
            var aInputIds = [
                "idPostcode",
                "idAddress",
                "idDetailAddress",
                "idExtraAddress"
            ];

            return aInputIds.every(function (sId) {
                var oInput = this.getView().byId(sId);
                return oInput && oInput.getValue().trim() !== "";
            }, this);
        },

        onStepActivated: function (oEvent) {
            var oWizard = oEvent.getSource();
            var oStep = oEvent.getParameter("step");
            var sStepId = oStep.getId();

            switch (sStepId) {
                case this.createId("paymentTypeStep"):
                    this._resetSteps();
                    this.goToPaymentStep();
                    break;
                case this.createId("cardInfoStep"):
                    this.validateCardInfo();
                    break;
                case this.createId("idDestination"):
                    this.onInputChange();
                    break;
                default:
                    break;
            }
        },

        goToPaymentStep: function () {
            var selectedKey = this.getView().getModel().getProperty("/SelectedPayment");
            var oWizard = this.byId("paymentWizard");
            var oStep = this.byId("paymentTypeStep");

            // 선택된 결제 방법에 따라 다음 스텝 설정
            switch (selectedKey) {
                case "KakaoPay":
                    oStep.setNextStep(this.byId("idDestination"));
                    console.log("casekakao");
                    break;
                case "Card":
                    oStep.setNextStep(this.byId("cardInfoStep"));
                    console.log("casecard");
                    break;
                default:
                    oStep.setNextStep(this.byId("cardInfoStep"));
                    break;
            }
            
            // 위저드의 진행 단계를 업데이트
            oWizard.validateStep(oStep);
        },
        
        setPaymentMethod: function (oEvent) {
            var selectedKey = oEvent.getParameter("key");
            var oCartModel = this.getView().getModel("cart");
            oCartModel.setProperty("/SelectedPayment", selectedKey);

            // 각 스텝의 visible 속성을 업데이트
            this._updateStepVisibility(selectedKey);

            // 결제 방식에 따라 스텝을 초기화하고 2단계로 돌아갑니다.
            this._resetSteps();
            this.goToPaymentStep();

            // 버튼 보이게 하기
            this.getView().byId("id3").setVisible(true);
            this.getView().byId("id4").setVisible(true);
        },

        _resetSteps: function () {
            var oWizard = this.byId("paymentWizard");
            var oStep2 = this.byId("paymentTypeStep");
            var oStep3 = this.byId("cardInfoStep");
            var oStep4 = this.byId("idDestination");
        
            // 스텝 초기화
            oWizard.discardProgress(oStep2);
            oWizard.discardProgress(oStep3);
            oWizard.discardProgress(oStep4);

            // 단계 3과 단계 4의 입력 필드 초기화
            this._clearInputFields([
                "creditCardHolderName",
                "creditCardNumber",
                "creditCardSecurityNumber",
                "creditCardExpirationDate",
                "idPostcode",
                "idAddress",
                "idDetailAddress",
                "idExtraAddress"
            ]);

            // 2단계로 돌아가기
            oWizard.goToStep(oStep2);
        },

        _clearInputFields: function (aInputIds) {
            aInputIds.forEach(function (sId) {
                var oInput = this.getView().byId(sId);
                if (oInput) {
                    oInput.setValue("");
                    oInput.setValueState("None");
                }
            }, this);
        },

        _updateStepVisibility: function (selectedKey) {
            var oView = this.getView();

            // 모든 스텝들을 보이지 않도록 설정
            oView.byId("cardInfoStep").setVisible(false);
            oView.byId("idDestination").setVisible(false);
            // 선택된 결제 방법에 따른 스텝을 보이도록 설정
            switch (selectedKey) {
                case "KakaoPay":
                    oView.byId("idDestination").setVisible(true);
                    oView.byId("paymentTypeStep").setIcon("sap-icon://money-bills");
                    oView.byId("idDestination").setIcon("sap-icon://shipping-status");
                    break;
                case "Card":
                    oView.byId("cardInfoStep").setVisible(true);
                    oView.byId("idDestination").setVisible(true);
                    oView.byId("paymentTypeStep").setIcon("sap-icon://money-bills");
                    oView.byId("cardInfoStep").setIcon("sap-icon://credit-card");
                    oView.byId("idDestination").setIcon("sap-icon://shipping-status");
                    break;
                default:
                    oView.byId("cardInfoStep").setVisible(true);
                    oView.byId("idDestination").setVisible(true);
                    oView.byId("paymentTypeStep").setIcon("sap-icon://money-bills");
                    oView.byId("cardInfoStep").setIcon("sap-icon://credit-card");
                    oView.byId("idDestination").setIcon("sap-icon://shipping-status");
                    break;
            }
        }

    });
});
