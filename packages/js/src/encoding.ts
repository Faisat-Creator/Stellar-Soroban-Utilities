import { xdr, Address, nativeToScVal, scValToNative } from '@stellar/stellar-sdk';
export function toScVal(value: unknown): xdr.ScVal { return nativeToScVal(value); }
export function fromScVal(scVal: xdr.ScVal): unknown { return scValToNative(scVal); }
export function addressToScVal(address: string): xdr.ScVal { return new Address(address).toScVal(); }
export function scValToXdr(scVal: xdr.ScVal): string { return scVal.toXDR('base64'); }
export function xdrToScVal(b64: string): xdr.ScVal { return xdr.ScVal.fromXDR(b64, 'base64'); }
export function mapToScVal(map: Record<string, unknown>): xdr.ScVal {
  const entries = Object.entries(map).map(([k,v]) => new xdr.ScMapEntry({ key: toScVal(k), val: toScVal(v) }));
  return xdr.ScVal.scvMap(entries);
}
