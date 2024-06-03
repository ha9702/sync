sap.ui.define(
  [
      "sap/ui/core/mvc/Controller"
  ],

  function(BaseController) {
    "use strict";

    return BaseController.extend("sync.zec.main.controller.App", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
      },
  
      onRouteMatched: function (oEvent) {
        var sRouteName = oEvent.getParameter("name"),
          oArguments = oEvent.getParameter("arguments");
  
        // Save the current route name
        this.currentRouteName = sRouteName;
        this.currentVbeln = oArguments.vbeln;
      },
  
      onStateChanged: function (oEvent) {
        var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
          sLayout = oEvent.getParameter("layout");
  
        // Replace the URL with the new layout if a navigation arrow was used
        if (bIsNavigationArrow) {
          this.oRouter.navTo(
            this.currentRouteName, 
            {
              layout: sLayout, 
              vbeln: this.currentVbeln
            },
            true);
        } 
      },
  
      onExit: function () {
        this.oRouter.detachRouteMatched(this.onRouteMatched, this);
      }
    });
  }
);
