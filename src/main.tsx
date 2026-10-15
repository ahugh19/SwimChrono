import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "mobx-react";
import { Store } from "./store";

// Restore a deep link that GitHub Pages redirected through 404.html.
try {
  const redirect = sessionStorage.getItem("swimchrono.redirectPath")
  if (redirect) {
    sessionStorage.removeItem("swimchrono.redirectPath")
    window.history.replaceState(null, "", redirect)
  }
} catch {
  // storage unavailable: stay on the root page
}

const store = new Store();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
