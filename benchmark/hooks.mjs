/**
 * Node.js module hooks for the benchmark.
 *
 * Resolves extension-less relative imports (e.g. "./rle-array") that Zepp's
 * bundler handles transparently but Node.js ESM requires an explicit ".js".
 */

export async function resolve(specifier, context, nextResolve) {
  // Node.js ESM requires explicit file extensions; Zepp's bundler does not.
  // Try the bare specifier first, then append ".js".
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL
  ) {
    try {
      return await nextResolve(specifier, context);
    } catch {
      return await nextResolve(specifier + ".js", context);
    }
  }

  return nextResolve(specifier, context);
}
