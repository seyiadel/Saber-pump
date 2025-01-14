import React from "react";
import { useReadContract } from "wagmi";

type FormProps = {
  ContractAddress: `0x${string}`;
  abi: any;
};

const ListingFee: React.FC<FormProps> = ({ abi, ContractAddress }) => {
  const {
    data: listingFee,
    isLoading,
    isError,
  } = useReadContract({
    address: ContractAddress,
    abi: abi,
    functionName: "listingFee",
  });

  if (isLoading) return <p className="text-black">Loading...</p>;
  if (isError) return <p className="text-red-500">Error</p>;

  // Convert the listing fee from Wei to Ether for display
  const listingFeeInEther = listingFee
    ? parseFloat((Number(listingFee) / 10 ** 18).toFixed(4))
    : 0;
  //   const listingFeeInEther = listingFee
  //     ? parseFloat((Number(listingFee) / 10 ** 18).toFixed(4))
  //     : 0;
  console.log(listingFeeInEther);

  return (
    <div className="text-black">
      <h1>Listing Fee</h1>
      <p>{listingFeeInEther} ETH</p>
    </div>
  );
};

export default ListingFee;
