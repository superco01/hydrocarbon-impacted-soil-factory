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
var DiagramEditorComponent = (function () {
    function DiagramEditorComponent() {
        var _this = this;
        this.diagram = new go.Diagram();
        this.palette = new go.Palette();
        this.nodeSelected = new core_1.EventEmitter();
        this.modelChanged = new core_1.EventEmitter();
        var $ = go.GraphObject.make;
        this.diagram = new go.Diagram();
        this.diagram.initialContentAlignment = go.Spot.Center;
        this.diagram.allowDrop = true; // necessary for dragging from Palette
        this.diagram.undoManager.isEnabled = true;
        this.diagram.addDiagramListener("ChangedSelection", function (e) {
            var node = e.diagram.selection.first();
            _this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
        this.diagram.addModelChangedListener(function (e) { return e.isTransactionFinished && _this.modelChanged.emit(e); });
        this.diagram.nodeTemplate =
            $(go.Node, "Auto", new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, {
                fill: "white", strokeWidth: 0,
                portId: "", cursor: "pointer",
                // allow many kinds of links
                fromLinkable: true, toLinkable: true,
                fromLinkableSelfNode: true, toLinkableSelfNode: true,
                fromLinkableDuplicates: true, toLinkableDuplicates: true
            }, new go.Binding("fill", "color")), $(go.TextBlock, { margin: 8, editable: true }, new go.Binding("text").makeTwoWay()));
        this.diagram.linkTemplate =
            $(go.Link, 
            // allow relinking
            { relinkableFrom: true, relinkableTo: true }, $(go.Shape), $(go.Shape, { toArrow: "OpenTriangle" }));
        this.palette = new go.Palette();
        this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;
        // initialize contents of Palette
        this.palette.model.nodeDataArray =
            [
                { text: "Alpha", color: "lightblue" },
                { text: "Beta", color: "orange" },
                { text: "Gamma", color: "lightgreen" },
                { text: "Delta", color: "pink" },
                { text: "Epsilon", color: "yellow" }
            ];
    }
    Object.defineProperty(DiagramEditorComponent.prototype, "model", {
        get: function () { return this.diagram.model; },
        set: function (val) { this.diagram.model = val; },
        enumerable: true,
        configurable: true
    });
    DiagramEditorComponent.prototype.ngOnInit = function () {
        this.diagram.div = this.diagramRef.nativeElement;
        this.palette.div = this.paletteRef.nativeElement;
    };
    return DiagramEditorComponent;
}());
__decorate([
    core_1.ViewChild('diagramDiv'),
    __metadata("design:type", typeof (_a = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _a || Object)
], DiagramEditorComponent.prototype, "diagramRef", void 0);
__decorate([
    core_1.ViewChild('paletteDiv'),
    __metadata("design:type", typeof (_b = typeof core_1.ElementRef !== "undefined" && core_1.ElementRef) === "function" && _b || Object)
], DiagramEditorComponent.prototype, "paletteRef", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", go.Model),
    __metadata("design:paramtypes", [go.Model])
], DiagramEditorComponent.prototype, "model", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DiagramEditorComponent.prototype, "nodeSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DiagramEditorComponent.prototype, "modelChanged", void 0);
DiagramEditorComponent = __decorate([
    core_1.Component({
        selector: 'app-diagram-editor',
        templateUrl: './diagram-editor.component.html',
        styleUrls: ['./diagram-editor.component.css']
    }),
    __metadata("design:paramtypes", [])
], DiagramEditorComponent);
exports.DiagramEditorComponent = DiagramEditorComponent;
var _a, _b;
//# sourceMappingURL=diagram-editor.component.js.map