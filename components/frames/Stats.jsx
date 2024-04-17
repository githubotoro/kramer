import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../utilities";
import supabase from "../db";

export const Stats = async ({ page, contestId, ctx }) => {
  const fid = ctx.message.requesterFid;
  const vote = ctx.searchParams.vote;

  let voteStatus = "new";

  const { data: existingLog, error: existingError } = await supabase
    .from("logs")
    .select("*")
    .eq("id", `${contestId}-${fid}`)
    .single();

  if (existingLog) {
    voteStatus = "old";
  }

  const imageUrl = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/image/stats?id=${Date.now()}&contestId=${contestId}&fid=${fid}&vote=${vote}&voteStatus=${voteStatus}`;

  await fetchWithTimeout([imageUrl]);

  return {
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    image: imageUrl,
    buttons: [
      <Button action="link" target={process.env.NEXT_PUBLIC_APP_URL}>
        Create Contest
      </Button>,
      <Button
        action="post"
        target={{
          query: { page: "positions", contestId },
        }}
      >
        View Positions
      </Button>,
      <Button
        action="post"
        target={{
          query: { page: "home", contestId },
        }}
      >
        Home
      </Button>,
    ],
  };
};
