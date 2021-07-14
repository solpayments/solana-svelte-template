import type { Connection, AccountInfo } from '@solana/web3.js';
import { Account, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { AccountLayout, Token } from '@solana/spl-token';
import { CONFIRMED } from './constants';
import { ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from './solana';
import type { Result } from './result';
import { failure, success } from './result';
import type { WalletAdapter } from './types';

interface GetOrCreateSOLTokenAccountParams {
  amount: number;
  connection: Connection;
  wallet: WalletAdapter;
}

interface CustomInstructionResult {
  address: PublicKey;
  instructions: TransactionInstruction[];
  cleanupInstructions: TransactionInstruction[];
  signers: Account[];
}

/**
 * Get or create the associated token account for the native mint
 */
export const getOrCreateSOLTokenAccount = async (
  params: GetOrCreateSOLTokenAccountParams
): Promise<Result<CustomInstructionResult>> => {
  const { amount, connection, wallet } = params;

  if (!wallet.publicKey) {
    return failure(new Error('Wallet not connected'));
  }

  const instructions: TransactionInstruction[] = [];
  const cleanupInstructions: TransactionInstruction[] = [];
  let possibleTokenAccount: AccountInfo<Buffer> | null = null;
  const newAccount = new Account();

  const closeAccountIx = Token.createCloseAccountInstruction(
    TOKEN_PROGRAM_ID,
    newAccount.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    []
  );

  try {
    possibleTokenAccount = await connection.getAccountInfo(newAccount.publicKey, CONFIRMED);
  } catch (error) {
    return failure(error);
  }

  if (!possibleTokenAccount) {
    // create the account
    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: await Token.getMinBalanceRentForExemptAccount(connection),
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    // Send lamports to it (these will be wrapped into native tokens by the token program)
    if (amount > 0) {
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: newAccount.publicKey,
          lamports: amount,
        })
      );
    }
    // Assign the new account to the native token mint.
    // the account will be initialized with a balance equal to the native token balance.
    // (i.e. amount)
    instructions.push(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        WRAPPED_SOL_MINT,
        newAccount.publicKey,
        wallet.publicKey
      )
    );
  }
  // consensus is to destroy the native mint account after all instructions
  cleanupInstructions.push(closeAccountIx);

  return success({
    address: newAccount.publicKey,
    instructions,
    cleanupInstructions,
    signers: [newAccount],
  });
};

/**
 * Derives the associated token address for the given wallet address and token mint.
 * @param owner Wallet address
 * @param mint Mint address
 * Get or create the associated token account for the native mint
 */
export async function getAssociatedTokenAddress(
  owner: PublicKey,
  mint: PublicKey
): Promise<PublicKey> {
  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
  return address;
}

interface GetOrCreateTokenAccountParams {
  connection: Connection;
  mint: PublicKey;
  wallet: WalletAdapter;
}

/**
 * Get or create an associated token account for a given mint
 * NOTE: does not work for the native SOL mint
 */
export const getOrCreateTokenAccount = async (
  params: GetOrCreateTokenAccountParams
): Promise<Result<CustomInstructionResult>> => {
  const { connection, mint, wallet } = params;

  if (mint.toBase58() === WRAPPED_SOL_MINT.toBase58()) {
    return failure(new Error("Can't create wrapped SOL account"));
  }
  if (!wallet.publicKey) {
    return failure(new Error('Wallet not connected'));
  }

  const instructions: TransactionInstruction[] = [];
  const address = await getAssociatedTokenAddress(wallet.publicKey, mint);
  let possibleTokenAccount: AccountInfo<Buffer> | null = null;

  try {
    possibleTokenAccount = await connection.getAccountInfo(address, CONFIRMED);
  } catch (error) {
    return failure(error);
  }

  if (!possibleTokenAccount) {
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        address,
        wallet.publicKey,
        wallet.publicKey
      )
    );
  }

  return success({
    address,
    instructions,
    cleanupInstructions: [],
    signers: [],
  });
};

interface CreateAccountParams {
  accountOwner: PublicKey;
  connection: Connection;
  wallet: WalletAdapter;
}

/**
 * Create a system account
 */
export const createAccount = async (
  params: CreateAccountParams
): Promise<Result<CustomInstructionResult>> => {
  const { accountOwner, connection, wallet } = params;
  if (!wallet.publicKey) {
    return failure(new Error('Wallet not connected'));
  }
  const instructions: TransactionInstruction[] = [];
  const cleanupInstructions: TransactionInstruction[] = [];
  const newAccount = new Account();
  // create the account
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span),
      space: AccountLayout.span,
      programId: accountOwner,
    })
  );
  return success({
    address: newAccount.publicKey,
    instructions,
    cleanupInstructions,
    signers: [newAccount],
  });
};
