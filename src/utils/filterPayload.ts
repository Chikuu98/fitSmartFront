export function filterPayload<T extends Record<string, any>>(
  rawPayload: T,
): Partial<T> {
  const filtered = Object.fromEntries(
    Object.entries(rawPayload).filter(([_, v]) => v !== undefined && v !== ""),
  );
  return filtered as Partial<T>;
}
