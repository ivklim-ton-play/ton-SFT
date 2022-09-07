export async function Delay(ms: number = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function WaitFor<T1>(
  func: () => Promise<boolean>,
  delaySeconds: number = 3
) {
  for (let attempt = 0; attempt <= 10; attempt++) {
    try {
      if (attempt > 0) {
        await Delay(delaySeconds * 1000);
        // await Delay(attempt * 2 * 1000);
      }
      let fnRes = await func();
      // console.log(`Attempt #${attempt + 1}`, fnRes);

      if (fnRes) return true;
    } catch (err) {
      console.log(`Attempt #${attempt + 1} failed: `, err);
    }
  }
  return false;
}
