import api from "../api/axios";

export const createQuestions = async (
  questions: any[]
) => {
  const response = await api.post(
    "/questions/bulk",
    {
      questions,
    }
  );

  return response.data;
};

export const fetchBulkQuestions = async (
  questionIds: string[]
) => {
  const response = await api.post(
    "/questions/fetchBulk",
    {
      question_ids: questionIds,
    }
  );

  return response.data;
};