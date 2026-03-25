import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => (
  <AuthCard
    title="Welcome back"
    description="Sign in to continue your work and pick up where you left off."
  >
    <LoginForm />
  </AuthCard>
);

export default LoginPage;
