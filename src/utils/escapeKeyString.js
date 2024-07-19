export function escapeKeyString(key) {
  // Replace every special character with '_'
  // The regex [^a-zA-Z0-9] matches any character that is not a letter or a digit
  return key.replace(/[^a-zA-Z0-9]/g, "_");
}
