# Stellar Soroban Utilities

> Stop rewriting boilerplate. Start shipping contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/badge/npm-0.1.0-blue)](https://www.npmjs.com/package/stellar-soroban-utilities)
[![Rust](https://img.shields.io/badge/rust-soroban--sdk%2020-orange)](https://crates.io/crates/soroban-utilities)

A dual-language toolkit (TypeScript + Rust) that handles the repetitive parts of Soroban smart contract development — so you can focus on what actually matters.

---

## What's Inside

| Package | Language | Purpose |
|---|---|---|
| `packages/js` | TypeScript | Contract invocation, XDR encoding, fee estimation, test helpers, SEP-41 tokens |
| `packages/rust` | Rust | Access control, safe math, event emitters, input validation |

---

## Installation

**TypeScript / JavaScript**

```bash
npm install stellar-soroban-utilities
```

**Rust** — add to `Cargo.toml`:

```toml
[dependencies]
soroban-utilities = "0.1.0"
```

---

## Quick Start

### TypeScript

```typescript
import {
  buildContractInvocation,
  submitAndConfirm,
  toScVal,
  estimateFee,
  createTestAccount,
} from 'stellar-soroban-utilities';
import { Networks, TransactionBuilder } from '@stellar/stellar-sdk';

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

// Check fees before committing
const fees = await estimateFee(xdr);
console.log('Total fee:', fees.totalFee, 'stroops');

// Sign and submit
const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
tx.sign(keypair);
const result = await submitAndConfirm(tx.toXDR());
console.log('Status:', result.status);
```

### Rust

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

## API Reference

### TypeScript

#### Contract

```typescript
buildContractInvocation(options)
```
Builds a simulated, fee-accurate unsigned transaction XDR for a Soroban contract call.

| Option | Type | Default | Description |
|---|---|---|---|
| `contractId` | `string` | required | Bech32 contract address |
| `method` | `string` | required | Contract function name |
| `args` | `xdr.ScVal[]` | `[]` | Encoded arguments |
| `sourceAccount` | `string` | required | Stellar public key |
| `networkPassphrase` | `string` | TESTNET | Network passphrase |
| `rpcUrl` | `string` | testnet RPC | Soroban RPC endpoint |

```typescript
submitAndConfirm(txXdr)
```
Submits a signed transaction and polls until confirmed. Returns `{ status, result }`.

#### Encoding

```typescript
toScVal(value)    // JS → Soroban ScVal
fromScVal(scVal)  // Soroban ScVal → JS
```
Supports strings, numbers, booleans, bigints, and plain objects.

#### Fees

```typescript
estimateFee(txXdr)
// Returns: { baseFee, inclusionFee, resourceFee, totalFee }
```

#### Testing

```typescript
createTestAccount()
// Generates a random keypair and funds it via Friendbot. Returns Keypair.
```

#### Tokens (SEP-41)

```typescript
buildTokenTransfer(opts, from, to, amount)
buildTokenMint(opts, to, amount)  // requires admin
```

---

### Rust

#### `access`

| Function | Description |
|---|---|
| `set_admin(env, admin)` | Store admin address |
| `get_admin(env)` | Retrieve admin address |
| `require_admin(env, caller)` | Panic if caller is not admin |
| `is_admin(env, address)` | Check admin without panicking |

#### `math`

| Function | Description |
|---|---|
| `safe_add(a, b)` | Overflow-safe addition |
| `safe_sub(a, b)` | Underflow-safe subtraction |
| `safe_mul(a, b)` | Overflow-safe multiplication |
| `safe_div(a, b)` | Division with zero-check |
| `basis_points(amount, bps)` | Percentage via basis points |
| `clamp(value, min, max)` | Clamp value within range |

#### `validation`

| Function | Description |
|---|---|
| `require_positive(amount)` | Panic if amount ≤ 0 |
| `require_max(amount, max)` | Panic if amount exceeds max |
| `require_not_expired(ledger, deadline)` | Panic if deadline passed |

#### `events`

| Function | Description |
|---|---|
| `emit_transfer(env, from, to, amount)` | Emit a transfer event |
| `emit_approval(env, owner, spender, amount)` | Emit an approval event |
| `emit_action(env, action, value)` | Emit a generic action event |

---

## Project Structure

```
Stellar-Soroban-Utilities/
├── packages/
│   ├── js/
│   │   └── src/
│   │       ├── contract.ts     # Invocation & submission
│   │       ├── encoding.ts     # XDR / ScVal encode & decode
│   │       ├── fees.ts         # Fee estimation
│   │       ├── testing.ts      # Friendbot & test helpers
│   │       ├── token.ts        # SEP-41 token helpers
│   │       ├── errors.ts       # Error parsing
│   │       └── index.ts        # Entry point
│   └── rust/
│       └── src/
│           ├── access.rs       # Admin access control
│           ├── math.rs         # Safe arithmetic
│           ├── events.rs       # Event emitters
│           ├── validation.rs   # Input validation
│           └── lib.rs
├── examples/
│   ├── invoke-contract.ts
│   └── encoding-demo.ts
├── CONTRIBUTING.md
└── README.md
```

---

## Running Tests

```bash
# TypeScript
cd packages/js && npm install && npm test

# Rust
cd packages/rust && cargo test
```

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
- [ ] Browser-compatible ESM bundle
- [ ] Integration with Stellar Soroban Kits

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
- [Stellar Mart](https://github.com/Faisat-Creator/Stellar-Mart) — decentralized marketplace on Stellar
