sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/f/LayoutType","sap/ui/Device","sap/m/MessageBox","sap/ui/core/routing/History","sap/ui/core/UIComponent"],function(e,t,r,o,a,n,s){"use strict";return e.extend("sync.zec.sales1.controller.Sub",{onInit:function(){var e=this.getOwnerComponent().getModel("cart");this.getView().setModel(e,"cart");var a=new t({layout:r.TwoColumnsMidExpanded});this.getView().setModel(a,"appView");o.media.attachHandler(this._onResize.bind(this),null,o.media.RANGESETS.SAP_STANDARD);e.setProperty("/productSelected",false);e.setProperty("/Submonth",3)},onToggleCart:function(e){var t=this.byId("flexibleColumnLayout");var o=e.getParameter("pressed");if(o){t.setLayout(r.ThreeColumnsMidExpanded)}else{t.setLayout(r.TwoColumnsMidExpanded)}},onAddToCart:function(){var e=this.getView().getModel("cart");var t=e.getProperty("/selectedProduct");if(!t||!t.Maktx){sap.m.MessageToast.show("선택된 상품이 없습니다.");return}var o=e.getProperty("/cartItems");var a=o.find(function(e){return e.Maktx===t.Maktx});if(a){sap.m.MessageToast.show("이미 추가된 상품입니다.")}else{t.Matnr=t.Matnr;t.Submonth=e.getProperty("/Submonth");t.Quantity=e.getProperty("/Submonth").toString();t.Image="/images/"+t.Matnr+".jpg";t.Netpr=parseFloat(t.Netpr)*30;t.Waers=t.Waers;o.push(JSON.parse(JSON.stringify(t)))}e.setProperty("/cartItems",o);this._updateTotalPrice();var n=this.byId("flexibleColumnLayout");n.setLayout(r.ThreeColumnsMidExpanded);var s=this.byId("cartToggleButton");s.setPressed(true)},onSubMonth:function(e){var t=this.getView().getModel("cart");var r=e.getParameter("value");t.setProperty("/Submonth",r);console.log(t);this._updateQuantitiesAndTotalPrice()},_updateQuantitiesAndTotalPrice:function(){var e=this.getView().getModel("cart");var t=e.getProperty("/cartItems");var r=e.getProperty("/Submonth");t.forEach(function(e){e.Quantity=r.toString()});e.setProperty("/cartItems",t);this._updateTotalPrice()},_updateTotalPrice:function(){var e=this.getView().getModel("cart");var t=e.getProperty("/cartItems");var r=0;t.forEach(function(e){var t=parseFloat(e.Netpr);r+=t*parseFloat(e.Quantity)});e.setProperty("/totalPrice",r)},onSelectProduct:function(e){var t=e.getSource().getBindingContext().getObject();var r=this.getView();var o=r.getModel("cart");console.log(t);console.log(o);o.setProperty("/selectedProduct",t);o.setProperty("/selectedProduct/pillNetpr",parseInt(t.Netpr));o.setProperty("/productSelected",true);switch(t.Maktx){case"P-아르기닌":o.setProperty("/selectedProduct/AdditionalText","상품설명 : Special text for P-아르기닌");break;case"P-비타민B플러스":o.setProperty("/selectedProduct/AdditionalText","상품설명 : Details for P-비타민B플러스");break;case"P-밀크씨슬":o.setProperty("/selectedProduct/AdditionalText","상품설명 : Information about P-밀크씨슬");break;default:o.setProperty("/selectedProduct/AdditionalText","상품설명 : Default additional text");break}},_onResize:function(e){var t=this.getView().getModel("appView");var o=t.getProperty("/layout");if(e.name==="Phone"){if(o!==r.OneColumn){t.setProperty("/layout",r.OneColumn)}}else if(e.name==="Tablet"){if(o!==r.TwoColumnsStartExpanded){t.setProperty("/layout",r.TwoColumnsStartExpanded)}}else{if(o!==r.ThreeColumnsMidExpandedEndHidden){t.setProperty("/layout",r.ThreeColumnsMidExpandedEndHidden)}}},onEditCart:function(){var e=this.getView().getModel("cart");e.setProperty("/editMode",true)},onSaveChanges:function(){var e=this.getView().getModel("cart");e.setProperty("/editMode",false)},onDeleteItem:function(e){var t=e.getSource();var r=t.getBindingContext("cart");var o=r.getObject().Maktx;var n=r.getModel();var s=n.getProperty("/cartItems");a.confirm("장바구니에서 상품을 삭제하시겠습니까?",{title:"상품 삭제",actions:["삭제","취소"],onClose:function(e){if(e==="삭제"){var t=s.filter(function(e){return e.Maktx!==o});n.setProperty("/cartItems",t);this._updateTotalPrice()}}.bind(this)})},onPayment:function(){var e=s.getRouterFor(this);var t=this.getView().getModel("cart");var r=t.getProperty("/cartItems");if(r.length>0){e.navTo("RoutePayment",{cartItems:encodeURIComponent(JSON.stringify(r))})}else{sap.m.MessageToast.show("장바구니에 상품이 없습니다.")}}})});
//# sourceMappingURL=Sub.controller.js.map