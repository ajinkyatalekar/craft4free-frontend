import { useNavigate } from "react-router-dom";

import dark from "@/assets/images/logo/dark.png";
import darkAnimated from "@/assets/images/logo/darkAnimated.gif";
import darkSmall from "@/assets/images/logo/darkSmall.png";
// import light from "@/assets/images/logo/light.png";
// import lightAnimated from "@/assets/images/logo/lightAnimated.gif";

export const Logo = ({
  otherStyles,
  stat,
  sm,
}: {
  otherStyles?: string;
  stat?: boolean;
  sm?: boolean;
}) => {
  const navigate = useNavigate();

  const getLogo = () => {
    if (sm) {
      return darkSmall;
    }
    return stat ? dark : darkAnimated;
  };

  return (
    <img
      src={getLogo()}
      className={`cursor-pointer ${otherStyles}`}
      onClick={() => navigate("/")}
    />
  );
};
