import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Services from "./pages/Services";
import Users from "./pages/Users";
import Projects from "./pages/Projects";  
import RootLayout from "./layout/RootLayout";
import PageNotFound from "./pages/pageNotFound";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import './index.css';
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Incidents from "./pages/Incidents";
import Contact from "./pages/Contact";
import Logout from "./pages/Logout";
import CreateOperationPage from "./Operations/CreateOperationPage";
import CreateProjects from "./Projects/CreateProject";
import ProjectDetailsPage from "./components/project/ProjectDetailsPage";
import OperationDetailsPage from "./components/operation/info/OperationDetailsPage";



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="Projects" element={<Projects />} />
            <Route path="services" element={<Services />} />
            <Route path="Reports" element={<Reports />} />
            <Route path="Incidents" element={<Incidents />} />
            <Route path="Users" element={<Users />} />
            <Route path="Contact" element={<Contact />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="logout" element={<Logout />} />
        <Route path="create-operation" element={<CreateOperationPage />} />
        <Route path="create-project" element={<CreateProjects />} />
        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        <Route path="/test-operation" element={<OperationDetailsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;