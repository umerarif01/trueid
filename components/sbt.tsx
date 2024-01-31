import React, { useState } from "react";
import { Button } from "./ui/button";
import ViewMetaData from "./view-metadata";
import { useContractWrite } from "wagmi";
import { contractAddress } from "../lib/constants";
import degreeAbi from "../lib/abi.json";
import toast from "react-hot-toast";

const SBT = ({ uri, address }: any) => {
  const [issuing, setIssuing] = useState(false);

  const {
    write: burn,
    error: burnError,
    isLoading: isIssuing,
    isError,
  } = useContractWrite({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "burnDegree",
    onSuccess() {
      toast.success("Degree Burned!");
    },
  });

  const burnDegree = async () => {
    try {
      toast("Burning Degree!", {
        icon: "🔥",
      });
      setIssuing(isIssuing);
      await burn({
        args: [address],
      });
    } catch (error) {
      console.error("Error burning degree:", burnError);
      toast.error("Error occured while burning degree!");
      setIssuing(isError);
    }
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300 space-y-3 justify-center rounded-md shadow-md dark:border-gray-600">
      <img
        src="https://i.seadn.io/s/raw/files/e9ce0e526f67d4fa17baca60a77204e0.png?auto=format&dpr=1&w=1000"
        width={300}
        height={300}
      />

      <div className="flex justify-around">
        <ViewMetaData tokenURI={uri} />

        <Button onClick={() => burnDegree()} className="px-5">
          Burn Degree
        </Button>
      </div>
    </div>
  );
};

export default SBT;
