import AppRoutes from './routes/AppRoutes'
import useAuthInit from './hooks/useAuthInit'

function App() {
  useAuthInit()
  return <AppRoutes />
}

export default App