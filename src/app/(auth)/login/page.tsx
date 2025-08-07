import type { Metadata } from "next";
import React from "react";
import LoginForm from "../../components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Expense Tracker",
  description: "Login to access your account in Expense Tracker.",
};

export default function LoginPage() {
  return <LoginForm />;
}       