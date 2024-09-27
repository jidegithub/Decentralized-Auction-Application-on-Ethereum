import BN from 'bn.js';

export const BigNumber = (arg) => {
  return new BN(arg,10);
}

export default BigNumber;