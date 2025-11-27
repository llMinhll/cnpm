export function requireLogin(navigate) {
  const token = localStorage.getItem("bus_token");
  if (!token) {
    navigate("/login");
  }
}
