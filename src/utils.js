/*
 * Utility functions here to keep main file readable
 */

function utils_drawBlock(t, svg) {
  var block = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  block.setAttribute('cx', 0);
  block.setAttribute('cy', 0);
  block.setAttribute('r', 50);
  svg.appendChild(block);
}
