sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,t){"use strict";return{createDeviceModel:function(){var n=new e(t);n.setDefaultBindingMode("OneWay");return n},createCartModel:function(){var t=new e({cartItems:[],selectedProduct:{},editMode:false,totalPrice:0,SelectedPayment:"Card",Submonth:0,pillNetpr:0});t.setDefaultBindingMode("TwoWay");return t}}});
//# sourceMappingURL=models.js.map