<script lang="ts">
  import { onMount } from 'svelte';
  import { RPC_API_URL } from './helpers/config';
  import { adapter, connected, solanaNetwork } from './stores';
  import { getTokenRegistry } from './stores/tokenRegistry';
  import Wallet from './components/Wallet/Wallet.svelte';

  export let name: string;

  solanaNetwork.update(() => RPC_API_URL);
  onMount(async () => getTokenRegistry());
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte
    apps.
  </p>

  {#if $connected}
    <p style="color: green">Connected to {$adapter?.publicKey}</p>
  {:else}
    <Wallet />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
