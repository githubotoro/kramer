"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useStore } from "../store";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pageLoading, setPageLoading } = useStore();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    setPageLoading(false);
  }, [pathname, searchParams]);

  return null;
}
