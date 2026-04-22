"use client";

import { motion } from "framer-motion";

/**
 * A fun, illustrated background for student-facing pages.
 * Cartoon-style scenery with sky, clouds, hills, trees, and animals.
 * Renders behind content as a fixed full-screen backdrop.
 */
interface AdventureBackgroundProps {
  /** Set to true during active learning (diagnostic/sessions) to reduce distracting motion */
  calm?: boolean;
}

export function AdventureBackground({ calm = false }: AdventureBackgroundProps) {
  // When calm=true, disable all persistent animations so the background
  // doesn't compete with the learning task (per cognitive-load research)
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #87CEEB 0%, #B8E4F9 40%, #D4F1FF 70%, #E8F8E8 100%)",
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute top-8 right-12 w-[80px] h-[80px] md:w-[110px] md:h-[110px] lg:w-[140px] lg:h-[140px]"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 80 80">
          {/* Sun rays */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.line
              key={i}
              x1="40" y1="40"
              x2={40 + Math.cos((i * 30 * Math.PI) / 180) * 38}
              y2={40 + Math.sin((i * 30 * Math.PI) / 180) * 38}
              stroke="#FFE066"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={0.5}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          <circle cx="40" cy="40" r="18" fill="#FFD93D" />
          <circle cx="40" cy="40" r="14" fill="#FFE066" />
          {/* Sun face */}
          <circle cx="35" cy="37" r="2" fill="#F59E0B" />
          <circle cx="45" cy="37" r="2" fill="#F59E0B" />
          <path d="M35 44 Q40 48 45 44" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Clouds — hidden during active learning to reduce distraction */}
      {!calm && (<>
      {/* Clouds */}
      <motion.div
        className="absolute top-16 left-[10%] w-[120px] h-[50px] md:w-[170px] md:h-[70px] lg:w-[220px] lg:h-[85px]"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 120 50" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="60" cy="30" rx="50" ry="18" fill="white" opacity="0.8" />
          <ellipse cx="40" cy="25" rx="30" ry="20" fill="white" opacity="0.8" />
          <ellipse cx="80" cy="28" rx="25" ry="15" fill="white" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-28 left-[55%] w-[100px] h-[40px] md:w-[150px] md:h-[55px] lg:w-[190px] lg:h-[70px] lg:left-[50%]"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="50" cy="25" rx="40" ry="14" fill="white" opacity="0.7" />
          <ellipse cx="35" cy="20" rx="25" ry="16" fill="white" opacity="0.7" />
          <ellipse cx="70" cy="22" rx="20" ry="12" fill="white" opacity="0.7" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-6 left-[35%] w-[80px] h-[35px] md:w-[120px] md:h-[50px] lg:w-[160px] lg:h-[60px] lg:left-[30%]"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 80 35" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="40" cy="20" rx="35" ry="12" fill="white" opacity="0.6" />
          <ellipse cx="25" cy="17" rx="20" ry="14" fill="white" opacity="0.6" />
          <ellipse cx="55" cy="19" rx="18" ry="10" fill="white" opacity="0.6" />
        </svg>
      </motion.div>
      </>)}

      {/* Far hills */}
      <div className="absolute bottom-0 w-full h-[320px] md:h-[400px] lg:h-[480px]">
        <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0 220 Q200 140 400 180 Q600 120 800 170 Q1000 130 1200 160 Q1400 140 1440 180 L1440 320 L0 320 Z" fill="#8BC34A" opacity="0.4" />
          <path d="M0 250 Q180 190 360 220 Q540 170 720 210 Q900 180 1080 200 Q1260 170 1440 210 L1440 320 L0 320 Z" fill="#6DAF3B" opacity="0.5" />
          <path d="M0 270 Q240 230 480 260 Q720 220 960 250 Q1200 230 1440 250 L1440 320 L0 320 Z" fill="#4CAF50" opacity="0.6" />
        </svg>
      </div>

      {/* Front hills with grass */}
      <div className="absolute bottom-0 w-full h-[160px] md:h-[200px] lg:h-[240px]">
        <svg className="w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0 80 Q360 30 720 70 Q1080 20 1440 60 L1440 160 L0 160 Z" fill="#43A047" />
          <path d="M0 110 Q300 80 600 100 Q900 70 1200 90 Q1350 80 1440 95 L1440 160 L0 160 Z" fill="#388E3C" />
        </svg>
      </div>

      {/* Trees - left side */}
      <div className="absolute bottom-20 left-4 w-[80px] h-[140px] md:w-[100px] md:h-[170px] md:bottom-24 lg:w-[120px] lg:h-[200px] lg:left-8 lg:bottom-28">
        <svg width="100%" height="100%" viewBox="0 0 80 140">
          <rect x="35" y="90" width="10" height="50" rx="3" fill="#795548" />
          <ellipse cx="40" cy="55" rx="35" ry="45" fill="#2E7D32" />
          <ellipse cx="30" cy="45" rx="20" ry="25" fill="#388E3C" />
          <ellipse cx="50" cy="50" rx="18" ry="22" fill="#43A047" />
          {/* Cute bird on tree */}
          <g transform="translate(55, 35)">
            <ellipse cx="0" cy="0" rx="6" ry="5" fill="#F44336" />
            <circle cx="-3" cy="-2" r="1.5" fill="white" />
            <circle cx="-3" cy="-2" r="0.8" fill="#333" />
            <polygon points="4,-1 8,0 4,1" fill="#FF9800" />
          </g>
        </svg>
      </div>

      {/* Trees - right side */}
      <div className="absolute bottom-16 right-6 w-[70px] h-[130px] md:w-[90px] md:h-[160px] md:bottom-20 lg:w-[110px] lg:h-[190px] lg:right-10 lg:bottom-24">
        <svg width="100%" height="100%" viewBox="0 0 70 130">
          <rect x="30" y="85" width="10" height="45" rx="3" fill="#6D4C41" />
          <ellipse cx="35" cy="50" rx="30" ry="40" fill="#1B5E20" />
          <ellipse cx="25" cy="40" rx="18" ry="22" fill="#2E7D32" />
          <ellipse cx="45" cy="45" rx="16" ry="20" fill="#388E3C" />
        </svg>
      </div>

      {/* Bushes */}
      <div className="absolute bottom-8 left-[20%] w-[60px] h-[40px] md:w-[80px] md:h-[55px] lg:w-[100px] lg:h-[65px] lg:bottom-12">
        <svg width="100%" height="100%" viewBox="0 0 60 40">
          <ellipse cx="30" cy="25" rx="28" ry="15" fill="#43A047" />
          <ellipse cx="18" cy="22" rx="16" ry="18" fill="#4CAF50" />
          <ellipse cx="42" cy="23" rx="15" ry="14" fill="#4CAF50" />
          {/* Small flower */}
          <circle cx="25" cy="15" r="3" fill="#FF7043" />
          <circle cx="25" cy="15" r="1.5" fill="#FFE082" />
        </svg>
      </div>

      <div className="absolute bottom-6 right-[25%] w-[50px] h-[35px] md:w-[70px] md:h-[48px] lg:w-[85px] lg:h-[58px] lg:bottom-10">
        <svg width="100%" height="100%" viewBox="0 0 50 35">
          <ellipse cx="25" cy="22" rx="22" ry="12" fill="#388E3C" />
          <ellipse cx="15" cy="19" rx="14" ry="15" fill="#43A047" />
          <ellipse cx="35" cy="20" rx="12" ry="11" fill="#4CAF50" />
          {/* Small flower */}
          <circle cx="30" cy="12" r="3" fill="#E91E63" />
          <circle cx="30" cy="12" r="1.5" fill="#FFF176" />
        </svg>
      </div>

      {/* Flowers, koala, butterfly — hidden during active learning */}
      {!calm && (<>
      {/* Flowers on ground */}
      {[
        { x: "12%", color: "#FF7043" },
        { x: "32%", color: "#AB47BC" },
        { x: "58%", color: "#FF7043" },
        { x: "75%", color: "#42A5F5" },
        { x: "88%", color: "#AB47BC" },
      ].map((flower, i) => (
        <motion.div
          key={i}
          className="absolute bottom-10 w-[16px] h-[24px] md:w-[22px] md:h-[32px] lg:w-[28px] lg:h-[40px] lg:bottom-14"
          style={{ left: flower.x }}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
        >
          <svg width="100%" height="100%" viewBox="0 0 16 24">
            <line x1="8" y1="12" x2="8" y2="24" stroke="#388E3C" strokeWidth="2" />
            <circle cx="8" cy="8" r="6" fill={flower.color} opacity="0.9" />
            <circle cx="8" cy="8" r="3" fill="#FFE082" />
          </svg>
        </motion.div>
      ))}

      {/* Cute animal peeking from bottom-left */}
      <motion.div
        className="absolute bottom-0 left-[8%] w-[50px] h-[50px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px]"
        initial={{ y: 20 }}
        animate={{ y: [20, 10, 20] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 50 50">
          {/* Koala */}
          <circle cx="25" cy="20" r="16" fill="#9E9E9E" />
          <circle cx="14" cy="10" r="8" fill="#9E9E9E" />
          <circle cx="36" cy="10" r="8" fill="#9E9E9E" />
          <circle cx="14" cy="10" r="5" fill="#BDBDBD" />
          <circle cx="36" cy="10" r="5" fill="#BDBDBD" />
          <ellipse cx="25" cy="24" rx="8" ry="6" fill="#BDBDBD" />
          <circle cx="20" cy="18" r="2.5" fill="white" />
          <circle cx="30" cy="18" r="2.5" fill="white" />
          <circle cx="21" cy="18" r="1.5" fill="#333" />
          <circle cx="31" cy="18" r="1.5" fill="#333" />
          <ellipse cx="25" cy="22" rx="4" ry="3" fill="#424242" />
        </svg>
      </motion.div>

      {/* Butterfly */}
      <motion.div
        className="absolute top-[35%] right-[15%] w-[30px] h-[24px] md:w-[40px] md:h-[32px] lg:w-[48px] lg:h-[38px]"
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -15, 5, -10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 30 24">
          <motion.g
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ellipse cx="10" cy="10" rx="8" ry="6" fill="#FF8A65" opacity="0.8" />
            <ellipse cx="20" cy="10" rx="8" ry="6" fill="#FF8A65" opacity="0.8" />
            <ellipse cx="10" cy="16" rx="5" ry="4" fill="#FFAB91" opacity="0.8" />
            <ellipse cx="20" cy="16" rx="5" ry="4" fill="#FFAB91" opacity="0.8" />
            <rect x="14" y="6" width="2" height="14" rx="1" fill="#5D4037" />
          </motion.g>
        </svg>
      </motion.div>
      </>)}
    </div>
  );
}
