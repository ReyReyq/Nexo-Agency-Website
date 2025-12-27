"use client";

import React, { useState, useRef } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Play } from "lucide-react";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface HoverVideoCardProps {
  /** URL to the video file */
  videoSrc: string;
  /** URL to the poster/thumbnail image */
  posterSrc: string;
  /** Project title */
  title: string;
  /** Project subtitle or description */
  subtitle?: string;
  /** Array of tags/technologies used */
  tags?: string[];
  /** Link to the project (external or internal) */
  link?: string;
  /** Additional CSS classes */
  className?: string;
  /** Aspect ratio of the card (default: "16/9") */
  aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
  /** Whether to show play icon on poster */
  showPlayIcon?: boolean;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Video playback start delay in ms (default: 0) */
  playbackStartDelay?: number;
  /** Overlay transition duration in ms (default: 400) */
  overlayTransitionDuration?: number;
}

// ============================================================================
// Primary Color from Nexo Design System
// ============================================================================

const PRIMARY_COLOR = "hsl(328, 100%, 54%)";
const PRIMARY_COLOR_RGB = "255, 20, 147"; // Approximate RGB for the primary color

// ============================================================================
// Sub-Components
// ============================================================================

interface LoadingSkeletonProps {
  aspectRatio: string;
  isInView?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ aspectRatio, isInView = true }) => (
  <div
    className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 animate-pulse"
    style={{ aspectRatio }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-t-transparent"
        style={{ borderColor: `${PRIMARY_COLOR} transparent transparent transparent` }}
        animate={isInView ? { rotate: 360 } : undefined}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
    {/* Shimmer effect */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${PRIMARY_COLOR_RGB}, 0.1), transparent)`,
        }}
        animate={isInView ? { translateX: ["100%", "-100%"] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  </div>
);

interface PosterOverlayProps {
  posterSrc: string;
  title: string;
  showPlayIcon: boolean;
}

const PosterOverlay: React.FC<PosterOverlayProps> = ({
  posterSrc,
  title,
  showPlayIcon,
}) => (
  <div className="absolute inset-0">
    {/* TODO: Consider converting external poster URLs to local optimized images */}
    <img
      src={posterSrc}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
      width={800}
      height={450}
    />
    {showPlayIcon && (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            background: `rgba(${PRIMARY_COLOR_RGB}, 0.2)`,
            border: `2px solid rgba(${PRIMARY_COLOR_RGB}, 0.5)`,
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Play
            className="w-6 h-6 ml-1"
            style={{ color: PRIMARY_COLOR }}
            fill={PRIMARY_COLOR}
          />
        </motion.div>
      </div>
    )}
  </div>
);

interface InfoOverlayProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  link?: string;
  isHovered: boolean;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({
  title,
  subtitle,
  tags,
  link,
  isHovered,
}) => (
  <AnimatePresence>
    {isHovered && (
      <motion.div
        className="absolute inset-0 flex flex-col justify-end pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(0, 0, 0, 0.6) 40%,
              rgba(${PRIMARY_COLOR_RGB}, 0.1) 70%,
              transparent 100%
            )`,
          }}
        />

        {/* Glass morphism info panel */}
        <motion.div
          className="relative p-4 sm:p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Glass background */}
          <div
            className="absolute inset-0 backdrop-blur-md rounded-t-xl"
            style={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
              borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
                    style={{
                      background: `rgba(${PRIMARY_COLOR_RGB}, 0.2)`,
                      border: `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.3)`,
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h3
              className="text-xl sm:text-2xl font-bold text-white mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {title}
            </motion.h3>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-sm sm:text-base text-white/70 line-clamp-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Link indicator */}
            {link && (
              <motion.div
                className="flex items-center gap-2 mt-3 text-sm font-medium pointer-events-auto"
                style={{ color: PRIMARY_COLOR }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span>View Project</span>
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================================================================
// Main Component
// ============================================================================

const HoverVideoCard: React.FC<HoverVideoCardProps> = ({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  tags = [],
  link,
  className,
  aspectRatio = "16/9",
  showPlayIcon = true,
  onClick,
  playbackStartDelay = 0,
  overlayTransitionDuration = 400,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  const aspectRatioMap = {
    "16/9": "16/9",
    "4/3": "4/3",
    "1/1": "1/1",
    "9/16": "9/16",
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "shadow-lg shadow-black/20",
        "transition-shadow duration-300",
        "hover:shadow-xl hover:shadow-black/30",
        className
      )}
      style={{
        aspectRatio: aspectRatioMap[aspectRatio],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Border glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{
          boxShadow: isHovered
            ? `0 0 20px rgba(${PRIMARY_COLOR_RGB}, 0.3), inset 0 0 20px rgba(${PRIMARY_COLOR_RGB}, 0.1)`
            : "none",
          border: isHovered
            ? `1px solid rgba(${PRIMARY_COLOR_RGB}, 0.3)`
            : "1px solid rgba(255, 255, 255, 0.1)",
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Video Player */}
      <HoverVideoPlayer
        videoSrc={videoSrc}
        muted
        loop
        restartOnPaused
        playbackStartDelay={playbackStartDelay}
        overlayTransitionDuration={overlayTransitionDuration}
        preload="metadata"
        unloadVideoOnPaused={false}
        hoverTarget={containerRef}
        videoClassName="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
        }}
        pausedOverlay={
          <PosterOverlay
            posterSrc={posterSrc}
            title={title}
            showPlayIcon={showPlayIcon}
          />
        }
        loadingOverlay={
          <LoadingSkeleton aspectRatio={aspectRatioMap[aspectRatio]} isInView={isInView} />
        }
        loadingStateTimeout={200}
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => setIsLoading(false)}
      />

      {/* Info Overlay */}
      <InfoOverlay
        title={title}
        subtitle={subtitle}
        tags={tags}
        link={link}
        isHovered={isHovered}
      />

      {/* Top gradient for better visibility of any top elements */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent)",
        }}
      />
    </motion.div>
  );
};

export { HoverVideoCard };
export default HoverVideoCard;
