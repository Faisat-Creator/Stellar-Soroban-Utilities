import { buildContractInvocation } from './contract';
import { toScVal, addressToScVal } from './encoding';
export interface TokenCallOptions { contractId: string; sourceAccount: string; networkPassphrase?: string; rpcUrl?: string; }
export async function buildTokenTransfer(opts: TokenCallOptions, from: string, to: string, amount: bigint): Promise<string> {
  return buildContractInvocation({ ...opts, method: 'transfer', args: [addressToScVal(from), addressToScVal(to), toScVal(amount)] });
}
export async function buildTokenMint(opts: TokenCallOptions, to: string, amount: bigint): Promise<string> {
  return buildContractInvocation({ ...opts, method: 'mint', args: [addressToScVal(to), toScVal(amount)] });
}
