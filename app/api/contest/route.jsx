import { createFrames, Button } from "frames.js/next";
import { Home, Stats, Positions } from "@/components/frames";

const frames = createFrames({
  basePath: "/api/contest",
});

const handleRequest = frames(async (ctx) => {
  const page = ctx.searchParams.page || "home";
  const contestId = ctx.searchParams.contestId;

  if (page === "home") {
    return Home({
      page,
      contestId,
      ctx,
    });
  } else if (page === "stats") {
    return Stats({
      page,
      contestId,
      ctx,
    });
  } else if (page === "positions") {
    return Positions({
      page,
      contestId,
      ctx,
    });
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
