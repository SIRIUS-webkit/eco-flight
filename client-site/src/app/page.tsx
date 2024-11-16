"use client";
import ChatBot from "@/components/Chatbot";
import CountSection from "@/components/common/CountSection";
import MaxWrapper from "@/components/common/MaxWrapper";
import Home from "@/components/home";
import HomeProject from "@/components/home/project-session";
import { useWeb3Auth } from "@/utils/Web3AuthContext";
import { useEffect, useState } from "react";

export default function Main() {
  const { subUser, subScribeChannel, walletAddress }: any = useWeb3Auth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  console.log(subscriptionStatus, subUser);
  useEffect(() => {
    if (subUser && walletAddress) {
      const isSubscribed = subUser.some((subscription: any) => {
        return (
          subscription.channel.toLowerCase() === walletAddress.toLowerCase()
        );
      });
      setSubscriptionStatus(isSubscribed);
    } else {
      console.log("No subscription data available.");
    }
  }, [subUser, walletAddress]);

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
        {!subscriptionStatus && (
          <div className="border p-4 rounded bg-yellow-100 text-center mb-5">
            <p className="text-lg font-bold">
              You are not subscribed to our updates yet!
            </p>
            <p className="mb-4">
              Stay informed about our latest projects and initiatives.
            </p>
            <button
              onClick={subScribeChannel}
              className="btn btn-primary text-white"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </MaxWrapper>
      <ChatBot />
    </>
  );
}
