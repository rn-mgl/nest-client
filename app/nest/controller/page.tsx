"use client";
import { useSession } from "next-auth/react";
import React from "react";

const AdminDashboard = () => {
  const { data } = useSession();
  const user = data?.user;

  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
