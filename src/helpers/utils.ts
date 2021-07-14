import { onDestroy } from 'svelte';

export const abbreviateAddress = (address: string): string => {
  return address.slice(0, 4) + '…' + address.slice(address.length - 4);
};

export const getUiAmount = (amount: number, decimals: number): number => {
  return amount / 10 ** decimals;
};

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the the amount of time
 *
 * Courtesy of https://stackoverflow.com/a/34270811
 */
export const forHumans = (seconds: number): string => {
  const secInYear = 31536000;
  const secInDay = 86400;
  const secInHour = 3600;
  const secInMin = 60;

  const levels: [number, string][] = [
    [Math.floor(seconds / secInYear), 'years'],
    [Math.floor((seconds % secInYear) / secInDay), 'days'],
    [Math.floor(((seconds % secInYear) % secInDay) / secInHour), 'hours'],
    [Math.floor((((seconds % secInYear) % secInDay) % secInHour) / secInMin), 'minutes'],
    [(((seconds % secInYear) % secInDay) % secInHour) % secInMin, 'seconds'],
  ];
  let returnText = '';

  for (let i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) {
      continue;
    }
    returnText += ` ${levels[i][0]} ${
      levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]
    }`;
  }
  return returnText.trim();
};

export const onInterval = (callback: () => void, milliseconds: number): void => {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
};

export const sleep = (t: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, t));
