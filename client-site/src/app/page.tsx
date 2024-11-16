import MaxWrapper from "@/components/common/MaxWrapper";
import Home from "@/components/home";
import HomeProject from "@/components/home/project-session";

export default function Main() {
  return (
    <>
      <div className="bg-[#09090b]">
        <Home />
      </div>
      <div className="w-full bg-light-green">
        <MaxWrapper>
          <div className=" py-8 px-10 flex justify-around items-center">
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">+10</h2>
              <p className="p2 ">accounts</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">+500</h2>
              <p className="p2 ">kg/co2 emission</p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="!leading-none font-bold text-primary">+9</h2>
              <p className="p2 ">projects</p>
            </div>
          </div>
        </MaxWrapper>
      </div>
      <MaxWrapper>
        <div className="py-10">
          <h3 className="font-bold">Explore project</h3>
          <p className="p2">
            Explore a diverse range of impactful projects designed to fight
            climate change, from planting trees and building renewable energy
            solutions to protecting wildlife and restoring oceans. Each project
            is verified for its contribution to reducing carbon emissions,
            ensuring your donations make a real difference.
          </p>
          <HomeProject />
        </div>
      </MaxWrapper>
    </>
  );
}
