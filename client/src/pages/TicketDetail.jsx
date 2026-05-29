import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../services/api"
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  FileText,
  MessageSquare,
  StickyNote,
} from "lucide-react"

const STATUS_OPTIONS = ["Open", "In Progress", "Closed"]

function statusBadgeClasses(status) {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700"
    case "In Progress":
      return "bg-yellow-100 text-yellow-700"
    case "Closed":
      return "bg-gray-200 text-gray-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

function statusDotClasses(status) {
  switch (status) {
    case "Open":
      return "bg-green-500"
    case "In Progress":
      return "bg-yellow-500"
    case "Closed":
      return "bg-gray-400"
    default:
      return "bg-gray-400"
  }
}

function formatDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateTime(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function TicketDetail() {
  const { id } = useParams()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [statusValue, setStatusValue] = useState("Open")
  const [saving, setSaving] = useState(false)

  const [noteText, setNoteText] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  async function fetchTicket() {
    if (!id) return
    setLoading(true)
    setError("")
    try {
      const res = await api.get(`/api/tickets/${id}`)
      const data = res.data
      setTicket(data)
      setStatusValue(data.status)
    } catch (err) {
      console.error(err)
      setError("Failed to load ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleSaveStatus() {
    if (!id) return
    setSaving(true)
    setError("")
    try {
      await api.put(`/api/tickets/${id}`, { status: statusValue })
      await fetchTicket()
    } catch (err) {
      console.error(err)
      setError("Failed to update status. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleAddNote() {
    if (!id || !noteText.trim()) return
    setAddingNote(true)
    setError("")
    try {
      await api.put(`/api/tickets/${id}`, { note_text: noteText.trim() })
      setNoteText("")
      await fetchTicket()
    } catch (err) {
      console.error(err)
      setError("Failed to add note. Please try again.")
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link to="/tickets" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!ticket) return null

  const notes = ticket.notes ?? []

  return (
    <div className="mx-auto max-w-6xl">
      {/* Back link + breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Link to="/tickets" className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-blue-600">{ticket.ticket_id}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Info card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                    {ticket.ticket_id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClasses(ticket.status)}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotClasses(ticket.status)}`} />
                    {ticket.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Created {formatDate(ticket.created_at)}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4 text-gray-400" />
                    {ticket.customer_name}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {ticket.customer_email}
                  </span>
                </div>
              </div>

              {/* Status update controls */}
              <div className="shrink-0">
                <label className="mb-1 block text-xs font-medium text-gray-500">Update Ticket Status:</label>
                <div className="flex items-center gap-2">
                  <select
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveStatus}
                    disabled={saving}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <FileText className="h-3.5 w-3.5" />
                Description
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{ticket.description}</p>
            </div>
          </div>

          {/* Notes section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-base font-semibold text-gray-900">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Notes &amp; Comments
              </h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {notes.length} {notes.length === 1 ? "Update" : "Updates"}
              </span>
            </div>

            {notes.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No notes yet.</p>
            ) : (
              <ul className="space-y-4">
                {notes.map((note, index) => (
                  <li key={note.id ?? index} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <StickyNote className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 border-b border-gray-100 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-relaxed text-gray-700">{note.note_text}</p>
                        <span className="shrink-0 text-xs text-gray-400">{formatDateTime(note.created_at)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Add note */}
            <div className="mt-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="Type your note here..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingNote ? "Adding..." : "Add Note"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Customer Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">{ticket.customer_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="break-all font-medium text-gray-900">{ticket.customer_email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Ticket ID</dt>
                <dd className="font-medium text-gray-900">{ticket.ticket_id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="font-medium text-gray-900">{formatDate(ticket.created_at)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
