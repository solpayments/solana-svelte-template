import App from './App.svelte';
import type { PublicKey, Transaction } from '@solana/web3.js'

type FFF = () => void;
type EEE = (publicKey: PublicKey) => void;

export interface WalletAdapter {
  publicKey: PublicKey | null | undefined
  autoApprove: boolean
  connected: boolean
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>
  connect: () => PublicKey
  disconnect: () => void
  // eslint-disable-next-line
  on<T>(event: string, fn: FFF | EEE): this
}

import Wallet from '@project-serum/sol-wallet-adapter';

const providerUrl = 'https://www.sollet.io';
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
const wallet: WalletAdapter = new Wallet(providerUrl);
/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */

wallet.on('connect', (publicKey: PublicKey) => console.log(`Connected to  ${publicKey.toBase58()}`));
wallet.on('disconnect', () => console.log('Disconnected'));

const app = new App({
  target: document.body,
  props: {
    name: 'world',
    wallet
  },
});

export default app;
