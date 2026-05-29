import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CreateTicket() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!customerName.trim() || !customerEmail.trim() || !subject.trim() || !description.trim()) {
      setError("Please fill in all required fields.")
      return
    }

    if (!EMAIL_REGEX.test(customerEmail.trim())) {
      setError("Please enter a valid email address.")
      return
    }

    setSubmitting(true)
    try {
      await api.post("/api/tickets", {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        subject: subject.trim(),
        description: description.trim(),
      })

      // Pass a success message for the toast on the tickets list.
      navigate("/tickets", { state: { toast: "Ticket created successfully" } })
    } catch (err) {
      console.error("[CreateTicket] Error submitting ticket:", err)
      setError("Something went wrong while creating the ticket. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-5 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li className="font-medium text-gray-500">Tickets</li>
          <li className="text-gray-400" aria-hidden="true">
            {">"}
          </li>
          <li className="font-semibold text-blue-600">New Submission</li>
        </ol>
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
          <p className="mt-1 text-sm text-blue-600">Log a new customer inquiry or system issue into the queue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {/* Customer name + email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="customerName" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-blue-600">
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Jonathan Wick"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-blue-600">
                Customer Email
              </label>
              <input
                id="customerEmail"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="jonathan@continental.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-blue-600">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-blue-600">
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide as much detail as possible about the customer's request..."
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Inline error */}
          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>

      <footer className="mt-4 flex flex-col gap-2 px-1 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>SupportCRM v2.4.0</span>
        <span className="flex gap-4">
          <a href="#" className="hover:text-gray-600">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-600">
            Support Portal
          </a>
        </span>
      </footer>
    </div>
  )
}
