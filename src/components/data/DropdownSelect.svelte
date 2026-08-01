<script lang="ts">
  import Icon from "astro-iconset/svelte";

  interface Option {
    name: string;
    icon?: string;
  }

  interface Props {
    value?: string;
    options: Option[];
  }

  let { value = $bindable(), options = [] }: Props = $props();
  let currentOption = $derived(options.find((o) => o.name == (value ?? options[0].name))!!);

  let dropDown = $state(false);

  function selectOption(opt: Option) {
    dropDown = false;
    currentOption = opt;
    value = opt.name;
  }

  function handleOutsideClick(event: any) {
    if (dropDown && !(event.target?.closest(".dropdown-clickable") ?? false)) {
      dropDown = false;
    }
  }
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="relative">
  <button
    class="dropdown-clickable flex w-fit cursor-pointer items-center justify-center gap-2 rounded-md border-2
border-gray-700 px-2 transition-colors duration-150 ease-in-out hover:bg-gray-600"
    onclick={(e) => (dropDown = !dropDown)}
  >
    {#if currentOption.icon}
      <Icon name={currentOption.icon} />
    {/if}
    {currentOption.name}

    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-100" viewBox="0 0 20 20" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  {#if dropDown}
    <div class="border-b-background-dark-80 bg-background-dark-90 absolute z-10 w-fit rounded-md border-2 object-contain">
      {#each options as option (option.name)}
        <button
          class="dropdown-clickable flex w-full cursor-pointer items-center gap-2
px-2 py-1 transition-colors duration-150 ease-in-out hover:bg-gray-600"
          onclick={(e) => selectOption(option)}
        >
          {#if option.icon}
            <Icon name={option.icon} />
          {/if}
          {option.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
