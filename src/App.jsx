import './App.css'
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: '1px solid rgba(75, 126, 107, 0.2)',
            background: 'rgba(20, 30, 26, 0.95)',
            color: '#e2e8f0',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#4B7E6B',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App
