// Notification.tsx
import { createSignal, For, onCleanup } from "solid-js";

type Toast = { id: number; msg: string };
const [toasts, setToasts] = createSignal<Toast[]>([]);

let nextId = 0;

export function notify(message: string) {
  const id = nextId++;
  setToasts((prev) => [...prev, { id, msg: message }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3400);
}

export default function Notifications() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        "z-index": 10000,
        display: "flex",
        "flex-direction": "column",
        gap: "10px",
      }}
    >
      <For each={toasts()}>
        {(t) => (
          <div
            style={{
              background: "#1e1e1e",
              color: "#eee",
              padding: "12px 18px",
              "border-radius": "6px",
              "box-shadow": "0 6px 18px #0006",
              "min-width": "200px",
              "max-width": "400px",
              animation: "toast-in 0.3s, toast-out 0.4s 3s forwards",
            }}
          >
            {t.msg}
          </div>
        )}
      </For>
    </div>
  );
}

