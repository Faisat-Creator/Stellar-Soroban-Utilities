# Stellar Soroban Utilities

> Powering Smarter Smart Contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/badge/npm-0.1.0-blue)](https://www.npmjs.com/package/stellar-soroban-utilities)
[![Rust](https://img.shields.io/badge/rust-soroban--sdk%2020-orange)](https://crates.io/crates/soroban-utilities)

Stellar Soroban Utilities is a lightweight collection of helper libraries and developer tools designed to simplify interaction with smart contracts on Soroban — Stellar's smart contract platform. It provides essential building blocks that reduce complexity, improve code efficiency, and accelerate development workflows.

---

## The Problem

Developers building on Soroban repeatedly run into the same friction points:

- Repetitive low-level logic for transactions and contract calls
- No standardized helper functions across projects
- Time-consuming debugging and testing processes
- Fragmented developer experience across tools

These inefficiencies slow down development and increase the risk of errors.

---

## Objective

Build a utility-first toolkit that:

- Simplifies common Soroban development tasks
- Provides reusable, well-tested helper functions
- Improves developer productivity and code reliability
- Enhances the overall developer experience on Stellar

---

## Packages

| Package | Language | Description |
|---|---|---|
| `packages/js` | TypeScript | NPM utility library — contract interaction, encoding, fee estimation, testing |
| `packages/rust` | Rust | Reusable Soroban contract helpers — access control, math, events, validation |

---

## Core Features

### 1. Contract Interaction Helpers
Simplified functions for invoking Soroban contracts, building transactions, and handling events — without writing boilerplate every time.

### 2. Data Encoding & Decoding
Tools for handling Soroban data structures (XDR, SCVal). Serialize and deserialize native JS values to/from contract-compatible types with a single function call.

### 3. Testing & Debugging Tools
Friendbot account funding, transaction confirmation polling, simulation assertion helpers, and event logging — everything you need to iterate fast on testnet.

### 4. Fee & Gas Optimization Utilities
Simulate transactions before signing to get accurate fee breakdowns. Includes base fee, inclusion fee, and resource fee estimates.

---

## Quick Start

### TypeScript / JavaScript

```bash
cd packages/js
npm install
npm run build
```

```typescript
import {
  buildContractInvocation,
  submitAndConfirm,
  toScVal,
  estimateFee,
  createTestAccount,
} from 'stellar-soroban-utilities';
import { Keypair, Networks, TransactionBuilder } from '@stellar/stellar-sdk';

// Fund a test account via Friendbot
const keypair = await createTestAccount();

// Build a contract invocation
const xdr = await buildContractInvocation({
  contractId: 'C...',
  method: 'increment',
  args: [toScVal(1)],
  sourceAccount: keypair.publicKey(),
  networkPassphrase: Networks.TESTNET,
});

// Estimate fees before signing
const fees = await estimateFee(xdr);
console.log('Total fee:', fees.totalFee, 'stroops');

// Sign and submit
const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
tx.sign(keypair);
const result = await submitAndConfirm(tx.toXDR());
console.log('Status:', result.status);
```

### Rust

Add to your `Cargo.toml`:

```toml
[dependencies]
soroban-utilities = "0.1.0"
```

```rust
use soroban_utilities::{access, math, validation, events};

pub fn initialize(env: Env, admin: Address) {
    access::set_admin(&env, &admin);
}

pub fn transfer(env: Env, caller: Address, to: Address, amount: i128) {
    access::require_admin(&env, &caller);
    validation::require_positive(amount);
    let fee = math::basis_points(amount, 250); // 2.5%
    let net = math::safe_sub(amount, fee);
    events::emit_transfer(&env, &caller, &to, net);
}
```

---

## Project Structure

```
Stellar-Soroban-Utilities/
├── packages/
│   ├── js/
│   │   ├── src/
│   │   │   ├── contract.ts     # Contract invocation & submission
│   │   │   ├── encoding.ts     # XDR / ScVal encode & decode
│   │   │   ├── fees.ts         # Fee estimation
│   │   │   ├── testing.ts      # Test helpers & Friendbot
│   │   │   ├── token.ts        # SEP-41 token helpers
│   │   │   ├── errors.ts       # Error parsing
│   │   │   └── index.ts        # Package entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.js
│   └── rust/
│       ├── src/
│       │   ├── lib.rs
│       │   ├── access.rs       # Admin access control
│       │   ├── math.rs         # Safe arithmetic & basis points
│       │   ├── events.rs       # Event emitters
│       │   └── validation.rs   # Input validation
│       └── Cargo.toml
├── examples/
│   ├── invoke-contract.ts
│   └── encoding-demo.ts
├── CONTRIBUTING.md
└── README.md
```

---

## API Reference

### TypeScript

#### `buildContractInvocation(options)`
Builds a simulated, fee-accurate unsigned transaction XDR for a Soroban contract call.

| Option | Type | Default | Description |
|---|---|---|---|
| `contractId` | `string` | required | Bech32 contract address |
| `method` | `string` | required | Contract function name |
| `args` | `xdr.ScVal[]` | `[]` | Encoded arguments |
| `sourceAccount` | `string` | required | Stellar public key |
| `networkPassphrase` | `string` | TESTNET | Network passphrase |
| `rpcUrl` | `string` | testnet RPC | Soroban RPC endpoint |

#### `toScVal(value)` / `fromScVal(scVal)`
Convert between native JS values and Soroban `ScVal` types. Supports strings, numbers, booleans, bigints, and objects.

#### `estimateFee(txXdr)`
Returns `{ baseFee, inclusionFee, resourceFee, totalFee }` by simulating the transaction.

#### `createTestAccount()`
Generates a random keypair and funds it via Friendbot. Returns the funded `Keypair`.

#### `buildTokenTransfer(opts, from, to, amount)`
Build an unsigned SEP-41 token transfer transaction.

#### `buildTokenMint(opts, to, amount)`
Build an unsigned token mint transaction (requires admin).

---

### Rust

#### `access`
| Function | Description |
|---|---|
| `set_admin(env, admin)` | Store admin address in contract storage |
| `get_admin(env)` | Retrieve the stored admin address |
| `require_admin(env, caller)` | Panic if caller is not admin |
| `is_admin(env, address)` | Check admin without panicking |

#### `math`
| Function | Description |
|---|---|
| `safe_add(a, b)` | Overflow-safe addition |
| `safe_sub(a, b)` | Underflow-safe subtraction |
| `safe_mul(a, b)` | Overflow-safe multiplication |
| `safe_div(a, b)` | Division with zero-check |
| `basis_points(amount, bps)` | Calculate percentage in basis points |
| `clamp(value, min, max)` | Clamp value within range |

#### `validation`
| Function | Description |
|---|---|
| `require_positive(amount)` | Panic if amount <= 0 |
| `require_max(amount, max)` | Panic if amount exceeds max |
| `require_not_expired(ledger, deadline)` | Panic if deadline passed |

#### `events`
| Function | Description |
|---|---|
| `emit_transfer(env, from, to, amount)` | Emit a transfer event |
| `emit_approval(env, owner, spender, amount)` | Emit an approval event |
| `emit_action(env, action, value)` | Emit a generic action event |

---

## Running Tests

```bash
# TypeScript
cd packages/js
npm install
npm test

# Rust
cd packages/rust
cargo test
```

---

## Technical Approach

- Core Languages: Rust & TypeScript
- Integration: Soroban SDK and Stellar Horizon / RPC APIs
- Distribution: NPM package + Rust crate
- Testing: Local sandbox + Stellar testnet via Friendbot

---

## Target Users

- Smart contract developers on Soroban
- Web3 engineers building dApps on Stellar
- Hackathon participants and open-source contributors
- Teams optimizing blockchain performance and transaction costs

---

## Value Proposition

- Reduced development complexity — stop rewriting the same boilerplate
- Faster implementation of smart contract interactions
- Improved code quality and reliability through well-tested utilities
- Streamlined testing and debugging workflows

---

## Roadmap

- [x] Contract invocation helpers (TypeScript)
- [x] XDR / ScVal encoding utilities
- [x] Fee estimation
- [x] Friendbot test account helper
- [x] SEP-41 token helpers
- [x] Rust access control, math, events, validation
- [ ] CLI tool for contract inspection and invocation
- [ ] Advanced debugging dashboard
- [ ] Plugin support for custom utility modules
- [ ] Integration with Stellar Soroban Kits for a full dev suite
- [ ] Browser-compatible ESM bundle

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on submitting issues, PRs, and new utilities.

---

## License

MIT — free to use, modify, and distribute.

---

## Related Projects

- [Stellar SDK (JS)](https://github.com/stellar/js-stellar-sdk)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Stellar Mart](https://github.com/Faisat-Creator/Stellar-Mart) — decentralized marketplace powered by Stellar
