import confetti from 'canvas-confetti';

export function fireSparkles(elementOrCoords = null) {
  // Brand colors for confetti/glitter: Cream, Sceptre Red, Cerulean Blue, Gold
  const colors = ['#4D0E12', '#A5BCD6', '#F5EFC6', '#F4B400', '#A0BEDA'];

  if (elementOrCoords && typeof elementOrCoords === 'object' && elementOrCoords.x !== undefined) {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x: elementOrCoords.x / window.innerWidth, y: elementOrCoords.y / window.innerHeight },
      colors,
      ticks: 180,
      gravity: 0.8,
      scalar: 0.8
    });
  } else {
    // Center cannon burst
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65 },
      colors,
      ticks: 200,
      gravity: 0.9,
      scalar: 0.9
    });
  }
}

export function fireMilestoneSparkles() {
  const duration = 1.8 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#4D0E12', '#A5BCD6', '#F5EFC6', '#FDE047'];

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export default function SparkleBadge({ children, className = '' }) {
  return (
    <span className={`relative inline-flex items-center gap-1 ${className}`}>
      {children}
      <span className="text-xs animate-sparkle">✨</span>
    </span>
  );
}
