sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageToast) {
        "use strict";

        return Controller.extend("sync.zec.sales1.controller.Main", {
            onInit: function () {
                var oCartModel = this.getOwnerComponent().getModel("cart");
                this.getView().setModel(oCartModel, "cart");

                // var oRouter = UIComponent.getRouterFor(this);
                // oRouter.getRoute("synczecsales1").attachPatternMatched(this._onObjectMatched, this);
                
                this._extractKunnrFromHash();

            },

            _extractKunnrFromHash: function() {
                var sHash = window.location.hash; // 예: #kunnr=value1
                if (sHash) {
                    var sKunnr = sHash.split("=")[1];
                    if (sKunnr) {
                        sKunnr = decodeURIComponent(sKunnr);
                        var oCartModel = this.getView().getModel("cart");
                        oCartModel.setProperty("/Kunnr", sKunnr);
                        
                    }
                }
            },
    
            onRegularProductPress: function () {
                // 일반 상품 섹션 클릭 시 실행할 코드
                // sap.m.MessageToast.show("일반 상품 섹션이 클릭되었습니다.");
                // 일반 상품 섹션 클릭 시 Home.view로 이동
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome");
            },
    
            onSubscriptionProductPress: function () {
                // 구독 상품 섹션 클릭 시 실행할 코드
                // sap.m.MessageToast.show("구독 상품 섹션이 클릭되었습니다.");
                // 구독 상품 섹션 클릭 시 Sub.view로 이동
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteSub");
            },

            onRec: function() {
                var oCartModel = this.getView().getModel("cart");
                var sKunnr = oCartModel.getProperty("/Kunnr");
    
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
    
                    var hash = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "synczecrecservice",
                            action: "display"
                        },
                        params: {
                            kunnr: sKunnr
                        }
                    });
    
                    var sUrl = window.location.href.split('#')[0] + hash;
    
                    var sPopupWindow = window.open(sUrl, "SurveyPopup", "width=800,height=600");
                    if (!sPopupWindow) {
                        MessageToast.show("팝업을 열 수 없습니다. 팝업 차단을 해제해 주세요.");
                    } else {
                        var timer = setInterval(function() {
                            if (sPopupWindow.closed) {
                                clearInterval(timer);
                                if (localStorage.getItem("materialCodes")) {
                                    var oRouter = UIComponent.getRouterFor(this);
                                    oRouter.navTo("RouteSub");
                                } else {
                                    MessageToast.show("설문을 완료하지 않았습니다.");
                                }
                            }
                        }.bind(this), 500);
                    }
                } else {
                    MessageToast.show("Cross Application Navigation 서비스가 제공되지 않습니다.");
                }
            },

            onSearchOrder : function() {
                var oCartModel = this.getView().getModel("cart");
                var sKunnr = oCartModel.getProperty("/Kunnr");
    
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
    
                    var hash = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "synczecmain",
                            action: "display"
                        },
                        params: {
                            kunnr: sKunnr
                        }
                    });
    
                    var sUrl = window.location.href.split('#')[0] + hash;
    
                    var sPopupWindow = window.open(sUrl, "SurveyPopup", "width=800,height=600");
                    if (!sPopupWindow) {
                        MessageToast.show("팝업을 열 수 없습니다. 팝업 차단을 해제해 주세요.");
                    } 
                } else {
                    MessageToast.show("Cross Application Navigation 서비스가 제공되지 않습니다.");
                }
            },

            onChat: function() {
                var oCartModel = this.getView().getModel("cart");
                var sKunnr = oCartModel.getProperty("/Kunnr");
    
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
    
                    var hash = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "synczecchatting",
                            action: "display"
                        },
                        params: {
                            kunnr: sKunnr
                        }
                    });
    
                    var sUrl = window.location.href.split('#')[0] + hash;
    
                    var sPopupWindow = window.open(sUrl, "SurveyPopup", "width=800,height=600");
                    if (!sPopupWindow) {
                        MessageToast.show("팝업을 열 수 없습니다. 팝업 차단을 해제해 주세요.");
                    } 
                } else {
                    MessageToast.show("Cross Application Navigation 서비스가 제공되지 않습니다.");
                }
            }

        });
    });