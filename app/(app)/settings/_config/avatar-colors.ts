const AVATAR_PALETTE = [
  "bg-blue-500/20 text-blue-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-violet-500/20 text-violet-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-pink-500/20 text-pink-400",
  "bg-amber-500/20 text-amber-400",
  "bg-teal-500/20 text-teal-400",
  "bg-rose-500/20 text-rose-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-red-500/20 text-red-400",
  "bg-orange-500/20 text-orange-400",
  "bg-fuchsia-500/20 text-fuchsia-400",
] as const;

export function getAvatarColor(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}
