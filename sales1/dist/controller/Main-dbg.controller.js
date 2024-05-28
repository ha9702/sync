sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
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
                        sap.m.MessageBox.information("현재 로그인한 고객코드: " + sKunnr);
                    }
                }
            },
    
            // _getQueryParameter: function(sURL, sParam) {
            //     var sURLParams = sURL.split('?')[1] || '';
            //     var sQueryParams = sURLParams.split('&');
                
            //     for (var i = 0; i < sQueryParams.length; i++) {
            //         var sParamPair = sQueryParams[i].split('=');
            //         if (sParamPair[0] === sParam) {
            //             return decodeURIComponent(sParamPair[1]);
            //         }
            //     }
            //     return null;
            // },

            // _onObjectMatched: function (oEvent) {
            //     var oArgs = oEvent.getParameter("arguments");
            //     var oQuery = oArgs["?query"];
            //     if (oQuery && oQuery.kunnr) {
            //         var sKunnr = decodeURIComponent(oQuery.kunnr);
                    
            //         var oCartModel = this.getView().getModel("cart");
            //         oCartModel.setProperty("/Kunnr", sKunnr);
            //     }
            // },
    
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
            }
        });
    });