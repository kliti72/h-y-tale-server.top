import { A } from "@solidjs/router";
import { Component, For, Show } from "solid-js";

interface BreadcrumbItem {
  label: string;
  href?: string;       // se undefined → è l'ultimo elemento (attivo, non cliccabile)
  isActive?: boolean;  // opzionale, ma utile per maggiore controllo
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  class?: string;      // per override/customizzazioni extra
  separator?: string;  // default: ›   puoi passare → / • / ecc...
}

const Breadcrumb: Component<BreadcrumbProps> = (props) => {
  const separator = () => props.separator ?? "›";

  return (
    <nav 
      aria-label="Breadcrumb" 
      class={`
        flex items-center flex-wrap gap-x-3 gap-y-1.5 
        text-sm text-violet-400 
        ${props.class ?? "mb-6"}
      `}
    >
      <For each={props.items}>
        {(item, index) => (
          <>
            <Show when={index() > 0}>
              <span class="text-violet-600/70 select-none">{separator()}</span>
            </Show>

            <Show
              when={item.href && !item.isActive}
              fallback={
                <span 
                  class={`
                    font-medium transition-colors
                    ${item.isActive 
                      ? "text-white" 
                      : "text-violet-300/90"}
                  `}
                >
                  {item.label}
                </span>
              }
            >
              <A
                href={item.href!}
                class="
                  hover:text-fuchsia-300 
                  transition-colors 
                  hover:underline 
                  underline-offset-4
                "
              >
                {item.label}
              </A>
            </Show>
          </>
        )}
      </For>
    </nav>
  );
};

export default Breadcrumb;