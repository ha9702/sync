/*global QUnit*/

sap.ui.define([
	"synczec/rec_service/controller/rec_service1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("rec_service1 Controller");

	QUnit.test("I should test the rec_service1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
