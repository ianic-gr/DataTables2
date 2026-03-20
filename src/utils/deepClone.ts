export default function <T>(data: T): T {
  if (data === null || typeof data !== "object") {
    return data;
  }

  return JSON.parse(JSON.stringify(data));
}
