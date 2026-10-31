import type { Chapter } from "./schema";
const makeChapter = (id: string, title: string, introduction: string, sections: Chapter["sections"], questions: Chapter["assessment"]["questions"], summary: string[], glossary: Chapter["glossary"]): Chapter => ({
  id, version: 1, title, introduction, minutes: 50,
  objectives: [{id:"understand",text:"Explain the core concept using correct terminology."},{id:"implement",text:"Run, modify and test a small Python implementation."},{id:"evaluate",text:"Identify the limitations of the example."}],
  prerequisites: [], sections, summary, glossary,
  references: [{id:"hf",title:"Hugging Face LLM Course",url:"https://huggingface.co/learn/llm-course/chapter1/1"},{id:"py",title:"Python Tutorial",url:"https://docs.python.org/3/tutorial/"}],
  assessment:{id:id+"-assessment",version:1,title:"Check your understanding",questions}
});
export const llmChapters: Chapter[] = [
makeChapter("llm-foundations","Language models from first principles",
"Learn what an LLM actually does, why text becomes tokens, and how training differs from inference. No previous AI experience required.",[
{id:"concepts",title:"1. AI, machine learning and LLMs",blocks:[
{type:"paragraph",text:"Artificial intelligence is a broad field. Machine learning uses data to learn patterns. A language model learns relationships in sequences of tokens. Many modern LLMs use transformer neural networks and are trained to predict tokens from context."},
{type:"definition",term:"Token",text:"A unit of text that may be a word, part of a word or punctuation. Real tokenization is not simply splitting on spaces."},
{type:"diagram",caption:"Simplified causal language-model pipeline",steps:["Text input","Tokenizer maps text to token IDs","Neural network produces next-token scores","Decoding chooses a token","Repeat for the next token"]},
{type:"callout",tone:"mistake",title:"Fluency is not truth",text:"Predicting plausible tokens does not guarantee accurate facts or valid reasoning."}
]},
{id:"training",title:"2. Training and inference are different",blocks:[
{type:"paragraph",text:"Training updates learned model parameters using examples, a loss function and optimization. Inference uses those learned parameters to produce predictions, generally without updating them. Downloading a model to a phone is not training it."},
{type:"table",headers:["Property","Training","Inference"],rows:[["Goal","Learn parameters","Use parameters"],["Updates weights","Usually yes","Usually no"],["Inputs","Training examples","User prompts"]]},
{type:"callout",tone:"note",title:"Offline model reality",text:"The size of an installed model does not prove that an application uses it locally or that it can generate images."}
]},
{id:"lab",title:"3. Python lab: a transparent next-word selector",blocks:[
{type:"paragraph",text:"This first experiment uses manually written probabilities. It is NOT a trained language model. Run it in the built-in Python laboratory, then change the scores so clear becomes the top prediction."},
{type:"code",example:{source:"scores = {'blue': 0.65, 'clear': 0.20, 'dark': 0.10, 'green': 0.05}\nprompt = 'The sky is'\nnext_word = max(scores, key=scores.get)\nprint(prompt + ' ' + next_word)\nprint(scores[next_word])",expectedOutput:"The sky is blue\n0.65",explanation:"max selects the dictionary key with the highest score. The numbers are hard-coded rather than learned."}},
{type:"callout",tone:"note",title:"Reflect",text:"Explain why changing dictionary values by hand is not model training, and why the most probable word need not always be sampled."}
]}],[
{id:"token",kind:"single",prompt:"Which statement about tokens is correct?",options:["Every token is a complete word","Tokens may be word fragments","Tokens are always sentences"],answer:[1],hint:"Subword tokenizers can split words.",explanation:"Tokens may be words, subwords or punctuation."},
{id:"training",kind:"single",prompt:"What usually changes during training?",options:["Learned model parameters","The user's display","Python syntax"],answer:[0],hint:"An optimizer adjusts numerical weights.",explanation:"Training updates model parameters to reduce a loss."},
{id:"selector",kind:"code",prompt:"Implement predict(scores), returning the key with the largest value.",starter:"def predict(scores):\n    pass",tests:"assert predict({'a': 0.1, 'b': 0.9}) == 'b'\nassert predict({'tea': 0.8, 'coffee': 0.2}) == 'tea'",hint:"Use max(scores, key=scores.get)."}
],["Language models learn token-sequence patterns.","Training updates parameters; inference uses them.","A hard-coded probability table is not a trained model."],[{term:"Token",definition:"A unit of text used by a model."},{term:"Inference",definition:"Producing predictions using a model."}]),
makeChapter("llm-tokenization","Tokenization and vocabulary",
"Turn raw sentences into numerical token IDs using a deliberately simple Python tokenizer.",[
{id:"vocabulary",title:"1. Why text becomes IDs",blocks:[
{type:"paragraph",text:"Neural networks calculate with numbers. A vocabulary maps tokens to integer IDs. Production tokenizers often use subword pieces, while our first experiment uses whole words separated by spaces."},
{type:"definition",term:"Vocabulary",text:"A mapping between tokens and their numerical IDs."},
{type:"diagram",caption:"Text encoding",steps:["cats chase birds","Split into word tokens","Look up vocabulary IDs","[1, 2, 3]"]}
]},
{id:"encode",title:"2. Build a tokenizer",blocks:[
{type:"code",example:{source:"vocab = {'<unk>': 0, 'cats': 1, 'chase': 2, 'birds': 3}\ndef encode(text):\n    return [vocab.get(word, 0) for word in text.lower().split()]\nprint(encode('cats chase birds'))\nprint(encode('cats see birds'))",expectedOutput:"[1, 2, 3]\n[1, 0, 3]",explanation:"The unknown word see maps to the reserved unknown-token ID 0."}},
{type:"callout",tone:"mistake",title:"Teaching tokenizer only",text:"Splitting on whitespace loses punctuation details and cannot reconstruct unknown words. Real LLM tokenizers are more sophisticated."}
]},
{id:"decode",title:"3. Decode and investigate",blocks:[
{type:"code",example:{source:"vocab = {'<unk>': 0, 'cats': 1, 'chase': 2, 'birds': 3}\nreverse = {number: word for word, number in vocab.items()}\nprint(' '.join(reverse[i] for i in [1, 2, 3]))",expectedOutput:"cats chase birds",explanation:"A reverse lookup reconstructs known words. Capitalization is not preserved."}},
{type:"paragraph",text:"Exercise: add see to the vocabulary, encode cats see birds, and verify that the unknown ID disappears. Explain what happens to punctuation and capitalization."}
]}],[
{id:"vocab",kind:"single",prompt:"What is a vocabulary?",options:["A mapping of tokens to IDs","A training GPU","An image editor"],answer:[0],hint:"Think about integer IDs.",explanation:"Vocabulary maps tokens to numerical IDs."},
{id:"unknown",kind:"single",prompt:"How does our toy tokenizer handle unknown words?",options:["Retrains itself","Maps them to 0","Calls an API"],answer:[1],hint:"Inspect vocab.get(word, 0).",explanation:"Unknown words receive the fallback ID 0."},
{id:"encode-code",kind:"code",prompt:"Implement encode(text) with the predefined vocabulary and unknown ID 0.",starter:"vocab = {'<unk>': 0, 'cats': 1, 'chase': 2, 'birds': 3}\ndef encode(text):\n    pass",tests:"assert encode('cats chase birds') == [1, 2, 3]\nassert encode('cats see birds') == [1, 0, 3]\nassert encode('CATS') == [1]",hint:"Lowercase, split and use vocab.get(word, 0)."}
],["Vocabulary maps tokens to integers.","Unknown-token handling is a design choice.","Word-level examples are not production tokenizers."],[{term:"Vocabulary",definition:"Mapping of tokens to numerical IDs."},{term:"Encode",definition:"Convert text into token IDs."}]),
makeChapter("llm-bigrams","Train a tiny statistical language model",
"Move from hand-authored scores to probabilities learned from example text. This is a real statistical baseline, not a transformer.",[
{id:"pairs",title:"1. Learn from adjacent words",blocks:[
{type:"paragraph",text:"A bigram model counts which words follow each context word. It predicts using only one preceding token, unlike a transformer that can consider a larger context window."},
{type:"definition",term:"Bigram",text:"A pair of adjacent tokens."},
{type:"diagram",caption:"Bigram learning",steps:["Collect sentences","Count adjacent token pairs","Normalize counts to probabilities","Predict the next token"]}
]},
{id:"train",title:"2. Python lab: count and normalize",blocks:[
{type:"code",example:{source:"from collections import defaultdict, Counter\nsentences = ['i like tea', 'i like coffee', 'you like tea']\ncounts = defaultdict(Counter)\nfor sentence in sentences:\n    words = sentence.split()\n    for left, right in zip(words, words[1:]):\n        counts[left][right] += 1\ndef probability(left, right):\n    total = sum(counts[left].values())\n    return counts[left][right] / total if total else 0.0\nprint(round(probability('like', 'tea'), 3))\nprint(round(probability('like', 'coffee'), 3))",expectedOutput:"0.667\n0.333",explanation:"The model learned two like→tea transitions and one like→coffee transition from its tiny dataset."}},
{type:"callout",tone:"note",title:"Evidence limit",text:"These probabilities reflect only three sentences, not general language. More data and better evaluation are necessary."}
]},
{id:"evaluate",title:"3. What makes a model reliable?",blocks:[
{type:"paragraph",text:"Evaluate on held-out examples rather than only the training sentences. A bigram model cannot capture long-range dependencies. Transformers use learned representations and attention, which we will study in later modules."},
{type:"table",headers:["Approach","Learns from data?","Context"],rows:[["Hard-coded scores","No","Manual"],["Bigram counts","Yes","One previous token"],["Transformer","Yes","Many tokens"]]},
{type:"callout",tone:"mistake",title:"Not GPT yet",text:"A statistical bigram predictor is a useful first model but has no transformer, attention layers or gradient training."}
]}],[
{id:"pairs",kind:"single",prompt:"What does a bigram model count?",options:["Adjacent token pairs","Image pixels","Internet requests"],answer:[0],hint:"Bigram means two adjacent tokens.",explanation:"It counts how frequently one token follows another."},
{id:"test",kind:"single",prompt:"Why use held-out evaluation data?",options:["To test unseen examples","To increase screen size","To avoid training"],answer:[0],hint:"Training data may be memorized.",explanation:"Held-out data helps evaluate generalization."},
{id:"prob-code",kind:"code",prompt:"Implement probability(count, total), returning zero when total is zero.",starter:"def probability(count, total):\n    pass",tests:"assert probability(2, 3) == 2/3\nassert probability(0, 0) == 0\nassert probability(1, 4) == 0.25",hint:"Guard total == 0, then divide."}
],["Bigram counts are learned from example sentences.","Normalize counts to get conditional probabilities.","Small data and short context limit generalization."],[{term:"Bigram",definition:"Two adjacent tokens."},{term:"Held-out data",definition:"Examples reserved for evaluation."}])
];