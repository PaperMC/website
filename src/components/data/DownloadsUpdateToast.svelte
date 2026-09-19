<script lang="ts">
  import { onMount } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { fade } from "svelte/transition";

  interface Props {
    toasts: Array<{ id: number; projectName: string; channel?: string; paused: boolean }>;
    durationMs: number;
    ondismiss: (id: number) => void;
    onpause: (id: number) => void;
    onresume: (id: number) => void;
  }

  let { toasts, durationMs, ondismiss, onpause, onresume }: Props = $props();
  let reducedMotion = $state(false);

  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => (reducedMotion = preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  });

  function accentClasses(value?: string) {
    switch (value?.toLowerCase()) {
      case "alpha":
        return "border-channel-alpha-primary";
      case "beta":
        return "border-channel-beta-primary";
      case "recommended":
        return "border-channel-recommended-primary";
      default:
        return "border-blue-500";
    }
  }

  function progressClass(value?: string) {
    switch (value?.toLowerCase()) {
      case "alpha":
        return "bg-channel-alpha-primary";
      case "beta":
        return "bg-channel-beta-primary";
      case "recommended":
        return "bg-channel-recommended-primary";
      default:
        return "bg-blue-500";
    }
  }

  function handleFocusOut(event: FocusEvent, toastId: number) {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget instanceof HTMLElement &&
      event.currentTarget.contains(event.relatedTarget)
    )
      return;
    if (event.currentTarget instanceof HTMLElement && event.currentTarget.matches(":hover")) return;
    onresume(toastId);
  }

  function handlePointerLeave(event: PointerEvent, toastId: number) {
    if (event.currentTarget instanceof HTMLElement && event.currentTarget.contains(document.activeElement)) return;
    onresume(toastId);
  }

  const animateStack: Attachment<HTMLDivElement> = (element) => {
    let previousHeight = element.offsetHeight;
    let stackAnimation: Animation | undefined;
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Imperative animation registry; mutations never drive rendering.
    const itemAnimations = new Map<HTMLElement, Animation>();
    let positions = new Map<HTMLElement, number>();

    const items = () => Array.from(element.querySelectorAll<HTMLElement>("[data-toast-id]"));
    const position = (item: HTMLElement) => element.offsetTop + item.offsetTop;

    const observer = new MutationObserver((mutations) => {
      const currentItems = items();
      const currentHeight = element.offsetHeight;
      const added = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some((node) => node instanceof HTMLElement && node.matches("[data-toast-id]"))
      );
      const removed = mutations.some((mutation) =>
        Array.from(mutation.removedNodes).some((node) => node instanceof HTMLElement && node.matches("[data-toast-id]"))
      );
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduceMotion && added && currentHeight > previousHeight) {
        const transform = getComputedStyle(element).transform;
        const currentOffset = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
        stackAnimation?.cancel();
        stackAnimation = element.animate(
          [{ transform: `translateY(${currentOffset + currentHeight - previousHeight}px)` }, { transform: "translateY(0)" }],
          {
            duration: 1_000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      } else if (!reduceMotion && removed) {
        for (const item of currentItems) {
          const previousPosition = positions.get(item);
          if (previousPosition === undefined) continue;
          const offset = previousPosition - position(item);
          if (Math.abs(offset) <= 0.5) continue;

          itemAnimations.get(item)?.cancel();
          const animation = item.animate([{ transform: `translateY(${offset}px)` }, { transform: "translateY(0)" }], {
            duration: 1_000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          });
          itemAnimations.set(item, animation);
          animation.addEventListener("finish", () => itemAnimations.delete(item), { once: true });
        }
      }

      previousHeight = currentHeight;
      positions = new Map(currentItems.map((item) => [item, position(item)]));
    });

    observer.observe(element, { childList: true });
    return () => {
      observer.disconnect();
      stackAnimation?.cancel();
      for (const animation of itemAnimations.values()) animation.cancel();
    };
  };
</script>

<div
  class="pointer-events-none fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-60 flex flex-col gap-3 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:left-auto sm:w-88"
  aria-live="polite"
  {@attach animateStack}
>
  {#each toasts as toast (toast.id)}
    <aside
      data-toast-id={toast.id}
      class={`pointer-events-auto relative overflow-hidden rounded-lg border bg-white px-4 py-3 text-gray-900 shadow-md dark:bg-gray-900 dark:text-white ${accentClasses(toast.channel)}`}
      role="status"
      out:fade={{ duration: reducedMotion ? 0 : 800 }}
      onpointerenter={() => onpause(toast.id)}
      onpointerleave={(event) => handlePointerLeave(event, toast.id)}
      onfocusin={() => onpause(toast.id)}
      onfocusout={(event) => handleFocusOut(event, toast.id)}
    >
      <div class="flex items-start gap-3">
        <div class="min-w-0 flex-1">
          <p class="font-medium">Downloads updated</p>
          <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">A new {toast.projectName} build is now available.</p>
        </div>
        <button
          type="button"
          class="-m-1 grid size-7 shrink-0 place-items-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={`Dismiss ${toast.projectName} update notification`}
          onclick={() => ondismiss(toast.id)}
        >
          <svg viewBox="0 0 20 20" class="size-4" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <span
        class={`toast-progress absolute bottom-0 left-0 hidden h-0.5 w-full origin-left motion-safe:block ${progressClass(toast.channel)} ${toast.paused ? "paused" : ""}`}
        style:animation-duration={`${durationMs}ms`}
        aria-hidden="true"
      ></span>
    </aside>
  {/each}
</div>

<style>
  .toast-progress {
    animation-name: toast-countdown;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .toast-progress.paused {
    animation-play-state: paused;
  }

  @keyframes toast-countdown {
    to {
      transform: scaleX(0);
    }
  }
</style>
