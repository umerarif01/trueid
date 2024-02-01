import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { FormState } from "../types/main";
import { pinJSONToIPFS } from "../lib/pinata";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import degreeAbi from "../lib/abi.json";
import { contractAddress } from "../lib/constants";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SBT from "./sbt";

const Form = () => {
  const { address } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    university: "",
    academicDegree: "",
    year: "",
    fieldOfStudy: "",
    studentName: "",
    thesisTitle: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormState
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  };

  const { write: requestDegree, error: requestError } = useContractWrite({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "requestDegree",
    onSuccess() {
      toast.success("Request Submitted Successfully!");
      setIsSubmitting(false);
    },
    onError() {
      toast.error("An error occured! Please try again!");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formState.university &&
      !formState.academicDegree &&
      !formState.year &&
      !formState.fieldOfStudy
    ) {
      toast.error("Please fill out the form!");
      return;
    }

    try {
      setIsSubmitting(true);
      const ipfsHash = await pinJSONToIPFS(formState);
      await requestDegree({
        args: [ipfsHash],
      });
    } catch (error) {
      console.log(requestError);
      setIsSubmitting(false);
    }
  };

  const { data: degree } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "checkDegreeOfPerson",
    args: [address],
    watch: true,
  });

  const { data: requested } = useContractRead({
    address: contractAddress,
    abi: degreeAbi.abi,
    functionName: "checkRequestOfPerson",
    args: [address],
    watch: true,
  });

  return (
    <>
      {!address ? (
        <div className="flex flex-col space-y-4 items-center justify-center p-8 rounded-xl mt-[150px] h-[150px] border border-gray-300 shadow-sm w-full md:w-2/5 dark:border-gray-700">
          <h1 className="font-semibold text-xl">Please Connect Your Wallet!</h1>
          <ConnectButton />
        </div>
      ) : (
        <div className="flex flex-col space-y-2 p-8 rounded-xl border border-gray-300 shadow-sm w-full md:w-3/5 dark:border-gray-700 mt-[50px]">
          {(degree && (degree as any).issued === true) || requested ? (
            <>
              {degree && (degree as any).issued === true && (
                <div className="flex flex-col items-center space-y-3">
                  <p className="font-semibold text-lg text-center">
                    You have already received a degree associated with this
                    wallet address.
                  </p>
                  <SBT uri={(degree as any).tokenURI} address={address} />
                </div>
              )}

              {requested && degree && (degree as any).issued === false && (
                <div>
                  <p className="font-semibold text-lg text-center">
                    You have already requested a degree associated with this
                    wallet address.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="font-semibold text-xl">Request your Degree</h1>
              <form className="space-y-2" onSubmit={handleSubmit}>
                <div>
                  <Label>Name of the University</Label>
                  <Input
                    type="text"
                    id="university"
                    placeholder="Enter the name of your university"
                    value={formState.university}
                    onChange={(e) => handleInputChange(e, "university")}
                  />
                </div>
                <div>
                  <Label>Academic Degree</Label>
                  <Input
                    type="text"
                    id="academicDegree"
                    placeholder="Enter the name of your academic degree"
                    value={formState.academicDegree}
                    onChange={(e) => handleInputChange(e, "academicDegree")}
                  />
                </div>
                <div>
                  <Label>Year of the Degree</Label>
                  <Input
                    type="text"
                    id="year"
                    placeholder="Enter the year of your degree"
                    value={formState.year}
                    onChange={(e) => handleInputChange(e, "year")}
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    type="text"
                    id="fieldOfStudy"
                    placeholder="Enter the field of study"
                    value={formState.fieldOfStudy}
                    onChange={(e) => handleInputChange(e, "fieldOfStudy")}
                  />
                </div>
                <div>
                  <Label>{`Student's Name (optional)`}</Label>
                  <Input
                    type="text"
                    id="studentName"
                    placeholder="Enter the name of the student"
                    value={formState.studentName}
                    onChange={(e) => handleInputChange(e, "studentName")}
                  />
                </div>
                <div>
                  <Label>Title of the Thesis (optional)</Label>
                  <Input
                    type="text"
                    id="thesisTitle"
                    placeholder="Enter the title of your thesis"
                    value={formState.thesisTitle}
                    onChange={(e) => handleInputChange(e, "thesisTitle")}
                  />
                </div>
                <div />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? `Requesting Degree` : `Request Degree`}
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Form;

const Label = ({ children }: any) => {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {children}
    </label>
  );
};
