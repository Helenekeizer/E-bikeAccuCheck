
const qs=s=>document.querySelector(s);
function getData(){return JSON.parse(localStorage.getItem("accuData")||"{}")}
function setData(d){localStorage.setItem("accuData",JSON.stringify(d))}
function scoreData(d){
  const age=Math.min(100,(Number(d.age)||3)*14);
  const cycles=Math.min(100,(Number(d.cycles)||250)/7);
  const range=Number(d.range)||55, original=Number(d.original)||70;
  const rangeLoss=Math.max(0,Math.min(100,100-(range/original*100)));
  const state={"Zeer goed":0,"Goed":10,"Redelijk":35,"Slecht":70}[d.condition]??25;
  const score=Math.max(20,Math.round(100-(age*.30+cycles*.28+rangeLoss*.32+state*.10)));
  const capacity=Math.round(score);
  return {score,capacity,range,life:Math.max(1,Math.round(score/18)),replacement:score<60?"€ 450 – € 800":"€ 350 – € 650",impact:score>=80?"Beperkte invloed":"Kan merkbaar invloed hebben"};
}
function renderResult(){
 const d=getData(), r=scoreData(d);
 if(qs("#score")) qs("#score").textContent=r.score+"/100";
 if(qs("#capacity")) qs("#capacity").textContent=r.capacity+"%";
 if(qs("#range")) qs("#range").textContent=r.range+" km";
 if(qs("#life")) qs("#life").textContent=r.life+"+ jaar";
 if(qs("#replacement")) qs("#replacement").textContent=r.replacement;
 if(qs("#impact")) qs("#impact").textContent=r.impact;
}
document.addEventListener("DOMContentLoaded",()=>{
 const form=qs("#accu-form");
 if(form) form.addEventListener("submit",e=>{
   e.preventDefault(); const fd=new FormData(form), d=Object.fromEntries(fd.entries()); setData(d); location.href="resultaat.html";
 });
 renderResult();
 const pay=qs("#pay");
 if(pay) pay.addEventListener("click",()=>location.href="confirmation.html");
});
