'use strict'

const inTxtValDefault = `The Quick Brown Fox Jumps Over The Lazy Dog
The Quick brown cat that looks like fox jumps over the fence`;
const inRgxValDefault = "quick\\s(brown).*(jumps)";

const inTxt = document.querySelector("#inTxt");
const inRgx = document.querySelector("#inRgx");
const runBtn = document.querySelector("#runBtn");
const outTxt = window.document.querySelector("#outTxt");
const outExec = window.document.querySelector("#outExec");
const chGlob = document.querySelector("#chGlob");
const chCase = document.querySelector("#chCase");
const chMult = document.querySelector("#chMult");

const runRx = () => {
  var str = inTxt.value;
  if (str.length === 0) {outTxt.innerText = outExec.innerText = "";return;}
  if (inRgx.value.length === 0) {outTxt.innerText = outExec.innerText = "";return;}
    
  var opt = "";
  if (chGlob.checked) opt += "g";
  if (chCase.checked) opt += "i";
  if (chMult.checked) opt += "m";  
  
  try {
    var regexp = new RegExp(inRgx.value, opt);
    
    outTxt.innerHTML = str.replace(regexp, d => `<span class="marker">${d}</span>`);
    var outExecVal = "", rxArray, idx = 1;
    while (rxArray = regexp.exec(str)) {
      console.log('--->', rxArray); 
      outExecVal += "iter " + idx + ": " + rxArray + " [idx:" + rxArray.index + 
        " next: " + regexp.lastIndex + "]\n";
      idx++;
      if (idx > 100) break;
    }
    if (idx > 1) outExecVal += "iter " + idx + ": null";
    else outExecVal = "No matches.";
    
    outExec.innerText = outExecVal; 
  } catch (err) {
    outTxt.innerText = err;
    outExec.innerText = "";
  }
};

const getQueryStringParams = () => {
  var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);

  var urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  
  inTxt.value = urlParams["intx"] || inTxtValDefault;   
  inRgx.value = urlParams["inrgx"] || inRgxValDefault;
  
  runRx();
};

runBtn.onclick = inRgx.oninput = 
chGlob.onchange = chCase.onchange = chMult.onchange = 
inTxt.oninput = runRx;

window.onload = getQueryStringParams;

//------------------------------------------------------------
// encode(decode) html text into html entity
var decodeHtmlEntity = function(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
};

var encodeHtmlEntity = function(str) {
  var buf = [];
  for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};
//------------------------------------------------------------