import type { Metadata } from "next";
import React from "react";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign Up | Expense Tracker",
  description: "Create your account in Expense Tracker.",
};

export default function SignInPage() {
  return <SignInForm />;
}  