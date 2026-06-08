const ease = [0.22, 1, 0.36, 1]

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
})

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

export const slideIn = (direction = 'left') => ({
  hidden: { opacity: 0, x: direction === 'left' ? -36 : 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
})

export const floatAnim = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' },
  },
})

export const iconBounce = {
  scale: [1, 1.25, 0.9, 1.1, 1],
  transition: { duration: 0.35 },
}

export const connectorLine = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, delay: 0.3, ease } },
}

export const pulseRing = {
  scale: [1, 2.4, 2.4],
  opacity: [0.6, 0, 0],
  transition: { duration: 2, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.5 },
}

export const chipAnim = (i = 0) => ({
  initial: { opacity: 0, scale: 0.85, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.45 + i * 0.1, ease },
})

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay, ease },
})

export const slideUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

export const viewportOpts = { once: true, margin: '-80px' }
