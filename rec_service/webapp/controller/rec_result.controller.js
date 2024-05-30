sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sync.zec.recservice.controller.rec_result", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("rec_result").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function () {
            var oModel = this.getOwnerComponent().getModel("selectionModel"); // Component에 있는 모델 사용할 때
            this.getView().setModel(oModel, "selectionModel");

            this._setResultBasedOnSelection();
        },

        _setResultBasedOnSelection: function() {
            var oModel = this.getView().getModel("selectionModel");
            var aSelectedItems = oModel.getProperty("/selectedItems");
            var sUserName = oModel.getProperty("/userName");
            var sGender = oModel.getProperty("/selectedGender");
            var sAgeGroup = oModel.getProperty("/selectedAgeGroup");
            var sMedicationName = oModel.getProperty("/medicationName");

            // 결과를 저장할 모델 생성
            var oResultModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oResultModel, "resultModel");

            // 선택 항목에 따른 결과 설정
            var aResults = [];
            var sCustomMessage = "";  // ##형 이라고 뜰 맞춤형 결과 메시지

            var oImageModel = this.getView().getModel("imageModel");
            var oRootPath = oImageModel.getProperty("/path");

            // 자재코드 매핑
            var materialCodes = {
                "비타민B플러스": "H0110",
                "아르기닌": "H0210",
                "밀크씨슬": "H0310",
                "오메가3": "H0410",
                "프로바이오틱스": "H0510",
                "마그네슘": "H0610",
                "루테인": "H0710",
                "비오틴": "H0810",
                "코큐텐": "H0910",
                "L-테아닌": "H1010",
                "가르시니아": "H1110",
                "콘드로이진": "H1210",
                "글루타치온": "H1310",
                "멜라토닌": "H1410",
                "징코민": "H1510"
            };

            // Helper function to store material code in session storage
            var storeMaterialCode = function(name) {
                var materialCode = materialCodes[name];
                if (materialCode) {
                    sessionStorage.setItem(materialCode, materialCode);
                }
            };

            if (aSelectedItems.includes("간 건강")) {
                aResults.push({
                    name: "밀크씨슬",
                    description: "밀크씨슬은 강력한 간 보호 효과로 간 건강을 지원하며, 해독 작용을 촉진합니다. 항산화 성분인 실리마린이 풍부하여 간 세포 재생과 염증 감소에 탁월합니다.",
                    imageUrl: oRootPath + "/images/H0310.png"
                });
                storeMaterialCode("밀크씨슬");
                sCustomMessage = "간이 피로해 형 ";
            }
            if (aSelectedItems.includes("콜레스테롤")) {
                aResults.push({
                    name: "코큐텐",
                    description: "세포 에너지 생성을 돕고 노화를 지연시키는 효능이 있습니다. 또한, 심혈관 건강을 개선하고 운동 성능을 향상시키는 데 기여합니다.",
                    imageUrl: oRootPath + "/images/H0910.png"
                });
                storeMaterialCode("코큐텐");
                sCustomMessage = "콜레스테롤 관리합시다. 형 ";
            }
            if (aSelectedItems.includes("혈압 관리")) {
                aResults.push({
                    name: "비타민B플러스",
                    description: "비타민B플러스는 에너지 생산과 신진대사를 촉진하여 활력을 높여줍니다. 신경계와 뇌 기능을 지원하며, 스트레스 감소와 면역력 증진, 피부, 머리카락, 눈, 간 건강을 유지하는 데 탁월합니다.",
                    imageUrl: oRootPath + "/images/H0110.png"
                });
                storeMaterialCode("비타민B플러스");

                aResults.push({
                    name: "오메가3",
                    description: "오메가3는 콜레스테롤 수치를 조절하여 심혈관 질환 예방에 탁월하며, 두뇌 기능과 인지 능력을 향상시킵니다. 또한, 시력을 보호하고 눈 건강을 유지하는 데 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H0410.png"
                });
                storeMaterialCode("오메가3");
                sCustomMessage = "협압상승!! 형 ";
            }
            if (aSelectedItems.includes("혈당 관리")) {
                aResults.push({
                    name: "마그네슘",
                    description: "마그네슘은 근육 경련 완화와 신경 기능을 최적화합니다. 에너지 생산과 뼈 건강을 지원하며, 피로 회복과 스트레스 감소에 탁월한 효과를 제공합니다. 심장 건강과 혈압 조절에도 도움을 주어 전반적인 웰빙을 촉진합니다.",
                    imageUrl: oRootPath + "/images/H0610.png"
                });
                storeMaterialCode("마그네슘");
                sCustomMessage = "혈당이 위험해 형 ";
            }
            if (aSelectedItems.includes("뇌 건강")) {
                aResults.push({
                    name: "비타민B플러스",
                    description: "비타민B플러스는 에너지 생산과 신진대사를 촉진하여 활력을 높여줍니다. 신경계와 뇌 기능을 지원하며, 스트레스 감소와 면역력 증진, 피부, 머리카락, 눈, 간 건강을 유지하는 데 탁월합니다.",
                    imageUrl: oRootPath + "/images/H0110.png"
                });
                storeMaterialCode("비타민B플러스");

                aResults.push({
                    name: "징코민",
                    description: "은행잎추출물로 혈액의 응집을 방지하고 혈관을 확장시켜 혈액순환을 개선합니다. 말초동맥 순환장애의 치료, 어지러움, 혈관성 및 퇴행성 이명, 두통, 기억력 감퇴, 우울감 등의 치매성 증상을 수반하는 기질성 뇌기능 장애의 치료를 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H1510.png"
                });
                storeMaterialCode("징코민");
                sCustomMessage = "뇌도 쉼이 필요해 형 ";
            }
            if (aSelectedItems.includes("눈 건강")) {
                aResults.push({
                    name: "오메가3",
                    description: "오메가3는 콜레스테롤 수치를 조절하여 심혈관 질환 예방에 탁월하며, 두뇌 기능과 인지 능력을 향상시킵니다. 또한, 시력을 보호하고 눈 건강을 유지하는 데 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H0410.png"
                });
                storeMaterialCode("오메가3");

                aResults.push({
                    name: "루테인",
                    description: "루테인은 마리골드꽃 추출물에서 얻은 루테인과 지아잔틴을 주원료로 한 눈건강 보조제입니다. 황반 색소 밀도를 유지하고, 눈의 피로를 줄이며, 나이 관련 황반 변성(AMD) 예방에 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H0710.png"
                });
                storeMaterialCode("루테인");
                sCustomMessage = "하루종일 모니터만 바라봐 형 ";
            }
            if (aSelectedItems.includes("뼈 건강")) {
                aResults.push({
                    name: "마그네슘",
                    description: "마그네슘은 근육 경련 완화와 신경 기능을 최적화합니다. 에너지 생산과 뼈 건강을 지원하며, 피로 회복과 스트레스 감소에 탁월한 효과를 제공합니다. 심장 건강과 혈압 조절에도 도움을 주어 전반적인 웰빙을 촉진합니다.",
                    imageUrl: oRootPath + "/images/H0610.png"
                });
                storeMaterialCode("마그네슘");
                sCustomMessage = "비실이 형 ";
            }
            if (aSelectedItems.includes("위장 건강")) {
                aResults.push({
                    name: "프로바이오틱스",
                    description: "프로바이오틱스는 유익한 생균 원료로, 장내 건강을 최적화합니다. 소화 기능을 개선하고, 면역 체계를 강화하여 전반적인 건강을 증진합니다. 유익한 박테리아 균주가 장내 균형을 맞춰주어 변비와 설사 예방에 효과적입니다.",
                    imageUrl: oRootPath + "/images/H0510.png"
                });
                storeMaterialCode("프로바이오틱스");
                sCustomMessage = "바쁘다바빠 소화불량 사회인 형 ";
            }
            if (aSelectedItems.includes("관절/근육")) {
                aResults.push({
                    name: "아르기닌",
                    description: "아르기닌은 혈액 순환을 개선하고 혈관 건강을 지원하여 심혈관 건강에 탁월합니다. 운동 수행 능력과 근육 회복을 향상시킵니다. 면역 기능을 강화하고 상처 치유를 돕는 아르기닌의 효능을 경험하세요. ",
                    imageUrl: oRootPath + "/images/H0210.png"
                })
                storeMaterialCode("아르기닌");

                aResults.push({
                    name: "콘드로이진",
                    description: "콘드로이진은 연골을 구성하는 주성분으로 연골에 영양분을 공급하고, 연골세포 활성과 연골 성분의 합성 증가를 통해 연골을 보호하고 탄성력을 주는 역할을 함으로써 관절 및 연골 건강에 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H1210.png"
                })
                storeMaterialCode("콘드로이진");
                sCustomMessage = "이젠 관리할 나이 형 ";
            }
            if (aSelectedItems.includes("면역력")) {
                aResults.push({
                    name: "비타민B플러스",
                    description: "비타민B플러스는 에너지 생산과 신진대사를 촉진하여 활력을 높여줍니다. 신경계와 뇌 기능을 지원하며, 스트레스 감소와 면역력 증진, 피부, 머리카락, 눈, 간 건강을 유지하는 데 탁월합니다.",
                    imageUrl: oRootPath + "/images/H0110.png"
                });
                storeMaterialCode("비타민B플러스");

                aResults.push({
                    name: "코큐텐",
                    description: "코큐텐은 세포 에너지 생성을 돕고 노화를 지연시키는 효능이 있습니다. 또한, 심혈관 건강을 개선하고 운동 성능을 향상시키는 데 기여합니다.",
                    imageUrl: oRootPath + "/images/H0910.png"
                });
                storeMaterialCode("코큐텐");
                sCustomMessage = "나를 지켜야 하는 형 ";
            }
            if (aSelectedItems.includes("스트레스")) {
                aResults.push({
                    name: "비타민B플러스",
                    description: "비타민B플러스는 에너지 생산과 신진대사를 촉진하여 활력을 높여줍니다. 신경계와 뇌 기능을 지원하며, 스트레스 감소와 면역력 증진, 피부, 머리카락, 눈, 간 건강을 유지하는 데 탁월합니다.",
                    imageUrl: oRootPath + "/images/H0110.png"
                });
                storeMaterialCode("비타민B플러스");

                aResults.push({
                    name: "L-테아닌",
                    description: "L-테아닌은 녹차나 차에 풍부하게 함유된 아미노산으로, 스트레스를 완화하고 집중력을 높이며 수면을 개선하는 데 도움을 줍니다. 정신적인 안정과 편안함을 유지를 위해 섭취를 권합니다.",
                    imageUrl: oRootPath + "/images/H1010.png"
                });
                storeMaterialCode("L-테아닌");
                sCustomMessage = "스트레스 만땅 현대인 형 ";
            }
            if (aSelectedItems.includes("모발")) {
                aResults.push({
                    name: "비오틴",
                    description: "비오틴은 고품질 비오틴을 원료로 한 보충제로, 건강한 머리카락, 피부, 손톱을 유지하는 데 도움을 줍니다. 비오틴은 에너지 대사와 탄수화물, 지방, 단백질의 대사를 촉진하여 전반적인 건강을 지원합니다.",
                    imageUrl: oRootPath + "/images/H0810.png"
                });
                storeMaterialCode("비오틴");
                sCustomMessage = "모발이..필요해 형 ";
            }
            if (aSelectedItems.includes("수면")) {
                aResults.push({
                    name: "멜라토닌",
                    description: "멜라토닌은 생체 리듬을 조절하여 수면을 촉진합니다. 잠들기 어려운 경우나 수면의 질이 낮은 경우에 도움이 될 수 있습니다.",
                    imageUrl: oRootPath + "/images/H1410.png"
                });
                storeMaterialCode("멜라토닌");
                sCustomMessage = "잠이 필요해ㅠㅅㅠ 형 ";
            }
            if (aSelectedItems.includes("피부")) {
                aResults.push({
                    name: "글루타치온",
                    description: "글루타치온은 강력한 항산화제로, 면역 체계를 강화하고 멜라닌 생성을 억제하여 피부 톤을 밝게 해줍니다. 또한, 피부 세포를 보호하여 피부 노화를 방지합니다.",
                    imageUrl: oRootPath + "/images/H1310.png"
                });
                storeMaterialCode("글루타치온");
                sCustomMessage = "피부미인이 될거야 형 ";
            }
            if (aSelectedItems.includes("체지방관리")) {
                aResults.push({
                    name: "가르시니아",
                    description: "가르시니아는 캄보지아 열대 과일에서 추출한 천연 성분으로, HCA 성분이 지방 형성을 억제하고 식욕을 줄이는 데 도움을 주기에 체중 감소, 콜레스테롤 개선, 항산화 효과, 혈당 수치 안정화에 도움을 줍니다.",
                    imageUrl: oRootPath + "/images/H1110.png"
                });
                storeMaterialCode("가르시니아");
                sCustomMessage = "올해는 다이어트할거야 형 ";
            }

            var bAlreadyTaking = aResults.some(function(result) {
                return result.name === sMedicationName;
            });

            if (bAlreadyTaking) {
                oResultModel.setProperty("/alreadyTakingMessage", ` * 현재 복용중인 ${sMedicationName}을(를) 고려해서 추천된 조합이니 안심하세요 :) `);
            } else {
                oResultModel.setProperty("/alreadyTakingMessage", "");
            }

            oResultModel.setProperty("/results", aResults);
            oResultModel.setProperty("/userName", sUserName);
            oResultModel.setProperty("/customMessage", sCustomMessage);
            oResultModel.setProperty("/userDetails", `[ ${sUserName}: ${sAgeGroup} ${sGender} ]`); // 사용자 세부정보 설정
        
            // console.log(aResults);
        
        },

        onPurchase: function() {
            MessageToast.show("맞춤 영양제 구매하러 가기");
            var materialCodes = [];
            for (var i = 0; i < sessionStorage.length; i++) {
                var key = sessionStorage.key(i);
                var materialCode = sessionStorage.getItem(key);
                if (materialCode) {
                    materialCodes.push(materialCode);
                }
            }
            localStorage.setItem("materialCodes", JSON.stringify(materialCodes));
            console.log(materialCodes);
            
            window.close();  // 팝업 창 닫기
        },

        onConsult: function() {
            MessageToast.show("전문가 상담 예약하러 가기");
        }
    });
});
