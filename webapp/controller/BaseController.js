sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History", "sap/ndc/BarcodeScanner",
	"sap/m/MessageBox"
], function(Controller, JSONModel, History, BarcodeScanner, MessageBox) {
	"use strict";

	return Controller.extend("Apontamento.paZPP_APONTAMENTO.BaseController", {
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getMessageModel: function() {
			return this.getOwnerComponent().getModel("message");
		},
		getMessageManager: function() {
			return this.getOwnerComponent().getMessageManager();
		},
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getEventBus: function() {
			return sap.ui.getCore().getEventBus();
		},
		getHelper: function() {
			return this.getOwnerComponent().getHelper();
		},
		getNextUiState: function(iNextLevel) {
			var oHelper = this.getHelper();
			return oHelper.getNextUIState(iNextLevel);
		},
		getDefaultODataModel: function() {
			return this.getOwnerComponent().getModel();
		},
		getBusyDialog: function(parameters) {
			return new sap.m.BusyDialog({
				title: parameters.title,
				text: parameters.text,
				close: parameters.onclose
			});

		},
		confirmAction: function(sMessage, sTitle, fnCallback) {
			sap.m.MessageBox.confirm(sMessage, {
				title: sTitle,
				onClose: fnCallback,
				styleClass: "",
				actions: [sap.m.MessageBox.Action.YES,
					sap.m.MessageBox.Action.CANCEL
				],
				emphasizedAction: sap.m.MessageBox.Action.YES,
				initialFocus: sap.m.MessageBox.Action.CANCEL,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		},
		toastMessage: function(message) {
			sap.m.MessageToast.show(message, {
				duration: 6000, // default
				animationTimingFunction: "ease-in-out", // default
				animationDuration: 1500, // default
				closeOnBrowserNavigation: true // default
			});
		},
		navigateBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Home", {
					layout: "OneColumn"
				});
			}
		},
		scanHU: function(oEvent) {
			return new Promise(function(resolve, reject) {
				BarcodeScanner.closeScanDialog();
				BarcodeScanner.scan(
					function(mResult) {
						//If user cancelled scanning, cancel routine.
						if (mResult.cancelled) {
							reject();
						}

						if (mResult.text === "") {
							reject();
						}

						resolve(mResult.text);

					},
					function(Error) {

					}
				);
			});
		},		
		// resetChanges: function(sCurrentBindingPath) {
		// 	return new Promise((resolve, reject) => {
		// 		var oModel = this.getOwnerComponent().getModel();
		// 		if (oModel.hasPendingChanges()) {
		// 			var oBundle = this.getResourceBundle();
		// 			this.confirmAction(oBundle.getText("SureToCancel"), oBundle.getText("CancelEditing"),
		// 				(oAction) => {
		// 					if (oAction === sap.m.MessageBox.Action.CANCEL) {
		// 						reject();
		// 					} else {
		// 						// let oPendingChanges = oModel.getPendingChanges();

		// 						// if (sCurrentBindingPath && oPendingChanges[sCurrentBindingPath.substr(1)]) {
		// 						// 	oModel.resetChanges([sCurrentBindingPath.substr(1)]);
		// 						// } else {
		// 						oModel.resetChanges();
		// 						// }

		// 						// oModel.updateBindings(true);
		// 						resolve();
		// 					}
		// 				});
		// 		} else {
		// 			resolve();
		// 		}
		// 	});
		// },
		// dialogEscapeHandler: function(oPromise) {
		// 	this.resetChanges().then(() => {
		// 		oPromise.resolve();
		// 	}).catch(() => {
		// 		oPromise.reject();
		// 	});
		// },
		onAfterCloseDialog: function(oEvent) {
			oEvent.getSource().destroy();
		},
		onMessagePopoverPress: function(oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function() {
			// create popover lazily (singleton)
			// if (!this._oMessagePopover) {
			// 	// create popover lazily (singleton)
			// 	this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
			// 		"zwmfc.mov_deposito.view.fragment.MessagePopover", this);
			// 	this.getView().addDependent(this._oMessagePopover);
			// }
			// return this._oMessagePopover;
		}

	});

});