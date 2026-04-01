import { Contract, Networks, TransactionBuilder, BASE_FEE, rpc, xdr } from '@stellar/stellar-sdk';

export interface InvokeContractOptions {
  contractId: string;
  method: string;
  args?: xdr.ScVal[];
  sourceAccount: string;
  networkPassphrase?: string;
  rpcUrl?: string;
}

/** Build an unsigned transaction to invoke a Soroban contract method. */
export async function buildContractInvocation(options: InvokeContractOptions): Promise<string> {
  const { contractId, method, args = [], sourceAccount, networkPassphrase = Networks.TESTNET, rpcUrl = 'https://soroban-testnet.stellar.org' } = options;
  const server = new rpc.Server(rpcUrl);
  const account = await server.getAccount(sourceAccount);
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) throw new Error(Simulation failed: ${simResult.error});
  return rpc.assembleTransaction(tx, simResult).build().toXDR();
}

/** Submit a signed XDR transaction and wait for confirmation. */
export async function submitAndConfirm(signedXdr: string, networkPassphrase = Networks.TESTNET, rpcUrl = 'https://soroban-testnet.stellar.org'): Promise<rpc.Api.GetTransactionResponse> {
  const server = new rpc.Server(rpcUrl);
  const tx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const sendResult = await server.sendTransaction(tx);
  if (sendResult.status === 'ERROR') throw new Error(Submit failed: ${JSON.stringify(sendResult.errorResult)});
  let response: rpc.Api.GetTransactionResponse;
  do {
    await new Promise(r => setTimeout(r, 1000));
    response = await server.getTransaction(sendResult.hash);
  } while (response.status === rpc.Api.GetTransactionStatus.NOT_FOUND);
  return response;
}