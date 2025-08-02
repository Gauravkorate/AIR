self.onmessage = async (e) => {
  const { cmd, cores } = e.data;
  if (cmd !== 'go') return;

  const T = 60000; // 60 s
  const bucket = new Float32Array(cores);
  const start = performance.now();

  await Promise.all(
    Array.from({ length: cores }, (_, i) =>
      new Promise((res) => {
        const t0 = performance.now();
        const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
        while (performance.now() - t0 < T) fib(30);
        bucket[i] = performance.now() - t0;
        res();
      })
    )
  );

  const jitter = bucket.map((t) => Math.abs(t - T) / T);
  const mean = jitter.reduce((a, b) => a + b, 0) / cores;
  const label = mean > 0.05 ? 'dirty-ish' : 'clean-ish';

  self.postMessage({ label });
};