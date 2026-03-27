import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: "pipelining",
    label: "Pipelining",
    icon: "⚡",
    color: "#00f5d4",
    formulas: [
      {
        id: "ideal-cpi",
        title: "Ideal CPI",
        level: "easy",
        formula: "CPI_ideal = 1",
        meaning: "In a perfect pipeline with no hazards, every stage completes one instruction per clock cycle.",
        when: "Use as the baseline for any pipeline performance comparison. Real CPI is always ≥ 1.",
        example: "A 5-stage MIPS pipeline with no stalls: CPI = 1, throughput = 1 IPC.",
        mistake: "Forgetting that Ideal CPI = 1 only if there are NO structural, data, or control hazards."
      },
      {
        id: "actual-cpi",
        title: "Actual CPI",
        level: "medium",
        formula: "CPI_actual = CPI_ideal + Stall_cycles_per_instruction",
        meaning: "Real CPI is degraded by pipeline stalls caused by hazards. Every stall adds wasted cycles.",
        when: "Use when computing real throughput after accounting for data, control, or structural hazards.",
        example: "Ideal CPI = 1, average stalls = 0.4 → Actual CPI = 1.4",
        mistake: "Mixing up stall cycles per instruction (average) with total stall cycles in the program."
      },
      {
        id: "speedup",
        title: "Pipeline Speedup",
        level: "easy",
        formula: "Speedup ≈ n  (n = number of pipeline stages)",
        meaning: "An n-stage pipeline can theoretically run n times faster than a single-cycle design.",
        when: "Quick approximation for ideal speedup. Actual speedup is less due to hazards and pipeline overhead.",
        example: "5-stage pipeline vs single-cycle: Speedup ≈ 5×. With stalls, Speedup < 5.",
        mistake: "Applying ideal speedup formula when the problem has explicit stall information. Always use actual CPI in that case."
      },
      {
        id: "speedup-exact",
        title: "Exact Speedup (with Stalls)",
        level: "medium",
        formula: "Speedup = (CPI_seq × T_seq) / (CPI_pipe × T_pipe)\n         ≈ n / (1 + stall_rate)",
        meaning: "Accounts for both the gain from pipelining (≈n) and the loss from stall cycles.",
        when: "When comparing a non-pipelined and pipelined processor with known stall data.",
        example: "n=5 stages, 0.5 stalls per instruction: Speedup = 5 / 1.5 ≈ 3.33×",
        mistake: "Ignoring that clock period may differ between pipelined and non-pipelined designs."
      },
      {
        id: "throughput",
        title: "Pipeline Throughput",
        level: "easy",
        formula: "Throughput = 1 / (CPI × T_clk)\nIPC = 1 / CPI",
        meaning: "Throughput is instructions completed per second. IPC (Instructions Per Cycle) is its inverse of CPI.",
        when: "Use throughput to compare processor performance at the same clock speed.",
        example: "CPI = 1.4, T_clk = 2ns → Throughput = 1/(1.4 × 2ns) ≈ 357 MIPS",
        mistake: "Confusing latency (time for one instruction) with throughput (rate of instruction completion)."
      },
      {
        id: "latency-vs-throughput",
        title: "Latency vs Throughput",
        level: "easy",
        formula: "Latency = n × T_clk  (single instruction through n stages)\nThroughput = 1 / T_clk  (after pipeline fills)",
        meaning: "Pipelining improves throughput but NOT latency. Each instruction still passes through all n stages.",
        when: "Any question distinguishing 'how fast is one instruction' from 'how many instructions per second'.",
        example: "5-stage pipeline at 1GHz: Latency = 5ns, Throughput = 1 instruction/ns.",
        mistake: "Claiming pipelining reduces latency. It doesn't — it overlaps instructions."
      }
    ]
  },
  {
    id: "hazards",
    label: "Pipeline Hazards",
    icon: "⚠️",
    color: "#ff6b6b",
    formulas: [
      {
        id: "data-hazard-stalls",
        title: "Data Hazard Stall Cycles",
        level: "critical",
        formula: "Stall_cycles = dependency_distance_penalty × occurrence_fraction\n(RAW typically: 2 stall cycles without forwarding)",
        meaning: "A Read-After-Write (RAW) hazard causes a dependent instruction to stall until data is written back.",
        when: "Determine stall cycles when forwarding is disabled or a load-use hazard occurs.",
        example: "Without forwarding, RAW hazard → 2 stall cycles. With forwarding → 0 (mostly).",
        mistake: "Assuming forwarding eliminates ALL stalls. Load-Use hazard still causes 1 stall even with forwarding."
      },
      {
        id: "load-use",
        title: "Load-Use Hazard Condition",
        level: "critical",
        formula: "Stall if: (ID/EX.MemRead = 1) AND\n          (ID/EX.Rt = IF/ID.Rs OR ID/EX.Rt = IF/ID.Rt)",
        meaning: "When a load instruction is immediately followed by an instruction using the loaded value, 1 bubble must be inserted.",
        when: "Specifically for MIPS-style pipeline: lw followed immediately by a dependent instruction.",
        example: "lw $t1, 0($t0)  followed by  add $t2, $t1, $t3 → 1 stall cycle injected.",
        mistake: "Forgetting that even with full forwarding, load-use always requires exactly 1 stall bubble."
      },
      {
        id: "branch-penalty",
        title: "Branch Penalty",
        level: "critical",
        formula: "Branch penalty = Number of stages before branch resolves\n(Typically 1–3 cycles depending on pipeline design)",
        meaning: "Control hazard: the pipeline fetches wrong instructions after a branch until the branch outcome is known.",
        when: "Use when calculating the cost of branches in a pipeline.",
        example: "Branch resolved at EX stage (stage 3): Branch penalty = 2 cycles.",
        mistake: "Assuming branch prediction eliminates penalty. Misprediction still incurs the full penalty."
      },
      {
        id: "cpi-branch",
        title: "CPI with Branch Stalls",
        level: "critical",
        formula: "CPI = Base CPI + Branch_freq × Branch_penalty\n    = 1 + (Branch_fraction × Misprediction_rate × Penalty)",
        meaning: "Branches degrade CPI proportionally to how often they occur and how often prediction fails.",
        when: "Performance analysis when branch frequency and prediction accuracy are given.",
        example: "Base CPI=1, branch freq=20%, penalty=3, misprediction=10%:\nCPI = 1 + 0.20 × 0.10 × 3 = 1.06",
        mistake: "Using total branch penalty when you have a predictor. Only count mispredictions."
      },
      {
        id: "effective-cpi",
        title: "Effective CPI (All Hazards)",
        level: "critical",
        formula: "CPI_eff = Base CPI + Data_stalls + Control_stalls + Structural_stalls",
        meaning: "The real CPI accounting for all pipeline hazard sources combined.",
        when: "Comprehensive performance questions with multiple hazard types.",
        example: "Base=1, data stalls=0.3, branch stalls=0.2, structural=0.05 → CPI = 1.55",
        mistake: "Forgetting structural hazards (e.g., single memory port for both data and instruction fetch)."
      },
      {
        id: "structural-hazard",
        title: "Structural Hazard Stalls",
        level: "medium",
        formula: "Stall occurs when two instructions need the same hardware resource simultaneously.\nAvoid by: resource duplication (e.g., separate I-cache and D-cache)",
        meaning: "Two instructions compete for one hardware unit (e.g., one memory port, one ALU).",
        when: "Design questions about pipeline resource conflicts.",
        example: "Single memory: lw in MEM and IF both need memory → stall. Fix: Harvard architecture.",
        mistake: "Assuming structural hazards are automatically handled. They require explicit hardware design."
      }
    ]
  },
  {
    id: "memory",
    label: "Memory & Cache",
    icon: "🧱",
    color: "#ffd166",
    formulas: [
      {
        id: "amat",
        title: "AMAT (Average Memory Access Time)",
        level: "critical",
        formula: "AMAT = Hit_time + Miss_rate × Miss_penalty",
        meaning: "The average time to access memory, accounting for cache hits (fast) and misses (slow main memory).",
        when: "ALWAYS use for cache performance problems. This is THE most important memory formula.",
        example: "Hit time = 2 cycles, Miss rate = 0.05, Miss penalty = 100 cycles:\nAMAT = 2 + 0.05 × 100 = 7 cycles",
        mistake: "Forgetting that Hit_time is paid every access (hits AND misses). It's not zero on a hit."
      },
      {
        id: "amat-multilevel",
        title: "AMAT (Multi-level Cache)",
        level: "critical",
        formula: "AMAT = L1_hit + L1_miss × (L2_hit + L2_miss × Mem_penalty)\n\nOr: AMAT = HT_L1 + MR_L1×HT_L2 + MR_L1×MR_L2×Mem_penalty",
        meaning: "With L1 and L2 caches, a miss at L1 goes to L2, and a miss at L2 goes to main memory.",
        when: "Any problem with 2+ levels of cache hierarchy.",
        example: "HT_L1=2, MR_L1=0.1, HT_L2=10, MR_L2=0.05, Mem=200:\nAMAT = 2 + 0.1×(10 + 0.05×200) = 2 + 0.1×20 = 4 cycles",
        mistake: "Using global miss rate for L2 instead of local miss rate (of accesses that reach L2)."
      },
      {
        id: "miss-rate",
        title: "Miss Rate & Hit Rate",
        level: "easy",
        formula: "Miss_rate = Misses / Total_accesses\nHit_rate  = Hits  / Total_accesses\nMiss_rate + Hit_rate = 1",
        meaning: "Fraction of memory accesses that find data in cache (hit) or must go to next level (miss).",
        when: "Any cache performance calculation. Usually given directly or derived from access traces.",
        example: "1000 accesses, 950 hits: Hit_rate = 0.95, Miss_rate = 0.05",
        mistake: "Calculating miss rate as Misses/Hits instead of Misses/Total."
      },
      {
        id: "cpu-time-memory",
        title: "CPU Time with Memory Stalls",
        level: "critical",
        formula: "CPU_time = (CPU_cycles + Memory_stall_cycles) × T_clk",
        meaning: "Total execution time includes both computation cycles and cycles wasted waiting for memory.",
        when: "Full system performance questions combining execution + memory hierarchy.",
        example: "CPU_cycles=1000, stall=200, T_clk=2ns: CPU_time = 1200 × 2ns = 2400ns",
        mistake: "Ignoring memory stalls in CPU time formula — a common exam trap."
      },
      {
        id: "memory-stall-cycles",
        title: "Memory Stall Cycles",
        level: "critical",
        formula: "Mem_stall_cycles = (Mem_accesses / Instructions) × Miss_rate × Miss_penalty\n               = Mem_accesses × Miss_rate × Miss_penalty",
        meaning: "Total clock cycles wasted per instruction due to cache misses.",
        when: "Computing the memory component of CPI or total CPU time.",
        example: "1.5 mem accesses/instr, miss_rate=0.02, penalty=50:\nMem_stall = 1.5 × 0.02 × 50 = 1.5 cycles/instr",
        mistake: "Counting only instruction fetch misses; data memory misses must be included separately."
      },
      {
        id: "cpi-memory",
        title: "CPI with Memory Stalls",
        level: "critical",
        formula: "CPI = Base_CPI + Mem_stall_cycles_per_instruction\n    = Base_CPI + (Imiss_rate × Imiss_penalty) + (Dmiss_rate × Dmiss_penalty × data_frac)",
        meaning: "The real CPI combining execution + instruction fetch stalls + data memory stalls.",
        when: "Performance problems separating instruction cache and data cache miss rates.",
        example: "Base CPI=1, I-miss=2%, D-miss=4%, penalty=50 both, 36% data:\nCPI = 1 + 0.02×50 + 0.36×0.04×50 = 1 + 1 + 0.72 = 2.72",
        mistake: "Applying data miss rate to ALL instructions. Only data-memory instructions (loads/stores) cause data misses."
      }
    ]
  },
  {
    id: "cache-addressing",
    label: "Cache Addressing",
    icon: "📍",
    color: "#a78bfa",
    formulas: [
      {
        id: "direct-mapping",
        title: "Direct Mapping Index",
        level: "medium",
        formula: "Cache_index = Block_address mod Number_of_cache_blocks\n            = (Block_address) & (NumBlocks − 1)  [if power of 2]",
        meaning: "Each memory block maps to exactly one cache line. The index selects which cache line to check.",
        when: "Determining which cache line a memory address maps to in a direct-mapped cache.",
        example: "Cache has 8 blocks. Block address 13: index = 13 mod 8 = 5 → maps to cache line 5.",
        mistake: "Using byte address directly. Always convert to block address first by dividing by block size."
      },
      {
        id: "address-breakdown",
        title: "Address Breakdown (Tag | Index | Offset)",
        level: "critical",
        formula: "Physical Address = [  Tag  |  Index  |  Block Offset  ]\n\nOffset bits = log₂(Block_size_in_bytes)\nIndex  bits = log₂(Number_of_cache_blocks)\nTag    bits = Address_bits − Index_bits − Offset_bits",
        meaning: "Every memory address is split into 3 fields: Tag (identifies which block), Index (which cache line), Offset (byte within block).",
        when: "Cache design and lookup problems — always decompose address this way.",
        example: "32-bit addr, 16-byte blocks, 256-line cache:\nOffset=4, Index=8, Tag=20 bits.",
        mistake: "Reversing tag and index positions. Tag is ALWAYS the most significant bits."
      },
      {
        id: "block-address",
        title: "Block Address",
        level: "easy",
        formula: "Block_address = ⌊Byte_address / Block_size⌋\n             = Byte_address >> log₂(Block_size)",
        meaning: "Strips the byte offset to identify which block of memory is being accessed.",
        when: "First step in any cache lookup or mapping problem.",
        example: "Byte address = 200, Block size = 16: Block_address = ⌊200/16⌋ = 12",
        mistake: "Forgetting integer division — block address is always an integer (floor)."
      },
      {
        id: "set-associative",
        title: "Set-Associative Mapping",
        level: "medium",
        formula: "Number_of_sets = Total_cache_blocks / Associativity\nSet_index = Block_address mod Number_of_sets\nOffset bits = log₂(block_size)\nIndex  bits = log₂(num_sets)\nTag    bits = addr_bits − index_bits − offset_bits",
        meaning: "n-way set associative: address maps to a set of n lines, any of which can hold the block.",
        when: "Cache problems specifying 2-way, 4-way, 8-way associativity.",
        example: "4-way, 64 total lines → 16 sets. Addr: 32-bit, 4B block.\nIndex=4, Offset=2, Tag=26.",
        mistake: "Using total lines count for index bits instead of number of sets."
      }
    ]
  },
  {
    id: "cache-design",
    label: "Cache Design",
    icon: "🔧",
    color: "#06d6a0",
    formulas: [
      {
        id: "total-cache-bits",
        title: "Total Cache Storage Bits",
        level: "medium",
        formula: "Total_bits = Num_blocks × (Valid_bit + Tag_bits + Data_bits)\nData_bits = Block_size × 8\nTag_bits  = Address_bits − Index_bits − Offset_bits",
        meaning: "The actual hardware size of a cache including overhead bits (tag + valid), not just data.",
        when: "Cache design questions asking 'how many bits total?' — remember tag and valid overhead!",
        example: "256-line direct map, 32B blocks, 32-bit addr:\nIndex=8, Offset=5, Tag=19.\nPer line: 1+19+256 = 276 bits.\nTotal = 256 × 276 = 70,656 bits ≈ 8.6 KB",
        mistake: "Reporting only data capacity (256 × 32B = 8KB) and forgetting tag+valid overhead."
      },
      {
        id: "cache-capacity",
        title: "Cache Data Capacity",
        level: "easy",
        formula: "Cache_capacity = Num_blocks × Block_size\n(in bytes)\nNum_blocks = Cache_size / Block_size",
        meaning: "The useful data storage in cache, excluding tag and valid bit overhead.",
        when: "When the question asks for data capacity, not total hardware bits.",
        example: "128 blocks × 64 bytes = 8192 bytes = 8 KB cache capacity.",
        mistake: "Confusing cache capacity with total hardware bits. They are different!"
      },
      {
        id: "write-policy",
        title: "Write Policies",
        level: "medium",
        formula: "Write-Through: Write to cache AND memory simultaneously\n  Stall cycles on write = Write_fraction × Miss_penalty\n\nWrite-Back: Write to cache only; write to memory when evicted\n  Dirty bit overhead included in Total_bits formula",
        meaning: "Write policy determines when modified cache data propagates to main memory.",
        when: "Cache design, memory traffic analysis, or CPI questions mentioning write operations.",
        example: "Write-through with 25% stores, miss penalty 100: extra CPI = 0.25×100 = 25 — very costly!",
        mistake: "Applying write miss penalty to all instructions. Only write instructions matter for write policy."
      },
      {
        id: "replacement-policy",
        title: "Replacement Policies",
        level: "medium",
        formula: "LRU: Evict least-recently-used block\n  → Best hit rate, requires tracking\nFIFO: Evict oldest block\n  → Simpler, Bélády anomaly possible\nRandom: Evict random block\n  → No tracking needed, unpredictable\n\nOptimal (Bélády): Evict block used furthest in future (theoretical best)",
        meaning: "When all ways in a set are full, replacement policy decides which block to kick out.",
        when: "Cache miss analysis or design trade-off questions.",
        example: "LRU with 3 frames, access: 1,2,3,1,2,4,1 → 4 misses.\nFIFO for same: may give more misses.",
        mistake: "Assuming LRU is always optimal. Bélády algorithm is optimal but requires future knowledge."
      }
    ]
  },
  {
    id: "datapath",
    label: "Datapath & Control",
    icon: "🔌",
    color: "#f77f00",
    formulas: [
      {
        id: "pipeline-registers",
        title: "Pipeline Register Data Flow",
        level: "medium",
        formula: "IF  → [IF/ID]  → ID  → [ID/EX]  → EX  → [EX/MEM]  → MEM  → [MEM/WB]  → WB\n\nControl signals generated at ID, travel forward through pipeline registers.",
        meaning: "Instructions and their control signals pass through latched registers between pipeline stages.",
        when: "Understanding forwarding paths, hazard detection, and control signal timing.",
        example: "A load word: MemRead=1 set at ID, carried in ID/EX.MemRead, used in EX to detect load-use.",
        mistake: "Thinking control signals are re-decoded each stage. They propagate from ID through registers."
      },
      {
        id: "control-signals-ex",
        title: "EX Stage Control Signals",
        level: "medium",
        formula: "EX controls: { RegDst, ALUOp[1:0], ALUSrc }\nRegDst:  0 = rt dest (I-type), 1 = rd dest (R-type)\nALUSrc:  0 = register, 1 = immediate\nALUOp:   00=add(lw/sw), 01=sub(branch), 10=R-type",
        meaning: "These signals control the ALU operation and source/destination register selection at EX stage.",
        when: "Datapath design, control unit truth tables, hazard detection questions.",
        example: "For 'add $rd, $rs, $rt': RegDst=1, ALUSrc=0, ALUOp=10.",
        mistake: "Confusing ALUOp (2-bit high-level) with ALU control (4-bit fine-grained operation selector)."
      },
      {
        id: "control-signals-mem",
        title: "MEM Stage Control Signals",
        level: "medium",
        formula: "MEM controls: { Branch, MemRead, MemWrite }\nBranch:    1 = conditional branch instruction\nMemRead:   1 = load instruction (lw)\nMemWrite:  1 = store instruction (sw)",
        meaning: "These signals control whether memory is read, written, or a branch is taken in the MEM stage.",
        when: "Datapath analysis and hazard detection unit design.",
        example: "For 'lw': MemRead=1, MemWrite=0, Branch=0. For 'sw': MemRead=0, MemWrite=1.",
        mistake: "Setting both MemRead and MemWrite for load. Only MemRead=1 for load; only MemWrite=1 for store."
      },
      {
        id: "control-signals-wb",
        title: "WB Stage Control Signals",
        level: "easy",
        formula: "WB controls: { RegWrite, MemToReg }\nRegWrite:  1 = write result back to register file\nMemToReg:  0 = ALU result, 1 = memory data (lw)",
        meaning: "Controls whether and what data is written back to the register file.",
        when: "Datapath writeback analysis; checking if an instruction modifies a register.",
        example: "For 'lw': RegWrite=1, MemToReg=1. For 'sw': RegWrite=0 (no register write).",
        mistake: "Setting RegWrite=1 for store instructions. sw does NOT write to any register."
      },
      {
        id: "forwarding-paths",
        title: "Forwarding (Bypassing) Conditions",
        level: "critical",
        formula: "EX Hazard (forward from EX/MEM):\n  EX/MEM.RegWrite=1 AND EX/MEM.Rd ≠ 0\n  AND (EX/MEM.Rd = ID/EX.Rs OR ID/EX.Rt)\n\nMEM Hazard (forward from MEM/WB):\n  MEM/WB.RegWrite=1 AND MEM/WB.Rd ≠ 0\n  AND NOT EX hazard condition\n  AND (MEM/WB.Rd = ID/EX.Rs OR ID/EX.Rt)",
        meaning: "Forward the most recent value of a register from a later pipeline stage back to EX stage input.",
        when: "Pipelined datapath with forwarding unit — eliminates most data hazard stalls.",
        example: "add $1,$2,$3 followed by sub $4,$1,$5: EX/MEM.Rd=$1 matches ID/EX.Rs=$1 → forward!",
        mistake: "Not checking priority — EX hazard takes priority over MEM hazard for the same register."
      }
    ]
  }
];

const QUIZ_QUESTIONS = [
  {
    q: "A cache has Hit time = 4 cycles, Miss rate = 10%, Miss penalty = 80 cycles. Find AMAT.",
    formula: "AMAT = Hit_time + Miss_rate × Miss_penalty",
    answer: "AMAT = 4 + 0.10 × 80 = 4 + 8 = 12 cycles",
    topic: "memory"
  },
  {
    q: "A 5-stage pipeline has Base CPI = 1, branch frequency = 20%, branch penalty = 3 cycles, misprediction rate = 15%. Find effective CPI.",
    formula: "CPI = Base CPI + Branch_freq × Misprediction_rate × Branch_penalty",
    answer: "CPI = 1 + 0.20 × 0.15 × 3 = 1 + 0.09 = 1.09",
    topic: "hazards"
  },
  {
    q: "32-bit addresses, 64-byte blocks, 1024-line direct-mapped cache. Find Tag, Index, Offset bits.",
    formula: "Offset = log₂(64) = 6, Index = log₂(1024) = 10, Tag = 32−10−6 = 16 bits",
    answer: "Offset = 6 bits, Index = 10 bits, Tag = 16 bits",
    topic: "cache-addressing"
  },
  {
    q: "CPU: Base CPI = 1.5, 35% loads/stores with 4% miss rate, 2% instruction miss rate, both penalty = 100 cycles. Find total CPI.",
    formula: "CPI = Base + I_miss×penalty + D_frac×D_miss×penalty",
    answer: "CPI = 1.5 + 0.02×100 + 0.35×0.04×100 = 1.5 + 2 + 1.4 = 4.9",
    topic: "memory"
  },
  {
    q: "Byte address = 1352, block size = 32 bytes. Find block address and cache index for 128-line direct cache.",
    formula: "Block_addr = ⌊1352/32⌋ = 42. Index = 42 mod 128 = 42",
    answer: "Block address = 42, Cache index = 42",
    topic: "cache-addressing"
  },
  {
    q: "Pipeline: 40% loads, 25% have load-use hazard. No forwarding: RAW = 2 stalls. With forwarding: load-use = 1 stall. Base CPI = 1. Find CPI for both cases.",
    formula: "CPI_no_fwd = 1 + 0.40 × 2 = 1.8. CPI_fwd = 1 + 0.40 × 0.25 × 1 = 1.1",
    answer: "Without forwarding: CPI = 1.80. With forwarding: CPI = 1.10",
    topic: "hazards"
  }
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  easy:     { color: "#00f5d4", label: "Easy",     dot: "🟢" },
  medium:   { color: "#ffd166", label: "Medium",   dot: "🟡" },
  critical: { color: "#ff6b6b", label: "Critical", dot: "🔴" }
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Pill({ level }) {
  const c = LEVEL_CONFIG[level];
  return (
    <span style={{
      background: c.color + "22",
      border: `1px solid ${c.color}66`,
      color: c.color,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
      borderRadius: 20,
      letterSpacing: 1,
      textTransform: "uppercase"
    }}>{c.dot} {c.label}</span>
  );
}

function FormulaCard({ formula, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const lc = LEVEL_CONFIG[formula.level];

  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(formula.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      border: `1px solid ${lc.color}33`,
      borderLeft: `3px solid ${lc.color}`,
      borderRadius: 12,
      marginBottom: 14,
      overflow: "hidden",
      transition: "box-shadow 0.2s",
      boxShadow: open ? `0 0 20px ${lc.color}22` : "none"
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", cursor: "pointer", gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <span style={{ color: lc.color, fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>ƒ</span>
          <span style={{ color: "#e6edf3", fontWeight: 600, fontSize: 15 }}>{formula.title}</span>
          <Pill level={formula.level} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={copy}
            style={{
              background: copied ? "#00f5d422" : "#ffffff11",
              border: "1px solid #ffffff22",
              color: copied ? "#00f5d4" : "#8b949e",
              borderRadius: 6, padding: "3px 10px", fontSize: 11,
              cursor: "pointer", transition: "all 0.2s"
            }}
          >{copied ? "✓ Copied" : "Copy"}</button>
          <span style={{ color: "#8b949e", fontSize: 18, transform: open ? "rotate(90deg)" : "none", transition: "0.2s" }}>›</span>
        </div>
      </div>

      {/* Formula box always preview */}
      <div style={{ padding: "0 18px 10px" }}>
        <div style={{
          background: "#0a0e14",
          border: `1px solid ${lc.color}44`,
          borderRadius: 8,
          padding: "10px 14px",
          fontFamily: "monospace",
          fontSize: 13,
          color: lc.color,
          whiteSpace: "pre-wrap",
          lineHeight: 1.7
        }}>{formula.formula}</div>
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "💡 Meaning", text: formula.meaning, color: "#58a6ff" },
            { label: "📌 When to Use", text: formula.when, color: "#a78bfa" },
            { label: "📐 Example", text: formula.example, color: "#00f5d4", mono: true },
            { label: "⚠️ Common Mistake", text: formula.mistake, color: "#ff6b6b" }
          ].map(({ label, text, color, mono }) => (
            <div key={label}>
              <div style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
              <div style={{
                color: "#c9d1d9", fontSize: 13, lineHeight: 1.65,
                fontFamily: mono ? "monospace" : "inherit",
                whiteSpace: mono ? "pre-wrap" : "normal",
                background: mono ? "#0a0e1488" : "transparent",
                padding: mono ? "8px 12px" : 0,
                borderRadius: mono ? 6 : 0,
                borderLeft: mono ? `2px solid ${color}66` : "none"
              }}>{text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormulaExplorer() {
  const [activeTopic, setActiveTopic] = useState("pipelining");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const topic = TOPICS.find(t => t.id === activeTopic);
  const filtered = topic?.formulas.filter(f => {
    const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.formula.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || f.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div>
      {/* Topic tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            style={{
              background: activeTopic === t.id ? t.color + "22" : "#161b22",
              border: `1px solid ${activeTopic === t.id ? t.color : "#30363d"}`,
              color: activeTopic === t.id ? t.color : "#8b949e",
              borderRadius: 8, padding: "8px 14px",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s", whiteSpace: "nowrap"
            }}
          >{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search formulas..."
          style={{
            flex: 1, minWidth: 200, background: "#0d1117",
            border: "1px solid #30363d", borderRadius: 8,
            padding: "8px 14px", color: "#e6edf3", fontSize: 13,
            outline: "none"
          }}
        />
        {["all", "easy", "medium", "critical"].map(l => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            style={{
              background: levelFilter === l ? "#ffffff11" : "transparent",
              border: `1px solid ${levelFilter === l ? "#ffffff33" : "#30363d"}`,
              color: l === "all" ? "#e6edf3" : LEVEL_CONFIG[l]?.color || "#e6edf3",
              borderRadius: 8, padding: "8px 12px",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
              transition: "all 0.2s"
            }}
          >{l === "all" ? "All" : `${LEVEL_CONFIG[l].dot} ${LEVEL_CONFIG[l].label}`}</button>
        ))}
      </div>

      {/* Cards */}
      {filtered?.length === 0 ? (
        <div style={{ color: "#8b949e", textAlign: "center", padding: 40 }}>No formulas match your filter.</div>
      ) : (
        filtered?.map(f => <FormulaCard key={f.id} formula={f} />)
      )}
    </div>
  );
}

function FlashcardMode() {
  const all = TOPICS.flatMap(t => t.formulas.map(f => ({ ...f, topicColor: t.color })));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ know: 0, review: 0 });
  const [done, setDone] = useState(false);
  const [queue, setQueue] = useState(() => [...all].sort(() => Math.random() - 0.5));

  const card = queue[idx];

  const answer = (knew) => {
    setScore(s => ({ ...s, [knew ? "know" : "review"]: s[knew ? "know" : "review"] + 1 }));
    if (idx + 1 >= queue.length) setDone(true);
    else { setIdx(i => i + 1); setRevealed(false); }
  };

  const restart = () => {
    setQueue([...all].sort(() => Math.random() - 0.5));
    setIdx(0); setRevealed(false); setScore({ know: 0, review: 0 }); setDone(false);
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <div style={{ color: "#e6edf3", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Session Complete!</div>
      <div style={{ color: "#8b949e", marginBottom: 32 }}>
        ✅ Knew: <span style={{ color: "#00f5d4", fontWeight: 700 }}>{score.know}</span> &nbsp;|&nbsp;
        🔄 Review: <span style={{ color: "#ffd166", fontWeight: 700 }}>{score.review}</span>
      </div>
      <button onClick={restart} style={{
        background: "linear-gradient(135deg, #00f5d4, #a78bfa)",
        border: "none", borderRadius: 10, padding: "12px 32px",
        color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer"
      }}>Restart Deck</button>
    </div>
  );

  if (!card) return null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ color: "#8b949e", fontSize: 13 }}>Card {idx + 1} / {queue.length}</span>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ color: "#00f5d4", fontSize: 13 }}>✅ {score.know}</span>
          <span style={{ color: "#ffd166", fontSize: 13 }}>🔄 {score.review}</span>
        </div>
      </div>
      <div style={{ height: 4, background: "#161b22", borderRadius: 4, marginBottom: 28 }}>
        <div style={{ width: `${(idx / queue.length) * 100}%`, height: "100%", background: card.topicColor, borderRadius: 4, transition: "width 0.3s" }} />
      </div>

      {/* Card */}
      <div style={{
        background: "linear-gradient(135deg, #0d1117, #161b22)",
        border: `2px solid ${card.topicColor}44`,
        borderRadius: 16, padding: 32,
        boxShadow: `0 0 40px ${card.topicColor}11`,
        minHeight: 280
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <Pill level={card.level} />
          <span style={{ color: "#8b949e", fontSize: 12 }}>{card.title}</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ color: "#8b949e", fontSize: 13, marginBottom: 16 }}>What is the formula for…</div>
          <div style={{ color: "#e6edf3", fontSize: 22, fontWeight: 700, lineHeight: 1.4 }}>{card.title}</div>
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            style={{
              width: "100%", padding: "14px", background: card.topicColor + "22",
              border: `1px solid ${card.topicColor}`, borderRadius: 10,
              color: card.topicColor, fontWeight: 700, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s"
            }}
          >Reveal Formula ›</button>
        ) : (
          <div>
            <div style={{
              background: "#0a0e14", border: `1px solid ${card.topicColor}66`,
              borderRadius: 10, padding: "16px 20px",
              fontFamily: "monospace", color: card.topicColor,
              fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.7,
              marginBottom: 16
            }}>{card.formula}</div>
            <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 16, textAlign: "center" }}>{card.meaning}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => answer(false)} style={{
                flex: 1, padding: 12, background: "#ff6b6b22",
                border: "1px solid #ff6b6b", borderRadius: 10,
                color: "#ff6b6b", fontWeight: 700, cursor: "pointer"
              }}>🔄 Need Review</button>
              <button onClick={() => answer(true)} style={{
                flex: 1, padding: 12, background: "#00f5d422",
                border: "1px solid #00f5d4", borderRadius: 10,
                color: "#00f5d4", fontWeight: 700, cursor: "pointer"
              }}>✅ Got It!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuizMode() {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = QUIZ_QUESTIONS;
  const q = questions[qIdx];

  const reveal = () => setShowAnswer(true);
  const next = (correct) => {
    if (correct) setScore(s => s + 1);
    if (qIdx + 1 >= questions.length) setDone(true);
    else { setQIdx(i => i + 1); setShowAnswer(false); setSelected(null); }
  };
  const restart = () => { setQIdx(0); setShowAnswer(false); setSelected(null); setScore(0); setDone(false); };

  if (done) return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>{score >= 5 ? "🏆" : score >= 3 ? "👍" : "💪"}</div>
      <div style={{ color: "#e6edf3", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Quiz Complete</div>
      <div style={{ color: "#8b949e", fontSize: 18, marginBottom: 32 }}>
        Score: <span style={{ color: "#00f5d4", fontWeight: 800 }}>{score}</span> / {questions.length}
      </div>
      <button onClick={restart} style={{
        background: "linear-gradient(135deg, #00f5d4, #a78bfa)",
        border: "none", borderRadius: 10, padding: "12px 32px",
        color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer"
      }}>Retry Quiz</button>
    </div>
  );

  const topic = TOPICS.find(t => t.id === q.topic);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: "#8b949e" }}>Q {qIdx + 1} / {questions.length}</span>
        <span style={{ color: "#00f5d4", fontWeight: 700 }}>Score: {score}</span>
      </div>

      <div style={{
        background: "#0d1117", border: `1px solid ${topic?.color || "#30363d"}44`,
        borderRadius: 14, padding: 28, marginBottom: 20
      }}>
        <div style={{ color: "#8b949e", fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          {topic?.icon} {topic?.label}
        </div>
        <div style={{ color: "#e6edf3", fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>{q.q}</div>
      </div>

      {!showAnswer ? (
        <div>
          <div style={{
            background: "#161b22", border: "1px solid #30363d",
            borderRadius: 10, padding: "14px 20px", marginBottom: 16,
            color: "#a78bfa", fontFamily: "monospace", fontSize: 13
          }}>
            <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 6 }}>HINT — Formula to use:</div>
            {q.formula}
          </div>
          <button onClick={reveal} style={{
            width: "100%", padding: 14, background: "#00f5d422",
            border: "1px solid #00f5d4", borderRadius: 10,
            color: "#00f5d4", fontWeight: 700, fontSize: 15, cursor: "pointer"
          }}>Show Answer & Worked Solution</button>
        </div>
      ) : (
        <div>
          <div style={{
            background: "#00f5d411", border: "1px solid #00f5d444",
            borderRadius: 10, padding: "18px 20px", marginBottom: 20
          }}>
            <div style={{ color: "#00f5d4", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ ANSWER</div>
            <div style={{ color: "#e6edf3", fontFamily: "monospace", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{q.answer}</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => next(false)} style={{
              flex: 1, padding: 12, background: "#ff6b6b22",
              border: "1px solid #ff6b6b", borderRadius: 10,
              color: "#ff6b6b", fontWeight: 700, cursor: "pointer"
            }}>❌ Got it Wrong</button>
            <button onClick={() => next(true)} style={{
              flex: 1, padding: 12, background: "#00f5d422",
              border: "1px solid #00f5d4", borderRadius: 10,
              color: "#00f5d4", fontWeight: 700, cursor: "pointer"
            }}>✅ Got it Right</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MemoryTrainer() {
  const all = TOPICS.flatMap(t => t.formulas);
  const [phase, setPhase] = useState("idle"); // idle | study | recall | result
  const [card, setCard] = useState(null);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [results, setResults] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [studySet, setStudySet] = useState([]);
  const timerRef = useRef(null);

  const startSession = () => {
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, 8);
    setStudySet(shuffled);
    setQIdx(0);
    setResults([]);
    setCard(shuffled[0]);
    setPhase("study");
    setTimeLeft(15);
  };

  const startRecall = () => {
    setPhase("recall");
    setInput("");
    setTimeLeft(20);
  };

  const handleSubmit = (timedOut = false) => {
    clearInterval(timerRef.current);
    const correct = input.trim().length > 10;
    setResults(r => [...r, { card, input, timedOut, correct }]);
    if (qIdx + 1 >= studySet.length) {
      setPhase("result");
    } else {
      const next = studySet[qIdx + 1];
      setQIdx(i => i + 1);
      setCard(next);
      setPhase("study");
      setTimeLeft(15);
      setInput("");
    }
  };

  useEffect(() => {
    if (phase !== "recall" && phase !== "study") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (phase === "study") startRecall();
          else handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, qIdx]);

  const urgentColor = timeLeft <= 5 ? "#ff6b6b" : timeLeft <= 10 ? "#ffd166" : "#00f5d4";

  if (phase === "idle") return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⏱️</div>
      <div style={{ color: "#e6edf3", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Memory Trainer</div>
      <div style={{ color: "#8b949e", maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.7 }}>
        Study a formula for 15 seconds, then recall it from memory in 20 seconds.
        Trains active recall — the most effective memorization technique.
      </div>
      <button onClick={startSession} style={{
        background: "linear-gradient(135deg, #a78bfa, #00f5d4)",
        border: "none", borderRadius: 12, padding: "14px 40px",
        color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer"
      }}>Start Training Session</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
        <div style={{ color: "#e6edf3", fontSize: 22, fontWeight: 700 }}>Session Complete</div>
        <div style={{ color: "#8b949e", marginTop: 8 }}>{results.filter(r => r.correct).length} / {results.length} recalled</div>
      </div>
      {results.map((r, i) => (
        <div key={i} style={{
          background: "#0d1117", border: `1px solid ${r.correct ? "#00f5d444" : "#ff6b6b44"}`,
          borderRadius: 12, padding: "14px 18px", marginBottom: 12
        }}>
          <div style={{ color: r.correct ? "#00f5d4" : "#ff6b6b", fontWeight: 700, marginBottom: 6 }}>
            {r.correct ? "✅" : "❌"} {r.card.title}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#8b949e" }}>{r.card.formula}</div>
          {r.timedOut && <div style={{ color: "#ff6b6b", fontSize: 11, marginTop: 4 }}>⏰ Timed out</div>}
        </div>
      ))}
      <button onClick={() => setPhase("idle")} style={{
        width: "100%", marginTop: 16, padding: 14, background: "#a78bfa22",
        border: "1px solid #a78bfa", borderRadius: 10,
        color: "#a78bfa", fontWeight: 700, cursor: "pointer"
      }}>New Session</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ color: "#8b949e" }}>Card {qIdx + 1} / {studySet.length}</span>
        <div style={{
          background: urgentColor + "22", border: `1px solid ${urgentColor}`,
          borderRadius: 8, padding: "4px 14px", color: urgentColor,
          fontWeight: 800, fontSize: 18, fontVariantNumeric: "tabular-nums"
        }}>{timeLeft}s</div>
      </div>

      {phase === "study" && (
        <div style={{
          background: "#0d1117", border: "1px solid #a78bfa44",
          borderRadius: 16, padding: 32, textAlign: "center"
        }}>
          <div style={{ color: "#a78bfa", fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>📖 STUDY PHASE — Memorize this!</div>
          <div style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>{card?.title}</div>
          <div style={{
            background: "#0a0e14", border: "1px solid #a78bfa44",
            borderRadius: 10, padding: "16px 20px",
            fontFamily: "monospace", color: "#a78bfa", fontSize: 14,
            whiteSpace: "pre-wrap", lineHeight: 1.8, marginBottom: 20
          }}>{card?.formula}</div>
          <div style={{ color: "#8b949e", fontSize: 13 }}>{card?.meaning}</div>
          <button onClick={() => { clearInterval(timerRef.current); startRecall(); }} style={{
            marginTop: 20, padding: "10px 24px", background: "#00f5d422",
            border: "1px solid #00f5d4", borderRadius: 8,
            color: "#00f5d4", fontWeight: 700, cursor: "pointer"
          }}>Ready to Recall →</button>
        </div>
      )}

      {phase === "recall" && (
        <div style={{
          background: "#0d1117", border: `1px solid ${urgentColor}44`,
          borderRadius: 16, padding: 32
        }}>
          <div style={{ color: urgentColor, fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>🧠 RECALL PHASE — Write it out!</div>
          <div style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>{card?.title}</div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the formula from memory..."
            autoFocus
            style={{
              width: "100%", minHeight: 120, background: "#0a0e14",
              border: `1px solid ${urgentColor}66`, borderRadius: 10,
              padding: "12px 16px", color: "#e6edf3", fontSize: 14,
              fontFamily: "monospace", resize: "vertical", outline: "none",
              boxSizing: "border-box"
            }}
          />
          <button onClick={() => handleSubmit(false)} style={{
            width: "100%", marginTop: 14, padding: 14,
            background: urgentColor + "22", border: `1px solid ${urgentColor}`,
            borderRadius: 10, color: urgentColor, fontWeight: 700,
            fontSize: 15, cursor: "pointer"
          }}>Submit Recall</button>
        </div>
      )}
    </div>
  );
}

function CheatSheet() {
  return (
    <div>
      <div style={{ color: "#8b949e", marginBottom: 20, fontSize: 13 }}>
        All critical formulas at a glance — perfect for last-minute revision.
      </div>
      {TOPICS.map(topic => (
        <div key={topic.id} style={{ marginBottom: 32 }}>
          <div style={{
            color: topic.color, fontWeight: 800, fontSize: 16,
            borderBottom: `1px solid ${topic.color}33`,
            paddingBottom: 8, marginBottom: 14
          }}>{topic.icon} {topic.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
            {topic.formulas.filter(f => f.level === "critical" || f.level === "medium").map(f => (
              <div key={f.id} style={{
                background: "#0d1117",
                border: `1px solid ${LEVEL_CONFIG[f.level].color}33`,
                borderLeft: `3px solid ${LEVEL_CONFIG[f.level].color}`,
                borderRadius: 8, padding: "10px 14px"
              }}>
                <div style={{ color: "#e6edf3", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                <div style={{
                  fontFamily: "monospace", fontSize: 11,
                  color: LEVEL_CONFIG[f.level].color,
                  whiteSpace: "pre-wrap", lineHeight: 1.6
                }}>{f.formula}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const MODES = [
  { id: "explorer", label: "Formula Explorer", icon: "🔭" },
  { id: "flashcard", label: "Flashcards", icon: "⚡" },
  { id: "quiz", label: "Problem Quiz", icon: "🧪" },
  { id: "trainer", label: "Memory Trainer", icon: "🧠" },
  { id: "cheatsheet", label: "Quick Cheatsheet", icon: "📋" }
];

export default function FormulaBrain() {
  const [mode, setMode] = useState("explorer");

  const totalFormulas = TOPICS.reduce((s, t) => s + t.formulas.length, 0);
  const criticalCount = TOPICS.flatMap(t => t.formulas).filter(f => f.level === "critical").length;

  return (
    <div style={{
      background: "#010409",
      color: "#e6edf3",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
    }}>
      {/* Header */}
      <div style={{
        background: "#010409ee",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #21262d",
        padding: "14px 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{
              fontSize: 18, fontWeight: 800, letterSpacing: 1,
              background: "linear-gradient(90deg, #00f5d4, #a78bfa, #ff6b6b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>COA Formula Brain</div>
            <div style={{ color: "#8b949e", fontSize: 11, marginTop: 2 }}>
              {totalFormulas} formulas · {criticalCount} critical · Computer Organization & Architecture
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  background: mode === m.id ? "#21262d" : "transparent",
                  border: `1px solid ${mode === m.id ? "#30363d" : "transparent"}`,
                  color: mode === m.id ? "#e6edf3" : "#8b949e",
                  borderRadius: 8, padding: "6px 12px",
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  transition: "all 0.2s"
                }}
              >{m.icon} {m.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        {/* Mode header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3" }}>
            {MODES.find(m => m.id === mode)?.icon} {MODES.find(m => m.id === mode)?.label}
          </div>
          <div style={{ color: "#8b949e", fontSize: 13, marginTop: 4 }}>
            {mode === "explorer" && "Browse all formulas by topic. Click any card to expand full details."}
            {mode === "flashcard" && "Classic spaced-repetition flashcards. Mark what you know vs need to review."}
            {mode === "quiz" && "Solve real numerical problems using the formulas. Timed, graded practice."}
            {mode === "trainer" && "Active recall training: study → cover → recall. The fastest way to memorize."}
            {mode === "cheatsheet" && "All medium + critical formulas condensed for last-minute revision."}
          </div>
        </div>

        {mode === "explorer" && <FormulaExplorer />}
        {mode === "flashcard" && <FlashcardMode />}
        {mode === "quiz" && <QuizMode />}
        {mode === "trainer" && <MemoryTrainer />}
        {mode === "cheatsheet" && <CheatSheet />}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "24px 20px",
        borderTop: "1px solid #21262d",
        color: "#484f58", fontSize: 12
      }}>
        🔴 Critical &nbsp;|&nbsp; 🟡 Medium &nbsp;|&nbsp; 🟢 Easy &nbsp;·&nbsp;
        COA Formula Brain · Last-Day Revision System
      </div>
    </div>
  );
}
