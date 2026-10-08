"use client";

import { useEffect } from "react";
import LoadingScreen from "@components/ui/loadingScreen";
import { useSessionIntro } from "./hook/useSessionIntro";

export default function SessionIntro() {
  const introState = useSessionIntro();
  useEffect(() => {
    if (!introState.visible) return;
    const main = document.querySelector("main");
    if (!main) return;
    const previousInert = main.inert;
    main.inert = true;
    return () => {
      main.inert = previousInert;
    };
  }, [introState.visible]);
  return <LoadingScreen {...introState} />;
}
