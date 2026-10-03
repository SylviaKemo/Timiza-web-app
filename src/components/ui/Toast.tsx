interface ToastProps {
  text: string;
  onUndo?: () => void;
}

/** Bottom-centre ink notification with an optional Undo action. */
export function Toast({ text, onUndo }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-7 left-1/2 z-60 flex min-h-[42px] max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3.5 rounded-control bg-ink py-2 pr-3 pl-4 text-[13px] leading-snug text-white"
    >
      <span>{text}</span>
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="h-[30px] rounded-[7px] px-2.5 text-[13px] font-medium text-undo hover:bg-[#2e2e2e]"
        >
          Undo
        </button>
      )}
    </div>
  );
}
