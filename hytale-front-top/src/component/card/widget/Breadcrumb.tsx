import { A } from "@solidjs/router";
import { Component, For, Show } from "solid-js";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  class?: string;
  separator?: string;
}

const Breadcrumb: Component<BreadcrumbProps> = (props) => {
  const separator = () => props.separator ?? ">";

  return (
    <nav
      aria-label="Breadcrumb"
      class={`flex items-center flex-wrap gap-x-2 gap-y-1 ${props.class ?? "mb-6"}`}
      style={{ "font-family": "'Share Tech Mono', monospace" }}
    >
      <span class="text-green-700/40 text-xs mr-1">~/</span>

      <For each={props.items}>
        {(item, index) => (
          <>
            <Show when={index() > 0}>
              <span class="text-green-900/50 text-xs select-none">{separator()}</span>
            </Show>

            <Show
              when={item.href && !item.isActive}
              fallback={
                <span
                  class="text-xs tracking-wide"
                  style={{
                    color: item.isActive ? "#00ff41" : "rgba(0,255,65,0.45)",
                    "text-shadow": item.isActive ? "0 0 8px rgba(0,255,65,0.3)" : "none",
                  }}
                >
                  {item.isActive && <span class="mr-1" style={{ color: "rgba(0,255,65,0.3)" }}>◈</span>}
                  {item.label}
                </span>
              }
            >
              <A
                href={item.href!}
                class="text-xs tracking-wide transition-all hover:underline underline-offset-4"
                style={{ color: "rgba(0,255,65,0.4)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#00ff41";
                  e.currentTarget.style.textShadow = "0 0 8px rgba(0,255,65,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,255,65,0.4)";
                  e.currentTarget.style.textShadow = "none";
                }}
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