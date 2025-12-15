import React from "react";
import { logo, logo2, mobile_logo } from "../constants/images";

interface LogoProps {
  logoWidth?: number | string;
  logoHeight?: number | string;
  logo2Width?: number | string;
  logo2Height?: number | string;
  mobileWidth?: number | string;
  mobileHeight?: number | string;
  gap?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  logoWidth = "auto",
  logoHeight = 40,
  logo2Width = "auto",
  logo2Height = 30,
  mobileWidth = "auto",
  mobileHeight = 60,
  gap = 8,
  className = "",
}) => {
  return (
    <>
      {/* Desktop / Tablet View */}
      <div
        className={`hidden md:flex items-center ${className}`}
        style={{ columnGap: gap }}
      >
        <img
          src={logo}
          alt="Logo 1"
          style={{ width: logoWidth, height: logoHeight }}
        />

        <img
          src={logo2}
          alt="Logo 2"
          style={{ width: logo2Width, height: logo2Height }}
        />
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden items-center">
        <img
          src={mobile_logo}
          alt="Mobile Logo"
          style={{ width: mobileWidth, height: mobileHeight }}
        />
      </div>
    </>
  );
};

export default Logo;
