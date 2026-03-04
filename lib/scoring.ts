export function clamp(n: number, a=0, b=100){ return Math.max(a, Math.min(b, n)); }

export function viralScore(params: {
  trendVelocity: number;
  nicheFit: number;
  hookStrength: number;
  offerClarity: number;
  friction: number;
}) {
  const raw =
    params.trendVelocity * 0.30 +
    params.nicheFit      * 0.25 +
    params.hookStrength  * 0.25 +
    params.offerClarity  * 0.20 -
    params.friction      * 0.15;

  return Math.round(clamp(raw));
}
