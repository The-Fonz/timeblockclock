/*
 * Main point of entry. Wires everything up.
 */

// VIEW/CONTROLLER -------------------------------------------------------------
function initView(svg, collection) {
  // Draw timeblocks on add
  collection.listen('add', function(tb){
    console.log("Timeblock added");
    // Get time, convert to angle
    var sang = tb.startt/2 *Math.PI/180;
    var eang = tb.endt/2 *Math.PI/180;
    var svgElem = utils.drawPath(utils.filledArc(50,50,40,50,sang,eang),
                                                             svg, "tb");

    tb.listen('update', function(){
      console.log("Timeblock updated");
      var sang = tb.startt/2 *Math.PI/180;
      var eang = tb.endt/2 *Math.PI/180;
      svgElem.setAttribute('d', utils.filledArc(50,50,40,50,sang,eang));
    });
    tb.listen('delete', function(){
      console.log("Timeblock deleted");
      svgElem.remove();
    });
    // Delete on ctrl-click
    svgElem.onclick = function(ev) {
      if (ev.ctrlKey) collection.delete(tb);
    };
  });

  // Detects mouseover and draws line in 5-min increments
  // If the user clicks and drags, (and the checks pass)
  // a new Timeblock is added, and increased/decreased in size until mouseup
}

function initTimer(collection, clocktxt, clockneedle, timertxt, origTitle, sound) {
  // Constant to specify update interval in ms
  var INTERVAL = 100;

  function update() {
    var t = new Date();
    // Calculate time of day in minutes
    var curt = (t.getHours()%12)*60 + t.getMinutes();
    var countdown = "";
    var ringding = false;

    // Update clock time, rotate needle
    var clockTime = t.toTimeString().slice(0,5);
    clocktxt.innerHTML = clockTime;
    clockneedle.setAttribute('transform',
    `rotate(${t.getHours()*30+t.getMinutes()*.5} 50 50)`);

    collection.arr.forEach(function(tb){
      var endt = tb.endt<tb.startt ? tb.endt+12*60: tb.endt;
      // If in a timeblock
      if (tb.startt <= curt && endt >= curt) {
        var ttg = endt-curt;
        var mins = ttg%60;
        countdown = `${Math.floor(ttg/60)}:${mins<10 ? '0'+mins:mins}`;

        // Quick hack, it's not pretty to put extra attributes on model
        if (curt === endt && tb.ringed === undefined) {
          ringding = true;
          tb.ringed = true;
        }
      }
    });

    if (countdown) {
      timertxt.innerHTML = countdown;
      document.title = `${countdown} - ${clockTime} - ${origTitle}`;
    } else {
      timertxt.innerHTML = "";
      document.title = `${clockTime} - ${origTitle}`;
    }
    // If begin/end of block within last interval, play sound
    if (ringding) {
      console.log("PLAYSOUND");
      sound.play();
    }
  }

  // Run once at start, then once every second
  update();
  setInterval(update, INTERVAL);
}

// TIMEBLOCK CREATION CONTROLLER -----------------------------------------------
function initController(clock, collection) {
  var dragstart = false;
  var dragtb = false;
  clock.onmousedown = function(ev){
    // Ignore ctrl-click
    if (!ev.ctrlKey) {
      var c = utils.classifyMouse(ev.offsetX, ev.offsetY, clock.clientWidth, 5);
      if (c.inRadius) {
        dragstart = c.minute;
        console.log("Clicked within radius! Minute: "+c.minute);
      }
    }
  };
  clock.onmousemove = function(ev) {
    if (dragstart !== false) {
      var c = utils.classifyMouse(ev.offsetX, ev.offsetY, clock.clientWidth, 5);
      // Make new
      if (dragtb === false) {
        dragtb = new model.Timeblock(dragstart*5, c.minute*5);
        collection.add(dragtb);
      } else {
        dragtb.update(dragstart*5, c.minute*5);
      }
    }
  };
  clock.onmouseup = function(ev) {
    if (dragstart !== false) {
      dragstart = false;
      dragtb = false;
    }
  };
}

// INIT ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  // Init model
  var collection = new model.Collection();
  // Init view
  var timeblocksg = document.getElementById("timeblocks");
  initView(timeblocksg, collection);
  // Init controller
  var clock = document.getElementById("clock");
  initController(clock, collection);
  // Init shizzle
  // Timing stuff
  var clocktxt = document.getElementById("time");
  var clockneedle = document.getElementById("needle");
  var timertxt = document.getElementById("timer");
  var sound = document.getElementById("fanta");
  initTimer(collection, clocktxt, clockneedle, timertxt, document.title, sound);
});
