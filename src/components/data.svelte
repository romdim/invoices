<script lang="ts">
  let input: HTMLElement;
  let files: FileList;
  export let data: {
    billing: Company;
    vendor: Company;
    payment: Payment;
  } = undefined;

  const readJson = async () => {
    data = JSON.parse(await files[0].text());
  };

	export function click() {
		input.click();
	}
</script>

<input type="file" bind:this={input} bind:files on:change={readJson}>

<style>
  input {
    display: none;
  }
</style>
