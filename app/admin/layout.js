import "./style.css";

export const metadata = {
  title: "Admin | CompareMyParkings",
  description: "Operations dashboard for airport parking bookings.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">Parkflow Admin</div>
        <nav className="sidebar-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#bookings">Bookings</a>
          <a href="#flights">Flights</a>
          <a href="#controls">Controls</a>
        </nav>
        <div className="sidebar-meta">
          <p className="meta-title">Env Keys</p>
          <ul>
            <li>VEHICLE_LOOKUP_API_KEY</li>
            <li>VEHICLE_LOOKUP_API_URL</li>
            <li>FLIGHT_TRACKING_API_KEY</li>
            <li>FLIGHT_TRACKING_API_URL</li>
          </ul>
        </div>
      </aside>
      <section className="admin-main">{children}</section>
    </div>
  );
}
