"use client";
import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { isAddress } from "viem";
import { title } from "process";

type FormProps = {
  ContractAddress: `0x${string}`;
  abi: any;
};

const Form: React.FC<FormProps> = ({ ContractAddress, abi }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const handleShowForm = () => {
    setShowForm(true);
  };

  const { writeContractAsync: createToken } = useWriteContract();

  const handleCreateToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAddress(ContractAddress)) {
      console.error("Invalid Ethereum address");
      return;
    }

    try {
      await createToken({
        address: ContractAddress, // Ensure this is correctly passed
        abi: abi,
        functionName: "createToken",
        args: [title, symbol], // Add arguments if your function expects them
      });
      console.log("Token created successfully!");
    } catch (error) {
      console.error("Error creating token:", error);
    }

    console.log("Token created successfully!");
  };

  return (
    <div className="text-center">
      <button className="text-[25px] font-semibold" onClick={handleShowForm}>
        [ Create a Token ]
      </button>

      {showForm && (
        <form onSubmit={handleCreateToken}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol"
            required
          />

          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:bg-gray-200 rounded-full p-2"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button type="submit">Create Token</button>
        </form>
      )}
    </div>
  );
};

export default Form;
