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

export default function NotClaimedDegreesComponent() {
  const [notClaimedDegrees, setNotClaimedDegrees] = useState<
    Array<{ userAddress: string; tokenURI: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [address, setAddress] = useState("");

  const {
    data: degrees,
    refetch: refetchDegrees,
    isSuccess,
  } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "getAllClaimedDegrees",
    watch: true,
    onSuccess() {
      // Check if degrees is defined and not an empty array
      if (!degrees || !Array.isArray(degrees)) {
        return [];
      }
      const degreesData = degrees.map((degree: any) => ({
        userAddress: degree.person,
        tokenURI: degree.tokenURI,
      }));
      setNotClaimedDegrees(degreesData);
      setIsLoading(false);
    },
    onError(error) {
      toast.error("An error occured! Please try again!");
      console.log(error);
      setIsLoading(false);
    },
  });

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
      refetchDegrees();
    },
  });

  const burnDegree = async (userAddress: string) => {
    try {
      setAddress(userAddress);
      toast("Burning Degree!", {
        icon: "🔥",
      });
      setIssuing(isIssuing);
      await burn({
        args: [userAddress],
      });
      setIssuing(isSuccess);
    } catch (error) {
      console.error("Error burning degree:", burnError);
      toast.error("Error occured while burning degree!");
      setIssuing(isError);
    }
  };

  useEffect(() => {
    refetchDegrees();
  }, [isSuccess]);

  return (
    <div>
      <h2 className="font-semibold text-2xl my-3">Issued Degrees</h2>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center space-y-3">
          <Spinner />
          <p className="font-semibold">Loading...</p>
        </div>
      ) : (
        <Table>
          <TableCaption>
            A list of users whose degrees have been issued to them
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead className="w-3/5">User Addreses</TableHead>
              <TableHead className="ml-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notClaimedDegrees.map((degree, index) => (
              <TableRow key={index}>
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
