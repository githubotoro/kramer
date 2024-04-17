"use client";

import React from "react";
import { useStore } from "@/components/store";
import { Loader } from "@/components/loaders";
import { ContestForm } from "@/components/molecules";

export const Home = () => {
  const { pageLoading, setPageLoading } = useStore();

  return (
    <React.Fragment>
      {pageLoading === true ? (
        <Loader />
      ) : (
        <div className="w-full max-w-xl p-3">
          <div className="px-3 py-7 w-full h-fit rounded-2xl overflow-hidden backdrop-blur-[1.5px] bg-black bg-opacity-10 border-2 shadow-sm border-gray-200">
            <div className="flex flex-col items-center">
              <div className="text-7xl text-center">🤝</div>
              <h1 className="text-2xl font-bold leading-tight mt-5 text-left w-full text-gray-800">
                Create frame-native contests on Warpcast with one-click
              </h1>
            </div>
            <ContestForm />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
