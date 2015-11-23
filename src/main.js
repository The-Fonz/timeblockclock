/*
 * All code
 */

// EVENTS ---------------------------------------------------------------------
// update, delete, add

// MODELS ----------------------------------------------------------------------
// Defines models and their APIs
//var Timeblock = object
//.update: update timeblock properties
//.delete: notify listeners, then delete timeblock

//var tbs = list of Timeblocks
//.add: add Timeblock

// VIEW/CONTROLLER -------------------------------------------------------------
// Listens to tbs.add: draws svg and adds to list

// Listens to Timeblock.update/delete via model ref stored in svg element

// Listens to svg_element.onmousemove, use CSS transform to let it slide out
// If slided too far, call delete on element
// If left alone, css animate it going back to its slot

// Draws a ring of 5-minute arcs that light up on hover
// If the user clicks one of these and drags,
// a new Timeblock is added, and increased/decreased in size until mouseup

// Draw last 5min of timeblock with separate arc. Change cursor on hover.
// If dragged, change duration and update

// Timer is shown in middle, updates per second and only listens to model.
// If active timeblock, show and increment timer.
// If begin/end of block just encountered, play sound

// INIT ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var clock = document.getElementById("clock");
});
