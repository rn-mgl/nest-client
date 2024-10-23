import axios from "axios";

export const getCSRFToken = async (url: string) => {
  const { data } = await axios.get(`${url}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });

  return data;
};
