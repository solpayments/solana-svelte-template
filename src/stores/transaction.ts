import { writable } from 'svelte/store';

export enum TxStatus {
  Fail = '0',
  Success = '1',
  Unknown = 'u',
}

export interface TxInfo {
  name: string;
  status: TxStatus;
}

export type TxMap = Map<string, TxInfo>;

/** transactions store */
export const transactionsMap = writable<TxMap>(new Map());

/** new transaction is always added in 'Unknown' state */
export const addTransaction = (txId: string, name: string): void => {
  transactionsMap.update((existing) => {
    const possibleTx = existing.get(txId);
    if (possibleTx) {
      // don't update an already existing transaction
      return existing;
    }
    return existing.set(txId, { name, status: TxStatus.Unknown });
  });
};

/** update existing */
export const updateTransaction = (txId: string, status: TxStatus): void => {
  transactionsMap.update((existing) => {
    const tx = existing.get(txId);
    if (tx) {
      // only update an existing transaction
      existing.set(txId, { ...tx, status });
    }
    return existing;
  });
};
