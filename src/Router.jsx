import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import App from "./App"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
