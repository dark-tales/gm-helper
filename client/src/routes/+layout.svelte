<script>
  let { children } = $props();
  import "../app.css";
</script>
{@render children()}

<style lang="postcss">
  :global(body) {
    background-color: #131516;
  }
</style>