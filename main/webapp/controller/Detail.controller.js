sap.ui.define([
    "sap/ui/core/mvc/Controller"
 ], function(
    Controller
 ) {
    "use strict";
 
    return Controller.extend("sync.zec.main.controller.Detail", {
 
         onInit: function () { // Controller 초기화
          var oOwnerComponent = this.getOwnerComponent();

          this.oRouter = oOwnerComponent.getRouter();
          this.oRouter.getRoute("master").attachPatternMatched(this._onOrderMatched, this);
          this.oRouter.getRoute("detail").attachPatternMatched(this._onOrderMatched, this);
       },
 
       _onOrderMatched: function (oEvent) { 
         this._vbeln = oEvent.getParameter("arguments").vbeln || this._vbeln || "";
         this.getView().bindElement("/OrderSet('" + this._vbeln + "')");
       },

         // 편집토글버튼이 눌릴 때 호출된다. 
         onEditToggleButtonPress: function() {
          var oObjectPage = this.getView().byId("ObjectPageLayout"), // 뷰에서 ObjectPageLayout을 가져온다.
             bCurrentShowFooterState = oObjectPage.getShowFooter();
 
          oObjectPage.setShowFooter(!bCurrentShowFooterState);
       },
 
       onExit: function () {
          this.oRouter.getRoute("master").detachPatternMatched(this._onOrderMatched, this);
          this.oRouter.getRoute("detail").detachPatternMatched(this._onOrderMatched, this);
       },
       
       formatSubcmon: function(Subcmon) {
         return Subcmon == "00" ? "일반 구매" : Subcmon + " 개월 구독";
     }
 
    });
 });