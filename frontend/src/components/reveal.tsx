"use client";

import { motion, type HTMLMotionProps } from "motion/react";

// Fades and lifts its children into view the first time they scroll on screen.
export function Reveal({
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}
