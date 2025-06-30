"use client";
import { useSession } from "next-auth/react";
import React from "react";

const AdminDashboard = () => {
  useSession({ required: true });

  return <div></div>;
};

export default AdminDashboard;
