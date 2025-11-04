import { axiosInstance } from "../axiosInstance/axiosInstance";

export const verifyAdminLogin = async (userEmail, userPassword) => {
  try {
    const response = await axiosInstance.post(`/login`, {
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
    const response = await axiosInstance.get(`/getallemployers`);
    return response;
  } catch (err) {
    return err;
  }
};

export const rejectEmployer = async (employerId) => {
  try {
    const response = await axiosInstance.put(`/reject-employer/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const approveEmployer = async (employerId) => {
  try {
    const response = await axiosInstance.put(`/approve-employer/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getEmployerDetails = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/get-employer-details/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getRegisterdCandidate = async () => {
  try {
    const response = await axiosInstance.get(`/get-registerd-candidate`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getIndividualCandidateDetails = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/get-candidate-details/${candidateId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getRegistedCompanyData = async () => {
  try {
    const response = await axiosInstance.get(`/get-all-company-details`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getComapanyTotalJobs = async (companyId) => {
  try {
    const response = await axiosInstance.get(
      `/get-all-company-posted-jobs/${companyId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getJobDetailsPage = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/get-job-details/${jobId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updateJobDetails = async (jobId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/update-job-details/${jobId}`, {
      updatedData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const addBlog = async (data) => {
  try {
    const response = await axiosInstance.post(`/post-blogs`, {
      data,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get(`/get-all-blogs`);
    return response;
  } catch (err) {
    return err;
  }
};
export const getblogById = async (blogId) => {
  try {
    const response = await axiosInstance.get(`/get-blogs/${blogId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updateBlog = async (blogId,data) => {
  try {
    const response = await axiosInstance.put(`/update-blog-data/${blogId}`,{data});
    return response;
  } catch (err) {
    return err;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await axiosInstance.delete(`/delete-blog-data/${blogId}`);
    return response;
  } catch (err) {
    return err;
  }
};