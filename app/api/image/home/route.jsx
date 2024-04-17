import { ImageResponse } from "next/og";
import supabase from "@/components/db";
import { formatUTC } from "@/components/utilities";

const handleRequest = async (req) => {
  const contestId = req.nextUrl.searchParams.get("contestId");

  const { data, error } = await supabase
    .from("contest")
    .select("*")
    .eq("contest_id", contestId)
    .single();

  console.log(data.end_timestamp);

  const endTimestamp = formatUTC(parseInt(data.end_timestamp));

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
          <div tw="absolute w-full h-full bg-black opacity-0 flex flex-col"></div>

          <div tw="absolute flex flex-col w-full h-full items-center px-[2rem]">
            <div tw="mt-[2rem] text-[5rem]">🧐</div>
            <div tw="mt-[1rem] flex flex-col items-center text-center text-[2.5rem] p-[1rem] w-full bg-[#EBEBF0] text-[#242426] rounded-[2rem] ">
              <div>{data.title}</div>
            </div>

            <div tw="absolute bottom-[2rem] flex flex-col items-center text-center text-[2.5rem] p-[0.5rem] w-full bg-[#EBEBF0] text-[#242426] rounded-[1.5rem] ">
              ⌛ Ends on {endTimestamp}
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
