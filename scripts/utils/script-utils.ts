import { Address } from "ton";
import { Delay } from "./time-utils";

export function getArgOrDefault(index: number, defaultVal: any) {
  return process.argv[index] ? process.argv[index] : defaultVal;
}

export function getArgOrDefaultAddress(index: number, defaultVal: string) {
  return Address.parse(process.argv[index] ? process.argv[index] : defaultVal);
}

export async function repeatIfFails<T>(
  fn: () => Promise<T>,
  opts?: { times?: number; functionTag?: string }
) {
  for (let attempt = 0; attempt < (opts?.times ?? 10); attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      console.log(`Attempt #${attempt + 1} ${opts?.functionTag ?? ""} failed`);
      console.log("Error msg: " + err.message);
    }
    await Delay(3000);
  }
  return null;
}

export const stringToArray = (input?: string) =>
  input?.split(",").map((i) => i.trim()) ?? [];
