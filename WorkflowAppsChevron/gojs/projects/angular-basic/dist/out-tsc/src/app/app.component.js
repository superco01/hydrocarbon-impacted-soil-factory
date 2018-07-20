"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var go = require("gojs");
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'My First GoJS App in Angular';
        this.model = new go.GraphLinksModel([
            { key: 1, text: "Alpha", color: "lightblue" },
            { key: 2, text: "Beta", color: "orange" },
            { key: 3, text: "Gamma", color: "lightgreen" },
            { key: 4, text: "Delta", color: "pink" }
        ], [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 2, to: 2 },
            { from: 3, to: 4 },
            { from: 4, to: 1 }
        ]);
    }
    AppComponent.prototype.showDetails = function (node) {
        this.node = node;
        if (node) {
            // copy the editable properties into a separate Object
            this.data = {
                text: node.data.text,
                color: node.data.color
            };
        }
        else {
            this.data = null;
        }
    };
    AppComponent.prototype.onCommitDetails = function () {
        if (this.node) {
            var model = this.node.diagram.model;
            // copy the edited properties back into the node's model data,
            // all within a transaction
            model.startTransaction();
            model.setDataProperty(this.node.data, "text", this.data.text);
            model.setDataProperty(this.node.data, "color", this.data.color);
            model.commitTransaction("modified properties");
        }
    };
    AppComponent.prototype.onCancelChanges = function () {
        // wipe out anything the user may have entered
        this.showDetails(this.node);
    };
    AppComponent.prototype.onModelChanged = function (c) {
        // who knows what might have changed in the selected node and data?
        this.showDetails(this.node);
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('text'),
    __metadata("design:type", typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object)
], AppComponent.prototype, "textField", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
exports.AppComponent = AppComponent;
var _a;
//# sourceMappingURL=app.component.js.map