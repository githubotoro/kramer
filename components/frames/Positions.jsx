import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../utilities";

export const Positions = async ({ page, contestId, ctx }) => {
  const fid = ctx.message.requesterFid;

  const imageUrl = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/image/positions?id=${Date.now()}&contestId=${contestId}&contestId=${contestId}&fid=${fid}`;

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
          query: { page: "home", contestId },
        }}
      >
        Home
      </Button>,
    ],
  };
};
