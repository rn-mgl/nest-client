import axios from "axios";

export const getCSRFToken = async () => {
  const url = process.env.URL;
  const { data } = await axios.get(`${url}/csrf-cookie`, {
    withCredentials: true,
  });

  return data;
};
