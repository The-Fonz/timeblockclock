/*
 * All code
 */

// EVENTS ---------------------------------------------------------------------
// update, delete, add

// MODELS ----------------------------------------------------------------------
// Timeblock: {'startt': 0<MINUTES<1440, 'endt': 0<MINUTES<1440}
var timeblocks = [];

// VIEW/CONTROLLER -------------------------------------------------------------
function initView(svg) {
  // Listens to tbs.add: draws svg and adds to list
  Object.observe(timeblocks, function (changes) {
    changes.forEach(function(change) {
      if (change.type === 'add') {
        // change.name contains list index
        var tb = timeblocks[change.name];
        // Get time, convert to angle
        var sang = tb.startt/2 *Math.PI/180;
        var eang = tb.endt/2 *Math.PI/180;
        var svgElem = utils_drawPath(utils_filledArc(50,50,40,50,sang,eang),
                                                                 clock, "tb");
        // Delete on double click
        svgElem.ondblclick = function() {
          svgElem.remove();
          var ind = timeblocks.indexOf(tb);
          if (ind == -1) throw "Timeblock obj not found in timeblocks list!";
          timeblocks.splice(ind, 1);
        };
      }
    });
  });

  // Detects mouseover and draws line in 5-min increments
  // If the user clicks and drags, (and the checks pass)
  // a new Timeblock is added, and increased/decreased in size until mouseup

  // Current time is shown in middle, and clock needle is rotated

  // Timer is shown in middle, updates per second and only listens to model.
  // If active timeblock, show and increment timer.
  // If begin/end of block within last interval, play sound
}

// INIT ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var clock = document.getElementById("clock");
  initView(clock);
  timeblocks.push({startt: 60, endt: 180});
});
