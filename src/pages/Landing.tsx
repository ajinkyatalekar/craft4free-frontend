import { CButton } from "@/components/CButton";
import { Logo } from "@/components/SiteLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 p-20">
      <ThemeToggle />
      <Logo />
      <div className="mt-5" />

      <p className="text-7xl">Fast Minecraft Servers for Free!</p>
      <div className="mt-2" />
      <CButton
        onClick={() => {
          handleAuthRedirect();
        }}
      >
        Play
      </CButton>
      <div className="mt-5" />
    </div>
  );
}

export default Landing;
