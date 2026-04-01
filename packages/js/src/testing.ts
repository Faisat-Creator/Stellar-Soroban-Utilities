import { Keypair, rpc } from '@stellar/stellar-sdk';
export async function createTestAccount(): Promise<Keypair> {
  const kp = Keypair.random();
  const res = await fetch('https://friendbot.stellar.org?addr=' + kp.publicKey());
  if (!res.ok) throw new Error('Friendbot funding failed');
  return kp;
}
export async function waitForTransaction(hash: string, rpcUrl = 'https://soroban-testnet.stellar.org', timeoutMs = 30000): Promise<rpc.Api.GetTransactionResponse> {
  const server = new rpc.Server(rpcUrl);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const r = await server.getTransaction(hash);
    if (r.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) return r;
    await new Promise(x => setTimeout(x, 1000));
  }
  throw new Error('Transaction not confirmed within ' + timeoutMs + 'ms');
}
export function assertSimulationSuccess(result: rpc.Api.SimulateTransactionResponse): void {
  if (rpc.Api.isSimulationError(result)) throw new Error('Simulation failed: ' + result.error);
}
