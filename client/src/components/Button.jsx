/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const tailwindColors = {
  "green-500": "#22c55e",
  "red-500": "#ef4444",
  "blue-500": "#3b82f6",
  "yellow-500": "#eab308",
};

const ButtonLink = ({
  text,
  redirect = false,
  link,
  responsive = false,
  bgColor,
  textBefColor,
  textAfterColor,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (!isHover) {
      timer = setTimeout(() => setShouldShow(false), 100);
    } else {
      setShouldShow(true);
    }

    return () => clearTimeout(timer);
  }, [isHover]);

  const handleInteractionStart = () => {
    setIsHover(true);
  };

  const handleInteractionEnd = () => {
    setIsHover(false);
  };

  const bgHexColor = tailwindColors[bgColor] || bgColor;

  return (
    <>
      <Link
        to={link}
        target={redirect ? "_blank" : "_self"}
        rel={redirect ? "noopener noreferrer" : undefined}
        className="md:block hidden w-fit primary py-2 px-8 overflow-hidden relative"
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <motion.div
          className={`w-2 h-2 absolute rounded-xl`}
          style={{
            top: `0px`,
            left: `0px`,
          }}
          animate={{
            backgroundColor: shouldShow ? `${bgHexColor}` : `#00ffff00`,
            scale: isHover ? 50 : 1,
          }}
        ></motion.div>
        <motion.p
          animate={{
            color: isHover ? `${textBefColor}` : `${textAfterColor}`,
          }}
          className={`${responsive ? "text-lg md:text-xl" : "text-xl"} ${
            isHover ? "font-semibold" : "font-normal"
          } relative z-10`}
        >
          {text}
        </motion.p>
      </Link>
      <Link
        to={link}
        style={{ backgroundColor: bgHexColor }}
        target={redirect ? "_blank" : "_self"}
        rel={redirect ? "noopener noreferrer" : undefined}
        className={`md:hidden block w-fit primary py-1 px-5 overflow-hidden relative`}
      >
        <p
          style={{ color: textBefColor }}
          className={`${
            responsive ? "text-lg md:text-xl" : "text-xl"
          } relative z-10`}
        >
          {text}
        </p>
      </Link>
    </>
  );
};

const Button = ({
  text,
  onClick,
  responsive = false,
  onClickState,
  bgColor,
  textBefColor,
  textAfterColor,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (!isHover) {
      timer = setTimeout(() => setShouldShow(false), 100);
    } else {
      setShouldShow(true);
    }

    return () => clearTimeout(timer);
  }, [isHover]);

  const handleInteractionStart = () => {
    setIsHover(true);
  };

  const handleInteractionEnd = () => {
    setIsHover(false);
  };

  const bgHexColor = tailwindColors[bgColor] || bgColor;

  return (
    <>
      <button
        onClick={onClick}
        disabled={onClickState}
        className="md:block hidden w-fit primary py-2 px-8 overflow-hidden relative"
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <motion.div
          className={`w-2 h-2 absolute rounded-xl bg-transparent`}
          style={{
            top: `0px`,
            left: `0px`,
          }}
          animate={{
            backgroundColor: shouldShow ? `${bgHexColor}` : `transparent`,
            scale: isHover ? 50 : 1,
          }}
        ></motion.div>
        <motion.p
          animate={{
            color: isHover ? `${textBefColor}` : `${textAfterColor}`,
          }}
          className={`${responsive ? "text-lg md:text-xl" : "text-xl"} ${
            isHover ? "font-semibold" : "font-normal"
          } relative z-10`}
        >
          {text}
        </motion.p>
      </button>
      <button
        style={{ backgroundColor: bgHexColor }}
        onClick={onClick}
        disabled={onClickState}
        className={`md:hidden block w-fit primary py-1 px-5 overflow-hidden relative`}
      >
        <p
          style={{ color: textBefColor }}
          className={`${
            responsive ? "text-lg md:text-xl" : "text-xl"
          } relative`}
        >
          {text}
        </p>
      </button>
    </>
  );
};

const SmallButton = ({
  text,
  onClick,
  responsive = false,
  onClickState,
  bgColor,
  textBefColor,
  textAfterColor,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (!isHover) {
      timer = setTimeout(() => setShouldShow(false), 100);
    } else {
      setShouldShow(true);
    }

    return () => clearTimeout(timer);
  }, [isHover]);

  const handleInteractionStart = () => {
    setIsHover(true);
  };

  const handleInteractionEnd = () => {
    setIsHover(false);
  };

  const bgHexColor = tailwindColors[bgColor] || bgColor;

  return (
    <>
      <button
        onClick={onClick}
        disabled={onClickState}
        className="md:block hidden w-fit primary py-1 px-5 overflow-hidden relative"
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <motion.div
          className={`w-2 h-2 absolute rounded-xl bg-transparent`}
          style={{
            top: `0px`,
            left: `0px`,
            backgroundColor: shouldShow ? `${bgHexColor}` : `transparent`,
          }}
          animate={{
            scale: isHover ? 50 : 1,
          }}
        ></motion.div>
        <motion.p
          animate={{
            color: isHover ? `${textBefColor}` : `${textAfterColor}`,
          }}
          className={`${responsive ? "text-base md:text-lg" : "text-lg"} ${
            isHover ? "font-semibold" : "font-normal"
          } relative z-10`}
        >
          {text}
        </motion.p>
      </button>
      <button
        style={{ backgroundColor: bgHexColor }}
        onClick={onClick}
        disabled={onClickState}
        className={`md:hidden block w-fit primary py-1 px-5 overflow-hidden relative`}
      >
        <p
          style={{ color: textBefColor }}
          className={`${
            responsive ? "text-base md:text-lg" : "text-lg"
          }  relative z-10`}
        >
          {text}
        </p>
      </button>
    </>
  );
};

export { ButtonLink, Button, SmallButton };
