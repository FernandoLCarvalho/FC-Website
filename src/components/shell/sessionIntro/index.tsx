"use client";

import LoadingScreen from "@components/ui/loadingScreen";
import { useSessionIntro } from "./hook/useSessionIntro";

export default function SessionIntro() {
  const introState = useSessionIntro();
  return <LoadingScreen {...introState} />;
}
