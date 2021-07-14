import type { Account, Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import type { WalletAdapter } from './types';
import { failure, success, Result } from './result';
import { FINALIZED, PROCESSED } from './constants';
import { addTransaction, updateTransaction, TxStatus } from '../stores/transaction';

export const awaitTransactionSignatureConfirmation = (
  txId: TransactionSignature,
  name: string,
  connection: Connection,
  timeout = 50000
): void => {
  // first register this transaction
  addTransaction(txId, name);
  // then set the callback
  try {
    connection.onSignature(
      txId,
      (result) => {
        if (result.err) {
          updateTransaction(txId, TxStatus.Fail);
        } else {
          updateTransaction(txId, TxStatus.Success);
        }
      },
      connection.commitment
    );
  } catch {
    // fallback where we manually get this thing
    setTimeout(() => {
      connection
        .getSignatureStatus(txId)
        .then((result) => {
          if (result.value && !result.value.err) {
            updateTransaction(txId, TxStatus.Success);
          } else {
            updateTransaction(txId, TxStatus.Fail);
          }
        })
        .catch(() => {
          /** do nothing?? */
        });
    }, timeout);
  }
};

/**
 * @param connection - the connection to the blockchain
 * @param transaction - the transaction to sign and send
 * @param wallet - the wallet (represents the person doing the transaction)
 * @param signers - the accounts to sign the transaction (optional)
 */
export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction,
  wallet: WalletAdapter,
  signers: Array<Account> = []
): Promise<Result<TransactionSignature>> {
  if (!wallet.publicKey) {
    return failure(new Error('Wallet not connected'));
  }

  try {
    transaction.recentBlockhash = (await connection.getRecentBlockhash(FINALIZED)).blockhash;
  } catch (error) {
    return failure(error);
  }

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  try {
    transaction = await wallet.signTransaction(transaction);
  } catch (error) {
    return failure(error);
  }

  let rawTransaction;
  try {
    rawTransaction = transaction.serialize();
  } catch (error) {
    return failure(error);
  }

  let result;
  try {
    result = await connection.sendRawTransaction(rawTransaction, {
      preflightCommitment: PROCESSED,
    });
  } catch (error) {
    return failure(error);
  }

  return success(result);
}
