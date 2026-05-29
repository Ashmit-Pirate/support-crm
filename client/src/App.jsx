import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import TicketList from "./pages/TicketList"
import CreateTicket from "./pages/CreateTicket"
import TicketDetail from "./pages/TicketDetail"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/new" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
