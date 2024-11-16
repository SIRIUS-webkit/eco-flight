import MaxWrapper from "@/components/common/MaxWrapper";
import Image from "next/image";
import Home from "@/components/home";

export default function Main() {
  return (
    <>
      <div className="bg-[#09090b]">
        <Home />
      </div>
      <MaxWrapper></MaxWrapper>
    </>
  );
}
