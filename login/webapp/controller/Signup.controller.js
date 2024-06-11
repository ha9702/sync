sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/thirdparty/jquery"
],
function (Controller, MessageBox, ODataModel, jquery) {
    "use strict";

    return Controller.extend("sync.zec.login.controller.Signup", {
        onInit: function () {
            jQuery.sap.includeScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

            var oIdInput = this.byId("signupIdInput");
            var oPwInput = this.byId("signupPasswordInput");
            oIdInput.attachLiveChange(this._onIdInputChange, this);
            oPwInput.attachLiveChange(this._onPwInputChange, this);
        },

        _onIdInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oErrorText = this.byId("signupIdError");

            var sValidValue = sValue.replace(/[^a-zA-Z0-9]/g, '');

            if (sValue !== sValidValue) {
                oInput.setValue(sValidValue);
                oInput.addStyleClass("inputError");
                oErrorText.addStyleClass("errorMessageVisible");
            } else {
                oInput.removeStyleClass("inputError");
                oErrorText.removeStyleClass("errorMessageVisible");
            }
        },

        _onPwInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oErrorText = this.byId("signupPwError");

            // 한글을 포함하지 않도록 유효성 검사
            var sValidValue = sValue.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');

            if (sValue !== sValidValue) {
                oInput.setValue(sValidValue);
                oInput.addStyleClass("inputError");
                oErrorText.addStyleClass("errorMessageVisible");
            } else {
                oInput.removeStyleClass("inputError");
                oErrorText.removeStyleClass("errorMessageVisible");
            }
        },

        onSignUpSubmit: function () {
            var signupId = this.byId("signupIdInput").getValue();
            var signupPassword = this.byId("signupPasswordInput").getValue();
            var signupName = this.byId("signupNameInput").getValue();
            var signupPostcode = this.byId("sample6_postcode").getValue();
            var signupAddress = this.byId("sample6_address").getValue();
            var signupDetailAddress = this.byId("sample6_detailAddress").getValue();
            var fullAddress = "(" + signupPostcode + ")" + " " + signupAddress + " " + signupDetailAddress;
            var signupEmail = this.byId("signupEmailInput").getValue();
            var signupPhone = this.byId("signupPhoneInput").getValue();

            if (!signupId || !signupPassword) {
                MessageBox.error("ID와 비밀번호는 필수 입력 사항입니다.");
                return;
            } else if (/[^a-zA-Z0-9]/.test(signupId)) {
                MessageBox.error("ID는 영문자와 숫자만 포함할 수 있습니다.");
                return;
            } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(signupPassword)) {
                MessageBox.error("비밀번호는 한글을 포함할 수 없습니다.");
                return;
            } else {
                var oModel = this.getView().getModel();
                var oData = {
                    Custid: signupId,
                    Custpw: signupPassword,
                    Name1: signupName,
                    Addnr: fullAddress,
                    Cemail: signupEmail,
                    Telf1: signupPhone
                };

                oModel.create("/CustomerSet", oData, {
                    success: function () {
                        MessageBox.success("회원가입이 완료되었습니다!");
                    },
                    error: function (oError) {
                        MessageBox.error("이미 가입한 회원입니다. 로그인 화면으로 이동해주세요.");
                    }
                });
            }
        },

        onGoToLogin: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onSearchPostcode: function () {
            var that = this;
            new daum.Postcode({
                oncomplete: function (data) {
                    var addr = '';
                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }
                    that.byId('sample6_postcode').setValue(data.zonecode);
                    that.byId("sample6_address").setValue(addr);
                    that.byId("sample6_detailAddress").focus();
                }
            }).open();
        }
    });
});
