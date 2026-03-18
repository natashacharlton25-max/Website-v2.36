# BCI-Fluent LLM — Build Roadmap

## Stage 1: RAG (Retrieval Augmented Generation)
**Cost: £0 | Timeline: weeks | Uses: Workers AI free tier**

No training needed. Structure your existing data so any LLM can reason about BCI
by retrieving the right context at query time.

### What you already have:
- 6,428 BCI concepts with glosses, POS, derivations
- ~120 key characters (the primitives everything is built from)
- BCI fundamental rules document (composition grammar)
- 18 language translations per concept
- Concept definitions with is/isNot/visual/contains
- Set bias rules per symbol set
- 600 homophones
- Documentation on how BCI panel evaluates proposals

### Build:
1. Chunk all documents into a Vectorize index (Cloudflare's vector DB, free tier)
2. System prompt teaches the LLM BCI composition rules
3. On each query, retrieve relevant BCI concepts + rules + derivations
4. LLM reasons with real data, not training memory

### System prompt (core):
```
You are a BCI (Blissymbolics Communication International) specialist.

BCI is a compositional semantic language where ~120 key characters 
combine to form 6,428+ concepts. Each concept has:
- A numeric index (e.g. 12383)
- English glosses (e.g. "cat,feline_(animal),felid")
- A POS colour (YELLOW=noun, RED=verb, GREEN=descriptor, BLUE=person, WHITE=function)
- A derivation showing how it was composed from primitives

Composition rules:
- Concepts combine left-to-right: modifier + base = derived
- earth + container = flowerpot
- feeling + positive = happy  
- animal + young = puppy
- building + heal = hospital
- person + teach = teacher

When asked about a concept:
1. Check if it exists in the BCI vocabulary (search by gloss)
2. If it exists, return the index, glosses, derivation, and definition
3. If it doesn't exist, propose a composition from existing concepts
4. Validate compositions against BCI rules
5. Flag any rule violations

When proposing new concepts:
1. Identify the semantic components
2. Find existing BCI concepts for each component  
3. Compose following BCI derivation patterns
4. Generate: proposed index range, glosses, derivation, definition
5. Note similar existing concepts that might already cover this meaning
```

### Vectorize index structure:
```
Collection: bci_concepts
  - Each concept as a document with all fields
  - Embedded on: glosses + is_field + visual
  - Metadata: bci_index, pos, core_tier, derivation

Collection: bci_rules  
  - Each rule/principle as a document
  - The fundamental rules document chunked into sections

Collection: bci_key_characters
  - Each of the ~120 key characters
  - Their meaning, usage patterns, composition examples

Collection: concept_definitions
  - Your generated definitions
  - Embedded on: is_field + visual + polysemy_sense
```

### Query flow:
```
User: "What's the BCI for dishwasher?"

1. Search Vectorize for "dishwasher" → no exact match
2. Decompose: dish + wash + machine
3. Search each: dish=13711, wash=18049, machine=15388
4. Check derivation patterns for similar compounds
5. Retrieve BCI rules on three-element compositions
6. LLM proposes: dish(13711) + wash(18049) + machine(15388)
   Following pattern of: clothes + wash + machine = washing_machine
7. Returns proposal with confidence, similar concepts, rule compliance
```

### Worker endpoint:
```
POST /api/bci-reason
Body: { query: "What's the BCI for dishwasher?" }

→ Searches Vectorize for relevant concepts + rules
→ Builds context from retrieved documents  
→ Calls Workers AI with system prompt + context + query
→ Returns structured BCI reasoning
```

### Why start here:
- Zero training cost
- Uses your existing data immediately
- Tests whether the approach works before investing in fine-tuning
- You can evaluate quality on real queries
- Every query + response becomes training data for Stage 2


## Stage 2: Fine-tuned LoRA
**Cost: ~£50-100 | Timeline: months | Uses: Cloudflare Workers AI LoRA support**

Once Stage 1 proves the approach works and you've accumulated 
thousands of verified query-response pairs, fine-tune a LoRA adapter.

### Training data sources:

#### A. BCI composition pairs (from derivation column)
```jsonl
{"input": "How is 'hospital' composed in BCI?", "output": "BCI 14867 'hospital' is composed from building(12929) + heal(14650). The building character provides the base concept of a structure, and heal modifies it to specify a building where healing happens. This follows the standard modifier+base pattern."}
{"input": "How is 'puppy' composed in BCI?", "output": "BCI 16435 'puppy' is composed from dog(12380) + young(18300). The animal character provides the species, and young provides the age modifier. This follows the same pattern as kitten = cat + young, calf = cow + young."}
```
Generate these from your 6,428 derivations — every concept that has 
a derivation becomes a training example. ~4,000+ examples.

#### B. Concept definition generation pairs
```jsonl
{"input": "Generate a concept definition for BCI 12383: cat,feline_(animal),felid, POS=YELLOW", "output": {"is": "domestic cat pet feline four-legged small furry whiskers", "isNot": "caterpillar dog lion tiger kitten wildcat", "visual": "small furry animal pointed ears whiskers tail", "contains": ["furry body", "pointed ears", "whiskers", "tail"], "classification": "NOUN", "animacy": "ANIMAL", "concreteness": "CONCRETE"}}
```
Your 6,428 concept definitions once generated and reviewed = 6,428 training examples.

#### C. New concept proposals (from Stage 1 usage)
```jsonl
{"input": "Propose a BCI concept for 'tablet computer'", "output": "No existing BCI concept matches 'tablet computer'. Nearest: desktop_computer(23470), telephone(17688). Proposed composition: computer(23458) + flat(14226) + portable(24145). Following pattern: laptop is not yet in BCI but would be computer + fold. Confidence: medium — 'portable' may not be the right modifier, 'hand-held' could work better."}
```
Every query from Stage 1 that gets human-validated becomes a training example.

#### D. Error correction pairs
```jsonl
{"input": "Is BCI 13132 the right concept for 'cat'?", "output": "No. BCI 13132 is 'caterpillar', not 'cat'. The correct concept for 'cat' is BCI 12383 'cat,feline_(animal),felid'. This is a common confusion caused by substring matching — 'cat' appears at the start of 'caterpillar'."}
```
Your 85 validation samples + all the garbage band discoveries = error correction training data.

#### E. Cross-language reasoning
```jsonl
{"input": "Why might 'barn' return children's images?", "output": "In Swedish, 'barn' means 'children'. BCI 12630 English 'barn' (the farm building) has Swedish label that differs from the English word. When searching multilingual symbol databases, the Swedish meaning can contaminate English results. The concept definition isNot field should include 'children kids child Swedish' to catch this."}
```
Your cross-language collision discoveries = training data.

### Total training examples:
- ~4,000 composition pairs (from derivations)
- ~6,428 definition generation pairs (your definitions)
- ~500+ error corrections (validation data)
- ~200+ new concept proposals (Stage 1 usage)
- ~100+ cross-language reasoning (collision data)
- = ~11,000+ training examples

### LoRA fine-tune process:

1. Format all training data as JSONL
2. Upload to Cloudflare (they support LoRA on Workers AI)
   OR use Hugging Face / Together AI for the fine-tune
3. Base model: Llama 3.2 3B (small, fast, cheap)
4. LoRA rank: 16-32 (enough for domain knowledge, not personality)
5. Training: ~2-4 hours on a single GPU
6. Cost: ~$10-50 depending on platform
7. Deploy: upload LoRA adapter to Workers AI
8. Inference: same free tier, adapter loads on demand

### Cloudflare Workers AI LoRA support:
```javascript
const response = await env.AI.run(
  "@cf/meta/llama-3.2-3b-instruct",
  {
    messages: [{ role: "user", content: query }],
    lora: "bci-reasoning-v1"  // your fine-tuned adapter
  }
);
```

### What the fine-tuned model gains over RAG:
- Faster inference (no retrieval step)
- Deeper understanding of composition patterns  
- Can generalise to unseen compositions
- Consistent reasoning style
- Can be shared as an open model for the AAC community


## Stage 3: BCI Reasoning Engine
**Cost: grant funded | Timeline: 6-12 months | The research programme**

The fine-tuned model becomes a component in a larger system:

```
User query
  → BCI LoRA model (understands composition)
  → Vectorize (retrieves relevant concepts)  
  → Concept definitions (structured knowledge)
  → Set bias rules (visual expectations)
  → Image generator (creates symbols)
  → Safeguarding model (checks output)
  → Output: new BCI concept proposal + candidate symbols
```

This is the system you demo to BCI, W3C, Communication Matters.
Not "we want to help" — "here's a working tool, try it."


## Summary

| Stage | Cost | Time | What you get |
|-------|------|------|-------------|
| 1. RAG | £0 | Weeks | BCI reasoning via retrieval, tests approach |
| 2. LoRA | £50 | Months | Fine-tuned model that thinks in BCI |
| 3. Engine | Grant | 6-12mo | Full proposal system for BCI/W3C |

Start Stage 1 now alongside the classification tool.
Every query becomes training data for Stage 2.
Stage 2 feeds Stage 3.
Each stage works standalone — you don't need Stage 3 to get value from Stage 1.
