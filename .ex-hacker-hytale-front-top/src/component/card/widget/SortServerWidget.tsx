import { createSignal, For, Show } from "solid-js";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  label: "◈ ORDINA PER",
  active: "◈ ATTIVO",
};

const ARCADE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  .sort-widget-card {
    background: #080f1a;
    box-shadow: 0 0 12px rgba(221, 64, 8, 0.2), inset 0 0 12px rgba(0,245,255,0.03);
    margin-bottom: 1rem;
    padding: 1rem;
    transition: box-shadow 0.3s;
  }

  .sort-widget-card:hover {
    box-shadow: 0 0 20px rgba(225, 225, 225, 0.35), inset 0 0 16px rgba(0,245,255,0.06);
  }

  .sort-trigger {
    width: 100%;
    background: rgba(0,245,255,0.03);
    border: 1px solid rgba(242, 0, 0, 0.25);
    color: #cbcbcb;
    font-family: 'Orbitron', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.6rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: all 0.2s;
  }

  .sort-trigger:hover {
    background: rgba(0,245,255,0.08);
    border-color: rgba(247, 14, 37, 0.6);
    box-shadow: 0 0 12px rgba(0,245,255,0.2);
  }

  .sort-dropdown {
    position: absolute;
    z-index: 50;
    width: 100%;
    margin-top: 4px;
    background: #050b14;
    border: 1px solid rgba(0,245,255,0.25);
    box-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 15px rgba(0,245,255,0.1);
    overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }

  .sort-option {
    width: 100%;
    padding: 0.65rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.45);
    background: transparent;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
  }

  .sort-option:hover {
    background: rgba(0,245,255,0.06);
    color: rgba(255,255,255,0.8);
    border-left-color: rgba(255, 0, 0, 0.4);
  }

  .sort-option.active {
    background: rgba(0,245,255,0.08);
    color: #e2e2e2;
    border-left: 2px solid #ff0000;
    box-shadow: inset 0 0 12px rgba(0,245,255,0.05);
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 0, 34, 0.6);
  }

  .sort-option + .sort-option {
    border-top: 1px solid rgba(0,245,255,0.06);
  }

  .sort-chevron {
    color: rgba(255, 0, 8, 0.5);
    transition: transform 0.25s ease;
    font-size: 0.65rem;
  }

  .sort-chevron.open {
    transform: rotate(180deg);
  }

  .sort-label {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.25em;
    color: rgba(255, 0, 0, 0.5);
    text-transform: uppercase;
    margin-bottom: 0.6rem;
    display: block;
  }

  .active-badge {
    margin-left: auto;
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    color: #ff0044;
    text-shadow: 0 0 8px #a00303;
    letter-spacing: 0.1em;
  }

  @keyframes dropdown-in {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sort-dropdown {
    animation: dropdown-in 0.15s ease-out forwards;
  }
`;

interface SortOption {
  value: string;
  label: string;
  icon: string;
}

interface SortServerWidgetProps {
  sortBy: () => string;
  setSortBy: (value: string) => void;
  options?: SortOption[];
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: 'votes',   label: 'Più Votati',  icon: '⬡' },
  { value: 'recent',  label: 'Più Recenti', icon: '◎' },
  { value: 'players', label: 'Più Player',  icon: '⬟' },
];

export default function SortServerWidget(props: SortServerWidgetProps) {
  const [open, setOpen] = createSignal(false);
  const options = props.options ?? DEFAULT_OPTIONS;
  const current = () => options.find(o => o.value === props.sortBy());

  return (
    <>
      <style>{ARCADE_STYLES}</style>

      <div class="sort-widget-card">
        <span class="sort-label text-white" style={{color: "white"}}>{LANG.label}</span>

        <div style="position: relative;">
          {/* Trigger */}
          <button
            class="sort-trigger"
            onClick={() => setOpen(o => !o)}
          >
            <span>{current()?.icon} {current()?.label}</span>
            <span class={`sort-chevron ${open() ? 'open' : ''}`}>▾</span>
          </button>

          {/* Dropdown */}
          <Show when={open()}>
            <div class="sort-dropdown">
              <For each={options}>
                {(option) => (
                  <button
                    class={`sort-option ${props.sortBy() === option.value ? 'active' : ''}`}
                    onClick={() => {
                      props.setSortBy(option.value);
                      setOpen(false);
                    }}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                    <Show when={props.sortBy() === option.value}>
                      <span class="active-badge">{LANG.active}</span>
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}