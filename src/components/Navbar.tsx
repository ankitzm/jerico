import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const DROP_DURATION_MS = 1200; // drop-in duration
const EXPAND_DURATION_MS = 800; // expand-to-full duration

const navItems = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [dropped, setDropped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const activeItem = useMemo(() => {
    return navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    ) ?? navItems[0];
  }, [pathname]);

  useEffect(() => {
    const dropTimer = window.setTimeout(() => setDropped(true), 0);
    const expandTimer = window.setTimeout(() => setExpanded(true), DROP_DURATION_MS);
    return () => {
      clearTimeout(dropTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  return (
    <nav
      className="sticky top-0 z-10 flex flex-col items-center pt-3 pb-2 font-mono"
      style={{
        transform: dropped ? "translateY(0)" : "translateY(-80px)",
        opacity: dropped ? 1 : 0,
        transition: `transform ${DROP_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${DROP_DURATION_MS}ms ease-out`,
        willChange: "transform, opacity",
      }}
    >
      <div
        className="relative flex bg-eerie-black-bg/80 text-gray-200/80 rounded-2xl shadow-2xl backdrop-blur-[60px] font-semibold tracking-wider uppercase"
        style={{
          gap: expanded ? 24 : 0,
          padding: expanded ? 8 : 8,
          transform: expanded ? "scaleX(1)" : "scaleX(0.94)",
          transformOrigin: "center",
          transition: `transform ${EXPAND_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), gap ${EXPAND_DURATION_MS}ms ease, padding ${EXPAND_DURATION_MS}ms ease`
        }}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const isVisible = expanded || isActive;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`relative inline-flex items-center rounded-xl transition-all ease-out group ${
                isActive ? "text-icterine" : "text-gray-200/80"
              } ${expanded ? "hover:animate-squiggle" : ""}`}
              style={{
                padding: isVisible ? "10px 16px" : "0px",
                opacity: isVisible ? 1 : 0,
                maxWidth: isVisible ? 260 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.95)",
                overflow: "hidden",
                pointerEvents: isVisible ? "auto" : "none",
                transitionDuration: `${EXPAND_DURATION_MS}ms`
              }}
            >
              {/* Active background */}
              {isActive && (
                <div 
                  className="absolute inset-0 bg-white/10 rounded-xl transition-all duration-300 ease-out"
                />
              )}
              {/* Hover background */}
              <div 
                className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Wallet Connect Button */}
        {expanded && (
          <div 
            className="transition-all ease-out"
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "scale(1)" : "scale(0.95)",
              transitionDuration: `${EXPAND_DURATION_MS}ms`,
              transitionDelay: "200ms"
            }}
          >
            <ConnectButton />
          </div>
        )}
      </div>
    </nav>
  );
}