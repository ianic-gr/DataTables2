export function getValueByStringPath(obj, path) {
  return path.split(".").reduce((acc, part) => {
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const index = arrayMatch[2];
      return acc && acc[arrayName] && acc[arrayName][index];
    }
    return acc && acc[part];
  }, obj);
}
