import type { PublicKey } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import type { WalletAdapter } from '../helpers/types';
import { removeWallet, updateWallet } from '../stores/index';

export const newWalletAdapter = (): WalletAdapter => {
  const providerUrl = 'https://www.sollet.io';
  /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
  const wallet: WalletAdapter = new Wallet(providerUrl);
  /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

  wallet.on('connect', (publicKey: PublicKey) =>
    console.log(`Connected to  ${publicKey.toBase58()}`)
  );
  wallet.on('disconnect', () => {
    console.log('Disconnected');
    removeWallet();
  });

  return wallet;
};

export const connectToWallet = async (): Promise<void> => {
  const newWallet = newWalletAdapter();
  // eslint-disable-next-line
  await newWallet.connect();
  updateWallet(newWallet);
};
