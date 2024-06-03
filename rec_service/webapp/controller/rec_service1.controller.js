sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sync/zec/recservice/util/formatter"
], function (Controller, JSONModel, MessageToast, formatter) {
    "use strict";
    
    return Controller.extend("sync.zec.recservice.controller.rec_service1", {  
        formatter: formatter,

        onInit: function () {
            var oViewModel = new JSONModel({
                medication: false,
                showMedicationInput: false,
                selectedAgeGroup: null,
                userName: "",
                selectedGender: "",
                aSelectedItems: [],
                medicationName: "" // 복용중인 약 이름
            });
            this.getView().setModel(oViewModel, "viewModel");

            this.selectedCount = 0;
        },

        onTogglePress: function(oEvent) {
            var oButton = oEvent.getSource();
            var sText = oButton.getText();
            var oModel = this.getView().getModel("selectionModel");
            var aSelectedItems = oModel.getProperty("/selectedItems");
        
            if (oButton.getPressed()) {
                if(this.selectedCount < 5) {
                    oButton.addStyleClass("selectedButton");
                    this.selectedCount++;
                    aSelectedItems.push(sText);
                } else {
                    oButton.setPressed(false);
                    MessageToast.show("최대 5개까지 선택할 수 있습니다.")
                }
            } else {
                oButton.removeStyleClass("selectedButton");
                this.selectedCount--;
                aSelectedItems = aSelectedItems.filter(function (item) {
                    return item !== sText;
                });
            }

            oModel.setProperty("/selectedItems", aSelectedItems);
        },
    
        onMedicationToggle: function (oEvent) {
            var bPressed = oEvent.getParameter("pressed");
            this.getView().getModel("viewModel").setProperty("/showMedicationInput", bPressed);
        },

        onMedicationInput: function(oEvent) {
            var sValue = oEvent.getSource().getValue();
            this.getView().getModel("viewModel").setProperty("/medicationName", sValue);
        },
    
        onGenderSelect: function (oEvent) {
            // var oButton = oEvent.getParameter("button");
            var sGender = oEvent.getSource().getText();
            var oModel = this.getView().getModel("selectionModel");
            oModel.setProperty("/selectedGender", sGender);
            debugger;
            MessageToast.show("성별: " + sGender);
        },
        
        onAgeSelect: function (oEvent) {
            // var oSelectedButton = oEvent.getParameter("button");
            var sAgeGroup = oEvent.getSource().getText();
            var oModel = this.getView().getModel("selectionModel");
            oModel.setProperty("/selectedAgeGroup", sAgeGroup); // 연령대 저장

            MessageToast.show("연령대: " + sAgeGroup)
        },

        onNavBack: function () {
            MessageToast.show("Navigation back pressed");
        },

        onNextPress: function () {
            // 두 번째 뷰로 넘어가기
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oViewModel = this.getView().getModel("viewModel");
            var sMedicationName = oViewModel.getProperty("/medicationName");

            // 'selectionModel'에 복용 중인 약 저장
            var oModel = this.getView().getModel("selectionModel");
            oModel.setProperty("/medicationName", sMedicationName);

            // rec_service2 view로 연결
            oRouter.navTo("rec_service2");
        }

        });
    });
    
