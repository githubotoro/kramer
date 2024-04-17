import { fetchMetadata } from "frames.js/next";
import { Stats } from "./Stats";

export async function generateMetadata({ params }) {
  const contestId = params.id;

  return {
    other: {
      ...(await fetchMetadata(
        new URL(
          `/api/contest?contestId=${contestId}`,
          `${process.env.NEXT_PUBLIC_APP_URL}`
        )
      )),
    },
  };
}

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Stats />
    </div>
  );
};

export default Page;
