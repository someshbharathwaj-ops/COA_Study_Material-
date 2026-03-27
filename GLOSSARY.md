# COA Glossary - Key Terminology

## Pipeline Terms

**IF (Instruction Fetch)**
- First stage of pipeline
- Retrieves instruction from instruction memory
- Increments program counter

**ID (Instruction Decode)**
- Second stage
- Decodes opcode and generates control signals
- Reads from register file
- Examples: ALUOp, RegDst, MemRead, MemWrite

**EX (Execute)**
- Third stage
- Performs ALU operation
- Calculates branch target address
- Forward/bypass unit operates here

**MEM (Memory)**
- Fourth stage
- Reads from or writes to data memory
- Loads data into register (for lw)
- Stores register data (for sw)

**WB (Write Back)**
- Fifth stage
- Writes computed value back to register file
- Updates program state

## Hazard Types

**Data Hazard (RAW - Read After Write)**
- Instruction reads register before previous instruction writes it
- Example: `add $1, $2, $3` followed by `sub $4, $1, $5`
- Solution: Forwarding or stalling

**Control Hazard (Branch)**
- Next instruction address unknown until branch resolves
- Example: `beq $1, $2, Label` - don't know if we branch
- Solution: Branch prediction, pipeline flushing

**Structural Hazard**
- Two instructions need same hardware resource simultaneously
- Example: Single memory for both IF and MEM
- Solution: Duplicate resources (Harvard architecture)

## Forwarding

**Forwarding/Bypassing**
- Pass result directly from EX to next instruction's EX
- Eliminates most RAW stalls
- Reduces misses from 2 cycles to 0 cycles (load-use exception)

**Load-Use Hazard**
- Special case: lw followed immediately by instruction using the loaded value
- Cannot be fully eliminated with forwarding
- Requires 1-cycle stall minimum (NOP insertion or compiler)

## Cache Terms

**Cache Hit**
- Data found in cache
- Fast access (2-5 cycles typically)

**Cache Miss**
- Data not in cache
- Must fetch from next level (100+ cycles)

**Hit Rate**
- Fraction of accesses that hit cache
- Example: 95% hit rate = 95 hits per 100 accesses

**Miss Rate**
- Fraction of accesses that miss cache
- miss_rate = 1 - hit_rate

**AMAT (Average Memory Access Time)**
- Expected time for typical memory access
- Formula: AMAT = Hit_time + Miss_rate × Miss_penalty
- Critical for performance analysis

## Cache Design

**Direct Mapping**
- Each memory block maps to exactly one cache line
- Simple hardware, high conflict misses
- Index = Block_address mod Num_lines

**Set Associative**
- Memory block maps to set of n cache lines
- 2-way, 4-way, 8-way are common
- Trade-off between direct and fully associative

**Fully Associative**
- Memory block can map to any cache line
- Low conflict misses, expensive hardware
- Requires full address search

**Block Offset**
- Bits within a cache block
- Block_offset_bits = log₂(block_size)

**Cache Index**
- Selects which cache line in set
- Index_bits = log₂(number_of_lines)

**Cache Tag**
- Distinguishes different memory blocks mapping to same line
- Tag_bits = Address_bits - Index_bits - Offset_bits

## Performance Metrics

**CPI (Cycles Per Instruction)**
- Average cycles needed per instruction
- CPI = Total_cycles / Number_of_instructions
- Lower is better

**Instruction Throughput**
- Instructions completed per clock cycle
- Throughput = 1 / CPI

**Speedup**
- Performance improvement ratio
- Speedup = CPI_old / CPI_new
- Example: 2x speedup = 2× faster

**Memory Stall Cycles**
- Cycles wasted waiting for memory
- Memstall = Mem_accesses × Miss_rate × Miss_penalty
- Major component of CPI

## Control Signals

**RegWrite**
- 1 = Write ALU result to register file
- 0 = Don't update register
- All instructions except sw set to 0

**MemRead**
- 1 = Read from data memory
- 0 = Don't read
- Set for lw instructions only

**MemWrite**
- 1 = Write to data memory
- 0 = Don't write
- Set for sw instructions only

**ALUSrc**
- 0 = Use register value for ALU second operand
- 1 = Use immediate (sign-extended)
- R-type: ALUSrc = 0; I-type: ALUSrc = 1

**RegDst**
- 0 = Write to rt (I-type result register)
- 1 = Write to rd (R-type destination)
- Determines which register gets written

**ALUOp**
- 2-bit signal for ALU operation type
- 00 = Add (lw/sw address calculation)
- 01 = Subtract (branch comparison)
- 10 = Function field determines operation (R-type)

## Assembly Instructions

**add $rd, $rs, $rt**
- $rd = $rs + $rt
- R-type, no immediate
- rd is write destination

**lw $rt, offset($rs)**
- $rt = Memory[$rs + offset]
- Load word from memory
- rt is write destination

**sw $rt, offset($rs)**
- Memory[$rs + offset] = $rt
- Store word to memory
- Does NOT write register

**beq $rs, $rt, label**
- If $rs == $rt, branch to label
- Control hazard source

**sub, and, or, others**
- Similar to add: $rd $rs $rt format
- Different ALU operations

## Key Abbreviations

| Abbreviation | Full Form |
|---|---|
| IF | Instruction Fetch |
| ID | Instruction Decode |
| EX | Execute |
| MEM | Memory Access |
| WB | Write Back |
| RAW | Read After Write |
| WAR | Write After Read |
| WAW | Write After Write |
| ALU | Arithmetic Logic Unit |
| AMAT | Average Memory Access Time |
| CPI | Cycles Per Instruction |
| IPC | Instructions Per Cycle |
| HT | Hit Time |
| MR | Miss Rate |
| MP | Miss Penalty |
| DRAM | Dynamic RAM |
| SRAM | Static RAM |
| I$ | Instruction Cache |
| D$ | Data Cache |
| L1 | Level 1 Cache |
| L2 | Level 2 Cache |
| L3 | Level 3 Cache |

---

**Pro Tip**: Reference this glossary when practicing problems. Understanding terminology is 50% of COA mastery!
