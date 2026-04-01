import { xdr } from '@stellar/stellar-sdk';

export function parseContractError(scVal: xdr.ScVal): string {
  try {
    if (scVal.switch() === xdr.ScValType.scvError()) {
      const err = scVal.error();
      return `Contract error []`;
    }
    return `Unexpected ScVal type: `;
  } catch { return 'Unknown contract error'; }
}

export function decodeTransactionError(resultXdr: string): string {
  try {
    const result = xdr.TransactionResult.fromXDR(resultXdr, 'base64');
    return `Transaction failed: `;
  } catch { return `Failed to decode: `; }
}

export class SorobanUtilError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SorobanUtilError';
  }
}