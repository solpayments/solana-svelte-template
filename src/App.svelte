<script lang="ts">
  import { connectToWallet } from './helpers/wallet';
  import { comp, store as adapter, setComp } from './stores';
  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte
    apps.
  </p>

  <button on:click={() => setComp()}> Connect </button>

  {#if $comp}
    {#await connectToWallet()}
      <p>loading</p>
    {:then _pubkey}
      <p style="color: green">Done</p>
    {:catch error}
      <p style="color: red">{error}</p>
    {/await}
  {/if}

  {#if $adapter?.publicKey}
    <p style="color: green">Connected to {$adapter.publicKey}</p>
  {:else}
    <p style="color: red">Not connected</p>
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
