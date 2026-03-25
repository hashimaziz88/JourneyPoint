import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => (
  <AuthCard
    title="Get started"
    description="Create your account and start building something great."
  >
    <RegisterForm />
  </AuthCard>
);

export default RegisterPage;
