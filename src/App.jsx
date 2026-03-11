import { Link } from "react-router-dom"

function App() {

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>RevenueLens</h1>
      <p>Track and visualize your sales deals easily.</p>

      <Link to="/dashboard">
        <button style={{ marginTop: "20px" }}>
          Open Dashboard
        </button>
      </Link>
    </div>
  )
}

export default App
