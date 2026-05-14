"use client";

import LoadingScreen from "@components/ui/loadingScreen";
import { useSessionIntro } from "./hook/useSessionIntro";

export default function SessionIntro() {
  return <LoadingScreen {...useSessionIntro()} />;
}
