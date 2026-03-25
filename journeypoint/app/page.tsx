import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import LandingActions from "@/components/home/LandingActions";

const Home: React.FC = () => (
  <AuthCard
    title="Welcome to your platform"
    description="Build faster with a clean Ant Design foundation. Sign in to continue your work or create an account to get started."
  >
    <LandingActions />
  </AuthCard>
);

export default Home;
