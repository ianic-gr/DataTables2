export default function (
  a: number,
  b: number,
  operator: ">" | "<" | ">=" | "<=" | "="
): boolean {
  switch (operator) {
    case ">":
      return a > b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case "<=":
      return a <= b;
    case "=":
      return a === b;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}
