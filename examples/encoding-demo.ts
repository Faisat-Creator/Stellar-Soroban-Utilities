import { toScVal, fromScVal, addressToScVal, mapToScVal, scValToXdr, xdrToScVal } from 'stellar-soroban-utilities';

const str = toScVal('hello');
console.log('string:', fromScVal(str));

const num = toScVal(42);
console.log('number:', fromScVal(num));

const map = mapToScVal({ name: 'stellar', version: 1 });
console.log('map type:', map.switch().name);

const xdr = scValToXdr(str);
console.log('xdr roundtrip:', fromScVal(xdrToScVal(xdr)));
