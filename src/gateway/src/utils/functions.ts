export function generateUUID(): string {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
