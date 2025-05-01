import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { MainPostPage } from './features/posts/MainPostPage'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { useAppSelector } from './app/hooks'
import { LoginPage } from './features/auth/LoginPage'
import { selectCurrentUsername } from './features/auth/authSlice'
import './index.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)

  if (!username) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
        <Route path="/" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/posts" element={<MainPostPage />} />
                  <Route path="/posts/:postId" element={<SinglePostPage />} />
                  <Route path="/editPost/:postId" element={<EditPostForm />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
