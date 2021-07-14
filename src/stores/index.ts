import { derived, writable } from 'svelte/store';
import { abbreviateAddress } from '../helpers/utils';
import type { WalletAdapter } from '../helpers/types';
import type { ClockInfo, TokenFromApi } from '../helpers/solana';
import type { TokenMap } from './tokenRegistry';

export type Adapter = WalletAdapter | undefined;

export interface UserToken extends TokenFromApi {
  name?: string;
  icon?: string;
  symbol?: string;
}

/** the wallet adapter from sollet, etc */
export const adapter = writable<Adapter>(undefined);
/** is the wallet connected? */
export const connected = derived(adapter, ($adapter) => {
  if ($adapter && $adapter.publicKey) {
    return true;
  }
  return false;
});
/** the on-chain clock sysvar account */
export const clock = writable<ClockInfo | undefined>(undefined);
/** the user's tokens */
export const userTokens = writable<UserToken[]>([]);
/** the network URL */
export const solanaNetwork = writable<string>('https://api.mainnet-beta.solana.com');

// helpers
export const updateUserTokens = (userTokenList: TokenFromApi[], allTokens: TokenMap): void => {
  userTokens.update(() =>
    userTokenList.map((userToken) => {
      const possibleToken = allTokens.get(userToken.pubkey.toBase58());
      return {
        ...userToken,
        icon: possibleToken?.logoURI,
        name: possibleToken
          ? possibleToken.name
          : abbreviateAddress(userToken.account.data.parsed.info.mint),
        symbol: possibleToken
          ? possibleToken.symbol
          : abbreviateAddress(userToken.account.data.parsed.info.mint),
      };
    })
  );
};
