$.getScript("../../gojs/release/go.js", function(){} );
window.onload=init;
console.log("wewe");
function  init() {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates
            myDiagram =
                $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                    {
                        initialContentAlignment: go.Spot.Center,
                        allowDrop: true,  // must be true to accept drops from the Palette
                        "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                        "LinkRelinked": showLinkLabel,
                        scrollsPageOnFocus: false,
                        "undoManager.isEnabled": true  // enable undo & redo
                    });
            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function(e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });
            // helper definitions for node templates
            function nodeStyle() {
                return [
                    // The Node.location comes from the "loc" property of the node data,
                    // converted by the Point.parse static method.
                    // If the Node.location is changed, it updates the "loc" property of the node data,
                    // converting back using the Point.stringify static method.
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // the Node.location is at the center of each node
                        locationSpot: go.Spot.Center
                    }
                ];
            }
            // Define a function for creating a "port" that is normally transparent.
            // The "name" is used as the GraphObject.portId,
            // the "align" is used to determine where to position the port relative to the body of the node,
            // the "spot" is used to control how links connect with the port and whether the port
            // stretches along the side of the node,
            // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
            function makePort(name, align, spot, output, input) {
                var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
                // the port is basically just a transparent rectangle that stretches along the side of the node,
                // and becomes colored when the mouse passes over it
                return $(go.Shape,
                    {
                        fill: "transparent",  // changed to a color in the mouseEnter event handler
                        strokeWidth: 0,  // no stroke
                        width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
                        height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
                        alignment: align,  // align the port on the main Shape
                        stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                        portId: name,  // declare this object to be a "port"
                        fromSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output,  // declare whether the user may draw links from here
                        toSpot: spot,  // declare where links may connect at this port
                        toLinkable: input,  // declare whether the user may draw links to here
                        cursor: "pointer",  // show a different cursor to indicate potential link point
                        mouseEnter: function(e, port) {  // the PORT argument will be this Shape
                            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                        },
                        mouseLeave: function(e, port) {
                            port.fill = "transparent";
                        }
                    });
            }

            function getKey() {

                return myDiagram.model.findNodeDataForKey(key);


            }
            function textStyle() {
                return {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "whitesmoke"

                }
            }
            function textStyle2() {
                return {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "whitesmoke"

                }
            }


            // define the Node templates for regular nodes
            myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Table", nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape

                    $(go.Panel, "Auto",
                       // myDiagram.model.nodeDataArray[0].statusNode = "Parent",
                        //$(go.model.nodeDataArray[0].statusNode = "Parent"),

                        $(go.Shape, "RoundedRectangle",
                            { fill: "#34495e", strokeWidth: 0 },
                            new go.Binding("figure", "figure")),
                        $(go.Panel, "Table",
                            {
                                maxSize: new go.Size(550, 999),
                                margin: new go.Margin(6, 10, 0, 3),
                                defaultAlignment: go.Spot.Left
                            },
                            $(go.RowColumnDefinition, { column: 2, width: 4 }),
                            $(go.TextBlock, textStyle(),  // the name
                                {
                                    row: 0, column: 0, columnSpan: 5,
                                    font: "12pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(10, 16),

                                },
                                new go.Binding("text").makeTwoWay(),


                                ),



                            $(go.TextBlock, "Subject : ", textStyle(),  // the name
                                {
                                    row: 1, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            // subject Value
                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 1),
                                    row: 1, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text", "subjectProcess").makeTwoWay()
                            ),

                            $(go.TextBlock, "Start Time : ", textStyle(),  // the name
                                {
                                    row: 2, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay(),
                            ),


                            // subject Start Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 2, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text", "startProcess").makeTwoWay()
                            ),

                            $(go.TextBlock, "Due Time : ", textStyle(),  // the name
                                {
                                    row: 3, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()

                            ),


                            // subject Due Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 3, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text", "dueProcess").makeTwoWay()
                            ),

                            $(go.TextBlock, "Cycle Time : ", textStyle(),  // the name
                                {
                                    row: 4, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),


                            // subject Cycle Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 4, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text", "cycleProcess").makeTwoWay()
                            ),
                        ),
                    ),
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                    makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                    makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
                ));


            // Sub Process Pallete

            // define the Node templates for regular nodes
            myDiagram.nodeTemplateMap.add("subProcess",  // the default category
                $(go.Node, "Table", nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape

                    $(go.Panel, "Auto",
                        $(go.Shape, "Rectangle",
                            { fill: "#16a085", strokeWidth: 0 },
                            new go.Binding("figure", "figure")),
                        $(go.Panel, "Table",
                            {
                                maxSize: new go.Size(550, 999),
                                margin: new go.Margin(6, 10, 0, 3),
                                defaultAlignment: go.Spot.Left
                            },
                            $(go.RowColumnDefinition, { column: 2, width: 4 }),
                            $(go.TextBlock, textStyle(),  // the name
                                {
                                    row: 0, column: 0, columnSpan: 5,
                                    font: "12pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text").makeTwoWay()
                            ),
                      //  $(go.model.nodeDataArray[0].statusNode = "Parent"),


                            $(go.TextBlock, "Subject : ", textStyle(),  // the name
                                {
                                    row: 1, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            // subject Value
                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 1),
                                    row: 1, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),


                            $(go.TextBlock, "PIC : ", textStyle(),  // the name
                                {
                                    row: 2, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            // subject Value
                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 1),
                                    row: 2, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            $(go.TextBlock, "Start Time : ", textStyle(),  // the name
                                {
                                    row: 3, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),


                            // subject Start Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 3, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            $(go.TextBlock, "Due Time : ", textStyle(),  // the name
                                {
                                    row: 4, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()

                            ),



                            // subject Due Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 4, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),

                            $(go.TextBlock, "Cycle Time : ", textStyle(),  // the name
                                {
                                    row: 5, column: 0,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: false, isMultiline: false,
                                    minSize: new go.Size(10, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),


                            // subject Cycle Time

                            $(go.TextBlock, "", textStyle(),  // the name
                                {
                                    margin: new go.Margin(0, 0, 0, 3),
                                    row: 5, column: 1, columnSpan: 5,
                                    font: "10pt Segoe UI,sans-serif",
                                    editable: true, isMultiline: false,
                                    minSize: new go.Size(200, 16)
                                },
                                new go.Binding("text2").makeTwoWay()
                            ),
                        ),
                    ),
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                    makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                    makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
                ));

            // replace the default Link template in the linkTemplateMap
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                        mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape,  // the highlight shape, normally transparent
                        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                    $(go.Shape,  // the link path shape
                        { isPanelMain: true, stroke: "#7f8c8d", strokeWidth: 2 }),
                    $(go.Shape,  // the arrowhead
                        { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
                    $(go.Panel, "Auto",  // the link label, normally not visible
                        { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                        new go.Binding("visible", "visible").makeTwoWay(),
                    )
                );
            // Make link labels visible if coming out of a "conditional" node.
            // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
            }
            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
            load();  // load an initial diagram from some JSON text
            // initialize the Palette that is on the left side of the page
            myPalette =
                $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                    {
                        scrollsPageOnFocus: false,
                        nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                        model: new go.GraphLinksModel([  // specify the contents of the Palette
                            { text: "Proses", statusNode: "parent"},
                            { category: "subProcess", text: "Sub Process", statusNode: "child" },


                        ])
                    });
} // end init
function save() {
            document.getElementById("mySavedModel").value = myDiagram.model.toJson();
            myDiagram.isModified = false;
}
function load() {
            myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}
// add an SVG rendering of the diagram at the end of this page
function makeSVG() {
            var svg = myDiagram.makeSvg({
                scale: 0.5
            });
            svg.style.border = "1px solid black";
            obj = document.getElementById("SVGArea");
            obj.appendChild(svg);
            if (obj.children.length > 0) {
                obj.replaceChild(svg, obj.children[0]);
            }

}


