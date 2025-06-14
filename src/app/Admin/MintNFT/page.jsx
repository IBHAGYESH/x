"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Admin from "../page";

export default function MintNFT() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    participantName: "",
    eventName: "",
    description: "",
    userEmail: "",
    file: null,
    previewUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cidData, setCidData] = useState({
    imageCid: "",
    metadataCid: "",
    transactionHash: "",
  });

  // Pinata credentials
  const PINATA_KEY = "0525ddf650657d927560";
  const PINATA_SECRET =
    "4f252b679c2fcee5923093d97aeeb87d5c3ff647bc40b29305d1f5e90edbf382";
  // Contract wallet address for ARC-19
  const CONTRACT_WALLET_ADDRESS = "YOUR_CONTRACT_WALLET_ADDRESS";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image (JPEG, PNG)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setError("");
    setFormData((prev) => ({
      ...prev,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Upload file to Pinata IPFS
  const uploadToPinata = async (file, isJson = false) => {
    const formData = new FormData();

    if (isJson) {
      // For JSON metadata
      formData.append(
        "file",
        new Blob([JSON.stringify(file)], { type: "application/json" }),
        "metadata.json"
      );
    } else {
      // For image file
      formData.append("file", file);
    }

    // Add Pinata metadata
    const metadata = JSON.stringify({
      name: isJson ? "ARC-53 Metadata" : file.name,
    });
    formData.append("pinataMetadata", metadata);

    // Add Pinata options
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: PINATA_KEY,
            pinata_secret_api_key: PINATA_SECRET,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.IpfsHash; // This is the CID
    } catch (error) {
      console.error("Pinata upload error:", error);
      throw new Error("Failed to upload to IPFS. Please try again.");
    }
  };

  // Create metadata in ARC-53 standard
  const createARC53Metadata = (imageCid) => {
    return {
      arc: "53", // Required by ARC-53 standard
      name: `Ticket for ${formData.participantName}`,
      description: formData.description,
      image: `ipfs://${imageCid}`,
      properties: {
        event: {
          name: formData.eventName,
        },
        ticket: {
          holder: formData.participantName,
        },
        contact: {
          email: formData.userEmail,
        },
      },
    };
  };

  // Convert CID to Uint8Array for ARC-19 note field
  const cidToUint8Array = (cid) => {
    const base32 = cid.replace('ipfs://', '');
    const decoder = new TextDecoder();
    return new Uint8Array(decoder.decode(base32));
  };

  // Simulate Algorand smart contract call with ARC-19
  const callAlgorandContract = async (imageCid, metadataCid) => {
    // ARC-19 Implementation Details:
    // 1. Asset URL is set to a fixed template per ARC-19 specification
    // 2. Reserve address holds the metadata CID in its first transaction note
    // 3. Manager address is set to allow future updates
    
    // In a real implementation, you would use:
    // const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    //   sender: senderAddress,
    //   total: 1,
    //   decimals: 0,
    //   defaultFrozen: false,
    //   unitName: "TICKET",
    //   assetName: `Ticket-${formData.eventName}`,
    //   assetURL: "template-ipfs://{ipfscid:1:raw:reserve:sha2-256}",
    //   assetMetadataHash: metadataHashBuffer,
    //   manager: CONTRACT_WALLET_ADDRESS,
    //   reserve: CONTRACT_WALLET_ADDRESS,
    //   clawback: CONTRACT_WALLET_ADDRESS,
    //   suggestedParams: params,
    //   note: cidToUint8Array(metadataCid), // CID in binary format
    // });
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock transaction hash
    return `ALGO-${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 15)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    setCidData({ imageCid: "", metadataCid: "", transactionHash: "" });

    // Basic validation
    const requiredFields = ["participantName", "eventName", "userEmail"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      setIsLoading(false);
      return;
    }

    if (!formData.file) {
      setError("Please select a ticket image");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Upload image to Pinata IPFS
      setSuccessMessage("Uploading ticket image to IPFS...");
      const imageCid = await uploadToPinata(formData.file);
      setCidData((prev) => ({ ...prev, imageCid }));
      setSuccessMessage("Image uploaded successfully!");

      // Step 2: Create ARC-53 metadata
      setSuccessMessage("Creating ARC-53 metadata...");
      const metadata = createARC53Metadata(imageCid);

      // Step 3: Upload metadata to Pinata IPFS
      setSuccessMessage("Uploading metadata to IPFS...");
      const metadataCid = await uploadToPinata(metadata, true);
      setCidData((prev) => ({ ...prev, metadataCid }));
      setSuccessMessage("Metadata uploaded successfully!");

      // Step 4: Call Algorand smart contract with ARC-19 parameters
      setSuccessMessage("Minting NFT ticket with ARC-19 standard...");
      const txHash = await callAlgorandContract(imageCid, metadataCid);
      setCidData((prev) => ({ ...prev, transactionHash: txHash }));
      setSuccessMessage("ARC-19 NFT ticket minted successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      setError(err.message || "Failed to mint NFT ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Admin>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Event Ticket
            </h1>
            <p className="text-gray-600 mt-2">
              Mint a blockchain-powered event ticket NFT
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Participant Name */}
                <div>
                  <label
                    htmlFor="participantName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Participant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="participantName"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter participant's full name"
                  />
                </div>

                {/* Event Name */}
                <div>
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter event name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Describe the event..."
                  />
                </div>

                {/* User Email */}
                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Image <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.previewUrl
                        ? "border-blue-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {formData.previewUrl ? (
                      <div className="p-4">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={formData.previewUrl}
                            alt="Ticket Preview"
                            className="object-contain max-h-64 w-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-white rounded-full p-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium text-blue-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              {isLoading && (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-700 flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5 animate-spin"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {cidData.imageCid && (
                <div className="bg-green-50 p-4 rounded-lg text-green-700">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">
                        Ticket image uploaded to IPFS
                      </p>
                      <p className="text-xs font-mono break-all mt-1">
                        CID: {cidData.imageCid}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {cidData.metadataCid && (
                <div className="bg-green-50 p-4 rounded-lg text-green-700">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">
                        ARC-53 Metadata uploaded to IPFS
                      </p>
                      <p className="text-xs font-mono break-all mt-1">
                        CID: {cidData.metadataCid}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {cidData.transactionHash && (
                <div className="bg-green-50 p-4 rounded-lg text-green-700">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">
                        ARC-19 Ticket NFT minted on Algorand
                      </p>
                      <p className="text-xs font-mono break-all mt-1">
                        Tx Hash: {cidData.transactionHash}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {successMessage && !isLoading && !error && (
                <div className="bg-green-50 p-4 rounded-lg text-green-700">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {successMessage}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl text-lg font-medium text-white transition-all ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Minting Ticket NFT...
                    </div>
                  ) : (
                    "Mint Ticket"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Admin>
  );
}