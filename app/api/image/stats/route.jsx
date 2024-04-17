import { ImageResponse } from "next/og";
import supabase from "@/components/db";
import { formatTimeDifference } from "@/components/utilities";

const handleRequest = async (req) => {
  const contestId = req.nextUrl.searchParams.get("contestId");
  const fid = req.nextUrl.searchParams.get("fid");
  const vote = req.nextUrl.searchParams.get("vote");
  const voteStatus = req.nextUrl.searchParams.get("voteStatus");

  let voteValue = vote;

  const { data, error } = await supabase
    .from("contest")
    .select("*")
    .eq("contest_id", contestId)
    .single();

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const status = formatTimeDifference(
    currentTimestamp,
    parseInt(data.end_timestamp) / 1000
  );

  const { data: existingLog, error: existingError } = await supabase
    .from("logs")
    .select("*")
    .eq("id", `${contestId}-${fid}`)
    .single();

  if (existingLog) {
    voteValue = existingLog.vote;
  } else {
    const { data: newLog, error: insertError } = await supabase
      .from("logs")
      .insert([
        {
          id: `${contestId}-${fid}`,
          contest_id: contestId,
          fid: fid,
          vote: vote,
        },
      ]);
  }

  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-center w-full h-full p-[3rem]"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_APP_URL}/dots.png)`,
          backgroundSize: "contain",
        }}
      >
        <div
          tw="flex flex-col items-center w-full h-full rounded-[3rem] relative overflow-hidden border-4 border-[#D8D8DC]"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/${data.background})`,
            backgroundSize: "contain",
          }}
        >
          <div tw="absolute w-full h-full bg-black opacity-50 flex flex-col"></div>

          <div tw="absolute flex flex-col w-full h-full items-center px-[2rem]">
            <div tw="mt-[2rem] text-[5rem]">
              {voteStatus === "new" ? "🥳" : "😮"}
            </div>
            <div tw="mt-[1rem] flex flex-col items-center text-center text-[2.5rem] p-[1rem] w-full bg-[#EBEBF0] text-[#242426] rounded-[2rem] ">
              <div>
                {voteStatus === "new"
                  ? `Congrats! You voted on "${vote.toString()}"`
                  : `Whoops! You have already voted on "${existingLog.vote}"`}
              </div>
            </div>

            <div tw="absolute bottom-[2rem] flex flex-col items-center text-center text-[2.5rem] p-[0.5rem] w-full bg-[#EBEBF0] text-[#242426] rounded-[1.5rem] ">
              ⌛ Contest ends in {status}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      headers: {
        key: "Cache-Control",
        value: "public, max-age=1, must-revalidate",
      },
    }
  );
};

export const GET = handleRequest;
export const POST = handleRequest;
