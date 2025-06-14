"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PeraWalletConnect } from "@perawallet/connect";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const peraWallet = React.useRef(new PeraWalletConnect()).current;
  const router = useRouter();

  const ADMIN_WALLET = "N3WGSFVJRZ6UNRPCXUZGRQOTVQOLRLPKZILVMNWO7OYBUQM2DZBVHZEAUY"; 

  useEffect(() => {
    const checkConnection = async () => {
      const storedAddress = localStorage.getItem("walletAddress");
      if (!storedAddress) {
        await peraWallet.disconnect();
        return;
      }

      try {
        const accounts = await peraWallet.reconnectSession();
        if (accounts.length) {
          setAccount(accounts[0]);
          navigateBasedOnRole(accounts[0]);
        }
      } catch (error) {
        console.log("No existing session", error);
      }
    };

    checkConnection();
  }, [peraWallet]);

  const navigateBasedOnRole = (walletAddress) => {
    if (walletAddress === ADMIN_WALLET) {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await peraWallet.disconnect();
      const accounts = await peraWallet.connect();
      const connectedAddress = accounts[0];
      localStorage.setItem("walletAddress", connectedAddress);
      navigateBasedOnRole(connectedAddress);
    } catch (error) {
      console.error("Connection failed:", error);
      localStorage.removeItem("walletAddress");
      await peraWallet.disconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-b from-blue-600 to-indigo-800">
          <div className="relative w-full max-w-sm aspect-square">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-700 rounded-2xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center">
              <Image
                src="/Images/Login.png"
                alt="Event Management"
                width={300}
                height={300}
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h1>
            <p className="text-gray-600">Connect your wallet to access the platform</p>
          </div>
          
          <div className="space-y-6">
            <Button 
              onClick={connectWallet}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Connect Pera Wallet
                </div>
              )}
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have a wallet?</span>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="https://perawallet.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Get Pera Wallet
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center rounded-lg bg-blue-100 p-2">
                <div className="w-5 h-5 rounded-full bg-blue-600"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Secured by Algorand blockchain</p>
                <p className="text-xs text-gray-500">Your wallet information is stored locally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}