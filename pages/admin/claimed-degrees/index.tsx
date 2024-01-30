"use client";

// useOwnershipCheck.js
// IndexPage.js
import React, { useEffect, useState } from "react";

import Spinner from "../../../components/ui/spinner";
import { SiteHeader } from "../../../components/site-header";
import { useAccount, useContractRead } from "wagmi";
import { contractAddress } from "../../../lib/constants";
import degreeAbi from "../../../lib/abi.json";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ClaimedDegreesComponent from "../../../components/claimed-degrees";

const useOwnershipCheck = (address: any) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: owner } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "isOwner",
    args: [address],
  });

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        console.log(owner);
        setLoading(false);
        setIsOwner(owner as boolean);
      } catch (error) {
        console.error("Error checking ownership:", error);
        setLoading(false);
      }
    };

    checkOwnership();
  }, [address, owner]);

  return { isOwner, loading };
};

const Page = () => {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { isOwner, loading } = useOwnershipCheck(address);

  if (!mounted) return;

  if (!address) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-col items-center justify-center mt-[150px]">
          <div className="flex flex-col space-y-4 items-center p-8 rounded-xl border border-gray-300 shadow-sm w-full md:w-2/6 dark:border-gray-700">
            <h1 className="font-semibold text-xl">
              Please Connect Your Wallet!
            </h1>
            <ConnectButton />
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-col justify-center items-center space-y-3 mt-5">
          <Spinner />
          <p className="font-semibold">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="container grid items-center pb-8 pt-6 md:py-10">
        {isOwner ? (
          <ClaimedDegreesComponent />
        ) : (
          <p className="flex justify-center font-semibold">
            You are not the owner.
          </p>
        )}
      </div>
    </>
  );
};

export default Page;
