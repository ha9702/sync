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

            if (localStorage.getItem("materialCodes")) {
                this._addItemsFromLocalStorage();
            }

            // this._addItemsFromLocalStorage();
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

        _addItemsFromLocalStorage: function() {
            var oCartModel = this.getView().getModel("cart");
            var aCartItems = oCartModel.getProperty("/cartItems") || [];
            var materialCodes = JSON.parse(localStorage.getItem("materialCodes")) || [];

            console.log("Loaded material codes from local storage:", materialCodes);

            var oModel = this.getOwnerComponent().getModel(); // Assuming the main model is defined in manifest

            var promises = materialCodes.map(function(materialCode) {
                return new Promise(function(resolve, reject) {
                    console.log("Reading data for material code:", materialCode);
                    oModel.read("/SubItemSet('" + materialCode + "')", {
                        success: function(oData) {
                            console.log("Data received for material code:", materialCode, oData);
                            var oExistingItem = aCartItems.find(function(item) {
                                return item.Matnr === oData.Matnr;
                            });

                            if (!oExistingItem) {
                                var oNewItem = JSON.parse(JSON.stringify(oData));
                                oNewItem.Matnr = oData.Matnr;
                                oNewItem.Submonth = oCartModel.getProperty("/Submonth");
                                oNewItem.Quantity = oCartModel.getProperty("/Submonth").toString(); // 초기 수량 설정
                                oNewItem.Image = "/images/" + oData.Matnr + ".jpg"; // 이미지 경로 추가
                                oNewItem.Netpr = (parseFloat(oData.Netpr) * 30);
                                oNewItem.Waers = oData.Waers;

                                aCartItems.push(oNewItem);
                            }
                            resolve();
                        },
                        error: function(error) {
                            console.error("Error reading data for material code:", materialCode, error);
                            reject(error);
                        }
                    });
                });
            });

            Promise.all(promises).then(function() {
                oCartModel.setProperty("/cartItems", aCartItems);
                this._updateTotalPrice();
                localStorage.removeItem("materialCodes"); // 로컬 스토리지 지우기
                console.log("Cleared material codes from local storage");
            }.bind(this)).catch(function(error) {
                console.error("Error processing material codes:", error);
            });

            var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);

            var oCartToggleButton = this.byId("cartToggleButton");
            oCartToggleButton.setPressed(true);

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

            // Set additional text based on the value of oProduct.Maktx
            switch (oProduct.Maktx) {
                case "P-아르기닌":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 아르기닌은 혈액 순환 개선과 혈관 건강을 지원하여 심혈관 질환 예방에 도움을 줍니다. 운동 수행 능력과 근육 회복을 향상시키며, 성장 호르몬 분비를 촉진합니다. 면역 기능 강화와 상처 치유를 돕고, 남성의 성 건강에도 유익합니다. 또한, 체내 노폐물 제거와 신진대사 촉진에 기여합니다.");
                    break;
                case "P-비타민B플러스":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 비타민B플러스는 에너지 생산과 신진대사를 촉진하여 활력을 높여줍니다. 신경계와 뇌 기능을 지원하며, 스트레스 감소와 면역력 증진에 도움을 줍니다. 피부, 머리카락, 눈, 간 건강을 유지하는 데 탁월합니다. 다양한 B군 비타민이 포함된 비타민 B 플러스로 전반적인 건강을 강화하세요.");
                    break;
                case "P-밀크씨슬":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 밀크씨슬은 강력한 간 보호 효과로 간 건강을 지원하며, 해독 작용을 촉진합니다. 항산화 성분인 실리마린이 풍부하여 간 세포 재생과 염증 감소에 탁월합니다. 알코올이나 독소로 인한 간 손상을 예방하고, 소화 건강까지 챙기세요. 밀크씨슬로 간 건강을 최상으로 유지하세요.");
                    break;
                case "P-오메가3":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 오메가-3는 심장 건강을 증진하고, 콜레스테롤 수치를 조절하여 심혈관 질환 예방에 탁월합니다. 염증을 감소시켜 관절 건강을 지원하며, 두뇌 기능과 인지 능력을 향상시킵니다. 또한, 시력을 보호하고 눈 건강을 유지하는 데 도움을 줍니다.");
                    break;
                case "P-프로바이오틱스":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 프로바이오틱스는 유익한 생균 원료로, 장내 건강을 최적화합니다. 소화 기능을 개선하고, 면역 체계를 강화하여 전반적인 건강을 증진합니다. 유익한 박테리아 균주가 장내 균형을 맞춰주어 변비와 설사 예방에 효과적입니다. 꾸준한 섭취로 소화 건강과 면역력을 높이세요.");
                    break;
                case "P-마그네슘":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 고품질 마그네슘을 원료로 하여 근육 경련 완화와 신경 기능을 최적화합니다. 에너지 생산과 뼈 건강을 지원하며, 피로 회복과 스트레스 감소에 탁월한 효과를 제공합니다. 심장 건강과 혈압 조절에도 도움을 주어 전반적인 웰빙을 촉진합니다. 하루 한 정으로 간편하게 활력과 건강을 유지합니다.");
                    break;
                case "P-루테인":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 루테인은 마리골드꽃 추출물에서 얻은 루테인과 지아잔틴을 주원료로 한 눈 건강 보조제입니다. 이 제품은 황반 색소 밀도를 유지하고, 눈의 피로를 줄이며, 나이 관련 황반 변성(AMD) 예방에 도움을 줍니다. 또한, 루테인은 항산화 작용을 통해 피부 톤 개선과 자외선으로 인한 피부 손상을 방지합니다.");
                    break;
                case "P-비오틴":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 비오틴은 고품질 비오틴을 원료로 한 보충제로, 건강한 머리카락, 피부, 손톱을 유지하는 데 도움을 줍니다. 비오틴은 에너지 대사와 탄수화물, 지방, 단백질의 대사를 촉진하여 전반적인 건강을 지원합니다. 또한, 비오틴은 신경 기능을 개선하고 혈당 조절에도 유익합니다.");
                    break;
                case "P-콘드로이친":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 콘드로이친은 연골을 구성하는 주성분으로 혈관이 없는 연골에 영양분을 공급하고, 연골세포 활성과 연골 성분의 합성 증가를 통해 연골을 보호하고 연골에 탄성력을 주는 역할을 한다. -> 관절 및 연골 건강에 도움을 줄 수 있음 관절통증, 관절기능, 보행기능, 관절너비, 관절경직시간 개선에 도움을 줍니다.");
                    break;
                case "P-멜라토닌":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 멜라토닌은 생체 리듬을 조절하여 수면을 촉진합니다. 이 영양제를 복용하면 잠들기 어려운 경우나 수면의 질이 낮은 경우에 도움이 될 수 있습니다. 수면 장애 개선, 스트레스 완화, 신경보호 효과에 도움을 줍니다.");
                    break;
                case "P-L-테아닌":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : L-테아닌은 녹차나 차에 풍부하게 함유된 아미노산으로, 스트레스를 완화하고 집중력을 높이며 수면을 개선하는 데 도움을 줄 수 있습니다. 정신적인 안정과 편안함을 유지하는 데 도움이 되고 스트레스 완화, 수면개선, 집중력 향상, 신경보호, 스트레스로 인한 신체적 증상 완화를 도와줍니다.");
                    break;    
                case "P-가르시니아":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 가르시니아는 캄보지아라는 열대 과일에서 추출한 천연 성분으로 부작용이 적습니다. HCA 성분이 지방 형성을 억제하고 식욕을 줄이는 데 도움을 주기에 체중 감소, 콜레스테롤 개선, 항산화 효과, 혈당 수치 안정화 등 다양한 건강 기능에 도움을 줍니다.");
                    break;
                case "P-징코민":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 징코민은 은행잎추출물로 혈액의 응집을 방지하고 혈관을 확장시켜 혈액순환을 개선한다. 말초동맥 순환장애(간헐성 파행증; 이따금 절뚝거림)의 치료, 어지러움, 혈관성 및 퇴행성 이명, 두통, 기억력 감퇴, 우울감 등의 치매성 증상을 수반하는 기질성 뇌기능 장애의 치료를 도움 줍니다.");
                    break;
                case "P-글루타치온":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 글루타치온은 강력한 항산화제로, 면역 체계를 강화하고 멜라닌 생성을 억제하여 피부 톤을 밝게 해줍니다. 또한, 피부 세포를 보호하여 피부 노화를 방지합니다.");
                    break;
                case "P-코큐텐":
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : 코큐텐은 세포 에너지 생성을 돕고 노화를 지연시키는 효능이 있습니다. 또한, 심혈관 건강을 개선하고 운동 성능을 향상시키는 데 기여합니다.");
                    break;
                default:
                    oCartModel.setProperty("/selectedProduct/AdditionalText", "상품설명 : ");
                    break;
            }

        },

        _onResize: function (oEvent) {
            var oLayoutModel = this.getView().getModel("appView");
            var sLayout = oLayoutModel.getProperty("/layout");

            if (oEvent.name === "Phone") {
                if (sLayout !== LayoutType.TwoColumnsStartExpanded) {
                    oLayoutModel.setProperty("/layout", LayoutType.TwoColumnsStartExpanded);
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
            
            oCartModel.setProperty("/Before", "sub");
            oCartModel.refresh(true); // 변경 사항 즉시 반영
            console.log(oCartModel.getProperty("/Before"));

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
            var sKunnr = oCartModel.getProperty("/Kunnr").substr(0, 10);
            if (sKunnr) {
                MessageBox.information("현재 로그인한 고객코드: " + sKunnr);
            }
        },

        onMain: function() {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain", {}, true); // main view로 네비게이션
            
            // 해시 값을 유지한 채로 페이지를 새로고침
            setTimeout(function() {
                location.reload();
            }, 500);
        }
    });
});