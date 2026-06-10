import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { GroupsPage } from "@/pages/GroupsPage"
import { GroupPage } from "@/pages/GroupPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { DashboardPage } from "@/pages/DashboardPage"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { BottomNavigation } from "@/components/layout/BottomNavigation"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <>
                <GroupsPage />
                <BottomNavigation />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/groups" replace />} />
        <Route path="*" element={<Navigate to="/groups" replace />} />
      </Routes>
    </Router>
  )
}

export default App
