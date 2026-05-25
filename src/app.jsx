import { useState, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart
} from "recharts";

const CARD_SVG = {
  tax: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/></linearGradient></defs><rect width="240" height="80" fill="url(#tg1)"/><rect x="14" y="12" width="80" height="10" rx="3" fill="rgba(6,182,212,0.5)"/><rect x="14" y="28" width="55" height="8" rx="2" fill="rgba(255,255,255,0.18)"/><rect x="14" y="42" width="65" height="8" rx="2" fill="rgba(255,255,255,0.12)"/><rect x="14" y="56" width="45" height="8" rx="2" fill="rgba(255,255,255,0.08)"/><rect x="150" y="15" width="72" height="52" rx="6" fill="rgba(0,0,0,0.35)" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/><rect x="158" y="23" width="20" height="4" rx="2" fill="#06b6d4" opacity="0.9"/><rect x="158" y="31" width="55" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/><rect x="158" y="38" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/><rect x="158" y="45" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.14)"/><rect x="158" y="52" width="35" height="3" rx="1.5" fill="rgba(245,158,11,0.5)"/><circle cx="108" cy="40" r="18" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.5"/><circle cx="108" cy="40" r="12" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7"/><text x="108" y="44" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="700">TAX</text></svg>`,
  mort: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2"/></linearGradient></defs><rect width="240" height="80" fill="url(#mg1)"/><polygon points="60,60 60,30 80,14 100,30 100,60" fill="rgba(6,182,212,0.35)" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5"/><rect x="68" y="44" width="14" height="16" rx="2" fill="rgba(255,255,255,0.3)"/><rect x="24" y="40" width="30" height="20" rx="3" fill="rgba(124,58,237,0.35)" stroke="rgba(124,58,237,0.5)" strokeWidth="1"/><polygon points="24,40 39,28 54,40" fill="rgba(124,58,237,0.5)" stroke="rgba(124,58,237,0.6)" strokeWidth="1"/><polyline points="115,62 130,50 145,55 160,38 175,42 195,22" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.8"/><polyline points="115,62 130,58 145,65 160,55 175,58 195,48" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6"/><rect x="113" y="18" width="85" height="50" rx="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/><line x1="113" y1="62" x2="198" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/></svg>`,
  debt: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0.25"/></linearGradient></defs><rect width="240" height="80" fill="url(#dg1)"/><rect x="14" y="16" width="90" height="14" rx="7" fill="rgba(0,0,0,0.3)" stroke="rgba(244,63,94,0.3)" strokeWidth="1"/><rect x="14" y="16" width="75" height="14" rx="7" fill="rgba(244,63,94,0.45)"/><rect x="14" y="36" width="90" height="14" rx="7" fill="rgba(0,0,0,0.3)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/><rect x="14" y="36" width="50" height="14" rx="7" fill="rgba(245,158,11,0.45)"/><rect x="14" y="56" width="90" height="14" rx="7" fill="rgba(0,0,0,0.3)" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/><rect x="14" y="56" width="25" height="14" rx="7" fill="rgba(6,182,212,0.45)"/><path d="M118,65 Q135,52 148,48 Q162,44 175,36 Q188,28 200,18" fill="none" stroke="#f43f5e" strokeWidth="2.5" opacity="0.85"/><path d="M118,65 Q135,58 148,56 Q162,54 175,50 Q188,46 200,40" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"/><circle cx="148" cy="48" r="4" fill="#f43f5e" opacity="0.9"/><circle cx="175" cy="36" r="3" fill="#f59e0b" opacity="0.9"/><circle cx="200" cy="18" r="4" fill="#10b981" opacity="0.9"/><text x="203" y="16" fill="#10b981" fontSize="7" fontWeight="700">FREE</text></svg>`,
  cred: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2"/></linearGradient></defs><rect width="240" height="80" fill="url(#cg1)"/><circle cx="65" cy="42" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/><circle cx="65" cy="42" r="30" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="4" strokeDasharray="120 70" strokeLinecap="round" transform="rotate(-90 65 42)"/><circle cx="65" cy="42" r="20" fill="rgba(0,0,0,0.3)"/><text x="65" y="39" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700">720</text><text x="65" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6">GOOD</text><polygon points="140,42 148,26 156,42 162,34 170,42 176,32 184,42 190,36 198,42 198,62 140,62" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.2" opacity="0.8"/><polygon points="140,42 148,32 156,42 162,38 170,42 176,36 184,42 190,38 198,42 198,62 140,62" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1" opacity="0.6"/><line x1="140" y1="62" x2="198" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/></svg>`,
  sal: `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/></linearGradient></defs><rect width="240" height="80" fill="url(#sg1)"/><rect x="14" y="52" width="22" height="22" rx="3" fill="rgba(124,58,237,0.5)" stroke="rgba(124,58,237,0.7)" strokeWidth="1"/><rect x="42" y="38" width="22" height="36" rx="3" fill="rgba(6,182,212,0.45)" stroke="rgba(6,182,212,0.7)" strokeWidth="1"/><rect x="70" y="28" width="22" height="46" rx="3" fill="rgba(245,158,11,0.45)" stroke="rgba(245,158,11,0.7)" strokeWidth="1"/><rect x="98" y="18" width="22" height="56" rx="3" fill="rgba(16,185,129,0.5)" stroke="rgba(16,185,129,0.7)" strokeWidth="1"/><text x="24" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6">£45k</text><text x="52" y="36" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6">£50k</text><text x="80" y="26" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6">£55k</text><text x="108" y="16" textAnchor="middle" fill="#10b981" fontSize="6" fontWeight="700">£65k</text><path d="M140,55 Q155,48 165,40 Q178,30 198,18" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.8"/><path d="M140,65 Q155,60 165,56 Q178,52 198,46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4,3"/><circle cx="198" cy="18" r="4" fill="#10b981"/><text x="190" y="14" fill="#10b981" fontSize="6" fontWeight="700">+30%</text></svg>`,
};
const BANNER_SVG = {
  tax: `<svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="tb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#03020d"/><stop offset="50%" stopColor="#0a0520"/><stop offset="100%" stopColor="#050d1a"/></linearGradient></defs><rect width="1200" height="200" fill="url(#tb1)"/><circle cx="900" cy="80" r="120" fill="rgba(6,182,212,0.06)"/><circle cx="1100" cy="160" r="80" fill="rgba(124,58,237,0.05)"/><rect x="600" y="20" width="160" height="22" rx="4" fill="rgba(6,182,212,0.12)"/><rect x="600" y="52" width="120" height="12" rx="3" fill="rgba(255,255,255,0.06)"/><rect x="600" y="72" width="140" height="12" rx="3" fill="rgba(255,255,255,0.05)"/><rect x="600" y="92" width="100" height="12" rx="3" fill="rgba(255,255,255,0.04)"/><rect x="600" y="112" width="120" height="12" rx="3" fill="rgba(245,158,11,0.15)"/><rect x="780" y="20" width="200" height="150" rx="10" fill="rgba(0,0,0,0.4)" stroke="rgba(6,182,212,0.2)" strokeWidth="1"/><rect x="796" y="36" width="60" height="8" rx="2" fill="rgba(6,182,212,0.4)"/><rect x="796" y="52" width="168" height="6" rx="2" fill="rgba(255,255,255,0.12)"/><rect x="796" y="64" width="140" height="6" rx="2" fill="rgba(255,255,255,0.09)"/><rect x="796" y="76" width="155" height="6" rx="2" fill="rgba(255,255,255,0.07)"/><rect x="796" y="88" width="120" height="6" rx="2" fill="rgba(124,58,237,0.3)"/><rect x="796" y="102" width="100" height="6" rx="2" fill="rgba(245,158,11,0.3)"/><rect x="796" y="118" width="50" height="20" rx="4" fill="rgba(6,182,212,0.25)"/><line x1="950" y1="40" x2="1150" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/><line x1="950" y1="80" x2="1150" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/><line x1="950" y1="120" x2="1150" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/><rect x="960" y="100" width="20" height="40" rx="2" fill="rgba(6,182,212,0.2)"/><rect x="988" y="70" width="20" height="70" rx="2" fill="rgba(124,58,237,0.2)"/><rect x="1016" y="85" width="20" height="55" rx="2" fill="rgba(245,158,11,0.2)"/><rect x="1044" y="55" width="20" height="85" rx="2" fill="rgba(16,185,129,0.2)"/><rect x="1072" y="75" width="20" height="65" rx="2" fill="rgba(244,63,94,0.2)"/><rect x="1100" y="45" width="20" height="95" rx="2" fill="rgba(6,182,212,0.25)"/></svg>`,
  mort: `<svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="mb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#03020d"/><stop offset="50%" stopColor="#090420"/><stop offset="100%" stopColor="#040d1a"/></linearGradient></defs><rect width="1200" height="200" fill="url(#mb1)"/><polygon points="650,170 650,70 700,30 750,70 750,170" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.35)" strokeWidth="2"/><rect x="668" y="120" width="30" height="50" rx="3" fill="rgba(6,182,212,0.25)"/><polygon points="780,170 780,90 830,55 880,90 880,170" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.3)" strokeWidth="2"/><rect x="800" y="125" width="25" height="45" rx="3" fill="rgba(124,58,237,0.25)"/><polygon points="920,170 920,110 960,80 1000,110 1000,170" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.25)" strokeWidth="2"/><circle cx="400" cy="100" r="2" fill="rgba(6,182,212,0.6)"/><circle cx="450" cy="80" r="2" fill="rgba(6,182,212,0.6)"/><circle cx="500" cy="90" r="2" fill="rgba(6,182,212,0.6)"/><circle cx="550" cy="60" r="2" fill="rgba(6,182,212,0.6)"/><polyline points="400,100 450,80 500,90 550,60 600,70" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeDasharray="4,3"/><path d="M 1050,160 Q 1080,130 1100,120 Q 1130,108 1150,100" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2"/><path d="M 1050,160 Q 1080,148 1100,142 Q 1130,136 1150,132" fill="none" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="5,3"/></svg>`,
  debt: `<svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="db1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#03020d"/><stop offset="50%" stopColor="#110612"/><stop offset="100%" stopColor="#0a0a05"/></linearGradient></defs><rect width="1200" height="200" fill="url(#db1)"/><rect x="600" y="35" width="220" height="18" rx="9" fill="rgba(0,0,0,0.4)" stroke="rgba(244,63,94,0.25)" strokeWidth="1"/><rect x="600" y="35" width="185" height="18" rx="9" fill="rgba(244,63,94,0.3)"/><text x="620" y="48" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Credit Card  £4,800</text><rect x="600" y="65" width="220" height="18" rx="9" fill="rgba(0,0,0,0.4)" stroke="rgba(245,158,11,0.25)" strokeWidth="1"/><rect x="600" y="65" width="130" height="18" rx="9" fill="rgba(245,158,11,0.3)"/><text x="620" y="78" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Car Loan     £3,200</text><rect x="600" y="95" width="220" height="18" rx="9" fill="rgba(0,0,0,0.4)" stroke="rgba(6,182,212,0.25)" strokeWidth="1"/><rect x="600" y="95" width="75" height="18" rx="9" fill="rgba(6,182,212,0.3)"/><text x="620" y="108" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Personal     £1,800</text><path d="M 870,160 Q 920,140 960,120 Q 1000,98 1050,75 Q 1100,52 1150,35" fill="none" stroke="#f43f5e" strokeWidth="2.5" opacity="0.7"/><path d="M 870,160 Q 920,150 960,143 Q 1000,136 1050,125 Q 1100,114 1150,100" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.5"/><circle cx="960" cy="120" r="5" fill="#f43f5e" opacity="0.8"/><circle cx="1050" cy="75" r="5" fill="#f59e0b" opacity="0.8"/><circle cx="1150" cy="35" r="6" fill="#10b981" opacity="0.9"/><text x="1152" y="30" fill="#10b981" fontSize="9" fontWeight="700">PAID!</text></svg>`,
  cred: `<svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="cb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#03020d"/><stop offset="50%" stopColor="#040f12"/><stop offset="100%" stopColor="#040d0a"/></linearGradient></defs><rect width="1200" height="200" fill="url(#cb1)"/><circle cx="680" cy="100" r="75" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16"/><circle cx="680" cy="100" r="75" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="5" strokeDasharray="310 160" strokeLinecap="round" transform="rotate(-90 680 100)"/><circle cx="680" cy="100" r="55" fill="rgba(0,0,0,0.4)"/><text x="680" y="96" textAnchor="middle" fill="#10b981" fontSize="24" fontWeight="700" fontFamily="monospace">750</text><text x="680" y="114" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">VERY GOOD</text><rect x="600" y="185" width="160" height="6" rx="3" fill="rgba(255,255,255,0.05)"/><rect x="600" y="185" width="118" height="6" rx="3" fill="rgba(16,185,129,0.4)"/><rect x="800" y="25" width="360" height="150" rx="8" fill="rgba(0,0,0,0.3)" stroke="rgba(6,182,212,0.1)" strokeWidth="1"/><line x1="820" y1="60" x2="820" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><line x1="860" y1="60" x2="860" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><line x1="900" y1="60" x2="900" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><line x1="800" y1="110" x2="1160" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><polyline points="820,150 860,130 900,140 940,100 980,115 1020,90 1060,80 1100,65 1140,55" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7"/><circle cx="1140" cy="55" r="5" fill="#10b981"/></svg>`,
  sal: `<svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#03020d"/><stop offset="50%" stopColor="#100412"/><stop offset="100%" stopColor="#08060a"/></linearGradient></defs><rect width="1200" height="200" fill="url(#sb1)"/><rect x="600" y="140" width="40" height="40" rx="4" fill="rgba(124,58,237,0.35)" stroke="rgba(124,58,237,0.5)" strokeWidth="1"/><rect x="650" y="110" width="40" height="70" rx="4" fill="rgba(6,182,212,0.35)" stroke="rgba(6,182,212,0.5)" strokeWidth="1"/><rect x="700" y="80" width="40" height="100" rx="4" fill="rgba(245,158,11,0.35)" stroke="rgba(245,158,11,0.5)" strokeWidth="1"/><rect x="750" y="55" width="40" height="125" rx="4" fill="rgba(16,185,129,0.4)" stroke="rgba(16,185,129,0.6)" strokeWidth="1"/><rect x="800" y="35" width="40" height="145" rx="4" fill="rgba(6,182,212,0.45)" stroke="rgba(6,182,212,0.7)" strokeWidth="1"/><text x="620" y="138" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">£45k</text><text x="670" y="108" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">£50k</text><text x="720" y="78" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">£55k</text><text x="770" y="53" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">£60k</text><text x="820" y="33" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="700">£65k</text><path d="M 880,160 Q 940,130 980,110 Q 1040,85 1100,60 Q 1140,44 1170,30" fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.8"/><path d="M 880,175 Q 940,158 980,148 Q 1040,135 1100,122 Q 1140,113 1170,105" fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" strokeDasharray="6,3"/><circle cx="1170" cy="30" r="6" fill="#10b981"/><text x="1150" y="25" fill="#10b981" fontSize="9" fontWeight="700">+44%</text><text x="885" y="158" fill="rgba(255,255,255,0.3)" fontSize="8">Now</text><text x="1158" y="175" fill="rgba(255,255,255,0.3)" fontSize="8">+5yr</text></svg>`,
};


/* ─────────────────────────────────────────────
   CSS Keyframes & Global Styles
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #03020d; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed, #06b6d4); border-radius: 3px; }

  @keyframes aurora {
    0%   { transform: translate(0%,0%) scale(1) rotate(0deg); }
    33%  { transform: translate(8%,-6%) scale(1.08) rotate(3deg); }
    66%  { transform: translate(-6%,8%) scale(0.95) rotate(-2deg); }
    100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0.4); }
    70%  { box-shadow: 0 0 0 14px rgba(6,182,212,0); }
    100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }
  }
  @keyframes glow-border {
    0%,100% { border-color: rgba(6,182,212,0.3); box-shadow: 0 0 15px rgba(6,182,212,0.1); }
    50%      { border-color: rgba(124,58,237,0.6); box-shadow: 0 0 30px rgba(124,58,237,0.2); }
  }
  @keyframes count-up {
    from { opacity:0; transform:scale(0.5); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes particle-float {
    0%,100% { transform:translateY(0) translateX(0); opacity:0.4; }
    25%      { transform:translateY(-30px) translateX(15px); opacity:1; }
    75%      { transform:translateY(20px) translateX(-10px); opacity:0.6; }
  }
  @keyframes border-run {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  @keyframes slide-in-left {
    from { opacity:0; transform:translateX(-50px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slide-in-right {
    from { opacity:0; transform:translateX(50px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .grad-text {
    background: linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #f59e0b 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-text-2 {
    background: linear-gradient(135deg, #34d399 0%, #06b6d4 50%, #818cf8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-text-gold {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .section-enter { animation: slideUp 0.6s ease both; }
  .left-enter    { animation: slide-in-left 0.6s ease both; }
  .right-enter   { animation: slide-in-right 0.6s ease both; }

  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(6,182,212,0.18);
    border-radius: 20px;
    backdrop-filter: blur(12px);
    transition: all 0.35s ease;
  }
  .glass-card:hover {
    border-color: rgba(124,58,237,0.45);
    box-shadow: 0 8px 40px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1);
    transform: translateY(-3px);
  }
  .glow-btn {
    background: linear-gradient(135deg, #06b6d4, #7c3aed);
    border: none; color: #fff; cursor: pointer; font-weight: 600;
    border-radius: 12px; transition: all 0.3s ease; position: relative; overflow: hidden;
  }
  .glow-btn::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    opacity:0; transition:opacity 0.3s;
  }
  .glow-btn:hover::before { opacity:1; }
  .glow-btn:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 12px 40px rgba(6,182,212,0.35); }
  .glow-btn:active { transform:translateY(-1px) scale(0.99); }
  .glow-btn span { position:relative; z-index:1; }

  .toggle-btn {
    background:transparent; border:none; cursor:pointer;
    transition: all 0.25s ease; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-weight:500;
  }
  .toggle-btn.active {
    background: linear-gradient(135deg, rgba(6,182,212,0.25), rgba(124,58,237,0.25));
    border: 1px solid rgba(6,182,212,0.5);
    color: #06b6d4;
  }
  .toggle-btn:hover:not(.active) { background:rgba(255,255,255,0.06); }

  .fi-input {
    width:100%; background:rgba(255,255,255,0.05);
    border:1px solid rgba(6,182,212,0.2); border-radius:10px;
    color:#e2e8f0; font-family:'DM Sans',sans-serif; font-size:0.95rem;
    padding:0.7rem 1rem; outline:none; transition:all 0.3s;
  }
  .fi-input:focus {
    border-color:#06b6d4;
    box-shadow:0 0 0 3px rgba(6,182,212,0.12), 0 0 20px rgba(6,182,212,0.08);
    background:rgba(6,182,212,0.04);
  }
  .fi-select {
    width:100%; background:rgba(10,10,30,0.9);
    border:1px solid rgba(6,182,212,0.2); border-radius:10px;
    color:#e2e8f0; font-family:'DM Sans',sans-serif; font-size:0.95rem;
    padding:0.7rem 1rem; outline:none; transition:all 0.3s; -webkit-appearance:none;
    cursor:pointer;
  }
  .fi-select:focus { border-color:#06b6d4; box-shadow:0 0 0 3px rgba(6,182,212,0.12); }

  .result-card {
    background:linear-gradient(135deg, rgba(6,182,212,0.08), rgba(124,58,237,0.08));
    border:1px solid rgba(6,182,212,0.22); border-radius:14px; padding:1.1rem 1.2rem;
    position:relative; overflow:hidden; transition:all 0.3s; animation: count-up 0.5s ease both;
  }
  .result-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, #06b6d4, #7c3aed, #f59e0b);
  }
  .result-card:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(6,182,212,0.15); }

  .stat-badge {
    display:inline-flex; align-items:center; gap:5px;
    font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em;
    padding:3px 8px; border-radius:6px;
  }
  .nav-item {
    background:transparent; border:none; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500;
    padding:0.42rem 0.85rem; border-radius:8px;
    text-transform:uppercase; letter-spacing:0.05em;
    transition:all 0.2s; white-space:nowrap; color:rgba(148,163,184,0.9);
  }
  .nav-item:hover { color:#06b6d4; background:rgba(6,182,212,0.08); }
  .nav-item.active { color:#0f0f1a; background:linear-gradient(135deg,#06b6d4,#7c3aed); font-weight:600; }

  .debt-entry {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
    border-radius:12px; padding:1rem; margin-bottom:0.7rem; position:relative;
    animation:slideUp 0.4s ease both;
  }
  .section-wrapper { animation: slideUp 0.6s ease both; }

  .chart-container { animation: fadeIn 0.8s ease 0.3s both; }

  .aurora-blob {
    position:absolute; border-radius:50%; filter:blur(80px);
    animation: aurora 14s ease-in-out infinite; pointer-events:none;
  }
  .tip-item {
    background:rgba(255,255,255,0.025); border-left:3px solid #06b6d4;
    border-radius:0 10px 10px 0; padding:0.85rem 1.1rem;
    margin-bottom:0.65rem; font-size:0.86rem; line-height:1.65; color:#94a3b8;
    transition:all 0.3s;
  }
  .tip-item:hover { border-left-color:#a855f7; color:#e2e8f0; background:rgba(255,255,255,0.04); }
  .row-stat { display:flex; justify-content:space-between; align-items:center; padding:0.58rem 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.87rem; }
  .row-stat:last-child { border-bottom:none; }
  .progress-bar-wrap { background:rgba(255,255,255,0.06); border-radius:100px; height:8px; overflow:hidden; margin-top:6px; }
  .progress-bar-fill { height:100%; border-radius:100px; transition:width 1.2s cubic-bezier(0.34,1.56,0.64,1); }
`;

/* ─────────────────────────────────────────────
   2026 TAX RATES
───────────────────────────────────────────── */
const UK_2026 = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  tapersAbove: 100000,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45,
  niPrimThreshold: 12570,
  niUpperThreshold: 50270,
  niBasicRate: 0.08,
  niHigherRate: 0.02,
  selfEmployedNI4Basic: 0.06,
  selfEmployedNI4Higher: 0.02,
};

const US_2026_BRACKETS = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  hoh: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

const US_2026 = {
  stdDeduction: { single: 15000, married: 30000, hoh: 22500 },
  ssWageBase: 176100,
  ssRate: 0.062,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: 200000,
  stateRates: { ca: 0.093, ny: 0.0685, tx: 0, fl: 0, wa: 0, il: 0.0495, ot: 0.045 },
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const fmt = (n, curr) => {
  const sym = curr === "gbp" || curr === "uk" ? "£" : "$";
  return sym + Math.round(n).toLocaleString();
};
const fmtPct = n => n.toFixed(1) + "%";

const COLORS = {
  cyan: "#06b6d4", purple: "#7c3aed", gold: "#f59e0b",
  green: "#10b981", red: "#f43f5e", orange: "#fb923c",
  indigo: "#6366f1", pink: "#ec4899", teal: "#14b8a6",
};
const CHART_COLORS = ["#06b6d4","#7c3aed","#f59e0b","#10b981","#f43f5e","#fb923c","#6366f1"];

const CustomTooltip = ({ active, payload, label, curr = "gbp" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(10,10,30,0.96)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem" }}>
      {label && <p style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#06b6d4", fontFamily: "Rajdhani,monospace", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? (p.name?.toLowerCase().includes("%") ? fmtPct(p.value) : fmt(p.value, curr)) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   AURORA BACKGROUND
───────────────────────────────────────────── */
function AuroraBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#03020d 0%,#06041a 25%,#03081e 50%,#060318 75%,#03020d 100%)" }} />
      <div className="aurora-blob" style={{ width: 700, height: 700, background: "rgba(124,58,237,0.12)", top: "-200px", left: "-200px", animationDuration: "16s" }} />
      <div className="aurora-blob" style={{ width: 550, height: 550, background: "rgba(6,182,212,0.1)", bottom: "-100px", right: "-100px", animationDuration: "20s", animationDelay: "-7s" }} />
      <div className="aurora-blob" style={{ width: 400, height: 400, background: "rgba(245,158,11,0.07)", top: "40%", left: "45%", animationDuration: "18s", animationDelay: "-3s" }} />
      <div className="aurora-blob" style={{ width: 300, height: 300, background: "rgba(16,185,129,0.06)", top: "20%", right: "20%", animationDuration: "22s", animationDelay: "-12s" }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",
        backgroundSize: "60px 60px"
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ active, setActive }) {
  const tools = [
    { id: "tax", label: "💷 Tax Calc" },
    { id: "mort", label: "🏠 Mortgage" },
    { id: "debt", label: "💳 Debt Planner" },
    { id: "cred", label: "📊 Credit Score" },
    { id: "sal", label: "💼 Salary Helper" },
  ];
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(3,2,13,0.88)", backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(6,182,212,0.12)",
      height: 66, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem"
    }}>
      <div
        onClick={() => setActive("home")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse-ring 2.5s infinite", fontSize: "0.85rem", fontWeight: 700,
          color: "#fff", fontFamily: "Rajdhani,sans-serif"
        }}>AI</div>
        <div>
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "1.1rem" }} className="grad-text">aimoneytools</span>
          <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 400, fontSize: "1.1rem", color: "#94a3b8" }}>.pro</span>
        </div>
      </div>
      <nav style={{ display: "flex", gap: "0.15rem", overflowX: "auto", scrollbarWidth: "none" }}>
        {tools.map(t => (
          <button key={t.id} className={`nav-item ${active === t.id ? "active" : ""}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </nav>
    </header>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function AnimCounter({ target, prefix = "", suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero({ setActive }) {
  const cards = [
    { id: "tax", icon: "💷", name: "Tax Calculator", desc: "UK & US income tax with 2026 rates", color: "#06b6d4" },
    { id: "mort", icon: "🏠", name: "Mortgage Calc", desc: "Repayments, LTV & amortisation", color: "#7c3aed" },
    { id: "debt", icon: "💳", name: "Debt Planner", desc: "Avalanche & snowball strategies", color: "#f59e0b" },
    { id: "cred", icon: "📊", name: "Credit Advisor", desc: "Personalised score improvement", color: "#10b981" },
    { id: "sal", icon: "💼", name: "Salary Helper", desc: "AI negotiation scripts & strategy", color: "#f43f5e" },
  ];
  const stats = [
    { label: "Free Tools", val: 5, suffix: "" },
    { label: "2026 Rates", val: 100, suffix: "%" },
    { label: "UK Tax Brackets", val: 4, suffix: "" },
    { label: "US States Covered", val: 6, suffix: "" },
  ];
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6rem 1.5rem 3rem" }}>
      <div style={{ maxWidth: 1040, width: "100%" }} className="section-enter">
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
          color: "#06b6d4", fontSize: "0.72rem", fontWeight: 700, padding: "0.38rem 1rem",
          borderRadius: 100, letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: "1.8rem", animation: "glow-border 3s ease infinite"
        }}>
          ⚡ UK & USA · AI-Powered Finance Tools · 2026 Rates
        </div>

        <h1 style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: 1.06, marginBottom: "1.3rem" }}>
          <span className="grad-text">Master Your Money</span><br />
          <span style={{ color: "#e2e8f0" }}>With </span>
          <span className="grad-text-gold">Intelligence</span>
        </h1>

        <p style={{ fontSize: "clamp(0.95rem,2vw,1.15rem)", color: "#64748b", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.85, fontWeight: 300, fontFamily: "DM Sans,sans-serif" }}>
          Five powerful free financial tools built for UK & USA audiences — updated with 2026 tax rates, mortgage rules, and salary data.
        </p>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.85rem", maxWidth: 600, margin: "0 auto 2.5rem" }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: "0.9rem 0.5rem" }}>
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "1.6rem" }} className="grad-text">
                <AnimCounter target={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tool Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "0.85rem", marginBottom: "2.2rem" }}>
          {cards.map((c, i) => (
            <div
              key={c.id}
              className="glass-card"
              onClick={() => setActive(c.id)}
              style={{ cursor: "pointer", padding: "1rem 0.8rem", textAlign: "left", animationDelay: `${i * 0.08}s` }}
            >
              <div style={{ width: "100%", height: 72, borderRadius: 8, overflow: "hidden", marginBottom: "0.7rem", position: "relative", background: `${c.color}14` }}
                dangerouslySetInnerHTML={{ __html: CARD_SVG[c.id] }} />
              <div style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.72rem", color: c.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{c.icon} {c.name}</div>
              <div style={{ fontSize: "0.73rem", color: "#64748b", lineHeight: 1.5, fontFamily: "DM Sans,sans-serif" }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <button className="glow-btn" onClick={() => setActive("tax")} style={{ padding: "0.95rem 2.4rem", fontSize: "0.9rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
          <span>⚡ LAUNCH FREE TOOLS</span>
        </button>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TOOL BANNER
───────────────────────────────────────────── */
function ToolBanner({ icon, title, accent, desc, toolKey, flags }) {
  return (
    <div style={{
      position: "relative", height: 200, borderRadius: 20, overflow: "hidden",
      marginBottom: "2rem", border: "1px solid rgba(6,182,212,0.18)"
    }}>
      <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: BANNER_SVG[toolKey] || BANNER_SVG.tax }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg,rgba(3,2,13,0.95) 0%,rgba(3,2,13,0.6) 55%,transparent 100%)",
        display: "flex", alignItems: "center", padding: "2rem 2.5rem"
      }}>
        <div style={{ fontSize: "3rem", marginRight: "1.4rem", filter: "drop-shadow(0 0 20px rgba(6,182,212,0.5))", animation: "float 3s ease-in-out infinite" }}>{icon}</div>
        <div>
          <h2 style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,3vw,2.2rem)", marginBottom: "0.4rem" }}>
            <span className="grad-text">{accent}</span> <span style={{ color: "#e2e8f0" }}>{title}</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", fontFamily: "DM Sans,sans-serif", fontWeight: 300, lineHeight: 1.6 }}>{desc}</p>
          {flags && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
              {flags.map((f, i) => (
                <span key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.73rem", padding: "0.24rem 0.7rem", borderRadius: 100, color: "#94a3b8" }}>{f}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LABEL & INPUT HELPERS
───────────────────────────────────────────── */
function FL({ children }) {
  return <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem", fontFamily: "Rajdhani,sans-serif" }}>{children}</label>;
}
function FG({ children, style }) {
  return <div style={{ marginBottom: "1.05rem", ...style }}>{children}</div>;
}
function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
      <span style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#06b6d4", letterSpacing: "0.15em", textTransform: "uppercase" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(6,182,212,0.3),transparent)" }} />
    </div>
  );
}
function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.16)", borderRadius: 10, overflow: "hidden" }}>
      {options.map(o => (
        <button key={o.value} className={`toggle-btn ${value === o.value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
          style={{ flex: 1, padding: "0.58rem 0.5rem", fontSize: "0.82rem", color: value === o.value ? "#06b6d4" : "#64748b" }}
        >{o.label}</button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAX CALCULATOR
───────────────────────────────────────────── */
function TaxCalculator() {
  const [country, setCountry] = useState("uk");
  const [income, setIncome] = useState("");
  const [empType, setEmpType] = useState("e");
  const [filing, setFiling] = useState("single");
  const [state, setState] = useState("ca");
  const [result, setResult] = useState(null);

  const calcUKTax = (inc) => {
    const r = UK_2026;
    let pa = r.personalAllowance;
    if (inc > r.tapersAbove) pa = Math.max(0, pa - (inc - r.tapersAbove) / 2);
    const taxable = Math.max(0, inc - pa);
    const basic = Math.min(taxable, r.basicRateLimit - r.personalAllowance) * r.basicRate;
    const higher = taxable > (r.basicRateLimit - r.personalAllowance)
      ? Math.min(taxable - (r.basicRateLimit - r.personalAllowance), r.higherRateLimit - r.basicRateLimit) * r.higherRate : 0;
    const addl = inc > r.higherRateLimit ? (inc - r.higherRateLimit) * r.additionalRate : 0;
    const incomeTax = basic + higher + addl;
    let ni = 0;
    if (empType === "e") {
      if (inc > r.niPrimThreshold) ni = (Math.min(inc, r.niUpperThreshold) - r.niPrimThreshold) * r.niBasicRate;
      if (inc > r.niUpperThreshold) ni += (inc - r.niUpperThreshold) * r.niHigherRate;
    } else {
      if (inc > r.niPrimThreshold) ni = (Math.min(inc, r.niUpperThreshold) - r.niPrimThreshold) * r.selfEmployedNI4Basic;
      if (inc > r.niUpperThreshold) ni += (inc - r.niUpperThreshold) * r.selfEmployedNI4Higher;
    }
    const total = incomeTax + ni;
    const takeHome = inc - total;
    const eff = (total / inc) * 100;

    const bracketData = [
      { bracket: "Personal Allow.", amount: Math.min(inc, pa), tax: 0, rate: "0%" },
      { bracket: "Basic Rate", amount: Math.min(Math.max(inc - pa, 0), r.basicRateLimit - pa), tax: basic, rate: "20%" },
      { bracket: "Higher Rate", amount: Math.min(Math.max(inc - r.basicRateLimit, 0), r.higherRateLimit - r.basicRateLimit), tax: higher, rate: "40%" },
      { bracket: "Addl. Rate", amount: Math.max(inc - r.higherRateLimit, 0), tax: addl, rate: "45%" },
    ].filter(b => b.amount > 0);

    const pieData = [
      { name: "Income Tax", value: Math.round(incomeTax) },
      { name: empType === "e" ? "Nat. Insurance" : "NI Class 4", value: Math.round(ni) },
      { name: "Take Home", value: Math.round(takeHome) },
    ];

    const monthlyData = [
      { name: "Gross", value: inc / 12 },
      { name: "Tax", value: incomeTax / 12 },
      { name: "NI", value: ni / 12 },
      { name: "Net", value: takeHome / 12 },
    ];

    return { country: "uk", inc, incomeTax, ni, total, takeHome, eff, pa, basic, higher, addl, bracketData, pieData, monthlyData };
  };

  const calcUSTax = (inc) => {
    const sd = US_2026.stdDeduction[filing];
    const taxable = Math.max(0, inc - sd);
    const brackets = US_2026_BRACKETS[filing];
    let fed = 0, prev = 0;
    const bracketData = [];
    for (const b of brackets) {
      if (taxable <= prev) break;
      const amt = Math.min(taxable, b.limit) - prev;
      const tax = amt * b.rate;
      if (amt > 0) bracketData.push({ bracket: `${(b.rate * 100).toFixed(0)}%`, amount: Math.round(amt), tax: Math.round(tax), rate: `${(b.rate * 100).toFixed(0)}%` });
      fed += tax;
      prev = b.limit;
    }
    const ss = Math.min(inc, US_2026.ssWageBase) * US_2026.ssRate;
    const med = inc * US_2026.medicareRate + (inc > US_2026.additionalMedicareThreshold ? (inc - US_2026.additionalMedicareThreshold) * US_2026.additionalMedicareRate : 0);
    const fica = ss + med;
    const stTax = inc * (US_2026.stateRates[state] || 0);
    const total = fed + fica + stTax;
    const takeHome = inc - total;
    const eff = (total / inc) * 100;

    const pieData = [
      { name: "Federal Tax", value: Math.round(fed) },
      { name: "FICA (SS+Med)", value: Math.round(fica) },
      { name: "State Tax", value: Math.round(stTax) },
      { name: "Take Home", value: Math.round(takeHome) },
    ];
    const monthlyData = [
      { name: "Gross", value: inc / 12 },
      { name: "Federal", value: fed / 12 },
      { name: "FICA", value: fica / 12 },
      { name: "State", value: stTax / 12 },
      { name: "Net", value: takeHome / 12 },
    ];
    return { country: "us", inc, fed, fica, ss, med, stTax, total, takeHome, eff, sd, bracketData, pieData, monthlyData };
  };

  const calculate = () => {
    const inc = parseFloat(income);
    if (!inc || inc <= 0) return alert("Please enter a valid income");
    setResult(country === "uk" ? calcUKTax(inc) : calcUSTax(inc));
  };

  const curr = country;
  return (
    <div className="section-wrapper" style={{ paddingTop: 66 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ToolBanner icon="💷" accent="AI Tax" title="Calculator" desc="UK 2026/27 and US 2026 rates — income tax, NI/FICA, take-home pay with full bracket visualisation." toolKey="tax" flags={["🇬🇧 UK 2026/27", "🇺🇸 USA 2026", "2026 Rates"]} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          {/* INPUT */}
          <div className="glass-card left-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Details</SectionTitle>
            <FG>
              <FL>Country</FL>
              <Toggle options={[{ value: "uk", label: "🇬🇧 United Kingdom" }, { value: "us", label: "🇺🇸 United States" }]} value={country} onChange={setCountry} />
            </FG>
            <FG><FL>Annual Gross Income</FL><input className="fi-input" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 65000" min="0" /></FG>
            {country === "uk" && (
              <FG>
                <FL>Employment Type</FL>
                <select className="fi-select" value={empType} onChange={e => setEmpType(e.target.value)}>
                  <option value="e">Employed (PAYE)</option>
                  <option value="s">Self-Employed</option>
                </select>
              </FG>
            )}
            {country === "us" && (<>
              <FG>
                <FL>Filing Status</FL>
                <select className="fi-select" value={filing} onChange={e => setFiling(e.target.value)}>
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </FG>
              <FG>
                <FL>State</FL>
                <select className="fi-select" value={state} onChange={e => setState(e.target.value)}>
                  <option value="ca">California (9.3%)</option>
                  <option value="ny">New York (6.85%)</option>
                  <option value="tx">Texas (0%)</option>
                  <option value="fl">Florida (0%)</option>
                  <option value="wa">Washington (0%)</option>
                  <option value="il">Illinois (4.95%)</option>
                  <option value="ot">Other (~4.5%)</option>
                </select>
              </FG>
            </>)}
            <button className="glow-btn" onClick={calculate} style={{ width: "100%", padding: "0.95rem", fontSize: "0.88rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
              <span>⚡ CALCULATE MY TAX</span>
            </button>

            {/* 2026 Rates Info */}
            <div style={{ marginTop: "1.2rem", background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 12, padding: "1rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "Rajdhani,sans-serif" }}>
                {country === "uk" ? "🇬🇧 UK 2026/27 Rates" : "🇺🇸 US 2026 Federal Rates"}
              </div>
              {country === "uk" ? (
                [["Personal Allowance", "£12,570"], ["Basic Rate (20%)", "£12,571–£50,270"], ["Higher Rate (40%)", "£50,271–£125,140"], ["Additional Rate (45%)", "£125,141+"], ["NI Employee", "8% / 2%"]].map(([k, v]) => (
                  <div key={k} className="row-stat"><span style={{ color: "#64748b", fontFamily: "DM Sans,sans-serif", fontSize: "0.81rem" }}>{k}</span><span style={{ color: "#06b6d4", fontFamily: "Rajdhani,monospace", fontSize: "0.82rem", fontWeight: 600 }}>{v}</span></div>
                ))
              ) : (
                [["Standard Deduction (S)", "$15,000"], ["10% Bracket", "to $11,925"], ["12% Bracket", "to $48,475"], ["22% Bracket", "to $103,350"], ["SS Wage Base", "$176,100"]].map(([k, v]) => (
                  <div key={k} className="row-stat"><span style={{ color: "#64748b", fontFamily: "DM Sans,sans-serif", fontSize: "0.81rem" }}>{k}</span><span style={{ color: "#06b6d4", fontFamily: "Rajdhani,monospace", fontSize: "0.82rem", fontWeight: 600 }}>{v}</span></div>
                ))
              )}
            </div>
          </div>

          {/* RESULTS */}
          <div className="glass-card right-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Tax Breakdown</SectionTitle>
            {!result ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#334155" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🧮</div>
                <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem" }}>Enter your income and calculate</p>
              </div>
            ) : (
              <div className="chart-container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
                  {[
                    { label: "Annual Take Home", val: fmt(result.takeHome, curr), color: "#10b981" },
                    { label: "Monthly Net Pay", val: fmt(result.takeHome / 12, curr), color: "#06b6d4" },
                    { label: "Total Deductions", val: fmt(result.total, curr), color: "#f43f5e" },
                    { label: "Effective Rate", val: fmtPct(result.eff), color: "#f59e0b" },
                  ].map((c, i) => (
                    <div key={i} className="result-card" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "DM Sans,sans-serif" }}>{c.label}</div>
                      <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "1.5rem", fontWeight: 700, color: c.color, marginTop: 4 }}>{c.val}</div>
                    </div>
                  ))}
                </div>

                {/* PIE CHART */}
                <SectionTitle>Tax Composition</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={result.pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {result.pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip curr={curr} />} />
                    <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>

                {/* BRACKET BAR CHART */}
                <SectionTitle>Tax By Bracket</SectionTitle>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={result.bracketData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="bracket" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, curr)} width={70} />
                    <Tooltip content={<CustomTooltip curr={curr} />} />
                    <Bar dataKey="tax" name="Tax Paid" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="amount" name="Income in Band" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* MONTHLY COMPARISON */}
                <SectionTitle>Monthly Breakdown</SectionTitle>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={result.monthlyData} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, curr)} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={55} />
                    <Tooltip content={<CustomTooltip curr={curr} />} />
                    <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
                      {result.monthlyData.map((d, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MORTGAGE CALCULATOR
───────────────────────────────────────────── */
function MortgageCalc() {
  const [curr, setCurr] = useState("gbp");
  const [propVal, setPropVal] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const pv = parseFloat(propVal), dp = parseFloat(deposit) || 0;
    const rt = parseFloat(rate), tm = parseInt(term), inc = parseFloat(income) || 0;
    if (!pv || !rt || !tm) return alert("Please enter property value, rate and term");
    const loan = pv - dp;
    if (loan <= 0) return alert("Deposit cannot exceed property value");
    const mr = (rt / 100) / 12, n = tm * 12;
    const mp = loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
    const totPaid = mp * n, totInt = totPaid - loan, ltv = (loan / pv) * 100;
    const afford = curr === "gbp" ? loan <= inc * 4.5 : mp <= (inc / 12) * 0.28;

    // Amortisation schedule
    const amort = [];
    let bal = loan, cumInt = 0, cumPrin = 0;
    for (let y = 1; y <= Math.min(tm, 30); y++) {
      let yearInt = 0, yearPrin = 0;
      for (let m = 0; m < 12; m++) {
        const i = bal * mr; const p = mp - i;
        yearInt += i; yearPrin += p; bal = Math.max(0, bal - p);
      }
      cumInt += yearInt; cumPrin += yearPrin;
      amort.push({ year: `Yr ${y}`, balance: Math.round(bal), cumInterest: Math.round(cumInt), cumPrincipal: Math.round(cumPrin) });
    }

    // Rate comparison
    const rateComp = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0].map(r => {
      const mr2 = (r / 100) / 12;
      const mp2 = loan * (mr2 * Math.pow(1 + mr2, n)) / (Math.pow(1 + mr2, n) - 1);
      return { rate: `${r}%`, monthly: Math.round(mp2), totalCost: Math.round(mp2 * n) };
    });

    setResult({ loan, dp, pv, mp, totPaid, totInt, ltv, rt, tm, afford, amort, rateComp, inc });
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: 66 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ToolBanner icon="🏠" accent="Mortgage" title="Affordability Calculator" desc="Monthly repayments, LTV ratio, 30-year amortisation chart, and rate comparison for UK & USA home loans." toolKey="mort" flags={["🇬🇧 UK Mortgages", "🇺🇸 US Mortgages", "Amortisation"]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          <div className="glass-card left-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Mortgage Details</SectionTitle>
            <FG><FL>Currency</FL><Toggle options={[{ value: "gbp", label: "🇬🇧 GBP (£)" }, { value: "usd", label: "🇺🇸 USD ($)" }]} value={curr} onChange={setCurr} /></FG>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              <FG><FL>Property Value</FL><input className="fi-input" type="number" value={propVal} onChange={e => setPropVal(e.target.value)} placeholder="e.g. 350000" min="0" /></FG>
              <FG><FL>Deposit / Down Payment</FL><input className="fi-input" type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="e.g. 35000" min="0" /></FG>
              <FG><FL>Interest Rate (%)</FL><input className="fi-input" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 4.5" step="0.01" min="0" /></FG>
              <FG><FL>Term (Years)</FL><input className="fi-input" type="number" value={term} onChange={e => setTerm(e.target.value)} placeholder="e.g. 25" min="1" max="40" /></FG>
            </div>
            <FG><FL>Annual Household Income (affordability check)</FL><input className="fi-input" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 65000" min="0" /></FG>
            <button className="glow-btn" onClick={calculate} style={{ width: "100%", padding: "0.95rem", fontSize: "0.88rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
              <span>🏠 CALCULATE MORTGAGE</span>
            </button>
          </div>

          <div className="glass-card right-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Mortgage Results</SectionTitle>
            {!result ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#334155" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🏡</div>
                <p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem" }}>Enter property details to see your repayments</p>
              </div>
            ) : (
              <div className="chart-container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
                  {[
                    { label: "Monthly Payment", val: fmt(result.mp, curr), color: "#06b6d4" },
                    { label: "Total Interest", val: fmt(result.totInt, curr), color: "#f43f5e" },
                    { label: "LTV Ratio", val: fmtPct(result.ltv), color: result.ltv > 90 ? "#f43f5e" : result.ltv > 75 ? "#f59e0b" : "#10b981" },
                    { label: "Affordability", val: result.afford ? "✅ OK" : "⚠️ Stretched", color: result.afford ? "#10b981" : "#f43f5e" },
                  ].map((c, i) => (
                    <div key={i} className="result-card" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "DM Sans,sans-serif" }}>{c.label}</div>
                      <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "1.4rem", fontWeight: 700, color: c.color, marginTop: 4 }}>{c.val}</div>
                    </div>
                  ))}
                </div>

                <SectionTitle>30-Year Amortisation</SectionTitle>
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={result.amort}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 9 }} interval={4} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, curr)} width={72} />
                    <Tooltip content={<CustomTooltip curr={curr} />} />
                    <Legend formatter={v => <span style={{ color: "#94a3b8", fontSize: "0.77rem" }}>{v}</span>} />
                    <Area type="monotone" dataKey="balance" name="Balance" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth={2} />
                    <Line type="monotone" dataKey="cumInterest" name="Cum. Interest" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cumPrincipal" name="Cum. Principal" stroke="#10b981" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>

                <SectionTitle>Rate Comparison Chart</SectionTitle>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={result.rateComp} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="rate" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, curr)} width={68} />
                    <Tooltip content={<CustomTooltip curr={curr} />} />
                    <Bar dataKey="monthly" name="Monthly Payment" radius={[4, 4, 0, 0]}>
                      {result.rateComp.map((d, i) => <Cell key={i} fill={d.rate === `${result.rt}%` ? "#06b6d4" : "#7c3aed55"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEBT PLANNER
───────────────────────────────────────────── */
function DebtPlanner() {
  const [debts, setDebts] = useState([
    { id: 1, name: "Credit Card", bal: "", apr: "", min: "", curr: "gbp" },
    { id: 2, name: "Car Loan", bal: "", apr: "", min: "", curr: "gbp" },
  ]);
  const [extra, setExtra] = useState("");
  const [strategy, setStrategy] = useState("av");
  const [result, setResult] = useState(null);
  const nextId = useRef(3);

  const addDebt = () => {
    const names = ["Personal Loan", "Student Loan", "Store Card", "Overdraft", "Mortgage"];
    setDebts(d => [...d, { id: nextId.current++, name: names[d.length % names.length], bal: "", apr: "", min: "", curr: "gbp" }]);
  };
  const rmDebt = id => setDebts(d => d.filter(x => x.id !== id));
  const updateDebt = (id, k, v) => setDebts(d => d.map(x => x.id === id ? { ...x, [k]: v } : x));

  const simulate = (sorted, extraPay) => {
    const bals = sorted.map(d => ({ ...d, bal: parseFloat(d.bal) }));
    let months = 0, totInt = 0;
    const mdata = [], totalStart = bals.reduce((s, d) => s + d.bal, 0);
    while (bals.some(d => d.bal > 0) && months < 360) {
      months++;
      let mi = 0, ex = extraPay;
      for (const d of bals) {
        if (d.bal <= 0) continue;
        const i = d.bal * (parseFloat(d.apr) / 100) / 12;
        mi += i; d.bal += i;
        d.bal = Math.max(0, d.bal - Math.min(parseFloat(d.min), d.bal));
      }
      for (const d of bals) {
        if (d.bal <= 0 || ex <= 0) continue;
        const p = Math.min(ex, d.bal); ex -= p; d.bal = Math.max(0, d.bal - p);
      }
      totInt += mi;
      mdata.push({ month: months, total: Math.round(bals.reduce((s, d) => s + d.bal, 0)) });
    }
    return { months, years: (months / 12).toFixed(1), totInt, mdata, totalStart };
  };

  const calculate = () => {
    const valid = debts.filter(d => d.bal && d.apr && d.min && parseFloat(d.bal) > 0);
    if (!valid.length) return alert("Add at least one complete debt entry");
    const ex = parseFloat(extra) || 0;
    const sorted = [...valid].sort(strategy === "av" ? (a, b) => parseFloat(b.apr) - parseFloat(a.apr) : (a, b) => parseFloat(a.bal) - parseFloat(b.bal));
    const r = simulate(sorted, ex);
    const avR = simulate([...valid].sort((a, b) => parseFloat(b.apr) - parseFloat(a.apr)), ex);
    const swR = simulate([...valid].sort((a, b) => parseFloat(a.bal) - parseFloat(b.bal)), ex);

    const debtComp = valid.map(d => ({ name: d.name, balance: parseFloat(d.bal), apr: parseFloat(d.apr), min: parseFloat(d.min), interest: parseFloat(d.bal) * parseFloat(d.apr) / 100 }));
    setResult({ ...r, sorted, debtComp, avR, swR, curr: valid[0]?.curr || "gbp" });
  };

  const c = result?.curr || "gbp";
  return (
    <div className="section-wrapper" style={{ paddingTop: 66 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ToolBanner icon="💳" accent="Debt Payoff" title="Planner" desc="Add your debts and get an Avalanche or Snowball payoff plan with strategy comparison charts." toolKey="debt" flags={["Avalanche Strategy", "Snowball Strategy", "Visual Payoff Chart"]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          <div className="glass-card left-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Debts</SectionTitle>
            {debts.map(d => (
              <div key={d.id} className="debt-entry">
                <button onClick={() => rmDebt(d.id)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.25)", color: "#f43f5e", width: 24, height: 24, borderRadius: 6, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "Rajdhani,sans-serif" }}>{d.name || `Debt #${d.id}`}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.55rem", marginBottom: "0.55rem" }}>
                  {[["Name", "name", d.name, "text", "Credit Card"], ["Balance", "bal", d.bal, "number", "5000"], ["APR %", "apr", d.apr, "number", "19.9"]].map(([l, k, v, t, ph]) => (
                    <div key={k}><div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#06b6d4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3, fontFamily: "Rajdhani,sans-serif" }}>{l}</div>
                      <input className="fi-input" type={t} value={v} onChange={e => updateDebt(d.id, k, e.target.value)} placeholder={ph} style={{ padding: "0.5rem 0.65rem", fontSize: "0.82rem" }} /></div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
                  <div><div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#06b6d4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3, fontFamily: "Rajdhani,sans-serif" }}>Min /mo</div>
                    <input className="fi-input" type="number" value={d.min} onChange={e => updateDebt(d.id, "min", e.target.value)} placeholder="100" style={{ padding: "0.5rem 0.65rem", fontSize: "0.82rem" }} /></div>
                  <div><div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#06b6d4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3, fontFamily: "Rajdhani,sans-serif" }}>Currency</div>
                    <select className="fi-select" value={d.curr} onChange={e => updateDebt(d.id, "curr", e.target.value)} style={{ padding: "0.5rem 0.65rem", fontSize: "0.82rem" }}><option value="gbp">🇬🇧 £</option><option value="usd">🇺🇸 $</option></select></div>
                </div>
              </div>
            ))}
            <button onClick={addDebt} style={{ width: "100%", background: "transparent", border: "1px dashed rgba(6,182,212,0.3)", color: "#06b6d4", borderRadius: 10, padding: "0.7rem", cursor: "pointer", fontSize: "0.87rem", marginBottom: "0.9rem", transition: "all 0.3s", fontFamily: "DM Sans,sans-serif" }}>＋ Add Another Debt</button>
            <FG><FL>Extra Monthly Payment</FL><input className="fi-input" type="number" value={extra} onChange={e => setExtra(e.target.value)} placeholder="e.g. 200 additional per month" min="0" /></FG>
            <FG>
              <FL>Strategy</FL>
              <Toggle options={[{ value: "av", label: "🔥 Avalanche" }, { value: "sw", label: "❄️ Snowball" }]} value={strategy} onChange={setStrategy} />
              <div style={{ fontSize: "0.77rem", color: "#64748b", marginTop: "0.4rem", fontFamily: "DM Sans,sans-serif" }}>
                {strategy === "av" ? "🔥 Highest APR first — saves the most money in interest" : "❄️ Smallest balance first — faster psychological wins"}
              </div>
            </FG>
            <button className="glow-btn" onClick={calculate} style={{ width: "100%", padding: "0.95rem", fontSize: "0.88rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
              <span>💳 BUILD MY PAYOFF PLAN</span>
            </button>
          </div>

          <div className="glass-card right-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Payoff Plan</SectionTitle>
            {!result ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#334155" }}><div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>📋</div><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem" }}>Add debts and calculate your payoff plan</p></div>
            ) : (
              <div className="chart-container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
                  {[
                    { label: "Debt Free In", val: `${result.years} yrs`, color: "#10b981" },
                    { label: "Total Debt", val: fmt(result.totalStart, c), color: "#f43f5e" },
                    { label: "Total Interest", val: fmt(result.totInt, c), color: "#f59e0b" },
                    { label: result.months + " Months", val: "Timeline", color: "#06b6d4" },
                  ].map((x, i) => (
                    <div key={i} className="result-card" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "DM Sans,sans-serif" }}>{x.label}</div>
                      <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "1.5rem", fontWeight: 700, color: x.color, marginTop: 4 }}>{x.val}</div>
                    </div>
                  ))}
                </div>

                <SectionTitle>Debt Payoff Curve</SectionTitle>
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={result.mdata}>
                    <defs>
                      <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => `Mo${v}`} interval={Math.floor(result.mdata.length / 8)} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, c)} width={72} />
                    <Tooltip content={<CustomTooltip curr={c} />} />
                    <Area type="monotone" dataKey="total" name="Remaining Debt" stroke="#f43f5e" strokeWidth={2} fill="url(#debtGrad)" />
                  </AreaChart>
                </ResponsiveContainer>

                <SectionTitle>Strategy Comparison</SectionTitle>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={[
                    { strategy: "Avalanche", months: result.avR.months, interest: Math.round(result.avR.totInt) },
                    { strategy: "Snowball", months: result.swR.months, interest: Math.round(result.swR.totInt) },
                  ]} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="strategy" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, c)} width={72} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip curr={c} />} />
                    <Legend formatter={v => <span style={{ color: "#94a3b8", fontSize: "0.77rem" }}>{v}</span>} />
                    <Bar yAxisId="left" dataKey="interest" name="Total Interest" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="months" name="Months" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <SectionTitle>Debt Breakdown by APR</SectionTitle>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={result.debtComp} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => fmt(v, c)} width={68} />
                    <Tooltip content={<CustomTooltip curr={c} />} />
                    <Bar dataKey="balance" name="Balance" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interest" name="Annual Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREDIT ADVISOR
───────────────────────────────────────────── */
function CreditAdvisor() {
  const [country, setCountry] = useState("uk");
  const [score, setScore] = useState("");
  const [missed, setMissed] = useState("0");
  const [util, setUtil] = useState("lo");
  const [hist, setHist] = useState("lo");
  const [apps, setApps] = useState("no");
  const [result, setResult] = useState(null);

  const analyse = () => {
    const sc = parseInt(score);
    if (!sc || sc <= 0) return alert("Please enter your credit score");
    const max = country === "uk" ? 999 : 850;
    let col, lbl;
    if (country === "uk") {
      if (sc <= 560) { col = "#f43f5e"; lbl = "POOR"; }
      else if (sc <= 720) { col = "#fb923c"; lbl = "FAIR"; }
      else if (sc <= 880) { col = "#f59e0b"; lbl = "GOOD"; }
      else { col = "#10b981"; lbl = "EXCELLENT"; }
    } else {
      if (sc < 580) { col = "#f43f5e"; lbl = "POOR"; }
      else if (sc < 670) { col = "#fb923c"; lbl = "FAIR"; }
      else if (sc < 740) { col = "#f59e0b"; lbl = "GOOD"; }
      else if (sc < 800) { col = "#a3e635"; lbl = "VERY GOOD"; }
      else { col = "#10b981"; lbl = "EXCEPTIONAL"; }
    }
    const payS = missed === "0" ? 95 : missed === "1" ? 55 : missed === "2" ? 32 : 15;
    const utlS = util === "lo" ? 92 : util === "me" ? 58 : 28;
    const hisS = hist === "lo" ? 92 : hist === "me" ? 62 : 38;
    const appS = apps === "no" ? 92 : apps === "fw" ? 68 : 38;
    const ov = Math.round((sc / max) * 100);
    const radarData = [
      { factor: "Payments", score: payS, fullMark: 100 },
      { factor: "Utilisation", score: utlS, fullMark: 100 },
      { factor: "History", score: hisS, fullMark: 100 },
      { factor: "New Credit", score: appS, fullMark: 100 },
      { factor: "Overall", score: ov, fullMark: 100 },
    ];
    const gaugeData = [
      { name: "Poor", value: country === "uk" ? 560 : 280, fill: "#f43f5e" },
      { name: "Fair", value: country === "uk" ? 160 : 90, fill: "#fb923c" },
      { name: "Good", value: country === "uk" ? 160 : 70, fill: "#f59e0b" },
      { name: "V.Good", value: country === "uk" ? 119 : 60, fill: "#a3e635" },
      { name: "Excellent", value: country === "uk" ? 0 : 50, fill: "#10b981" },
    ].filter(g => g.value > 0);
    const improvements = [
      { factor: "Payment History", current: payS, potential: 95, weight: 35 },
      { factor: "Credit Utilisation", current: utlS, potential: 92, weight: 30 },
      { factor: "History Length", current: hisS, potential: 92, weight: 15 },
      { factor: "New Applications", current: appS, potential: 92, weight: 10 },
    ];
    const adv = [];
    if (parseInt(missed) >= 1) adv.push({ icon: "🚨", title: "Fix Missed Payments", body: "Set up direct debits today. Contact creditors about any defaults — even a payment plan shows willingness. This is the #1 priority.", pri: "CRITICAL", col: "#f43f5e" });
    if (util === "hi") adv.push({ icon: "💳", title: "Reduce Utilisation to Under 30%", body: "Pay down balances urgently or request a limit increase. Getting below 30% can boost your score within 60 days.", pri: "HIGH", col: "#fb923c" });
    else if (util === "me") adv.push({ icon: "📉", title: "Lower Utilisation Below 30%", body: "You're at 30–50%. Getting below 30% is a quick win that improves your score within 30–60 days.", pri: "MEDIUM", col: "#f59e0b" });
    if (hist === "sh") adv.push({ icon: "⏳", title: "Build Credit History", body: "Keep oldest accounts open. A credit builder card or authorised user status accelerates history building.", pri: "MEDIUM", col: "#f59e0b" });
    if (apps === "ma") adv.push({ icon: "🛑", title: "Stop All Applications for 6 Months", body: "3+ applications = multiple hard inquiries dragging your score down 5–10 points each. Complete pause now.", pri: "HIGH", col: "#fb923c" });
    if (country === "uk") {
      adv.push({ icon: "🗳️", title: "Register on Electoral Roll", body: "Free 5-minute fix at gov.uk/register-to-vote. Not being registered is a known score suppressor for UK lenders.", pri: "QUICK WIN", col: "#06b6d4" });
    } else {
      adv.push({ icon: "📋", title: "Dispute Credit Report Errors", body: "1 in 5 Americans has errors on their report. Get your free report at AnnualCreditReport.com and dispute everything incorrect.", pri: "QUICK WIN", col: "#06b6d4" });
    }
    adv.push({ icon: "💰", title: "Never Miss Another Payment", body: "35% of your FICO score is payment history. One missed payment can drop you 50–100 points. Automate all minimums immediately.", pri: "ONGOING", col: "#10b981" });
    setResult({ sc, max, col, lbl, radarData, gaugeData, improvements, adv });
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: 66 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ToolBanner icon="📊" accent="Credit Score" title="Improvement Advisor" desc="Personalised action plan with radar analysis, factor breakdown, and improvement roadmap for UK Experian & US FICO." toolKey="cred" flags={["🇬🇧 UK Experian 0–999", "🇺🇸 FICO 300–850", "Action Plan"]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          <div className="glass-card left-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Credit Profile</SectionTitle>
            <FG><FL>Credit System</FL><Toggle options={[{ value: "uk", label: "🇬🇧 UK Experian" }, { value: "us", label: "🇺🇸 US FICO" }]} value={country} onChange={setCountry} /></FG>
            <FG>
              <FL>Current Score</FL>
              <input className="fi-input" type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={country === "uk" ? "e.g. 720 (0–999)" : "e.g. 680 (300–850)"} min="0" max={country === "uk" ? 999 : 850} />
              <div style={{ fontSize: "0.72rem", color: "#334155", marginTop: "0.4rem", fontFamily: "DM Sans,sans-serif" }}>{country === "uk" ? "Poor: 0–560 · Fair: 561–720 · Good: 721–880 · Excellent: 881–999" : "Poor: <580 · Fair: 580–669 · Good: 670–739 · Very Good: 740–799 · Exceptional: 800+"}</div>
            </FG>
            <FG><FL>Missed Payments (12 months)</FL>
              <select className="fi-select" value={missed} onChange={e => setMissed(e.target.value)}>
                <option value="0">None</option><option value="1">1 missed payment</option><option value="2">2–3 missed</option><option value="3">4+ missed</option>
              </select>
            </FG>
            <FG><FL>Credit Utilisation</FL>
              <select className="fi-select" value={util} onChange={e => setUtil(e.target.value)}>
                <option value="lo">Under 30% (Good)</option><option value="me">30–50% (Fair)</option><option value="hi">Over 50% (Poor)</option>
              </select>
            </FG>
            <FG><FL>Credit History Length</FL>
              <select className="fi-select" value={hist} onChange={e => setHist(e.target.value)}>
                <option value="lo">5+ years</option><option value="me">2–5 years</option><option value="sh">Under 2 years</option>
              </select>
            </FG>
            <FG><FL>Recent Applications (6 months)</FL>
              <select className="fi-select" value={apps} onChange={e => setApps(e.target.value)}>
                <option value="no">None</option><option value="fw">1–2 applications</option><option value="ma">3+ applications</option>
              </select>
            </FG>
            <button className="glow-btn" onClick={analyse} style={{ width: "100%", padding: "0.95rem", fontSize: "0.88rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
              <span>📊 ANALYSE MY SCORE</span>
            </button>
          </div>

          <div className="glass-card right-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Credit Analysis</SectionTitle>
            {!result ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#334155" }}><div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🎯</div><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem" }}>Fill in your profile to see analysis</p></div>
            ) : (
              <div className="chart-container">
                <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Rajdhani,sans-serif" }}>Your Score</div>
                  <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "4rem", fontWeight: 900, color: result.col, lineHeight: 1.1 }}>{result.sc}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: result.col, fontFamily: "Rajdhani,sans-serif" }}>{result.lbl}</div>
                  <div style={{ display: "flex", gap: 4, margin: "0.8rem 0" }}>
                    {[["#f43f5e", 35], ["#fb923c", 15], ["#f59e0b", 15], ["#a3e635", 15], ["#10b981", 20]].map(([c, w], i) => (
                      <div key={i} style={{ flex: w, height: 7, borderRadius: 100, background: c }} />
                    ))}
                  </div>
                </div>

                <SectionTitle>Score Factor Radar</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={result.radarData} cx="50%" cy="50%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "DM Sans,sans-serif" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#334155", fontSize: 8 }} />
                    <Radar name="Your Score" dataKey="score" stroke="#06b6d4" fill="rgba(6,182,212,0.15)" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>

                <SectionTitle>Improvement Potential</SectionTitle>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={result.improvements} layout="vertical" barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
                    <YAxis type="category" dataKey="factor" tick={{ fill: "#94a3b8", fontSize: 9 }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={v => <span style={{ color: "#94a3b8", fontSize: "0.77rem" }}>{v}</span>} />
                    <Bar dataKey="current" name="Current" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="potential" name="Potential" fill="rgba(6,182,212,0.3)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <SectionTitle>{result.adv.length} Action Steps</SectionTitle>
                {result.adv.map((a, i) => (
                  <div key={i} className="tip-item" style={{ borderLeftColor: a.col, animationDelay: `${i * 0.08}s` }}>
                    <div style={{ marginBottom: "0.3rem" }}>
                      {a.icon} <strong style={{ color: "#e2e8f0" }}>{a.title}</strong>
                      <span style={{ fontSize: "0.67rem", background: `${a.col}22`, color: a.col, borderRadius: 4, padding: "1px 5px", marginLeft: 5, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{a.pri}</span>
                    </div>
                    {a.body}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SALARY NEGOTIATION HELPER
───────────────────────────────────────────── */
function SalaryHelper() {
  const [country, setCountry] = useState("uk");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [exp, setExp] = useState("");
  const [scenario, setScenario] = useState("new");
  const [achievements, setAchievements] = useState("");
  const [tone, setTone] = useState("conf");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const SCRIPTS = {
    new: {
      conf: (sym, tgt, cur, t, e, ach) => `Thank you for the offer — I'm genuinely excited about the ${t} role.\n\nI've reviewed the package carefully. Based on my ${e} years of experience and my track record of ${ach}, I was expecting something closer to ${sym}${tgt.toLocaleString()}.\n\nI've researched current market rates and ${sym}${tgt.toLocaleString()} reflects both my experience and the 2026 market benchmark.\n\nIs there flexibility to reach ${sym}${tgt.toLocaleString()}? I'm very motivated to make this work.`,
      coll: (sym, tgt, cur, t, e, ach) => `Thank you so much — I'm really excited about joining the team.\n\nI'd love to discuss the salary component together. My ${e} years of experience and achievements — including ${ach} — have prepared me to add real value in this ${t} role.\n\nI was hoping we could reach ${sym}${tgt.toLocaleString()}, which is aligned with 2026 market data. Is there flexibility there?`,
      firm: (sym, tgt, cur, t, e, ach) => `I appreciate the offer. Let me be direct — based on my ${e} years as a ${t} and achievements including ${ach}, I need ${sym}${tgt.toLocaleString()} to accept this role.\n\n2026 market data fully supports this figure. My number is ${sym}${tgt.toLocaleString()}.`,
    },
    raise: {
      conf: (sym, tgt, cur, t, e, ach) => `I'd like to discuss my compensation. Over the past year I've ${ach}, delivering measurable value to the business.\n\nWith ${e} years here, and looking at 2026 market rates for ${t} professionals, I believe ${sym}${tgt.toLocaleString()} fairly reflects my current value.\n\nI'm requesting an increase from ${sym}${cur.toLocaleString()} to ${sym}${tgt.toLocaleString()}. I'd welcome your support.`,
      coll: (sym, tgt, cur, t, e, ach) => `I really enjoy my work here and I'm proud of what we've built together. I'd like an honest conversation about my pay.\n\nThis year I've ${ach}. The 2026 market rate for ${t} professionals at my level is around ${sym}${tgt.toLocaleString()}.\n\nCould we discuss an increase to ${sym}${tgt.toLocaleString()}? I'm fully committed here long term.`,
      firm: (sym, tgt, cur, t, e, ach) => `I want to address my compensation directly. I've delivered ${ach} and the 2026 market rate for a ${t} with ${e} years experience is ${sym}${tgt.toLocaleString()}.\n\nMy current ${sym}${cur.toLocaleString()} no longer reflects my value. I'm requesting an increase to ${sym}${tgt.toLocaleString()} effective [date].`,
    },
    promo: {
      conf: (sym, tgt, cur, t, e, ach) => `I'd like to formally request a promotion with a salary of ${sym}${tgt.toLocaleString()}.\n\nOver ${e} years I've ${ach} and been performing above my current grade. The 2026 market rate for this level is ${sym}${tgt.toLocaleString()}.\n\nI'm ready for greater responsibility. Can we make this official?`,
      coll: (sym, tgt, cur, t, e, ach) => `I'm proud of my contributions here and I'd love to grow into the next level. Over ${e} years I've ${ach}, and I believe I'm ready.\n\nCould we discuss a promotion to [next role] at ${sym}${tgt.toLocaleString()}? I'd love to build a roadmap together.`,
      firm: (sym, tgt, cur, t, e, ach) => `I'm requesting a promotion and salary increase to ${sym}${tgt.toLocaleString()}, effective [date].\n\nI've delivered ${ach} and I've been operating above my current grade. 2026 market data confirms ${sym}${tgt.toLocaleString()} for this level. I'd like to formalise this by [date].`,
    },
    counter: {
      conf: (sym, tgt, cur, t, e, ach) => `I want to be transparent — I've received a competing offer at ${sym}${tgt.toLocaleString()}. This role is my genuine first preference.\n\nCan you match ${sym}${tgt.toLocaleString()}? If so, I'll withdraw from the other process immediately and fully commit here.`,
      coll: (sym, tgt, cur, t, e, ach) => `I want to be open with you — I've received another offer at ${sym}${tgt.toLocaleString()}. You're my preferred choice, but I need to be responsible about the difference.\n\nIs there any possibility of reaching ${sym}${tgt.toLocaleString()}? I'd love to make staying here work.`,
      firm: (sym, tgt, cur, t, e, ach) => `I have a competing offer for ${sym}${tgt.toLocaleString()}. I prefer this opportunity, but I need compensation to match.\n\nMy number is ${sym}${tgt.toLocaleString()}. Match it, and I decline the other offer today.`,
    },
  };

  const generate = () => {
    const cur = parseFloat(current), tgt = parseFloat(target);
    if (!cur || !tgt) return alert("Please enter current and target salary");
    if (tgt <= cur) return alert("Target should be higher than current salary");
    const sym = country === "uk" ? "£" : "$";
    const inc = tgt - cur, pct = ((inc / cur) * 100).toFixed(1);
    const t = title || "professional", e = exp || "5", ach = achievements || "consistently exceeded targets";
    const script = SCRIPTS[scenario]?.[tone]?.(sym, tgt, cur, t, e, ach) || "";

    const projData = Array.from({ length: 6 }, (_, i) => ({
      year: `Year ${i}`, current: Math.round(cur * Math.pow(1.03, i)), target: Math.round(tgt * Math.pow(1.03, i)), diff: Math.round((tgt - cur) * Math.pow(1.03, i))
    }));
    const maxS = tgt * 1.15;
    const tips = [
      `📊 Research ${sym}${tgt.toLocaleString()} on ${country === "uk" ? "Glassdoor, Reed.co.uk, PayScale UK" : "Glassdoor, Indeed Salary, Levels.fyi"}`,
      `🎯 Your ask of +${pct}% is ${parseFloat(pct) <= 15 ? "reasonable and well within normal ranges" : parseFloat(pct) <= 25 ? "ambitious — have strong market data ready" : "a stretch — your evidence must be airtight"}`,
      `🤫 Silence rule: after stating your number, stop talking. Let them respond first. This is negotiation's most powerful technique.`,
      `📦 If salary is firm, negotiate: ${country === "uk" ? "pension contributions, private medical, extra leave, flexible working, signing bonus" : "401k matching, equity/stock, health cover, signing bonus, extra PTO, remote days"}`,
      `📅 Best timing: competing offer in hand, right after a major win, or during review season when budget is open`,
      `🔄 If refused: ask "What would I need to achieve in 6 months to earn this?" — turns a no into a roadmap`,
      `📝 Always get the final agreed offer in writing before signing or declining other processes`,
    ];

    setResult({ cur, tgt, inc, pct, sym, script, projData, maxS, tips });
  };

  const copyScript = () => {
    if (result?.script) {
      navigator.clipboard.writeText(result.script).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
    }
  };

  return (
    <div className="section-wrapper" style={{ paddingTop: 66 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ToolBanner icon="💼" accent="Salary Negotiation" title="Helper" desc="AI-generated scripts, 5-year salary projection chart, and talking points to land the salary you deserve." toolKey="sal" flags={["🇬🇧 UK Job Market", "🇺🇸 US Job Market", "AI Scripts"]} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }}>
          <div className="glass-card left-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Details</SectionTitle>
            <FG><FL>Country</FL><Toggle options={[{ value: "uk", label: "🇬🇧 United Kingdom" }, { value: "us", label: "🇺🇸 United States" }]} value={country} onChange={setCountry} /></FG>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              <FG><FL>Current Salary</FL><input className="fi-input" type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 45000" /></FG>
              <FG><FL>Target Salary</FL><input className="fi-input" type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 55000" /></FG>
              <FG><FL>Job Title</FL><input className="fi-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Software Engineer" /></FG>
              <FG><FL>Years Experience</FL><input className="fi-input" type="number" value={exp} onChange={e => setExp(e.target.value)} placeholder="e.g. 5" min="0" /></FG>
            </div>
            <FG><FL>Scenario</FL>
              <select className="fi-select" value={scenario} onChange={e => setScenario(e.target.value)}>
                <option value="new">New Job Offer Negotiation</option><option value="raise">Annual Raise Request</option>
                <option value="promo">Promotion Negotiation</option><option value="counter">Counter Offer (have another offer)</option>
              </select>
            </FG>
            <FG><FL>Key Achievements</FL><input className="fi-input" type="text" value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="e.g. Led team of 5, grew revenue 20%" /></FG>
            <FG><FL>Tone</FL>
              <select className="fi-select" value={tone} onChange={e => setTone(e.target.value)}>
                <option value="conf">Confident & Direct</option><option value="coll">Collaborative & Warm</option><option value="firm">Assertive & Firm</option>
              </select>
            </FG>
            <button className="glow-btn" onClick={generate} style={{ width: "100%", padding: "0.95rem", fontSize: "0.88rem", letterSpacing: "0.08em", fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }}>
              <span>💼 GENERATE MY SCRIPT</span>
            </button>
          </div>

          <div className="glass-card right-enter" style={{ padding: "1.8rem" }}>
            <SectionTitle>Your Negotiation Package</SectionTitle>
            {!result ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#334155" }}><div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>✍️</div><p style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.88rem" }}>Fill in your details to generate a personalised script</p></div>
            ) : (
              <div className="chart-container">
                {/* Salary bars */}
                <div style={{ marginBottom: "1.2rem" }}>
                  {[{ label: "Current Salary", val: result.cur, fill: "linear-gradient(90deg,#6366f1,#818cf8)", class: "sfc" }, { label: "Target Salary", val: result.tgt, fill: "linear-gradient(90deg,#f59e0b,#06b6d4)", class: "sft" }].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.65rem" }}>
                      <div style={{ fontSize: "0.77rem", color: "#94a3b8", width: 110, flexShrink: 0, fontFamily: "DM Sans,sans-serif" }}>{s.label}</div>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 10, overflow: "hidden" }}>
                        <div className="progress-bar-fill" style={{ width: `${(s.val / result.maxS) * 100}%`, background: s.fill }} />
                      </div>
                      <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "0.78rem", color: "#e2e8f0", width: 78, textAlign: "right" }}>{result.sym}{s.val.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
                  {[
                    { label: "Annual Increase", val: `${result.sym}${result.inc.toLocaleString()}`, color: "#10b981" },
                    { label: "% Increase", val: `+${result.pct}%`, color: "#f59e0b" },
                    { label: "Monthly Gain", val: `${result.sym}${Math.round(result.inc / 12).toLocaleString()}`, color: "#06b6d4" },
                    { label: "5-Year Gain", val: `${result.sym}${(result.inc * 5).toLocaleString()}`, color: "#7c3aed" },
                  ].map((c, i) => (
                    <div key={i} className="result-card" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "DM Sans,sans-serif" }}>{c.label}</div>
                      <div style={{ fontFamily: "Rajdhani,monospace", fontSize: "1.4rem", fontWeight: 700, color: c.color, marginTop: 4 }}>{c.val}</div>
                    </div>
                  ))}
                </div>

                <SectionTitle>5-Year Salary Projection</SectionTitle>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={result.projData}>
                    <defs>
                      <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                      <linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} /><stop offset="95%" stopColor="#7c3aed" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickFormatter={v => `${result.sym}${(v / 1000).toFixed(0)}k`} width={50} />
                    <Tooltip content={<CustomTooltip curr={country} />} />
                    <Legend formatter={v => <span style={{ color: "#94a3b8", fontSize: "0.77rem" }}>{v}</span>} />
                    <Area type="monotone" dataKey="current" name="Current Path" stroke="#7c3aed" fill="url(#curGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="target" name="Target Path" stroke="#06b6d4" fill="url(#tgtGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>

                <SectionTitle>Negotiation Script</SectionTitle>
                <div style={{ background: "rgba(3,2,13,0.8)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 12, padding: "1.3rem", fontSize: "0.86rem", lineHeight: 1.85, color: "#94a3b8", position: "relative" }}>
                  <button onClick={copyScript} style={{ position: "absolute", top: "0.85rem", right: "0.85rem", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: copied ? "#10b981" : "#06b6d4", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.65rem", borderRadius: 6, cursor: "pointer", transition: "all 0.2s", fontFamily: "DM Sans,sans-serif" }}>
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                  {result.script.split("\n").map((l, i) => l.trim() ? <p key={i} style={{ marginBottom: "0.65rem" }}>{l}</p> : <br key={i} />)}
                </div>

                <SectionTitle>7 Key Talking Points</SectionTitle>
                {result.tips.map((t, i) => (
                  <div key={i} className="tip-item" style={{ animationDelay: `${i * 0.06}s` }}>{t}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 12, padding: "1rem 1.2rem", marginTop: "1.2rem", fontSize: "0.83rem", color: "#64748b", lineHeight: 1.65, fontFamily: "DM Sans,sans-serif" }}>
          <strong style={{ color: "#06b6d4" }}>💡 Pro Tip:</strong> Research market rates on {country === "uk" ? "Glassdoor, Reed.co.uk, LinkedIn Salary" : "Glassdoor, Indeed Salary, Levels.fyi"} before negotiating. Data always beats emotion.
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const setActiveTool = useCallback((t) => {
    setActive(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "DM Sans,sans-serif", color: "#e2e8f0", position: "relative" }}>
      <AuroraBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header active={active} setActive={setActiveTool} />
        {active === "home" && <Hero setActive={setActiveTool} />}
        {active === "tax" && <TaxCalculator />}
        {active === "mort" && <MortgageCalc />}
        {active === "debt" && <DebtPlanner />}
        {active === "cred" && <CreditAdvisor />}
        {active === "sal" && <SalaryHelper />}
        <footer style={{ background: "rgba(3,2,13,0.95)", borderTop: "1px solid rgba(6,182,212,0.08)", padding: "2rem", textAlign: "center", marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.7rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: "#fff", fontFamily: "Rajdhani,sans-serif" }}>AI</div>
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700 }} className="grad-text">aimoneytools</span>
            <span style={{ fontFamily: "Rajdhani,sans-serif", color: "#64748b" }}>.pro</span>
          </div>
          <p style={{ color: "#334155", fontSize: "0.78rem", lineHeight: 1.75, fontFamily: "DM Sans,sans-serif" }}>
            Built for 🇬🇧 UK & 🇺🇸 USA · 5 Free AI-Powered Financial Tools · 2026 Rates<br />
            <em>For educational purposes only. Not financial advice. Always consult a qualified advisor.</em>
          </p>
        </footer>
      </div>
    </div>
  );
}
