"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Admin from "../page";

export default function ReissueRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Simulated reissue request data
  const mockRequests = [
    {
      id: 1,
      participantName: "John Doe",
      eventName: "Blockchain Conference 2023",
      description:
        "Annual blockchain technology conference with industry leaders",
      userEmail: "john.doe@example.com",
      date: "2023-10-15",
      status: "pending",
      imageUrl: "/Images/Login.png",
    },
    {
      id: 2,
      participantName: "Sarah Johnson",
      eventName: "Web3 Developers Meetup",
      description: "Monthly meetup for web3 developers to share knowledge",
      userEmail: "sarahj@example.com",
      date: "2023-10-18",
      status: "pending",
      imageUrl: "/Images/Login.png",
    },
    {
      id: 3,
      participantName: "Michael Chen",
      eventName: "NFT Art Exhibition",
      description: "Digital art exhibition showcasing NFT collections",
      userEmail: "michael.c@example.com",
      date: "2023-10-20",
      status: "approved",
      imageUrl: "/Images/Login.png",
    },
    {
      id: 4,
      participantName: "Emma Wilson",
      eventName: "DeFi Summit",
      description: "Conference on decentralized finance innovations",
      userEmail: "emma.w@example.com",
      date: "2023-10-22",
      status: "rejected",
      imageUrl: "/Images/Login.png",
    },
  ];

  useEffect(() => {
    // Simulate loading data from blockchain or API
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (requestId) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "processing" } : req
      )
    );

    // Simulate smart contract call
    setTimeout(() => {
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "approved" } : req
        )
      );
      setStatusMessage({
        type: "success",
        text: "Reissue request approved successfully!",
      });
    }, 1500);
  };

  const handleReject = (requestId) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "processing" } : req
      )
    );

    // Simulate smart contract call
    setTimeout(() => {
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" } : req
        )
      );
      setStatusMessage({ type: "error", text: "Reissue request rejected." });
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "processing":
        return "Processing...";
      default:
        return "Pending Review";
    }
  };

  return (
    <Admin>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Reissue Request Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and process NFT ticket reissue requests
          </p>
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              statusMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {statusMessage.type === "success" ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              {statusMessage.text}
            </div>
          </div>
        )}

        {/* Requests Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reissue requests...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
              >
                {/* Card Header - Event Name */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-bold text-gray-800 text-xl text-center">
                    {request.eventName}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Image */}
                  <div className="mb-4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Participant Name */}
                  <div className="mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Participant
                      </h4>
                      <p className="font-medium text-gray-800">
                        {request.participantName}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Description
                        </h4>
                        <p className="text-gray-700">{request.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Email */}
                  <div className="mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Email
                      </h4>
                      <p className="font-medium text-gray-800">
                        {request.userEmail}
                      </p>
                    </div>
                  </div>

                  {/* Request Date */}
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Request Date
                      </h4>
                      <p className="font-medium text-gray-800">
                        {request.date}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Status */}
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusText(request.status)}
                  </div>
                </div>

                {/* Card Footer - Status and Buttons */}
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    {/* Buttons */}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Admin>
  );
}
