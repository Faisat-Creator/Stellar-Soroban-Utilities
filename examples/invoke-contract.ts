/**
 * Example: Invoke a Soroban contract and submit the signed transaction.
 */
import { buildContractInvocation, submitAndConfirm, toScVal } from 'stellar-soroban-utilities';
import { Keypair, Networks, TransactionBuilder } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'C...';
const SOURCE_SECRET = 'S...';

async function main() {
 const keypair = Keypair.fromSecret(SOURCE_SECRET);
 const xdr = await buildContractInvocation({
 contractId: CONTRACT_ID,
 method: 'increment',
 args: [toScVal(1)],
 sourceAccount: keypair.publicKey(),
 networkPassphrase: Networks.TESTNET,
 });
 const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
 tx.sign(keypair);
 const result = await submitAndConfirm(tx.toXDR());
 console.log('Status:', result.status);
}
main().catch(console.error);
