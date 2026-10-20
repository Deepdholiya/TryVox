/* Ported from the original static site. Edit freely: this file is now the source of truth. */
import type { ReactElement } from "react";

export const ICONS: Record<string, ReactElement> = {
  "phone": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 3.5h3.6l1.9 4.8-2.4 1.5a11 11 0 005.6 5.6l1.5-2.4 4.8 1.9V18a2.5 2.5 0 01-2.5 2.5A16.5 16.5 0 012.5 6 2.5 2.5 0 015 3.5z" fill="currentColor" fillOpacity=".14" />
      <path d="M15 3.5a5.5 5.5 0 015.5 5.5M15 7a2 2 0 012 2" />
    </svg>
  ),
  "sip": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
      <rect x="3" y="13.5" width="18" height="7" rx="2.2" fill="currentColor" fillOpacity=".14" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="1" fill="currentColor" stroke="none" />
      <path d="M11 7h6M11 17h6" />
    </svg>
  ),
  "wave": (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2.5" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
      <rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3" opacity=".75" />
      <rect x="10.7" y="3" width="2.6" height="18" rx="1.3" />
      <rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3" opacity=".75" />
      <rect x="18.9" y="10" width="2.6" height="4" rx="1.3" opacity=".45" />
    </svg>
  ),
  "bot": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="7" width="16" height="12.5" rx="3.5" fill="currentColor" fillOpacity=".14" />
      <path d="M12 3.5V7M2 12v3M22 12v3" />
      <circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M9.5 16h5" />
    </svg>
  ),
  "chat": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5l1.4-3.6A8 8 0 1112 20a8 8 0 01-3.9-1z" fill="currentColor" fillOpacity=".14" />
      <circle cx="8.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  "shield": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.8l7.5 3v5.4c0 4.9-3.2 8.6-7.5 10-4.3-1.4-7.5-5.1-7.5-10V5.8z" fill="currentColor" fillOpacity=".14" />
      <path d="M8.6 12l2.4 2.4 4.4-4.6" />
    </svg>
  ),
  "route": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" fill="currentColor" fillOpacity=".14" />
      <circle cx="18" cy="18" r="2.5" fill="currentColor" fillOpacity=".14" />
      <path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" />
    </svg>
  ),
  "search": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="currentColor" fillOpacity=".14" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  ),
  "id": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" fillOpacity=".14" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14.5 10h4M14.5 13.5h3" />
    </svg>
  ),
  "key": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="14" r="4" fill="currentColor" fillOpacity=".14" />
      <path d="M11 11l8.5-8.5M16 6l2.5 2.5M14 8l2 2" />
    </svg>
  ),
  "flow": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3.5" width="7" height="6" rx="1.8" fill="currentColor" fillOpacity=".14" />
      <rect x="14" y="14.5" width="7" height="6" rx="1.8" fill="currentColor" fillOpacity=".14" />
      <path d="M6.5 9.5v3.5a2 2 0 002 2H14" />
    </svg>
  ),
  "rec": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  "users": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8.5" r="3.2" fill="currentColor" fillOpacity=".14" />
      <path d="M3.5 19c.8-3 2.9-4.6 5.5-4.6s4.7 1.6 5.5 4.6" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M16.5 14.6c2 .2 3.4 1.6 4 4.1" />
    </svg>
  ),
  "bolt": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" fill="currentColor" fillOpacity=".14" />
    </svg>
  ),
  "hook": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 15a4 4 0 117.5-2" />
      <path d="M12.5 12.5L16 19" />
      <circle cx="17.5" cy="19" r="2" fill="currentColor" fillOpacity=".14" />
      <path d="M18 9a4 4 0 00-7.6 1.6" />
    </svg>
  ),
  "doc": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" fill="currentColor" fillOpacity=".14" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  "globe": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.5 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.5-3.6-8.5S9.5 6.1 12 3.5z" />
    </svg>
  ),
  "eye": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="currentColor" fillOpacity=".14" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  "mail": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" fillOpacity=".14" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  "rupee": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity=".14" />
      <path d="M9 8h6M9 10.5h6M9 8c2.6 0 3.6 1.2 3.6 2.6S11.5 13 9 13l4.5 4" />
    </svg>
  ),
  "heart": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0112 7.6 4.3 4.3 0 0119.5 10c0 5.5-7.5 10-7.5 10z" fill="currentColor" fillOpacity=".14" />
      <path d="M7.5 12h2.2l1.2-2 2 4 1.2-2h2.4" />
    </svg>
  ),
  "cart": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2.5l2.2 10.5h10l2-7.5H7" fill="currentColor" fillOpacity=".14" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </svg>
  ),
  "truck": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6.5h11v9h-11z" fill="currentColor" fillOpacity=".14" />
      <path d="M13.5 9.5h4l3 3v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  ),
  "home": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 11L12 4l8.5 7v9h-5.5v-5.5h-6V20H3.5z" fill="currentColor" fillOpacity=".14" />
    </svg>
  ),
  "plane": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 4L3 11l6.5 2.5L12 20l3-6.5z" fill="currentColor" fillOpacity=".14" />
      <path d="M9.5 13.5L21 4" />
    </svg>
  ),
  "code": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity=".14" />
      <path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5" />
    </svg>
  ),
};
