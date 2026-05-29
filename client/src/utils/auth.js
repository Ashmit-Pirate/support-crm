export function getToken() {
  return localStorage.getItem("crm_token")
}

export function logout() {
  localStorage.removeItem("crm_token")
}

export function isAuthenticated() {
  return !!localStorage.getItem("crm_token")
}
