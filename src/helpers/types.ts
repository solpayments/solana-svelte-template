import type { PublicKey, Transaction } from '@solana/web3.js'

export type VoidFunction = () => void;
export type PubkeyVoidFunction = (publicKey: PublicKey) => void;

export interface WalletAdapter {
    publicKey: PublicKey | null | undefined
    autoApprove: boolean
    connected: boolean
    signTransaction: (transaction: Transaction) => Promise<Transaction>
    signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>
    connect: () => PublicKey
    disconnect: () => void
    // eslint-disable-next-line
    on<T>(event: string, fn: VoidFunction | PubkeyVoidFunction): this
}