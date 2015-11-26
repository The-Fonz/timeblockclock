/*
 * Utility functions here to keep main file readable
 */

function utils_filledArc(centerX, centerY,
  innerRadius, outerRadius, startAngle, endAngle) {
  var m = Math;
  var diff = (endAngle-startAngle);
  // Make diff positive
  var diff = diff < 0 ? diff+2*m.PI : diff;
  var largeArcFlag = 0;
  if (diff > m.PI) largeArcFlag = 1;
  return `
  M ${centerX+outerRadius*m.sin(startAngle)}
    ${centerY-outerRadius*m.cos(startAngle)}
  A ${outerRadius} ${outerRadius},
   0, ${largeArcFlag}, 1,
   ${centerX+outerRadius*m.sin(endAngle)}
   ${centerY-outerRadius*m.cos(endAngle)}
  L ${centerX+innerRadius*m.sin(endAngle)} ${centerY-innerRadius*m.cos(endAngle)}
  A ${innerRadius} ${innerRadius},
   0, ${largeArcFlag}, 0,
   ${centerX+innerRadius*m.sin(startAngle)}
   ${centerY-innerRadius*m.cos(startAngle)} Z`;
}

function utils_drawPath(pathstr, svg, cssclass) {
  var svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttribute('d', pathstr);
  svgPath.setAttribute('class', cssclass);
  svg.appendChild(svgPath);
  return svgPath;
}

function utils_classifyMouse(x,y,w,round) {
  var out = {inRadius: false};
  var r = Math.sqrt(Math.pow(w/2-x, 2) + Math.pow(w/2-y, 2))/w*100;
  //console.log(`${x} ${y} ${w} ${round}`);
  //console.log("Dist r = "+r);
  if ((r > 40) && (r < 50)) out.inRadius = true;
  // Classify angle
  var v = {x: -y+w/2, y: x-w/2};
  var aRad = Math.acos( v.x / Math.sqrt(v.x*v.x + v.y*v.y) );
  var aDeg = aRad * 180 / Math.PI;
  if (x < w/2) aDeg = 360 - aDeg;
  //console.log("Angle in degrees is: " + aDeg);
  out.minute = Math.round(aDeg/2.5);
  return out;
}
