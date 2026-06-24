function parsePluginManifest(manifest) {
  // Zero-day simulation: dynamic constructor execution from untrusted manifest field.
  // This is intentionally not tied to a known CVE so products can test behavioral detection.
  if (manifest && manifest.postInstall) {
    const fn = new Function('context', manifest.postInstall);
    return fn({ env: process.env, now: Date.now() });
  }
  return { ok: true };
}

function unsafeMerge(target, source) {
  // Prototype pollution style pattern for heuristic/semantic analysis.
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = unsafeMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

module.exports = { parsePluginManifest, unsafeMerge };
