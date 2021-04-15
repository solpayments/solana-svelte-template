<script lang="ts">
  import type { WalletAdapter } from './main';
  export let name: string;
  export let wallet: WalletAdapter;
  export let comp: boolean;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte
    apps.
  </p>

  <button on:click={() => (comp = true)}> Load Component </button>

  {#if comp}
    {#await wallet.connect()}
      <p>loading</p>
    {:then pubkey}
      <p style="color: green">Done {pubkey}</p>
    {:catch error}
      <p style="color: red">{error}</p>
    {/await}
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
