<script lang="ts">
  import PaperclipRsDownloadButton from "@/components/data/PaperclipRsDownloadButton.svelte";
  import { onMount } from "svelte";
  import DropdownSelect from "@/components/data/DropdownSelect.svelte";

  interface Props {
    description?: string;
    experimentalWarning?: boolean;
    eol?: boolean;
    repository: string;
  }

  let { description = undefined, experimentalWarning = undefined, eol = false, repository }: Props = $props();

  let icon = undefined;
  let version = "vUnknown";

  // Detect user OS and CPU architecture for default download.
  let os: "Windows" | "MacOS" | "Linux" | undefined = $state(undefined);
  let cpu: "x64" | "arm64" | undefined = $state(undefined);

  onMount(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("win")) {
      os = "Windows";
    } else if (userAgent.includes("mac")) {
      os = "MacOS";
    } else if (userAgent.includes("linux")) {
      os = "Linux";
    }

    if (userAgent.includes("aarch64") || userAgent.includes("arm64") || userAgent.concat("armv8")) {
      cpu = "arm64";
    }
    if (userAgent.includes("x86")) {
      cpu = "x64";
    }
  });

  interface OptionWithIcon {
    name: string;
    icon?: string;
  }

  const osOptions: OptionWithIcon[] = [
    { name: "Windows", icon: "flowbite:windows-solid" },
    { name: "Linux", icon: "file-icons:arch-linux" },
    { name: "MacOS", icon: "wpf:macos" },
  ];

  const cpuOptions: OptionWithIcon[] = [
    { name: "x64", icon: "mdi:cpu-64-bit" },
    { name: "arm64", icon: "file-icons:arm" },
  ];
</script>

<header class="mx-auto flex max-w-7xl flex-row flex-wrap gap-16 px-4 pt-32 pb-16 lg:pt-48 lg:pb-26">
  <div class="flex-1">
    <div class="mb-6 flex flex-row items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 p-3">
        {#if icon}
          <img src={icon!} alt="Paperclip-rs logo" class="h-full w-full object-contain" />
        {/if}
      </div>
      <h1 class="text-xl font-medium">Downloads</h1>
    </div>

    <h2 class="text-4xl leading-normal font-medium lg:text-5xl lg:leading-normal">
      Get Paperclip-rs
      <span class="stable">{version}</span>
    </h2>

    <p class="mt-4 text-xl">Before downloading, ensure your operating system and CPU architecture match!</p>

    <div class="mt-4 flex gap-2 text-xl">
      Currently selected:
      <DropdownSelect bind:value={os} options={osOptions} />
      on
      <DropdownSelect bind:value={cpu} options={cpuOptions} />
    </div>

    <div class="mt-8 flex flex-col gap-4">
      <PaperclipRsDownloadButton {repository} {version} asset="none" eol={!!eol} disabled={false} />
    </div>

    <section id="builds" class="mt-20">
      <!--      <SoftwareBuilds project={id} {version} builds={builds.value.builds} eol={!!eol} />-->
    </section>

    <div class="hidden"></div>
  </div>
</header>
