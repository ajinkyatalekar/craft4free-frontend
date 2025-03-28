import { useNavigate } from "react-router-dom";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <p
      className="text-2xl cursor-pointer font-lora"
      onClick={() => navigate("/")}
    >
      Craft4Free.com
    </p>
  );
};
