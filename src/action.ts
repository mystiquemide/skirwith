export async function run(): Promise<void> {
  // Placeholder entrypoint for the v0.1 bundle.
  // Phase 2+ wires the real GitHub event -> policy -> KeeperHub flow here.
}

if (import.meta.url === new URL(process.argv[1] ?? "", "file:").href) {
  run().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
