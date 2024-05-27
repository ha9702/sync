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
                // Add press event listeners to VBoxes
                // this.byId("regularProductSection").attachBrowserEvent("click", this.onRegularProductPress.bind(this));
                // this.byId("subscriptionProductSection").attachBrowserEvent("click", this.onSubscriptionProductPress.bind(this));
            },
    
            onRegularProductPress: function () {
                // 일반 상품 섹션 클릭 시 실행할 코드
                sap.m.MessageToast.show("일반 상품 섹션이 클릭되었습니다.");
                // 일반 상품 섹션 클릭 시 Home.view로 이동
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome");
            },
    
            onSubscriptionProductPress: function () {
                // 구독 상품 섹션 클릭 시 실행할 코드
                sap.m.MessageToast.show("구독 상품 섹션이 클릭되었습니다.");
                // 구독 상품 섹션 클릭 시 Sub.view로 이동
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteSub");
            }
        });
    });