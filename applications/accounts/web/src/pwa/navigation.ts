export async function resolveNavigation<T>(
  network: () => Promise<T>,
  offlineShell: () => Promise<T>,
) {
  try {
    return await network();
  } catch {
    return offlineShell();
  }
}
