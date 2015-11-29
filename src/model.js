// MODELS ----------------------------------------------------------------------

var model = {}

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

// Objects are still in global namespace if not commonJS-imported
model.Observable = Observable;
model.Collection = Collection;
model.Timeblock = Timeblock;

// CommonJS module export if available
if (typeof(module) !== 'undefined') module.exports = model;
