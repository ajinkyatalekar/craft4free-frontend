import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo3.png";

export const Logo = ({ otherStyles }: { otherStyles?: string }) => {
  const navigate = useNavigate();

  return (
    <img
      src={logo}
      className={`w-[10rem] cursor-pointer ${otherStyles}`}
      onClick={() => navigate("/")}
    />
  );
};
