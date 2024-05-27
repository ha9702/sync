/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sync/zec/sales1/model/models",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, ODataModel, JSONModel) {
        "use strict";

        return UIComponent.extend("sync.zec.sales1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                var oRootPath = jQuery.sap.getModulePath("sync.zec.sales1"); // resource root

                var oImageModel = new JSONModel({
                    path: oRootPath
                });

                this.setModel(oImageModel, "imageModel");

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // set the cart model
                this.setModel(models.createCartModel(), "cart");
                
                // set the OData model
                // var oModel = new ODataModel("/sap/opu/odata/sap/ZEC_GW001_SRV/");
                // this.setModel(oModel);
            }
        });
    }
);