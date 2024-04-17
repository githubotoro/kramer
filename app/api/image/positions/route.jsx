import { ImageResponse } from "next/og";
import supabase from "@/components/db";
import { formatTimeDifference } from "@/components/utilities";

const handleRequest = async (req) => {
  const contestId = req.nextUrl.searchParams.get("contestId");
  const fid = req.nextUrl.searchParams.get("fid");

  const contestPromise = supabase
    .from("contest")
    .select("*")
    .eq("contest_id", contestId)
    .single();

  const existingLogPromise = supabase
    .from("logs")
    .select("*")
    .eq("fid", fid)
    .eq("contest_id", contestId);

  const allLogsPromise = supabase
    .from("logs")
    .select("*")
    .eq("contest_id", contestId);

  let [contestData, existingLogData, allLogsData] = await Promise.allSettled([
    contestPromise,
    existingLogPromise,
    allLogsPromise,
  ]);

  contestData = contestData.value;
  existingLogData = existingLogData.value.data[0];
  allLogsData = allLogsData.value;

  console.log(allLogsData);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const status = formatTimeDifference(
    currentTimestamp,
    parseInt(contestData.data.end_timestamp) / 1000
  );

  if (!allLogsData || allLogsData.error) {
    throw new Error("Failed to fetch logs");
  }

  let yesVotes = 0;
  let noVotes = 0;
  allLogsData.data.forEach((log) => {
    if (log.vote === "yes") {
      yesVotes++;
    } else if (log.vote === "no") {
      noVotes++;
    }
  });
  let totalVotes = yesVotes + noVotes;

  const vote = existingLogData.vote;

  console.log(vote);

  {
    /* <div tw="mt-[1rem] flex flex-row h-[9.5rem] w-[50rem]">
              <div tw="w-1/2 border-[#34C759] border-[1rem] flex flex-col items-center justify-center h-full text-center text-[2.5rem] bg-[#EBEBF0] text-[#242426] rounded-[2rem]">
                <div tw="flex flex-col text-center text-[2.5rem]">Yes 👍</div>
                <div tw="flex flex-col text-center text-[2.5rem] mt-[0.1rem]">
                  {totalVotes === 0
                    ? 0
                    : `${yesVotes} (${Math.round(
                        (yesVotes / totalVotes) * 100,
                        2
                      )}%)`}
                </div>
              </div>

              <div tw="ml-[1rem] border-[#FF3B30] border-[1rem] w-1/2 flex flex-col items-center justify-center h-full text-center text-[2.5rem] bg-[#EBEBF0] text-[#242426] rounded-[2rem]">
                <div tw="flex flex-col text-center text-[2.5rem]">No 👎</div>
                <div tw="flex flex-col text-center text-[2.5rem] mt-[0.1rem]">
                  {totalVotes === 0
                    ? 0
                    : `${noVotes} (${Math.round(
                        (noVotes / totalVotes) * 100,
                        2
                      )}%)`}
                </div>
              </div>
            </div> */
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
            backgroundImage: `url(${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/background/${contestData.data.background})`,
            backgroundSize: "contain",
          }}
        >
          <div tw="absolute w-full h-full bg-black opacity-50 flex flex-col"></div>

          <div tw="absolute flex flex-col w-full h-full items-center px-[2rem]">
            <div tw="mt-[2rem] text-[5rem]">👀</div>
            <div tw="mt-[1rem] flex flex-col items-center text-center text-[2.5rem] p-[1rem] w-full bg-[#EBEBF0] text-[#242426] rounded-[2rem]">
              <div tw="flex flex-col">You voted on {vote}</div>
            </div>

            <div tw="mt-[1rem] flex flex-row h-[9.5rem] w-[50rem]">
              <div tw="w-1/2 border-[#34C759] border-[1rem] flex flex-col items-center justify-center h-full text-center text-[2.5rem] bg-[#EBEBF0] text-[#242426] rounded-[2rem]">
                <div tw="flex flex-col text-center text-[2.5rem]">Yes 👍</div>
                <div tw="flex flex-col text-center text-[2.5rem] mt-[0.1rem]">
                  {totalVotes === 0
                    ? 0
                    : `${yesVotes} (${Math.round(
                        (yesVotes / totalVotes) * 100,
                        2
                      )}%)`}
                </div>
              </div>

              <div tw="ml-[1rem] border-[#FF3B30] border-[1rem] w-1/2 flex flex-col items-center justify-center h-full text-center text-[2.5rem] bg-[#EBEBF0] text-[#242426] rounded-[2rem]">
                <div tw="flex flex-col text-center text-[2.5rem]">No 👎</div>
                <div tw="flex flex-col text-center text-[2.5rem] mt-[0.1rem]">
                  {totalVotes === 0
                    ? 0
                    : `${noVotes} (${Math.round(
                        (noVotes / totalVotes) * 100,
                        2
                      )}%)`}
                </div>
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
