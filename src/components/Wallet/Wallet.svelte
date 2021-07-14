<script lang="ts">
  import { adapter, connected } from '../../stores';
  import { connectToWallet } from '../../helpers/wallet';

  let promise: Promise<void> | null;
  const handleConnect = () => {
    promise = connectToWallet().then(() => {
      promise = null;
    });
  };
  const handleDisconnect = () => {
    promise = null;
    adapter.update(() => undefined);
  };
</script>

<main>
  {#if !$connected}
    <button on:click={() => handleConnect()}> Connect </button>
  {/if}

  {#if !$connected && promise != null}
    {#await promise}
      <p>Connecting</p>
    {:then _pubkey}
      <p style="color: green">Connected to {$adapter && $adapter.publicKey}</p>
    {:catch error}
      <p style="color: red">{error}</p>
    {/await}
  {/if}

  {#if $connected}
    <button on:click={() => handleDisconnect()}> Disconnect </button>
  {/if}
</main>
