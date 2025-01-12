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
  const [description, setDescription] = useState("");

  const [showMore, setShowMore] = useState(false);
  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 space-y-4">
            {/* Header with X button */}
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-xl font-semibold">Create Token</h2>
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
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateToken}
              className="flex flex-col space-y-4 text-black"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Symbol"
                required
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />

              {/* Show More Button */}
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>

              {/* Additional Fields */}
              {showMore && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="Telegram Link"
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website"
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                Create Token
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
