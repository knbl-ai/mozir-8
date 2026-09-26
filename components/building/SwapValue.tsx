'use client';
import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { swap } from './motion';
import s from './explorer.module.css';

const variants = {
 enter: (direction: number) => ({ y: `${direction * 0.45}em`, opacity: 0, filter: 'blur(4px)' }),
 center: { y: '0em', opacity: 1, filter: 'blur(0px)' },
 exit: (direction: number) => ({ y: `${direction * -0.45}em`, opacity: 0, filter: 'blur(4px)' }),
};

// A value that changes by rolling: the old one leaves upward, the new one arrives from below
// (reversed when the number, or the caller's `order`, went down). Both occupy the same grid cell,
// so rapid changes (hover sweeping the facade) crossfade instead of queueing.
export default function SwapValue({ value, order, children, className }: { value: string; order?: number; children?: ReactNode; className?: string }) {
 const rank = order ?? (Number.isFinite(Number(value)) ? Number(value) : undefined);
 const [previous, setPrevious] = useState({ value, rank });
 const [direction, setDirection] = useState(1);
 if (previous.value !== value) {
  setDirection(rank !== undefined && previous.rank !== undefined && rank < previous.rank ? -1 : 1);
  setPrevious({ value, rank });
 }
 return <span className={`${s.swap} ${className ?? ''}`}>
  <AnimatePresence initial={false} custom={direction}>
   <motion.span key={value} className={s.swapItem} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={swap}>
    {children ?? value}
   </motion.span>
  </AnimatePresence>
 </span>;
}
