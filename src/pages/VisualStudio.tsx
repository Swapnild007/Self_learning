import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BookOpen, ChartColumn, FlaskConical } from "lucide-react";

type Demo = "weighted" | "tokens" | "complexity";
const demos: { id: Demo; title: string; subject: string }[] = [
  { id: "weighted", title: "Weighted averages", subject: "Python · Data analysis" },
  { id: "tokens", title: "Next-token predictions", subject: "AI & language models" },
  { id: "complexity", title: "Algorithm growth", subject: "Computer science" },
];
function NumberSlider({ id, label, value, min = 0, max = 100, onChange }: {
  id: string; label: string; value: number; min?: number; max?: number; onChange: (value: number) => void;
}) {
  return (
    <label className="visual-slider" htmlFor={id}>
      <span>{label}<strong>{value}</strong></span>
      <input id={id} type="range" value={value} min={min} max={max}
        onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
function Bars({ bars, suffix = "", note }: { bars: { name: string; value: number; width: number }[]; suffix?: string; note: string }) {
  return <figure className="visual-bars" aria-label={note}>
    <div className="visual-bar-list">
      {bars.map((bar) => <div className="visual-bar" key={bar.name}>
        <div className="visual-bar-head"><span>{bar.name}</span><strong>{Number(bar.value.toFixed(2))}{suffix}</strong></div>
        <div className="visual-bar-track"><span style={{ width: String(Math.max(0, Math.min(100, bar.width))) + "%" }} /></div>
      </div>)}
    </div>
    <figcaption>{note}</figcaption>
  </figure>;
}

export default function VisualStudio() {
  const [active, setActive] = useState<Demo>("weighted");
  const [firstCalls, setFirstCalls] = useState(2);
  const [secondCalls, setSecondCalls] = useState(8);
  const [firstWait, setFirstWait] = useState(30);
  const [secondWait, setSecondWait] = useState(50);
  const [tokenWeights, setTokenWeights] = useState([4, 3, 1]);
  const [n, setN] = useState(20);
  const avgUnweighted = (firstWait + secondWait) / 2;
  const totalCalls = firstCalls + secondCalls;
  const avgWeighted = totalCalls ? (firstCalls * firstWait + secondCalls * secondWait) / totalCalls : 0;
  const avgMax = Math.max(1, avgUnweighted, avgWeighted);
  const weightTotal = tokenWeights.reduce((sum, w) => sum + w, 0);
  const tokenLabels = ["coding", "tea", "music"];
  const probabilities = tokenWeights.map((weight) => weightTotal ? 100 * weight / weightTotal : 0);
  const complexityBars = [
    { name: "Constant O(1)", value: 1 },
    { name: "Logarithmic O(log₂ n)", value: Math.ceil(Math.log2(n)) },
    { name: "Linear O(n)", value: n },
    { name: "Quadratic O(n²)", value: n * n },
  ];
  const logMax = Math.log10(n * n + 1);
  return <div className="page">
    <header className="visual-hero">
      <div className="eyebrow">INTERACTIVE VISUAL NOTES</div>
      <h1>Change a number. Change your understanding<span className="blue-dot">.</span></h1>
      <p className="lead">Three small experiments that make invisible ideas visible. Make a prediction, adjust the controls, and explain what changed before checking the interpretation.</p>
      <div className="visual-hero-facts"><span><FlaskConical size={17} /> Live experiments</span><span><Activity size={17} /> Every chart responds</span><span><BookOpen size={17} /> Original educational examples</span></div>
    </header>
    <div className="visual-selector" role="group" aria-label="Select a concept">
      {demos.map((demo) => <button key={demo.id} type="button" className={active === demo.id ? "selected" : ""}
        aria-pressed={active === demo.id} onClick={() => setActive(demo.id)}>
        <span>{demo.subject}</span><strong>{demo.title}</strong>
      </button>)}
    </div>
    {active === "weighted" && <section className="visual-workbench" aria-labelledby="weighted-title">
      <div className="visual-side">
        <span className="eyebrow">EXPERIMENT 01 · DATA REASONING</span>
        <h2 id="weighted-title">When averages disagree</h2>
        <p>Two groups each have their own average wait. Is the overall average simply the midpoint? Make a prediction, then change the group sizes.</p>
        <NumberSlider id="first-calls" label="Calls in group A" min={1} max={30} value={firstCalls} onChange={setFirstCalls} />
        <NumberSlider id="first-wait" label="Mean wait in A (sec)" min={0} max={120} value={firstWait} onChange={setFirstWait} />
        <NumberSlider id="second-calls" label="Calls in group B" min={1} max={30} value={secondCalls} onChange={setSecondCalls} />
        <NumberSlider id="second-wait" label="Mean wait in B (sec)" min={0} max={120} value={secondWait} onChange={setSecondWait} />
      </div>
      <div className="visual-display">
        <div className="visual-question">Which average represents all {totalCalls} calls?</div>
        <Bars suffix=" sec" bars={[
          { name: "Simple mean of two averages", value: avgUnweighted, width: 100 * avgUnweighted / avgMax },
          { name: "Pooled call-weighted mean", value: avgWeighted, width: 100 * avgWeighted / avgMax },
        ]} note="Values are computed from the sliders, not external operational data. Bar lengths share a zero baseline." />
        <div className="visual-formula">({firstCalls} × {firstWait} + {secondCalls} × {secondWait}) / {totalCalls} = <strong>{avgWeighted.toFixed(2)} seconds</strong></div>
        <div className="visual-explanation"><strong>What to notice</strong><p>Equal weighting gives every group one vote. A pooled mean gives every call one vote. When group sizes are equal, the two means agree. Otherwise, the pooled answer is generally the appropriate per-call average, provided the groups are disjoint and measured consistently.</p></div>
        <Link to="/read/python-functions">Explore the complete Python lesson <ArrowRight size={16} /></Link>
      </div>
    </section>}
    {active === "tokens" && <section className="visual-workbench" aria-labelledby="token-title">
      <div className="visual-side">
        <span className="eyebrow">EXPERIMENT 02 · LANGUAGE MODELS</span>
        <h2 id="token-title">What could come next?</h2>
        <p>A simplified model sees the fragment “I enjoy …”. Adjust the scores for three candidate next words. Watch them become a probability distribution.</p>
        {tokenLabels.map((label, index) => <NumberSlider key={label} id={"weight-" + label}
          label={"Score for “" + label + "”"} min={0} max={12} value={tokenWeights[index]}
          onChange={(value) => setTokenWeights((previous) => previous.map((old, i) => i === index ? value : old))} />)}
        <p className="visual-aside">These nonnegative scores are converted to proportions for teaching only. Real neural models typically transform logits with softmax, not simple score normalization.</p>
      </div>
      <div className="visual-display">
        <div className="visual-question">I enjoy <span className="visual-prompt">?</span></div>
        <Bars suffix="%" bars={tokenLabels.map((name, index) => ({ name, value: probabilities[index], width: probabilities[index] }))}
          note="Toy next-word distribution. Each bar uses a 0–100% scale. These values are illustrative, not predictions from a deployed language model." />
        {weightTotal > 0
          ? <div className="visual-formula">Highest score: <strong>{tokenLabels[probabilities.indexOf(Math.max(...probabilities))]}</strong> · Total probability: {probabilities.reduce((a, b) => a + b, 0).toFixed(1)}%</div>
          : <div role="status" className="visual-formula">All scores are zero: a distribution cannot be formed. Increase one score.</div>}
        <div className="visual-explanation"><strong>What to notice</strong><p>A model can assign different likelihoods to different candidates. The most likely token is not guaranteed to be chosen: decoding strategy matters. A full tokenizer may represent a word using multiple tokens.</p></div>
        <Link to="/read/llm-foundations">Study language models from first principles <ArrowRight size={16} /></Link>
      </div>
    </section>}
    {active === "complexity" && <section className="visual-workbench" aria-labelledby="complexity-title">
      <div className="visual-side">
        <span className="eyebrow">EXPERIMENT 03 · ALGORITHM THINKING</span>
        <h2 id="complexity-title">How work grows</h2>
        <p>Imagine an input containing n items. Four example growth functions respond differently as the input gets larger.</p>
        <NumberSlider id="items-n" label="Input size (n)" min={2} max={100} value={n} onChange={setN} />
        <p className="visual-aside">Compare the counts, then double n mentally. Which approach grows slowest? Which becomes expensive fastest?</p>
      </div>
      <div className="visual-display">
        <div className="visual-question">Input size: <span className="visual-prompt">{n}</span></div>
        <Bars bars={complexityBars.map((item) => ({...item, width: 100 * Math.log10(item.value + 1) / logMax}))}
          note="Illustrative unit operation counts; the lengths are displayed on a logarithmic scale to keep small functions visible. These are not measured runtimes." />
        <div className="visual-formula">For n = {n}, quadratic work is <strong>{n * n}</strong> units compared with <strong>{n}</strong> linear units.</div>
        <div className="visual-explanation"><strong>What to notice</strong><p>Big-O describes how growth behaves as input size increases. It omits constant factors and does not promise a specific runtime. For real comparisons, choose meaningful input sizes and benchmark carefully.</p></div>
        <Link to="/course/dsa">Explore the algorithms curriculum <ArrowRight size={16} /></Link>
      </div>
    </section>}
    <section className="visual-next"><ChartColumn size={22} /><div><strong>From exploration to mastery</strong><p>These interactive diagrams build intuition. Full understanding also needs examples, exceptions, and independent exercises.</p></div><Link to="/catalog">Browse courses <ArrowRight size={16} /></Link></section>
  </div>;
}
