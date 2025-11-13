export function getValueByStringPath(
  obj: Record<string, any>,
  path: string
): unknown {
  return path.split(".").reduce((acc: any, part: string) => {
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayName = arrayMatch[1]!;
      const index = parseInt(arrayMatch[2]!, 10);
      return acc?.[arrayName]?.[index];
    }
    return acc?.[part];
  }, obj);
}
