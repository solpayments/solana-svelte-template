import { PublicKey } from '@solana/web3.js';
import { enums, Infer } from 'superstruct';
import type { AccountInfo, ParsedAccountData, RpcResponseAndContext } from '@solana/web3.js';

export interface ClockInfo {
  epoch: number;
  epochStartTimestamp: number;
  leaderScheduleEpoch: number;
  slot: number;
  unixTimestamp: number;
}
export interface ParsedClockData extends ParsedAccountData {
  parsed: {
    info: ClockInfo;
    type: 'clock';
  };
}
export type ClockAccountInfo = AccountInfo<ParsedClockData>;

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
export const ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export type TokenAccountState = Infer<typeof AccountState>;
const AccountState = enums(['initialized', 'uninitialized', 'frozen']);
export type TokenAccountType = Infer<typeof TokenAccountType>;
export const TokenAccountType = enums(['mint', 'account', 'multisig']);

export interface TokenAmount {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export interface TokenInfo {
  isNative: false;
  mint: string;
  owner: string;
  state: TokenAccountState;
  tokenAmount: TokenAmount;
}

export interface ParsedTokenData extends ParsedAccountData {
  parsed: {
    info: TokenInfo;
    type: TokenAccountType;
  };
}

export interface TokenFromApi {
  pubkey: PublicKey;
  account: AccountInfo<ParsedTokenData>;
}

export type TokenApiResult = RpcResponseAndContext<TokenFromApi[]>;
