import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract numeric part and suffix from value
  const numericMatch = value.match(/^([\d,\.]+)([A-Z%]*)?$/);
  
  if (!numericMatch) {
    return <span ref={ref}>{value}</span>;
  }

  const numericPart = numericMatch[1].replace(/,/g, '');
  const suffix = numericMatch[2] || '';
  const targetValue = parseFloat(numericPart);

  const [displayValue, setDisplayValue] = useState(0);
  
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(targetValue);
    }
  }, [isInView, targetValue, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  const formatNumber = (num: number) => {
    // Preserve decimal places if original had them
    const hasDecimal = numericPart.includes('.');
    if (hasDecimal) {
      return num.toFixed(2);
    }
    return Math.round(num).toLocaleString();
  };

  return (
    <span ref={ref}>
      {formatNumber(displayValue)}{suffix}
    </span>
  );
}
