import CountSection from "@/components/common/CountSection";
import MaxWrapper from "@/components/common/MaxWrapper";
import Home from "@/components/home";
import HomeProject from "@/components/home/project-session";

export default function Main() {
  return (
    <>
      <div className="bg-[#09090b]">
        <Home />
      </div>
      <CountSection />
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
