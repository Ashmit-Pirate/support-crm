export default function LoadingSpinner({
  size = "h-8 w-8",
  className = "",
  label = "Loading",
}) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`} role="status" aria-live="polite">
      <div className={`${size} animate-spin rounded-full border-2 border-blue-200 border-t-blue-600`} />
      <span className="sr-only">{label}</span>
    </div>
  )
}
