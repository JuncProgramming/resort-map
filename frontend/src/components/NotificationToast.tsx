import type { NotificationToastProps } from '@/types'

export default function NotificationToast({
  message,
  onClose
}: NotificationToastProps) {
  return (
    <div className="fixed top-4 left-1/2 z-10 w-full max-w-lg -translate-x-1/2 px-4 sm:top-6">
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-800 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <p>{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer rounded-md p-2 px-4 font-bold text-slate-600 opacity-80 transition-colors hover:bg-slate-100 hover:text-slate-900 hover:opacity-100"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
