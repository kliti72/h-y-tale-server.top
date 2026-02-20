export default class StringArrayUtils {

  static toArray(commaSeparated: string): string[] {
    if (!commaSeparated || typeof commaSeparated !== "string") {
      return [];
    }

    return commaSeparated
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  static toArrayTags(value: string): string[] {
  return value
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

  static toString(
    array: (string | null | undefined)[],
    options: { withSpace?: boolean } = { withSpace: true }
  ): string {
    if (!Array.isArray(array) || array.length === 0) {
      return "";
    }

    const cleaned = array
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map(item => item.trim());

    if (cleaned.length === 0) {
      return "";
    }

    const separator = options.withSpace ? ", " : ",";
    return cleaned.join(separator);
  }
}
