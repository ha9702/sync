sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("sync.zec.login.controller.Main", {
            onInit: function () {

            },

            onSubmit: function () {
                var customerId = this.byId("customerIdInput").getValue();
                var password = this.byId("passwordInput").getValue();
    
                if (!customerId || !password) {
                    MessageBox.error("ID, password 는 필수 입력 정보입니다.");
                    return;
                }
    
                var oModel = this.getView().getModel();
                var that = this;
    
                oModel.read("/CustomerSet", {
                    success: function (oData) {
                        var customers = oData.results;
                        var validCustomer = customers.find(function (customer) {
                            return customer.Custid === customerId && customer.Custpw === password;
                        });
    
                        if (validCustomer) {
                            MessageBox.success("Login successful!", {
                                onClose: function() {
                                    // 쇼핑몰 페이지로 이동
                                    var kunnr = validCustomer.Kunnr;
                                    var hash = "synczecsales1-display?kunnr=" + encodeURIComponent(kunnr);
                                    var url = "#/" + hash;

                                    // Cross-app navigation using UShell service
                                    sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
                                        target: {
                                            shellHash: hash
                                        }
                                    });
                                }
                            });
                        } else {
                            MessageBox.error("올바르지 않은 ID 또는 password 입니다.");
                        }
                    },
                    error: function (oError) {
                        MessageBox.error("고객 데이터를 불러오는 중 오류가 발생했습니다.");
                    }
                });
            },

            onSignup: function () {
                // 회원가입 페이지로 이동
                this.getOwnerComponent().getRouter().navTo("RouteSignup");
            }

        });
    });
