import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLoginPage from "./components/loginpage/AdminLoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./components/dashboard/DashboardPage";
import EmployerTable from "./components/employer/EmployerTable";
import CandidateTable from "./components/candidate/CandidateTable";
import CompaniesPage from "./components/company/CompaniesPage";
import PreviewEmployer from "./components/employer/PreviewEmployer";
import PreviewCandidate from "./components/candidate/PreviewCandidate";
import CompanyJobPostedTableList from "./components/employer/CompanyJobPostedTableList";
import ViewJobDetails from "./components/employer/ViewJobDetails";
import EditJobData from "./components/employer/EditJobData";

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
          <Route path="preview-employer/:empId" element={<PreviewEmployer />} />
          <Route path="candidates-table" element={<CandidateTable />} />
          <Route
            path="preview-candidate/:candidateId"
            element={<PreviewCandidate />}
          />
          <Route path="company-table" element={<CompaniesPage />} />
          <Route
            path="company-job-posted-list/:companyId"
            element={<CompanyJobPostedTableList />}
          />
          <Route path="view-job-details/:jobId" element={<ViewJobDetails />} />
          <Route path="edit-job-details/:jobId" element={<EditJobData />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
