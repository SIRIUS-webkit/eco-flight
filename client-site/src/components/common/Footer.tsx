import Link from "next/link";
import React from "react";

type NavProps = {
  id: number;
  name: string;
  link: string;
};

const Footer = () => {
  const navLinks: NavProps[] = [
    {
      id: 0,
      name: "Projects",
      link: "/projects",
    },
    {
      id: 1,
      name: "Create Project",
      link: "/create-project",
    },
    {
      id: 2,
      name: "Carbon Offset",
      link: "/carbon-offset",
    },
  ];

  return (
    <div className="bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto lgmx:mx-5 pb-20 smmx:pb-10">
        <div className="grid grid-cols-12 items-end mx910:items-start">
          <div className="col-span-6 mx910:col-span-12">
            <p className="p2 mt-4 text-white">
              Have questions or want to learn more? Contact us or follow us on
              social media for updates! Stay connected to learn about new green
              projects and sustainability tips.
            </p>
          </div>
          <div className="col-span-6 mx910:col-span-12 flex xsmmx:flex-col space-x-10 xsmmx:space-x-0 items-end xsmmx:items-start justify-end mx910:justify-start mt-0 mx910:mt-10">
            {navLinks.map((item) => (
              <Link href={item.link} key={item.id} target="_blank">
                <p className="p2 text-white">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#383440] my-4" />
        <div className="flex xsmmx:flex-col xsmmx:gap-4 justify-between items-center">
          <p className="p3 text-white">
            Copyright @ 2024 EcoFly, All rights reserved
          </p>
          <div className="flex space-x-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#3b5998"
                d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
              ></path>
              <path
                fill="#fff"
                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 30 30"
            >
              <path
                fill="#fff"
                d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <radialGradient
                id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                cx="19.38"
                cy="42.035"
                r="44.899"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fd5"></stop>
                <stop offset=".328" stopColor="#ff543f"></stop>
                <stop offset=".348" stopColor="#fc5245"></stop>
                <stop offset=".504" stopColor="#e64771"></stop>
                <stop offset=".643" stopColor="#d53e91"></stop>
                <stop offset=".761" stopColor="#cc39a4"></stop>
                <stop offset=".841" stopColor="#c837ab"></stop>
              </radialGradient>
              <path
                fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
              ></path>
              <radialGradient
                id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                cx="11.786"
                cy="5.54"
                r="29.813"
                gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#4168c9"></stop>
                <stop offset=".999" stopColor="#4168c9" stopOpacity="0"></stop>
              </radialGradient>
              <path
                fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
              ></path>
              <path
                fill="#fff"
                d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
              ></path>
              <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
              <path
                fill="#fff"
                d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
