const STATUS_STYLES = {
  Open: { pill: "bg-green-100 text-green-700", dot: "bg-green-500" },
  "In Progress": { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  Closed: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
}

export default function StatusBadge({ status, className = "" }) {
  const styles = STATUS_STYLES[status] ?? { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {status}
    </span>
  )
}
