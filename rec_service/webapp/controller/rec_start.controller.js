sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    
    return Controller.extend("sync.zec.recservice.controller.rec_start", {
        onStartPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("rec_service1");
        }
    });
});