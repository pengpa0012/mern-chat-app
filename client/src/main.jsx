import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom/dist';
import App from './App'
import './index.css'
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
