import { ENV, Strategy, TokenListProvider } from '@solana/spl-token-registry';
import type { TokenInfo } from '@solana/spl-token-registry';
import { writable } from 'svelte/store';

export type TokenMap = Map<string, TokenInfo>;

/** known tokens store */
export const tokenMap = writable<TokenMap>(new Map());

/** Update store with tokens */
export const setTokenMap = (tokenList: TokenInfo[]): void => {
  tokenMap.update(() =>
    tokenList.reduce<TokenMap>((map, item) => {
      map.set(item.address, item);
      return map;
    }, new Map())
  );
};

/** fetch and save token registry */
export const getTokenRegistry = (
  strategy: Strategy = Strategy.Static,
  env: ENV = ENV.MainnetBeta
): Promise<void> => {
  return new TokenListProvider().resolve(strategy).then((tokens) => {
    setTokenMap(
      tokens
        .excludeByTag('lp-token')
        .excludeByTag('leveraged')
        .excludeByTag('bull')
        .excludeByTag('bear')
        .excludeByTag('nft')
        .excludeByTag('security-token')
        .filterByChainId(env)
        .getList()
    );
  });
};
