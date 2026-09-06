// Shared motion tokens as defined in the DARKINT Overhaul Brief
export const springDefault = { type: "spring", stiffness: 380, damping: 30, mass: 0.9 };
export const springEnergetic = { type: "spring", stiffness: 260, damping: 20, mass: 0.8 };
export const transitionPage = { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: springDefault 
  }
};
