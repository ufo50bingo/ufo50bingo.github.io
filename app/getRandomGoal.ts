export default function getRandomGoal(goals: Set<string>): string {
  const items = Array.from(goals);
  return items[Math.floor(Math.random() * items.length)];
}
