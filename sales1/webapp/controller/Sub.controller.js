sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/LayoutType",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, LayoutType, Device, MessageBox, History, UIComponent) {
    "use strict";

    return Controller.extend("sync.zec.sales1.controller.Sub", {
        onInit: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");
            this.getView().setModel(oCartModel, "cart");

            // 초기 레이아웃 설정
            var oLayoutModel = new JSONModel({
                layout: LayoutType.TwoColumnsMidExpanded
            });
            this.getView().setModel(oLayoutModel, "appView");

            // Listen to screen size changes
            Device.media.attachHandler(this._onResize.bind(this), null, Device.media.RANGESETS.SAP_STANDARD);

            oCartModel.setProperty("/productSelected", false);
            oCartModel.setProperty("/Submonth", 3); // 초기 구독 개월 수 설정
            
        },

        onToggleCart: function (oEvent) {
            var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            var bPressed = oEvent.getParameter("pressed");

            if (bPressed) {
                oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);
            } else {
                oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsMidExpanded);
            }
        },

        onAddToCart: function () {
            var oCartModel = this.getView().getModel("cart");
            var oSelectedProduct = oCartModel.getProperty("/selectedProduct");

            // 선택된 상품이 정의되지 않았거나 비어있지 않은지 확인
            if (!oSelectedProduct || !oSelectedProduct.Maktx) {
                sap.m.MessageToast.show("선택된 상품이 없습니다.");
                return;
            }

            var aCartItems = oCartModel.getProperty("/cartItems");
            var oExistingItem = aCartItems.find(function (item) {
                return item.Maktx === oSelectedProduct.Maktx;
            });

            if (oExistingItem) {
                sap.m.MessageToast.show("이미 추가된 상품입니다.");
            } else {
                oSelectedProduct.Matnr = oSelectedProduct.Matnr;
                oSelectedProduct.Submonth = oCartModel.getProperty("/Submonth");
                oSelectedProduct.Quantity = oCartModel.getProperty("/Submonth").toString(); // 초기 수량을 소수점 두 자리로 설정
                oSelectedProduct.Image = "/images/" + oSelectedProduct.Matnr + ".jpg"; // 이미지 경로 추가
                oSelectedProduct.Netpr = (parseFloat(oSelectedProduct.Netpr) * 30);
                oSelectedProduct.Waers = oSelectedProduct.Waers;
                aCartItems.push(JSON.parse(JSON.stringify(oSelectedProduct))); // Deep copy to avoid reference issues
            }

            oCartModel.setProperty("/cartItems", aCartItems);
            // Update total price
            this._updateTotalPrice();

            var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);

            var oCartToggleButton = this.byId("cartToggleButton");
            oCartToggleButton.setPressed(true);
        },

        onSubMonth: function (oEvent) {
            var oCartModel = this.getView().getModel("cart");
            var submonth = oEvent.getParameter("value");
            oCartModel.setProperty("/Submonth", submonth);
            console.log(oCartModel);
            this._updateQuantitiesAndTotalPrice();
        },

        _updateQuantitiesAndTotalPrice: function () {
            var oCartModel = this.getView().getModel("cart");
            var aCartItems = oCartModel.getProperty("/cartItems");
            var Submonth = oCartModel.getProperty("/Submonth");

            aCartItems.forEach(function (item) {
                item.Quantity = Submonth.toString();
            });

            oCartModel.setProperty("/cartItems", aCartItems);
            this._updateTotalPrice();
        },
        
        _updateTotalPrice: function () {
            var oCartModel = this.getView().getModel("cart");
            var aCartItems = oCartModel.getProperty("/cartItems");
            var fTotalPrice = 0;

            aCartItems.forEach(function (oItem) {
                var fItemPrice = parseFloat(oItem.Netpr);
                fTotalPrice += fItemPrice * parseFloat(oItem.Quantity);
            });

            oCartModel.setProperty("/totalPrice", fTotalPrice);
        },

        onSelectProduct: function (oEvent) {
            var oProduct = oEvent.getSource().getBindingContext().getObject();
            var oView = this.getView();
            var oCartModel = oView.getModel("cart");
            console.log(oProduct);
            console.log(oCartModel);
            oCartModel.setProperty("/selectedProduct", oProduct);
            oCartModel.setProperty("/selectedProduct/pillNetpr", parseInt(oProduct.Netpr) )
            oCartModel.setProperty("/productSelected", true);

            // var oSelect = this.byId("idToSelect");
            // oSelect.bindElement({
            //     path: "/ListItemSet('" + oProduct.Matnr + "')"
            // });

            // 바인딩 경로 설정 및 첫 번째 항목 선택
            // var sPath = "/ListItemSet('" + oProduct.Matnr + "')/toSelect";
            // oSelect.bindAggregation("items", {
            //     path: sPath,
            //     template: new sap.ui.core.ListItem({
            //         key: "{Matnr}",
            //         text: "{Maktx}",
            //         additionalText: {
            //             parts: [{ path: 'Netpr' }, { path: 'Waers' }],
            //             formatter: this.formatCurrency
            //         }
            //     }),
            //     events: {
            //         dataReceived: function() {
            //             var aItems = oSelect.getItems();
            //             if (aItems.length > 0) {
            //                 var oFirstItem = aItems[0];
            //                 var sKey = oFirstItem.getKey();
            //                 var sText = oFirstItem.getText();
            //                 var sAdditionalText = oFirstItem.getAdditionalText();
            //                 var [Netpr, Waers] = sAdditionalText.split(" ");

            //                 oCartModel.setProperty("/selectedProduct/selectedOption", {
            //                     key: sKey,
            //                     text: sText,
            //                     additionalText: sAdditionalText,
            //                     Netpr: Netpr,
            //                     Waers: Waers
            //                 });
            //                 oSelect.setSelectedKey(sKey);
            //             }
            //         }
            //     }
            // });
            
            // Set additional text based on the value of oProduct.Maktx
            switch (oProduct.Maktx) {
                case "P-아르기닌":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : Special text for P-아르기닌");
                    break;
                case "P-비타민B플러스":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : Details for P-비타민B플러스");
                    break;
                case "P-밀크씨슬":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : Information about P-밀크씨슬");
                    break;
                default:
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : Default additional text");
                    break;
            }

        },

        _onResize: function (oEvent) {
            var oLayoutModel = this.getView().getModel("appView");
            var sLayout = oLayoutModel.getProperty("/layout");

            if (oEvent.name === "Phone") {
                if (sLayout !== LayoutType.OneColumn) {
                    oLayoutModel.setProperty("/layout", LayoutType.OneColumn);
                }
            } else if (oEvent.name === "Tablet") {
                if (sLayout !== LayoutType.TwoColumnsStartExpanded) {
                    oLayoutModel.setProperty("/layout", LayoutType.TwoColumnsStartExpanded);
                }
            } else {
                if (sLayout !== LayoutType.ThreeColumnsMidExpandedEndHidden) {
                    oLayoutModel.setProperty("/layout", LayoutType.ThreeColumnsMidExpandedEndHidden);
                }
            }
        },

        onEditCart: function () {
            var oCartModel = this.getView().getModel("cart");
            oCartModel.setProperty("/editMode", true); // 편집 모드 활성화
        },

        onSaveChanges: function () {
            var oCartModel = this.getView().getModel("cart");
            oCartModel.setProperty("/editMode", false); // 편집 모드 비활성화
        },
        onDeleteItem: function (oEvent) {
            var oButton = oEvent.getSource();
            var oItemContext = oButton.getBindingContext("cart");
            var sEntryId = oItemContext.getObject().Maktx;
            var oCartModel = oItemContext.getModel();
            var aCartItems = oCartModel.getProperty("/cartItems");
        
            MessageBox.confirm("장바구니에서 상품을 삭제하시겠습니까?", {
                title: "상품 삭제",
                actions: ["삭제", "취소"],
                onClose: function (oAction) {
                    if (oAction === "삭제") {
                        var aUpdatedCartItems = aCartItems.filter(function(item) {
                            return item.Maktx !== sEntryId;
                        });
        
                        oCartModel.setProperty("/cartItems", aUpdatedCartItems);
                        this._updateTotalPrice(); // Update total price
                    }
                }.bind(this)
            });
        },

        onPayment: function () {
            var oRouter = UIComponent.getRouterFor(this);
            var oCartModel = this.getView().getModel("cart");
            var aCartItems = oCartModel.getProperty("/cartItems");

            if (aCartItems.length > 0) {
                // Pass the source view as a parameter
            oRouter.navTo("RoutePayment", {
                cartItems: encodeURIComponent(JSON.stringify(aCartItems)),
                sourceView: "sub"
            });
            } else {
                // 카트에 아이템이 없을 경우 메시지 표시
                sap.m.MessageToast.show("장바구니에 상품이 없습니다.");
            }
        },

        onAvatarPress: function() {
            var oCartModel = this.getView().getModel("cart");
            var sKunnr = oCartModel.getProperty("/Kunnr");
            if (sKunnr) {
                MessageBox.information("현재 로그인한 고객코드: " + sKunnr);
            }
        }

        // onSelectChange: function (oEvent) {
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     var sSelectedKey = oSelectedItem.getKey();
        //     var sSelectedText = oSelectedItem.getText();
        //     var sAdditionalText = oSelectedItem.getAdditionalText();
        //     var [Netpr, Waers] = sAdditionalText.split(" "); // Assuming the formatter returns Netpr and Waers separated by space

        //     var oCartModel = this.getView().getModel("cart");
        //     var oSelectedProduct = oCartModel.getProperty("/selectedProduct");
            
        //     // Update selected product details
        //     oSelectedProduct.selectedOption = {
        //         key: sSelectedKey,
        //         text: sSelectedText,
        //         additionalText: sAdditionalText,
        //         Netpr: Netpr,
        //         Waers: Waers
        //     };
        
        //     // Bind product details to the selected product in the cart model
        //     oCartModel.setProperty("/selectedProduct", oSelectedProduct);
        
        //     // Optionally, if additional details need to be fetched from an OData service, implement the logic here
        //     // Example: this._fetchProductDetails(sSelectedKey);
        
        //     // Update product details view
        //     var oProductDetailsVBox = this.byId("productDetails");
        //     oProductDetailsVBox.bindElement({
        //         path: "/selectedProduct",
        //         model: "cart"
        //     });
            
        //     console.log(oSelectedProduct);

        //     this._updateTotalPrice();
        // }
        
    });
});