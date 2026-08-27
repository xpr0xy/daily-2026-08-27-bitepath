export const SR = 48000;
export const DEFAULT = {
  root: 43, duration: 1.25, spread: 18, sub: 62, bite: 58, drive: 54, tail: 28,
  path: [[0,.78],[.13,.31],[.27,.69],[.42,.24],[.58,.57],[.72,.18],[.86,.39],[1,.12]]
};
export const PRESETS = {
  neuro: {root:43,duration:1.1,spread:21,sub:58,bite:74,drive:67,tail:18,path:[[0,.9],[.12,.25],[.25,.76],[.4,.18],[.55,.7],[.7,.14],[.86,.43],[1,.1]]},
  foghorn: {root:38,duration:1.75,spread:12,sub:76,bite:34,drive:48,tail:42,path:[[0,.54],[.14,.48],[.29,.62],[.43,.4],[.58,.52],[.72,.34],[.87,.4],[1,.2]]},
  pressure: {root:36,duration:.78,spread:27,sub:68,bite:86,drive:76,tail:12,path:[[0,.96],[.14,.18],[.29,.83],[.43,.12],[.58,.64],[.72,.1],[.87,.31],[1,.06]]}
};
const clamp=(v,a=-1,b=1)=>Math.max(a,Math.min(b,v));
const midi=n=>440*Math.pow(2,(n-69)/12);
const interp=(path,t)=>{const p=t*(path.length-1),i=Math.min(path.length-2,Math.floor(p)),f=p-i;return path[i][1]*(1-f)+path[i+1][1]*f};
export function render(state, clean=false){
  const n=Math.ceil((state.duration+.42*state.tail/100)*SR), l=new Float32Array(n), r=new Float32Array(n);
  const f=midi(state.root), det=state.spread/1200, fl=f*Math.pow(2,-det), fr=f*Math.pow(2,det);
  let pl=0,pr=0,ps=0, lpL=0,lpR=0;
  for(let i=0;i<n;i++){
    const t=i/SR, u=Math.min(1,t/state.duration), trajectory=interp(state.path,u);
    const attack=Math.min(1,t/(.003+.025*(1-state.bite/100)));
    const decay=t<state.duration?Math.pow(1-u,.42):Math.exp(-(t-state.duration)/(0.035+.25*state.tail/100));
    const env=attack*decay, bend=1+.045*trajectory*Math.exp(-t*9)*(state.bite/100);
    pl+=fl*bend/SR;pr+=fr*bend/SR;ps+=f*bend/SR;
    const sawL=2*(pl-Math.floor(pl+.5)), sawR=2*(pr-Math.floor(pr+.5));
    const sub=Math.sin(2*Math.PI*ps);
    const vowel=.5+.5*Math.sin(2*Math.PI*(2*pl+trajectory*.35));
    const bodyL=sawL*(.62+.38*vowel), bodyR=sawR*(.62+.38*(1-vowel*.55));
    const cutoff=.025+trajectory*.2, rawL=bodyL*(1-state.sub/100)+sub*(state.sub/100), rawR=bodyR*(1-state.sub/100)+sub*(state.sub/100);
    lpL+=cutoff*(rawL-lpL);lpR+=cutoff*(rawR-lpR);
    let a=lpL*env,b=lpR*env;
    if(!clean){const k=1+state.drive/18;a=Math.tanh(a*k)/Math.tanh(k);b=Math.tanh(b*k)/Math.tanh(k);}
    l[i]=clamp(a*.82);r[i]=clamp(b*.82);
  }
  return {left:l,right:r,sampleRate:SR};
}
export function wavBytes(state, clean=false){
  const {left,right,sampleRate}=render(state,clean), len=left.length, b=new ArrayBuffer(44+len*4), v=new DataView(b);
  const s=(o,x)=>[...x].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
  s(0,'RIFF');v.setUint32(4,36+len*4,true);s(8,'WAVE');s(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,len*4,true);
  for(let i=0;i<len;i++){v.setInt16(44+i*4,Math.round(clamp(left[i])*32767),true);v.setInt16(46+i*4,Math.round(clamp(right[i])*32767),true)}
  return new Uint8Array(b);
}
export function normalized(x){return JSON.parse(JSON.stringify(x));}
