import { PublicKey, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import type { Connection } from '@solana/web3.js';
import type { Result } from './result';
import { failure, success } from './result';
import { CONFIRMED } from './constants';
import type { ClockAccountInfo, ClockInfo, TokenApiResult } from '../helpers/solana';

interface Base {
  connection: Connection;
}

interface GetTokenAccountParams extends Base {
  ownerKey: PublicKey;
  programId: PublicKey;
}

/** Gets SPL token accounts */
export const fetchTokenAccounts = async (
  params: GetTokenAccountParams
): Promise<Result<TokenApiResult>> => {
  const { connection, ownerKey, programId } = params;
  try {
    return success(
      await connection.getParsedTokenAccountsByOwner(ownerKey, { programId }, CONFIRMED)
    );
  } catch (error) {
    return failure(error);
  }
};

/** Gets The Clock account */
export const getClockAccount = async (
  connection: Connection
): Promise<Result<ClockInfo | null>> => {
  try {
    const result = await connection.getParsedAccountInfo(SYSVAR_CLOCK_PUBKEY, CONFIRMED);
    return result.value
      ? success((result.value as ClockAccountInfo).data.parsed.info)
      : success(null);
  } catch (error) {
    return failure(error);
  }
};
