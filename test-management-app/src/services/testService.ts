import api from "../api/axios";

export const getAllTests = async () => {
  const response = await api.get("/tests");

  return response.data.data;
};

export const createTest = async (
  payload: any
) => {
  const response = await api.post(
    "/tests",
    payload
  );

  return response.data;
};


export const publishTest = async (
  testId: string
) => {
  const response = await api.put(
    `/tests/${testId}`,
    {
      status: "live",
    }
  );

  return response.data;
};


export const getTestById = async (
  testId: string
) => {
  const response =
    await api.get(
      `/tests/${testId}`
    );

  return response.data.data;
};

export const updateTest = async (
  testId: string,
  payload: any
) => {
  const response = await api.put(
    `/tests/${testId}`,
    payload
  );

  return response.data;
};