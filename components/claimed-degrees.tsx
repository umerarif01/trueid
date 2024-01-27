import React, { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import Spinner from "../components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import ViewMetaData from "./view-metadata";
import { useContractRead, useContractWrite } from "wagmi";
import { contractAddress } from "../lib/constants";
import degreeAbi from "../lib/abi.json";
import toast from "react-hot-toast";

const useFetchTokenId = (userAddress: string) => {
  const { data: tokenId } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "getTokenIdFromAddress",
    args: [userAddress],
  });
  console.log(tokenId);
  return tokenId;
};

export default function NotClaimedDegreesComponent() {
  const [notClaimedDegrees, setNotClaimedDegrees] = useState<
    Array<{ userAddress: string; tokenURI: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  const { data: degrees } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "getAllClaimedDegrees",
  });

  // Function to retrieve and store not claimed degrees in state
  async function fetchNotClaimedDegrees() {
    try {
      // Check if degrees is defined and not an empty array
      if (!degrees || !Array.isArray(degrees)) {
        return [];
      }

      // Map the results to a format with userAddress and tokenURI
      const degreesData = degrees.map((degree: any) => ({
        userAddress: degree.person,
        tokenURI: degree.tokenURI,
      }));

      return degreesData;
    } catch (error) {
      console.error("Error retrieving not claimed degrees:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  const {
    write: burn,
    error: burnError,
    isLoading: isIssuing,
    isSuccess,
    isError,
  } = useContractWrite({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "burnDegree",
  });

  const burnDegree = async (userAddress: string) => {
    try {
      toast("Burning Degree!", {
        icon: "🔥",
      });
      setIssuing(isIssuing);
      const tokenId = useFetchTokenId(userAddress);
      console.log(tokenId);
      await burn({
        args: [tokenId],
      });
      setIssuing(isSuccess);
    } catch (error) {
      console.error("Error burning degree:", burnError);
      toast.error("Error occured while burning degree!");
      setIssuing(isError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const degreesData = await fetchNotClaimedDegrees();
      setNotClaimedDegrees(degreesData);
    };

    fetchData();
  }, [isSuccess]);

  return (
    <div>
      <h2 className="font-semibold text-2xl my-3">Claimed Degrees</h2>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center space-y-3">
          <Spinner />
          <p className="font-semibold">Loading...</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of users who have claimed degrees</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead className="w-3/5">User Addreses</TableHead>
              <TableHead className="ml-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notClaimedDegrees.map((degree, index) => (
              <TableRow>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{degree.userAddress}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ViewMetaData tokenURI={degree.tokenURI} />
                    <Button onClick={() => burnDegree(degree.userAddress)}>
                      Burn Degree
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
