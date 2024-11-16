"use client";
import React from "react";
import MaxWrapper from "./MaxWrapper";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CountSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="w-full bg-[#caffcc]" ref={ref}>
      {inView && (
        <MaxWrapper>
          <div className=" py-8 px-10 flex justify-around items-center">
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">
                +<CountUp end={10} />
              </h2>
              <p className="p2 ">accounts</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">
                +<CountUp end={500} />
              </h2>
              <p className="p2 ">kg/co2 emission</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">
                +<CountUp end={8} />
              </h2>
              <p className="p2 ">projects</p>
            </div>
          </div>
        </MaxWrapper>
      )}
    </div>
  );
};

export default CountSection;
