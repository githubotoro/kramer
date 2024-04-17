import { Button } from "frames.js/next";
import { fetchWithTimeout } from "../utilities";

export const Home = async ({ page, contestId, ctx }) => {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/image/home?id=${Date.now()}&contestId=${contestId}`;

  await fetchWithTimeout([imageUrl]);

  return {
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    image: imageUrl,
    buttons: [
      <Button
        action="post"
        target={{
          query: { page: "stats", contestId, vote: "yes" },
        }}
      >
        Yes
      </Button>,
      <Button
        action="post"
        target={{
          query: { page: "stats", contestId, vote: "no" },
        }}
      >
        No
      </Button>,
    ],
  };
};
