"use client";

import { useMemo, useState } from "react";
import { ActivityScreen } from "./activity";
import { AssistantScreen } from "./assistant";
import { initialWalkItems } from "./fixtures";
import { AddPlantScreen, GardenScreen } from "./garden";
import { AppNavigation } from "./navigation";
import { FirstGardenSetup, FreshWelcomeScreen } from "./onboarding";
import { StarterTodayScreen, TodayScreen } from "./today";
import type { InitialMode, Screen } from "./types";
import { WalkGuide, WalkOverview, WalkSummary } from "./walk";

export function VerdantApp({ initialMode }: { initialMode: InitialMode }) {
  const fresh = initialMode === "fresh";
  const [screen, setScreen] = useState<Screen>(fresh ? "welcome" : "today");
  const [onboarded, setOnboarded] = useState(!fresh);
  const [walkItems, setWalkItems] = useState(initialWalkItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assistantContext, setAssistantContext] = useState("Whole garden");
  const [walkPaused, setWalkPaused] = useState(false);
  const activeItems = useMemo(() => walkItems.filter((item) => item.status !== "skipped"), [walkItems]);
  const current = activeItems[currentIndex] ?? activeItems[0];

  function goToday() { setScreen("today"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function navigate(next: Screen) { if (next === "assistant") { setAssistantContext("Whole garden"); setWalkPaused(false); } setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openAssistant(context: string, fromWalk = false) { setAssistantContext(context); setWalkPaused(fromWalk); setScreen("assistant"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function startWalk(index = 0) { const requested = walkItems[index]; const activeIndex = requested ? activeItems.findIndex((item) => item.id === requested.id) : 0; setCurrentIndex(Math.max(activeIndex, 0)); setScreen("walk-guide"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function answerCheck(answer: "good" | "changed" | "unsure") { if (answer === "changed") { openAssistant(`${current.name} · ${current.area}`, true); return; } setWalkItems((items) => items.map((item) => item.id === current.id ? { ...item, status: "good" } : item)); if (currentIndex >= activeItems.length - 1) setScreen("walk-summary"); else setCurrentIndex((index) => index + 1); }
  function toggleSkip(id: number) { setWalkItems((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "skipped" ? "pending" : "skipped" } : item)); }

  return <div className="app-shell">
    <AppNavigation activeScreen={screen} onNavigate={navigate} onboarded={onboarded} initialMode={initialMode} />
    <main className="main-content">
      {screen === "welcome" && <FreshWelcomeScreen onStart={() => setScreen("setup")} />}
      {screen === "setup" && <FirstGardenSetup onBack={() => setScreen("welcome")} onComplete={() => { setOnboarded(true); setScreen("today"); }} />}
      {screen === "today" && (fresh ? <StarterTodayScreen onAddPlant={() => setScreen("add-plant")} onAsk={() => openAssistant("Garden nasturtium · Patio pots")} /> : <TodayScreen onStartWalk={() => startWalk()} onViewRoute={() => setScreen("walk-overview")} />)}
      {screen === "walk-overview" && <WalkOverview items={walkItems} onBack={goToday} onStart={startWalk} onSkip={toggleSkip} />}
      {screen === "walk-guide" && current && <WalkGuide item={current} index={currentIndex} total={activeItems.length} onOverview={() => setScreen("walk-overview")} onPause={goToday} onAnswer={answerCheck} />}
      {screen === "walk-summary" && <WalkSummary items={walkItems} onDone={goToday} onRestart={() => setScreen("walk-overview")} />}
      {screen === "garden" && <GardenScreen fresh={fresh} onAddPlant={() => setScreen("add-plant")} onAsk={openAssistant} />}
      {screen === "add-plant" && <AddPlantScreen onBack={() => setScreen("garden")} onDone={() => setScreen("garden")} />}
      {screen === "assistant" && <AssistantScreen fresh={fresh} initialContext={assistantContext} walkPaused={walkPaused} onResumeWalk={() => setScreen("walk-guide")} />}
      {screen === "activity" && <ActivityScreen fresh={fresh} />}
    </main>
  </div>;
}
