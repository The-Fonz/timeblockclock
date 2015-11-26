/*
 * All code
 */

// EVENTS ---------------------------------------------------------------------
// update, delete, add

// MODELS ----------------------------------------------------------------------
// Define observable and model API's
var Observable = function(){
  this.listeners = [];
};
Observable.prototype.listen = function(type, f) {
  if (typeof(f) === 'function') this.listeners.push({type:type, f:f});
};
Observable.prototype.notify = function(type, msg) {
  this.listeners.forEach(function(o){
    if (o.type === type) o.f(msg);
  });
};

// Collection emits 'add' on itself and 'delete' on the deleted element
var Collection = function(){
  Observable.call(this);
  this.arr = [];
};
Collection.prototype = Observable.prototype;
Collection.prototype.add = function(elem){
  this.arr.push(elem);
  this.notify('add', elem);
};
Collection.prototype.delete = function(elem){
  // If no element given, delete all
  if (elem === undefined) this.arr.forEach(function(e){this.delete(e)});
  else {
    this.arr.splice(this.arr.indexOf(elem), 1);
    elem.notify('delete');
  }
};

// Timeblock emits 'update'
var Timeblock = function(startt, endt){
  Observable.call(this);
  this.startt = startt;
  this.endt = endt;
};
Timeblock.prototype = Observable.prototype;
Timeblock.prototype.update = function(startt, endt) {
  this.startt = startt;
  this.endt = endt;
  this.notify('update');
};

// VIEW/CONTROLLER -------------------------------------------------------------
function initView(svg, collection) {
  // Draw timeblocks on add
  collection.listen('add', function(tb){
    console.log("Timeblock added");
    // Get time, convert to angle
    var sang = tb.startt/2 *Math.PI/180;
    var eang = tb.endt/2 *Math.PI/180;
    var svgElem = utils_drawPath(utils_filledArc(50,50,40,50,sang,eang),
                                                             svg, "tb");

    tb.listen('update', function(){
      console.log("Timeblock updated");
      var sang = tb.startt/2 *Math.PI/180;
      var eang = tb.endt/2 *Math.PI/180;
      svgElem.setAttribute('d', utils_filledArc(50,50,40,50,sang,eang));
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

  // Timing stuff
  var clocktxt = document.getElementById("time");
  var clockneedle = document.getElementById("needle");
  var timertxt = document.getElementById("timer");
  setInterval(function(){
    // Update clock time, rotate needle
    var t = new Date();
    clocktxt.innerHTML = t.toTimeString().slice(0,5);
    clockneedle.setAttribute('transform', `rotate(${t.getHours()*30+t.getMinutes()*.5} 50 50)`);
    // If active timeblock, show timer
    timertxt.innerHTML = "";
    collection.arr.forEach(function(tb){
      // Calculate time of day in minutes
      var curt = (t.getHours()%12)*60 + t.getMinutes();
      var endt = tb.endt<tb.startt ? tb.endt+12*60: tb.endt;
      if (tb.startt < curt && endt > curt) {
        var ttg = endt-curt;
        console.log(ttg);
        var mins = ttg%60;
        timertxt.innerHTML = `${Math.floor(ttg/60)}:${mins<10 ? '0'+mins:mins}`;
        // Update page title too
      }
    });
    // If begin/end of block within last interval, play sound
  }, 1000);
}

// INIT ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  // Init model
  var collection = new Collection();
  // Init view
  var timeblocksg = document.getElementById("timeblocks");
  initView(timeblocksg, collection);
  // Init controller
  var clock = document.getElementById("clock");
  var dragstart = false;
  var dragtb = false;
  clock.onmousedown = function(ev){
    // Ignore ctrl-click
    if (!ev.ctrlKey) {
      var c = utils_classifyMouse(ev.offsetX, ev.offsetY, clock.clientWidth, 5);
      if (c.inRadius) {
        dragstart = c.minute;
        console.log("Clicked within radius! Minute: "+c.minute);
      }
    }
  };
  clock.onmousemove = function(ev) {
    if (dragstart !== false) {
      var c = utils_classifyMouse(ev.offsetX, ev.offsetY, clock.clientWidth, 5);
      // Make new
      if (dragtb === false) {
        dragtb = new Timeblock(dragstart*5, c.minute*5);
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
  // Populate model
  collection.add(new Timeblock(180,360));
});
