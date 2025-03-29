import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <img
      src={logo}
      className="w-44 cursor-pointer"
      onClick={() => navigate("/")}
    />
  );
};
