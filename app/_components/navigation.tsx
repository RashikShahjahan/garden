"use client";

import { Home, Leaf, ListChecks, MessageCircle, MoreHorizontal, Sprout } from "lucide-react";
import Link from "next/link";
import type { InitialMode, Screen } from "./types";

const navItems = [
  { label: "Today", icon: Home, screen: "today" as Screen },
  { label: "Garden", icon: Sprout, screen: "garden" as Screen },
  { label: "Assistant", icon: MessageCircle, screen: "assistant" as Screen },
  { label: "Activity", icon: ListChecks, screen: "activity" as Screen },
];

export function Logo() {
  return <div className="brand" aria-label="Verdant"><span className="brand-mark"><Leaf size={18} strokeWidth={2.4} /></span><span>Verdant</span></div>;
}

export function AppNavigation({ activeScreen, onNavigate, onboarded, initialMode }: { activeScreen: Screen; onNavigate: (screen: Screen) => void; onboarded: boolean; initialMode: InitialMode }) {
  const activeSection = activeScreen.startsWith("walk") ? "today" : activeScreen === "add-plant" ? "garden" : activeScreen;
  const modeLink = initialMode === "fresh" ? { href: "/demo", label: "Established demo" } : { href: "/", label: "Fresh demo" };
  return (
    <>
      <aside className="sidebar">
        <Logo />
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => { const Icon = item.icon; const active = activeSection === item.screen; return (
            <button className={`nav-item ${active ? "is-active" : ""}`} key={item.label} onClick={() => onboarded && onNavigate(item.screen)} aria-current={active ? "page" : undefined} aria-disabled={!onboarded}>
              <Icon size={19} /><span>{item.label}</span>
            </button>
          ); })}
        </nav>
        <div className="sidebar-foot">
          <div className="garden-avatar">MG</div><div><strong>{onboarded ? "My first garden" : "Your garden"}</strong><span>{initialMode === "established" ? "6 plantings" : onboarded ? "1 planting" : "Setup not started"}</span><Link className="demo-mode-link" href={modeLink.href}>{modeLink.label}</Link></div><MoreHorizontal size={18} />
        </div>
      </aside>
      <nav className="mobile-nav" aria-label="Primary navigation">
        {navItems.map((item) => { const Icon = item.icon; const active = activeSection === item.screen; return (
          <button className={active ? "is-active" : ""} key={item.label} onClick={() => onboarded && onNavigate(item.screen)} aria-current={active ? "page" : undefined} aria-disabled={!onboarded}><Icon size={19} /><span>{item.label}</span></button>
        ); })}
        <Link className="mobile-demo-link" href={modeLink.href}>{modeLink.label}</Link>
      </nav>
    </>
  );
}
