// https://ipfs.io/ipfs/QmWYdPCE6smSu4WqTA5f9QmdPXwmHHCPjhfLC2BFvxhk2E
// ipfs://QmWYdPCE6smSu4WqTA5f9QmdPXwmHHCPjhfLC2BFvxhk2E

import axios from "axios";

import { FormState } from "../types/main";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZGU5ZTQxYi04MTc1LTQwODEtYjhjNy03ZWI3YTQ5NWMxYzciLCJlbWFpbCI6InVtZXJhcmlmMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjM1NmQ4ZTFmZWU3MGMxYjRiMmZmIiwic2NvcGVkS2V5U2VjcmV0IjoiMTBkZmZhZjFkNjJkMDFiNjRlYzRhYzFiMzk5Y2ZkOWMwZGIxZWQ4Mjk3Mjk3ZTFlMTE2NDU1NGZiNGU5NzUxMSIsImlhdCI6MTcwNTUxNDE3N30.IRQ4vFz-2tmxXqIEJPUZ6bwR6TdgmlZSfUdjr9IAB34";

export const pinJSONToIPFS = async (formData: FormState) => {
  // Construct the pinataContent object
  const pinataContent: any = {
    image: "ipfs://QmZeW8PyQcUMNbuRUT5C79N7Q6sLtq5fBJJwbnYJxioeVF",
    description:
      "An award conferred by a college or university signifying that the recipient has satisfactorily completed a course of study",
    traits: [],
  };

  // Add mandatory fields
  pinataContent.traits.push({
    trait_type: "University",
    value: formData.university,
  });
  pinataContent.traits.push({
    trait_type: "Degree",
    value: formData.academicDegree,
  });
  pinataContent.traits.push({ trait_type: "Year", value: formData.year });
  pinataContent.traits.push({
    trait_type: "Field of Study",
    value: formData.fieldOfStudy,
  });

  // Add optional fields if they are provided
  if (formData.studentName) {
    pinataContent.traits.push({
      trait_type: "Student Name",
      value: formData.studentName,
    });
  }

  if (formData.thesisTitle) {
    pinataContent.traits.push({
      trait_type: "Thesis Title",
      value: formData.thesisTitle,
    });
  }

  // Construct the data object
  const data = JSON.stringify({
    pinataContent,
    pinataMetadata: {
      name: "metadata.json",
    },
  });

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.log(error);
  }
};
