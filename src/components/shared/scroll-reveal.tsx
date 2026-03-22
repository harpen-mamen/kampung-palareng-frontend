"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE_SELECTOR = "main :is(section, div, article, aside, li, img, a, button, h1, h2, h3, p, svg)";

function isCardCandidate(element: HTMLElement) {
  const className = element.className;
  if (typeof className !== "string") return false;

  const isStructuralTag = ["DIV", "ARTICLE", "ASIDE", "LI", "SECTION"].includes(element.tagName);
  const hasCardShape =
    className.includes("rounded-[") ||
    className.includes("rounded-2") ||
    className.includes("rounded-xl") ||
    className.includes("card-panel");
  const hasCardSurface =
    className.includes("shadow-[") ||
    className.includes("border") ||
    className.includes("bg-white") ||
    className.includes("bg-[linear-gradient");

  return isStructuralTag && hasCardShape && hasCardSurface;
}

function isRevealTarget(element: HTMLElement) {
  if (element.classList.contains("hero-title-letter")) return false;
  if (element.closest("header") || element.closest("nav")) return false;
  if (element.closest('[data-no-reveal="true"]')) return false;

  return true;
}

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      const animatedElements = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal-ready, .reveal-visible, .reveal-card-ready, .reveal-card-visible"),
      );

      animatedElements.forEach((element) => {
        element.classList.remove("reveal-ready", "reveal-visible", "reveal-card-ready", "reveal-card-visible");
        element.style.removeProperty("--reveal-delay");
      });

      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(BASE_SELECTOR)).filter(
      isRevealTarget,
    );

    elements.forEach((element, index) => {
      element.classList.add(
        element.hasAttribute("data-reveal-card") || isCardCandidate(element)
          ? "reveal-card-ready"
          : "reveal-ready",
      );
      element.style.setProperty("--reveal-delay", `${Math.min(index % 8, 6) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              entry.target.hasAttribute("data-reveal-card") || isCardCandidate(entry.target as HTMLElement)
                ? "reveal-card-visible"
                : "reveal-visible",
            );
          } else {
            entry.target.classList.remove("reveal-visible", "reveal-card-visible");
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
