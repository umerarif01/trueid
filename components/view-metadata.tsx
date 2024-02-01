import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

// Define an interface for the data structure
interface DegreeData {
  image: string;
  description: string;
  traits: {
    trait_type: string;
    value: string;
  }[];
}

const ViewMetaData = ({ tokenURI }: any) => {
  const [degreeData, setDegreeData] = useState<DegreeData | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to extract hash from IPFS URI
  const extractHash = (tokenURI: string) => {
    const parts = tokenURI.split("/");
    return parts[parts.length - 1];
  };

  // Function to fetch JSON data from IPFS
  const fetchDataFromIpfs = async () => {
    try {
      const hash = extractHash(tokenURI);
      console.log(hash);
      const apiUrl = `https://ipfs.io/ipfs/${hash}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      setDegreeData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data from IPFS:", error);
    }
  };

  // Fetch data when the modal is opened
  useEffect(() => {
    if (open) {
      fetchDataFromIpfs();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <Button>View Metadata</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Token Metadata</DialogTitle>
          <DialogDescription>
            An award conferred by a college or university signifying that the
            recipient has satisfactorily completed a course of study
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center space-y-3 mt-5">
            <Spinner />
            <p className="font-semibold">Loading...</p>
          </div>
        ) : (
          degreeData && (
            <div className="grid grid-cols-3 gap-4">
              {degreeData?.traits.map((trait, index) => (
                <Card
                  key={index}
                  title={trait.trait_type}
                  content={trait.value}
                />
              ))}
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMetaData;

// Define a reusable Card component
const Card = ({ title, content }: any) => (
  <div className="flex flex-col text-center items-center p-4 border border-gray-300 rounded-md dark:border-gray-600">
    <h1 className="text-sm">{title}</h1>
    <p className="font-semibold ">{content}</p>
  </div>
);
