import { axiosInstance } from "../axiosInstance/axiosInstance";

export const verifyAdminLogin = async (userEmail, userPassword) => {
  try {
    const response = await axiosInstance.post(`/admin/login`, {
      userEmail,
      userPassword,
    });
    return response;
  } catch (err) {
    return err;
  }
};
export const getEmployersData = async () => {
  try {
    const response = await axiosInstance.get(`/admin/getallemployers`);
    return response;
  } catch (err) {
    return err;
  }
};

export const rejectEmployer = async (employerId) => {
  try {
    const response = await axiosInstance.put(`/admin/reject-employer/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const approveEmployer = async (employerId) => {
  try {
    const response = await axiosInstance.put(`/admin/approve-employer/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getEmployerDetails = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/get-employer-details/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getRegisterdCandidate = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-registerd-candidate`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getIndividualCandidateDetails = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/get-candidate-details/${candidateId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getRegistedCompanyData = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-all-company-details`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getComapanyTotalJobs = async (companyId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/get-all-company-posted-jobs/${companyId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getJobDetailsPage = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/admin/get-job-details/${jobId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updateJobDetails = async (jobId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/admin/update-job-details/${jobId}`, {
      updatedData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const addBlog = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin/post-blogs`, {
      data,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-all-blogs`);
    return response;
  } catch (err) {
    return err;
  }
};
export const getblogById = async (blogId) => {
  try {
    const response = await axiosInstance.get(`/admin/get-blogs/${blogId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updateBlog = async (blogId, data) => {
  try {
    const response = await axiosInstance.put(`/admin/update-blog-data/${blogId}`, { data });
    return response;
  } catch (err) {
    return err;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await axiosInstance.delete(`/admin/delete-blog-data/${blogId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllPlans = async () => {
  try {
    const response = await axiosInstance.get(`/admin/get-all-plans`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updatePlan = async (planId, data) => {
  try {
    const response = await axiosInstance.put(`/admin/update-plan/${planId}`, { data });
    return response;
  } catch (err) {
    return err;
  }
};

export const deletePlan = async (planId) => {
  try {
    const response = await axiosInstance.delete(`/admin/delete-plan/${planId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllCandidatePlans = async () => {
  try {
    const response = await axiosInstance.get(`/pricing-plans`);
    return response;
  } catch (err) {
    return err;
  }
};

export const activateEmployeePlan = async (employeeId, planId) => {
  try {
    const response = await axiosInstance.post(`/admin/activate-employee-plan`, {
      employeeId,
      planId,
    });
    return response;
  } catch (err) {
    return err;
  }
};