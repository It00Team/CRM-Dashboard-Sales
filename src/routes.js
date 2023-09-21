import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import SalesPage from './pages/Sales';
import TeamPage from './pages/Team';
import ProjectPage from './pages/Project';
import Calendar from './pages/Calendar';
import AddEvent from './pages/AddEvent';
import UserAdd from './pages/UserAdd';
import ShowTeam from './pages/ShowTeam';
import EditSales from './pages/EditSales';
import UpdateProject from './pages/EditProject';
import Email from './pages/Email';
import AddClients from './pages/AddClients';
import Review from './pages/QC';
import ShowQC from './pages/ShowQc';
import DoTask from './pages/DoTask';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'sales', element: <SalesPage /> },
        { path: 'project', element: <ProjectPage /> },
        { path: 'team', element: <TeamPage /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'add-event', element: <AddEvent /> },
        { path: 'show-team/:id', element: <ShowTeam /> },
        { path: 'edit-client/:id', element: <EditSales /> },
        { path: 'edit-project/:id', element: <UpdateProject /> },
        { path: 'email/', element: <Email /> },
        { path: 'add-clients/', element: <AddClients /> },
        { path: 'review/', element: <Review /> },
        { path: 'qc/', element: <ShowQC /> },
        { path: 'to-do-task/:id', element: <DoTask /> },




      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'user-add',
      element: <UserAdd />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
