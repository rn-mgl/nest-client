import axios from "axios";
import { getCookie } from "cookies-next";

export const getCSRFToken = async () => {
  const url = process.env.URL;
  const { data } = await axios.get(`${url}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });

  console.log(data);

  const token = getCookie("XSRF-TOKEN");

  console.log(token, "1");

  return { token };
};
