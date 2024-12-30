"use client";

import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import React from "react";

const Employee = () => {
  const [test, setTest] = React.useState({});

  const url = process.env.URL;

  const getTest = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data } = await axios.get(`${url}/employee/dashboard`, {
          headers: { Authorization: `Bearer ${getCookie("nest_token")}` },
          withCredentials: true,
        });

        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  React.useEffect(() => {
    getTest();
  }, [getTest]);

  return <div>Employee</div>;
};

export default Employee;
