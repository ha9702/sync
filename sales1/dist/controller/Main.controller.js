sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/m/MessageToast"],function(e,t,o){"use strict";return e.extend("sync.zec.sales1.controller.Main",{onInit:function(){var e=this.getOwnerComponent().getModel("cart");this.getView().setModel(e,"cart");this._extractKunnrFromHash()},_extractKunnrFromHash:function(){var e=window.location.hash;if(e){var t=e.split("=")[1];if(t){t=decodeURIComponent(t);var o=this.getView().getModel("cart");o.setProperty("/Kunnr",t)}}},onRegularProductPress:function(){var e=t.getRouterFor(this);e.navTo("RouteHome")},onSubscriptionProductPress:function(){var e=t.getRouterFor(this);e.navTo("RouteSub")},onRec:function(){var e=this.getView().getModel("cart");var r=e.getProperty("/Kunnr");if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var n=sap.ushell.Container.getService("CrossApplicationNavigation");var a=n.hrefForExternal({target:{semanticObject:"synczecrecservice",action:"display"},params:{kunnr:r}});var i=window.location.href.split("#")[0]+a;var s=window.open(i,"SurveyPopup","width=800,height=600");if(!s){o.show("팝업을 열 수 없습니다. 팝업 차단을 해제해 주세요.")}else{var c=setInterval(function(){if(s.closed){clearInterval(c);if(localStorage.getItem("materialCodes")){var e=t.getRouterFor(this);e.navTo("RouteSub")}else{o.show("설문을 완료하지 않았습니다.")}}}.bind(this),500)}}else{o.show("Cross Application Navigation 서비스가 제공되지 않습니다.")}}})});
//# sourceMappingURL=Main.controller.js.map