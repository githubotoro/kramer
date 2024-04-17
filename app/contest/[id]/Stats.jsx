"use client";

import { Loader } from "@/components/loaders";
import { useStore } from "@/components/store";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ClipboardIcon,
  CheckboxIcon,
  CheckIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import supabase from "@/components/db";
import { formatUTC } from "@/components/utilities";

export const Stats = () => {
  const params = useParams();

  const { pageLoading, setPageLoading } = useStore();

  const [contestData, setContestData] = useState(null);
  const [copied, setCopied] = useState(false);

  const getContest = async () => {
    try {
      const { data, error } = await supabase
        .from("contest")
        .select("*")
        .eq("contest_id", params.id)
        .single();

      if (error) {
        console.error("Error fetching contest:", error.message);
        return;
      }

      setContestData(data);
    } catch (error) {
      console.error("Error fetching contest:", error.message);
    }
  };

  console.log(contestData);

  useEffect(() => {
    if (params.id) {
      getContest();
    }
  }, [params]);

  const copyToClipboard = () => {
    const frameLink = `${process.env.NEXT_PUBLIC_APP_URL}/contest/${params.id}`;
    navigator.clipboard
      .writeText(frameLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => console.error("Error copying to clipboard:", error));
  };

  return (
    <React.Fragment>
      {pageLoading === true ? (
        <Loader />
      ) : (
        <div className="w-full max-w-xl p-3">
          <div className="px-3 py-7 w-full h-fit rounded-2xl overflow-hidden backdrop-blur-[1.5px] bg-black bg-opacity-10 border-2 shadow-sm border-gray-200">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-center">
                Contest Dashboard 👀
              </div>
              <Card className="w-full mt-5">
                <CardHeader>
                  <CardTitle>📌 Contest Id</CardTitle>
                  <CardDescription>{params.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  {contestData ? (
                    <React.Fragment>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/${contestData?.background}`}
                        alt="background image"
                        className="w-full aspect-[16/5] rounded-2xl overflow-hidden object-cover"
                      />

                      <div className="truncate text-ellipsis mt-5">
                        <span className="font-semibold">✍️ Title:</span>&nbsp;
                        {contestData?.title}
                      </div>

                      <div className="truncate text-ellipsis mt-2">
                        <span className="font-semibold">
                          ⌛ Contest Ends On:
                        </span>
                        &nbsp;
                        {formatUTC(parseInt(contestData?.end_timestamp))}
                      </div>
                    </React.Fragment>
                  ) : (
                    <div className="w-full rounded-xl bg-gray-200 p-3 !mb-5">
                      <Loader classes="!h-fit" />
                    </div>
                  )}

                  <div className="truncate text-ellipsis mt-2">
                    <span className="font-semibold">🖼️ Frame Link:</span>{" "}
                    {process.env.NEXT_PUBLIC_APP_URL}/contest/
                    {params.id}
                  </div>

                  <Button className="mt-2" onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy Frame Link to Clipboard"}

                    {copied ? (
                      <CheckCircledIcon className="ml-2" />
                    ) : (
                      <ClipboardIcon className="ml-2" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
