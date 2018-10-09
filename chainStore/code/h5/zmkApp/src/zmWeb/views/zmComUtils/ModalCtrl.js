"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModalCtrl = (function () {
    function ModalCtrl(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    ModalCtrl.newCtrl = function (viewCtrl) {
        return new ModalCtrl(viewCtrl);
    };
    ModalCtrl.prototype.cancelFunc = function () {
        var target = this;
        return function () {
            target.viewCtrl.dismiss(null);
        };
    };
    ModalCtrl.prototype.dismiss = function (data) {
        this.viewCtrl.dismiss(data);
    };
    return ModalCtrl;
}());
exports.ModalCtrl = ModalCtrl;
