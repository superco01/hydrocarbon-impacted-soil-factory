"use strict"
/*
*  Copyright (C) 1998-2018 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom Tool for dragging a segment of an orthogonal link.

/**
* This OrthogonalLinkReshapingTool class allows for a Link's path to be modified by the user
* via the dragging of a tool handle along the link segment, which will move the whole segment.
* @constructor
* @extends LinkReshapingTool
* @class
*/
function OrthogonalLinkReshapingTool() {
  go.LinkReshapingTool.call(this);
  this.name = "OrthogonalLinkReshaping";
}
go.Diagram.inherit(OrthogonalLinkReshapingTool, go.LinkReshapingTool);

/**
* For orthogonal, straight links, create the handles and set reshaping behavior.
* @override
* @param {Shape} pathshape
* @return {Adornment}
* @this {OrthogonalLinkReshapingTool}
*/
OrthogonalLinkReshapingTool.prototype.makeAdornment = function(pathshape) {
  var link = pathshape.part;

  // add all normal handles first
  var adornment = go.LinkReshapingTool.prototype.makeAdornment.call(this, pathshape);

  // add long reshaping handles for orthogonal, straight links
  if (link !== null && link.isOrthogonal && link.curve !== go.Link.Bezier) {
    var firstindex = link.firstPickIndex;
    var lastindex = link.lastPickIndex;
    for (var i = firstindex + 1; i < lastindex - 1; i++) {
      this.makeSegmentDragHandle(link, adornment, i);
    }
  }
  return adornment;
};

/**
* Once we finish a reshape, make sure any handles are properly updated.
* @override
* @this {OrthogonalLinkReshapingTool}
*/
OrthogonalLinkReshapingTool.prototype.doDeactivate = function() {
  // when we finish, recreate adornment to ensure proper reshaping behavior/cursor
  var link = this.adornedLink;
  if (link !== null && link.isOrthogonal && link.curve !== go.Link.Bezier) {
    var pathshape = link.path;
    var adornment = this.makeAdornment(pathshape);
    if (adornment !== null) {
      link.addAdornment(this.name, adornment);
      adornment.location = link.position;
    }
  }
  go.LinkReshapingTool.prototype.doDeactivate.call(this);
};

/**
* Set the reshaping behavior for segment dragging handles.
* @override
* @param {Point} newpt
* @this {OrthogonalLinkReshapingTool}
*/
OrthogonalLinkReshapingTool.prototype.reshape = function(newpt) {
  var link = this.adornedLink;

  // identify if the handle being dragged is a segment dragging handle
  if (link !== null && link.isOrthogonal && link.curve !== go.Link.Bezier && this.handle.toMaxLinks === 999) {
    link.startRoute();
    var index = this.handle.segmentIndex; // for these handles, firstPickIndex + 1 <= index < lastPickIndex - 1
    var behavior = this.getReshapingBehavior(this.handle);
    if (behavior === go.LinkReshapingTool.Vertical) {
      // move segment vertically
      link.setPointAt(index, link.getPoint(index - 1).x, newpt.y);
      link.setPointAt(index + 1, link.getPoint(index + 2).x, newpt.y);
    } else if (behavior === go.LinkReshapingTool.Horizontal) {
      // move segment horizontally
      link.setPointAt(index, newpt.x, link.getPoint(index - 1).y);
      link.setPointAt(index + 1, newpt.x, link.getPoint(index + 2).y);
    }
    link.commitRoute();
  } else {
    go.LinkReshapingTool.prototype.reshape.call(this, newpt);
  }
};

/**
* Create the segment dragging handles. 
* There are two parts: one invisible handle that spans the segment, and a visible handle at the middle of the segment.
* These are inserted at the front of the adornment such that the normal handles have priority.
* @param {Link} link
* @param {Adornment} adornment
* @param {number} index
* @this {OrthogonalLinkReshapingTool}
*/
OrthogonalLinkReshapingTool.prototype.makeSegmentDragHandle = function(link, adornment, index) {
  var a = link.getPoint(index);
  var b = link.getPoint(index + 1);
  var seglength = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  // determine segment orientation
  var orient = "";
  if (OrthogonalLinkReshapingTool.isApprox(a.x, b.x) && OrthogonalLinkReshapingTool.isApprox(a.y, b.y)) {
    b = link.getPoint(index - 1);
    if (OrthogonalLinkReshapingTool.isApprox(a.x, b.x)) {
      orient = "vertical";
    } else if (OrthogonalLinkReshapingTool.isApprox(a.y, b.y)) {
      orient = "horizontal";
    }
  } else {
    if (OrthogonalLinkReshapingTool.isApprox(a.x, b.x)) {
      orient = "vertical";
    } else if (OrthogonalLinkReshapingTool.isApprox(a.y, b.y)) {
      orient = "horizontal";
    }
  }

  // first, make an invisible handle along the whole segment
  var h = new go.Shape();
  h.opacity = 0;
  h.segmentOrientation = go.Link.OrientAlong;
  h.segmentIndex = index;
  h.segmentFraction = 0.5;
  h.toMaxLinks = 999; // set this unsused property to easily identify that we have a segment dragging handle
  if (orient === "horizontal") {
    this.setReshapingBehavior(h, go.LinkReshapingTool.Vertical);
    h.cursor = 'n-resize';
  } else {
    this.setReshapingBehavior(h, go.LinkReshapingTool.Horizontal);
    h.cursor = 'w-resize';
  }
  h.geometryString = "M 0 0 L " + seglength + " 0";
  adornment.insertAt(0, h);

  // second, make a visible handle near the middle
  h = new go.Shape();
  h.fill = "#1B3471"; // different from other handles to make sure it stands out
  h.stroke = "dodgerblue";
  h.segmentOrientation = go.Link.OrientAlong;
  h.segmentIndex = index;
  h.segmentFraction = 0.5;
  h.toMaxLinks = 999; // set this unsused property to easily identify that we have a segment dragging handle
  if (orient === "horizontal") {
    this.setReshapingBehavior(h, go.LinkReshapingTool.Vertical);
    h.cursor = 'n-resize';
  } else {
    this.setReshapingBehavior(h, go.LinkReshapingTool.Horizontal);
    h.cursor = 'w-resize';
  }
  h.geometryString = "F M 0 0 L 12 0 L 12 4 L 0 4 Z X M 6 0 L 6 -3 X M 6 4 L 6 7";
  adornment.insertAt(0, h);
};

/**
* Compare two numbers to ensure they are almost equal.
* Used in this class for comparing coordinates of Points.
* @param {number} x
* @param {number} y
* @return {boolean}
*/
OrthogonalLinkReshapingTool.isApprox = function(x, y) {
  var d = x - y;
  return d < 0.5 && d > -0.5;
}