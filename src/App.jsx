import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./components/loginpage/AdminLoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./components/dashboard/DashboardPage";
import EmployerTable from "./components/employer/EmployerTable";
import CandidateTable from "./components/candidate/CandidateTable";
import CompaniesPage from "./components/company/CompaniesPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<AdminLoginPage />} />

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Add more routes here */}
          <Route path="employers-table" element={<EmployerTable />} />
          <Route path="candidates-table" element={<CandidateTable />} />
          <Route path="company-table" element={<CompaniesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
