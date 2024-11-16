import React from "react";
import Arrow from "../common/Arrow";
import Circle from "../common/Circle";
import Button from "../common/Button";

const Home: () => React.JSX.Element = () => {
  return (
    <>
      <div className="max-w-[1320px] mx-auto py-20 smmx:py-10 relative z-10">
        <Circle width={200} height={200} />
        <Circle width={300} height={300} />
        <Circle width={450} height={450} cls="block smmx:hidden" />
        <Circle width={550} height={550} cls="block smmx:hidden" />
        <Circle width={650} height={650} cls="block smmx:hidden" />
        <p className="p2 font-bold text-center pb-10 smmx:pb-7 text-white">
          Transform Your Travel Impact Today
        </p>
        <h1 className="text-center text-white font-bold !leading-0 !mdmx:leading-3 text-[60px] mdmx:text-[70px] smmx:text-[50px]">
          Join EcoFly,
        </h1>
        <h1 className="text-center text-primary font-bold !leading-0 text-[70px] mdmx:text-[70px] smmx:text-[50px]">
          Offset Your Emissions,{" "}
        </h1>
        <h1 className="text-center  font-bold !leading-0 text-[60px] mdmx:text-[70px] smmx:text-[50px] text-white">
          One Flight at a Time.
        </h1>
        <div className="absolute top-28 left-72 lgmx:hidden">
          <img src="/icons8-airplane-100.png" width={80} height={80} />
          {/* <Badage text="Social Media" badageColor="bg-salmon-blue" /> */}
        </div>
        <div className="absolute top-[170px] left-[378px] lgmx:hidden">
          <Arrow rotationClass="rotate-90" />
        </div>
        <div className="absolute bottom-[90px] left-60 lgmx:hidden">
          {/* <Badage text="Blog" badageColor="bg-yellow" /> */}
          <img src="/chatbot.png" width={64} height={64} />
        </div>
        <div className="absolute bottom-[146px] left-[300px] lgmx:hidden">
          <Arrow bgColor="bg-yellow" rotationClass="rotate-360" />
        </div>
        <div className="absolute top-[150px] right-[360px] lgmx:hidden">
          {/* <Badage text="Chat" badageColor="bg-fuchsia" /> */}
          <img src="/icons8-co2-64.png" width={64} height={64} />
        </div>
        <div className="absolute top-[208px] right-[420px] lgmx:hidden">
          <Arrow bgColor="bg-fuchsia" rotationClass="rotate-180" />
        </div>
        <div className="absolute bottom-[90px] right-[210px] lgmx:hidden">
          {/* <Badage text="Coding" badageColor="bg-sky" /> */}
          <img src="/icons8-ethereum-64.png" width={64} height={64} />
        </div>
        <div className="absolute bottom-[120px] right-[286px] lgmx:hidden">
          <Arrow bgColor="bg-ether" rotationClass="-rotate-90" />
        </div>
      </div>
      <p className="p2 text-center max-w-[70%] smmx:max-w-full mx-auto text-white">
        Offset your flight emissions and earn rewards with EcoFly. Calculate
        your carbon footprint, contribute to verified green projects, and track
        your impact—all with the power of blockchain. Join us in making air
        travel sustainable, one flight at a time.
      </p>
      <div className="flex xsmmx:flex-col justify-center items-center space-x-5 xsmmx:space-x-0 xsmmx:gap-5 py-12">
        <Button
          text="Let's Donate"
          cls="btn btn-primary p2 text-white"
          type="button"
          linkTag
          link="/projects"
        />
        <Button
          text="Let's Calculate"
          cls="btn btn-primary p2 text-white"
          type="button"
          linkTag
          link="/carbon-offset"
        />
      </div>
    </>
  );
};

export default Home;
