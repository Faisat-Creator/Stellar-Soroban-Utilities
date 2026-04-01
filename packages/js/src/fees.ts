import { rpc, TransactionBuilder, Networks, BASE_FEE } from '@stellar/stellar-sdk';
export interface FeeEstimate { baseFee: string; inclusionFee: string; resourceFee: string; totalFee: string; }
export async function estimateFee(txXdr: string, networkPassphrase = Networks.TESTNET, rpcUrl = 'https://soroban-testnet.stellar.org'): Promise<FeeEstimate> {
  const server = new rpc.Server(rpcUrl);
  const tx = TransactionBuilder.fromXDR(txXdr, networkPassphrase);
  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error('Simulation error: ' + sim.error);
  const resourceFee = sim.minResourceFee ?? '0';
  const baseFee = BASE_FEE;
  const inclusionFee = String(Number(baseFee) * 2);
  const totalFee = String(Number(baseFee) + Number(inclusionFee) + Number(resourceFee));
  return { baseFee, inclusionFee, resourceFee, totalFee };
}
export async function getNetworkFee(rpcUrl = 'https://soroban-testnet.stellar.org'): Promise<string> {
  const server = new rpc.Server(rpcUrl);
  const stats = await server.getFeeStats();
  return stats.sorobanInclusionFee?.p50 ?? BASE_FEE;
}
