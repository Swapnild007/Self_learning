import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type MemoryRecord = { attempts: number; correct: number; due: number; interval: number };
const key = "self-learning:living-lab:v1";
const dataset = ["AI","Python","AI","AI","Python","AI","Python","AI","AI","Python"];
const now = () => Date.now();
function readMemory(): MemoryRecord {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const item = JSON.parse(raw) as MemoryRecord;
      if (Number.isFinite(item.attempts) && Number.isFinite(item.correct) && Number.isFinite(item.due) && Number.isFinite(item.interval)) return item;
    }
  } catch { /* private browsing may block storage */ }
  return { attempts: 0, correct: 0, due: 0, interval: 0 };
}
export default function LivingLab() {
  const [count, setCount] = useState(4);
  const [prediction, setPrediction] = useState<null | string>(null);
  const [guess, setGuess] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [memory, setMemory] = useState(readMemory);
  const [storageError, setStorageError] = useState(false);
  const ai = useMemo(() => dataset.slice(0,count).filter(x=>x==="AI").length,[count]);
  const python = count-ai;
  const winner = ai>=python?"AI":"Python";
  const probability = Math.round(100*ai/count);
  useEffect(() => { try { localStorage.setItem(key,JSON.stringify(memory)); } catch { setStorageError(true); } },[memory]);
  function submitRecall() {
    if (!answer.trim()) { setFeedback("Write your explanation before checking."); return; }
    const normalized=answer.toLowerCase();
    const concepts=["count","frequen","more example","most example","probab","highest","common"];
    const hasMechanism=concepts.some(word=>normalized.includes(word));
    const hasContext=normalized.includes("ai")||normalized.includes("python")||normalized.includes("word")||normalized.includes("token");
    const passed=hasMechanism&&hasContext;
    const interval=passed?Math.max(1,memory.interval===0?1:Math.round(memory.interval*2.5)):0;
    setMemory(old=>({attempts:old.attempts+1,correct:old.correct+(passed?1:0),interval,due:now()+(passed?interval:0)*86400000}));
    setFeedback(passed?"Good start: you mentioned the frequency mechanism. This is an automated keyword check, not a semantic AI evaluation. Compare your explanation with the worked reasoning below.":"Try again: explain how the model counts the examples after the same prompt. This keyword check can miss valid explanations.");
  }
  return <main className="page" style={{maxWidth:950,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <Link to="/course/llm-engineering">← Course overview</Link><span style={{fontSize:13,opacity:.7}}>Interactive prototype · Concept 01</span>
    </div>
    <h1 style={{marginTop:24}}>Teach a machine to predict</h1>
    <p>Don't memorize a definition first. Change the training examples, predict what happens, then explain why. Everything below runs locally in your browser.</p>
    <section style={{padding:22,border:"1px solid var(--border, #5555)",borderRadius:18,marginTop:24}}>
      <h2>1. Experiment with the evidence</h2>
      <p>Every example begins with <strong>“I love”</strong>. Move the slider to change how many examples the tiny frequency model sees.</p>
      <label htmlFor="examples">Training examples: <strong>{count}</strong></label>
      <input id="examples" type="range" min="1" max="10" value={count} onChange={e=>{setCount(Number(e.target.value));setPrediction(null);setFeedback("");}} style={{width:"100%",margin:"18px 0"}}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{dataset.slice(0,count).map((item,i)=><span key={i} style={{padding:"7px 10px",border:"1px solid #8885",borderRadius:10,fontSize:14}}>I love <strong>{item}</strong></span>)}</div>
      <h3 style={{marginTop:25}}>Learned probabilities</h3>
      {([["AI",ai,probability],["Python",python,100-probability]] as const).map(([name,number,pct])=><div key={name} style={{margin:"15px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><span>{name} ({number} examples)</span><strong>{pct}%</strong></div>
        <div style={{height:12,background:"#8883",borderRadius:8,overflow:"hidden",marginTop:7}}><div style={{width:pct+"%",height:"100%",background:name==="AI"?"#568cf2":"#15a88a",transition:"width .2s"}}/></div>
      </div>)}
      <p style={{fontSize:14}}>The model estimates P(next word | “I love”) = matching examples ÷ total examples. It has no neural network.</p>
    </section>
    <section style={{padding:22,border:"1px solid var(--border, #5555)",borderRadius:18,marginTop:18}}>
      <h2>2. Predict before revealing</h2>
      <p>Which word will the model choose? The rule is to choose the most frequent word. Ties go to AI.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["AI","Python"].map(item=><button key={item} type="button" onClick={()=>{setGuess(item);setPrediction(null)}} aria-pressed={guess===item} style={{padding:"10px 22px",borderRadius:10,border:guess===item?"2px solid #568cf2":"1px solid #8888",background:"transparent",color:"inherit"}}>{item}</button>)}
        <button type="button" disabled={!guess} onClick={()=>setPrediction(guess===winner?"correct":"incorrect")} style={{padding:"10px 22px",borderRadius:10}}>Reveal prediction</button>
      </div>
      {prediction&&<div role="status" style={{marginTop:18,padding:14,borderRadius:10,background:"#8882"}}>
        <strong>{prediction==="correct"?"Your prediction matches.":"Not quite. Try changing the examples."}</strong>
        <p>The model chooses <strong>{winner}</strong> because AI appears {ai} time(s) and Python appears {python} time(s).</p>
      </div>}
    </section>
    <section style={{padding:22,border:"1px solid var(--border, #5555)",borderRadius:18,marginTop:18}}>
      <h2>3. Explain it without looking</h2>
      <p>In your own words, why does the model choose one word over the other? Try explaining it as if teaching a friend.</p>
      <label htmlFor="explanation">Your explanation</label>
      <textarea id="explanation" rows={4} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="The model predicts ... because ..." style={{width:"100%",padding:12,borderRadius:10,margin:"10px 0",boxSizing:"border-box"}}/>
      <button type="button" onClick={submitRecall}>Check explanation and save practice</button>
      {feedback&&<p role="status" style={{marginTop:14}}>{feedback}</p>}
      {feedback&&<p><strong>Worked reasoning:</strong> This simple model counts which word follows the prompt in the observed examples and picks the one with the highest count. A different dataset may change its prediction. Unlike an LLM, it has no learned embeddings or transformer.</p>}
    </section>
    <section style={{padding:22,border:"1px solid var(--border, #5555)",borderRadius:18,marginTop:18}}>
      <h2>4. Return and remember</h2>
      <p>Practice attempts: <strong>{memory.attempts}</strong> · Keyword-check passes: <strong>{memory.correct}</strong></p>
      <p>{memory.attempts===0?"Complete your first explain-back to begin spaced practice.":memory.interval===0?"Review now: explain the concept again using a fresh example.":memory.due<=now()?"Review due now.":"Next suggested review: "+new Date(memory.due).toLocaleDateString()}</p>
      <p style={{fontSize:13,opacity:.8}}>Review timing is a simple experimental schedule, not a scientifically validated mastery score. Data stays in this browser and can be lost if site storage is cleared.</p>
      {storageError&&<p role="alert">Your browser blocked local storage. Practice history may not persist.</p>}
    </section>
    <p style={{margin:"24px 0"}}><Link to="/read/llm-foundations">Read the full chapter →</Link></p>
  </main>;
}
