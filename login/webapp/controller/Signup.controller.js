sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/thirdparty/jquery"
],
    function (Controller,
	MessageBox,
	ODataModel, jquery) {
        "use strict";

        return Controller.extend("sync.zec.login.controller.Signup", {
            onInit: function () {
                // var oModel = new ODataModel("sap/opu/odata/sap/YE04_LOGIN/");
                // this.getView().setModel(oModel);
                // Daum Postcode API 로드
                jQuery.sap.includeScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
        
            },

            onSignUpSubmit: function () {
                var signupId = this.byId("signupIdInput").getValue();
                var signupPassword = this.byId("signupPasswordInput").getValue();
                var signupName = this.byId("signupNameInput").getValue();


                // var signupAddress = this.byId("signupAddressInput").getValue();
                var signupPostcode = this.byId("sample6_postcode").getValue();
                var signupAddress = this.byId("sample6_address").getValue();
                var signupDetailAddress = this.byId("sample6_detailAddress").getValue();
                var fullAddress = "(" + signupPostcode + ")" + " " + signupAddress + " " + signupDetailAddress;


                var signupEmail = this.byId("signupEmailInput").getValue();
                var signupPhone = this.byId("signupPhoneInput").getValue();
    
                if (!signupId || !signupPassword) {
                    MessageBox.error("ID와 비밀번호는 필수 입력 사항입니다.");
                    return;
                } else {
                    
                    // 여기에 회원가입 로직을 추가합니다.
                    // MessageBox.success("회원가입이 완료되었습니다!");
                    var oModel = this.getView().getModel();
                    var oData = {
                        Custid: signupId,
                        Custpw: signupPassword,
                        Name1: signupName,
                        // Addnr: signupAddress,
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
                            
                            // this.getOwnerComponent().getRouter().navTo("RouteMain");
                        }
                    });

                }
                
                
            },

            onGoToLogin: function ( ) {
                // 로그인 페이지로 이동
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            },


            onSearchPostcode: function () {
                var that = this;
                new daum.Postcode({
                    oncomplete: function (data) {
                        var addr = ''; // 주소 변수
    
                        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                            addr = data.roadAddress;
                        } else { // 사용자가 지번 주소를 선택했을 경우(J)
                            addr = data.jibunAddress;
                        }
    
                        // 우편번호와 주소 정보를 해당 필드에 넣는다.
                        that.byId('sample6_postcode').setValue(data.zonecode);
                        that.byId("sample6_address").setValue(addr);
                        // 커서를 상세주소 필드로 이동한다.
                        that.byId("sample6_detailAddress").focus();
                    }
                }).open();
            }

        });
    });
