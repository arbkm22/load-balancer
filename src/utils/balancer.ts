export interface Hammer {
  serial: number;
  weight: number;
}

export interface BalanceResult {
  groups: {
    A: Hammer[];
    B: Hammer[];
    C: Hammer[];
  };
  target: number;
  bestDiff: number;
}

export function balanceHammers(hammers: Hammer[], tries: number = 10000): BalanceResult {
  const target = hammers.reduce((sum, h) => sum + h.weight, 0) / 3;
  let bestDiff = Infinity;
  let bestGroups: { A: Hammer[]; B: Hammer[]; C: Hammer[] } | null = null;

  const n = hammers.length;
  const sizeA = Math.ceil(n / 3);
  const sizeB = Math.ceil((n - sizeA) / 2);

  for (let i = 0; i < tries; i++) {
    const shuffled = [...hammers].sort(() => Math.random() - 0.5);
    const A = shuffled.slice(0, sizeA);
    const B = shuffled.slice(sizeA, sizeA + sizeB);
    const C = shuffled.slice(sizeA + sizeB);

    const totalA = A.reduce((sum, h) => sum + h.weight, 0);
    const totalB = B.reduce((sum, h) => sum + h.weight, 0);
    const totalC = C.reduce((sum, h) => sum + h.weight, 0);

    const diff = Math.abs(target - totalA) + Math.abs(target - totalB) + Math.abs(target - totalC);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestGroups = { A, B, C };
      if (diff < 0.2) break; // Close enough
    }
  }

  return {
    groups: bestGroups!,
    target,
    bestDiff,
  };
}
