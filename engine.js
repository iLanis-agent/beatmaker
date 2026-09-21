/* beatmaker engine: pattern model + encode/decode + scheduler math (pure, node-testable) */
var TRACKS = ['kick','snare','hihat','clap','tom'];
var STEPS = 16;

function makeEmptyPattern(){
  var p = {};
  TRACKS.forEach(function(t){ p[t] = []; for (var i=0;i<STEPS;i++) p[t].push(false); });
  return p;
}
var PRESETS = {
  'house': { bpm:124, p:{ kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], tom:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] } },
  'boom-bap': { bpm:88, p:{ kick:[1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1], hihat:[1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0], clap:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], tom:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] } },
  'trap': { bpm:140, p:{ kick:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], clap:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], tom:[0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0] } }
};
function presetPattern(name){
  var src = PRESETS[name]; if (!src) return null;
  var p = makeEmptyPattern();
  TRACKS.forEach(function(t){ for (var i=0;i<STEPS;i++) p[t][i] = !!src.p[t][i]; });
  return { bpm:src.bpm, pattern:p };
}
/* encode 5x16 bits -> 20 hex chars */
function encodePattern(p){
  var bits = '';
  TRACKS.forEach(function(t){ for (var i=0;i<STEPS;i++) bits += p[t][i] ? '1':'0'; });
  var hex = '';
  for (var i=0;i<bits.length;i+=4) hex += parseInt(bits.substr(i,4),2).toString(16);
  return hex;
}
function decodePattern(hex){
  if (typeof hex !== 'string' || !/^[0-9a-f]{20}$/i.test(hex)) return null;
  var bits = '';
  for (var i=0;i<hex.length;i++) bits += ('000'+parseInt(hex[i],16).toString(2)).slice(-4);
  var p = makeEmptyPattern(), k = 0;
  TRACKS.forEach(function(t){ for (var i=0;i<STEPS;i++){ p[t][i] = bits[k++]==='1'; } });
  return p;
}
/* seconds per 16th step at bpm (4 steps per beat) */
function stepDuration(bpm){ return 60 / bpm / 4; }
/* advance scheduler: given last step + time, return next */
function nextStep(step, time, bpm){
  return { step:(step+1)%STEPS, time:time + stepDuration(bpm) };
}
if (typeof module !== 'undefined' && module.exports){
  module.exports = { TRACKS:TRACKS, STEPS:STEPS, makeEmptyPattern:makeEmptyPattern, PRESETS:PRESETS, presetPattern:presetPattern, encodePattern:encodePattern, decodePattern:decodePattern, stepDuration:stepDuration, nextStep:nextStep };
}
