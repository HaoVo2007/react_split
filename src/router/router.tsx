import { createBrowserRouter } from 'react-router-dom'
import CreateExpensePage from '../pages/CreateExpensePage'
import GroupDetailPage from '../pages/GroupDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import MainLayout from '../features/layout/components/MainLayout'
import DashboardPage from '../pages/DashboardPage'
import GroupsPage from '../pages/GroupsPage'
import ProfilePage from '../pages/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'groups',
        element: <GroupsPage />,
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/expenses/create',
    element: <CreateExpensePage />,
  },
])
