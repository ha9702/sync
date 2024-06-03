sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/f/library',
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter, FilterOperator, Sorter, MessageBox, fioriLibrary, JSONModel) {
        "use strict";

        return Controller.extend("sync.zec.main.controller.Master", {
            onInit: function () {
                // this.oView = this.getView();
                this._bDescendingSort = false;
                // this.oOrderTable = this.oView.byId("idOrderTable");
                this.oRouter = this.getOwnerComponent().getRouter();

                var oCustModel = this.getOwnerComponent().getModel("customer");
                this.getView().setModel(oCustModel, "customer");
                
                this._extractKunnrFromHash();

                var oTable = this.byId("idOrderTable");
                oTable.attachEventOnce("updateFinished", this._applyKunnrFilter, this);
            },

            _extractKunnrFromHash: function() {
                var sHash = window.location.hash; // 예: #kunnr=value1
                if (sHash) {
                    var sKunnr = sHash.split("=")[1];
                    if (sKunnr) {
                        sKunnr = decodeURIComponent(sKunnr);
                        var oModel = this.getView().getModel("customer");
                        oModel.setProperty("/kunnr", sKunnr);
                    }
                }
            },
            
            _applyKunnrFilter: function() {
                var oModel = this.getView().getModel("customer");
                var sKunnr = oModel.getProperty("/kunnr");

                if (sKunnr) {
                    var oTable = this.byId("idOrderTable");
                    var oBinding = oTable.getBinding("items");
                    var aFilters = [new Filter("Kunnr", FilterOperator.EQ, sKunnr.substring(0, 10))];
                    oBinding.filter(aFilters);
                }
            },

            // onSearch: function ( oEvent ) {
            //     var aFilter = [],
			// 	sQuery = oEvent.getParameter("query");

            //     // var a filter = [];
            //     // var sQuery = ~~~;

            //     if (sQuery && sQuery.length > 0) {
            //         var oFilter = new Filter("Vbeln", FilterOperator.Contains, sQuery);
            //         aFilter.push(oFilter);
			//     }

            //     this.oOrderTable.getBinding("items").filter(aFilter);
            // },

            // onSort: function ( oEvent ) {
            //     this._bDescendingSort = !this._bDescendingSort;
			//     var oBinding = this.oOrderTable.getBinding("items"),
			// 	    oSorter = new sap.ui.model.Sorter("Vbeln", this._bDescendingSort);

			//     oBinding.sort(oSorter);
            // },

            onListItemPress: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext(),
				vVbeln = oContext.getProperty("Vbeln");

			this.oRouter.navTo("detail", 
                {
                    layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                    vbeln: vVbeln
                }
            );
            //var oFCL = this.oView.getParent().getParent();
            //oFCL.setLayout(fioriLibrary.LayoutType.TwocolumnMidExpanded);
            },
            formatSubcmon: function(Subcmon) {
                return Subcmon == "00" ? "일반 구매" : Subcmon + " 개월 구독";
            }
        });
    });