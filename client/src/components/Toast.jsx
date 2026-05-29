import { useEffect } from "react"

const TYPE_STYLES = {
  success: {
    border: "border-green-200",
    iconWrap: "bg-green-100",
    icon: "text-green-600",
    path: "M5 13l4 4L19 7",
  },
  error: {
    border: "border-red-200",
    iconWrap: "bg-red-100",
    icon: "text-red-600",
    path: "M6 18L18 6M6 6l12 12",
  },
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  const styles = TYPE_STYLES[type]

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg border ${styles.border} bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-lg`}
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${styles.iconWrap}`}>
        <svg
          className={`h-3.5 w-3.5 ${styles.icon}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={styles.path} />
        </svg>
      </span>
      {message}
    </div>
  )
}
