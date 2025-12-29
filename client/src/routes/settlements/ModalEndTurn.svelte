<script>
  import { fade, scale } from 'svelte/transition'
  let show = $state(false)
  let {onClose, endTurn} = $props()
</script>

{#if show}
<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-static-element-interactions -->
  <div class="backdrop" transition:fade={{ duration: 200 }}></div>
  <div class="modal" transition:scale={{ duration: 200 }}>
    
    
    <button onclick={onClose} transition:fade={{ duration: 200 }}>Close</button>
    <button onclick={endTurn} transition:fade={{ duration: 200 }}>End Turn</button>
    
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.9);
  }
  .modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-color);
    padding: 3rem;
    border-radius: 10px;
    min-width: 600px;
  }
  .modal button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-weight: bold;
    }

    .modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-color);
    padding: 3rem;
    border-radius: 10px;
    min-width: 600px;
  }
  
  @media (max-width: 768px) {
    .modal {
      padding: 2rem;
      min-width: unset;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
  }
  
  @media (max-width: 480px) {
    .modal {
      padding: 1.5rem;
      width: 95%;
    }
  }
  
  .modal button {
        background-color: var(--primary-color);
        color: var(--bg-color);
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-weight: bold;
    }
    
  @media (max-width: 480px) {
    .modal button {
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>
