sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/odata/v2/ODataModel"],function(e,o){"use strict";return e.extend("sync.zec.sales1.controller.Success",{onInit:function(){var e=this.getOwnerComponent().getModel("cart");var o=this.getView();o.setModel(e)},onNavHome:function(){var e=this.getOwnerComponent().getModel("cart");var o=sap.ui.core.UIComponent.getRouterFor(this);o.navTo("RouteMain");window.location.reload()}})});
//# sourceMappingURL=Success.controller.js.map