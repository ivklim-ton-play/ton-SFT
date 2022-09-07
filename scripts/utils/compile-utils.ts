import * as fs from "fs";
import child_process from "child_process";

export function compiledFiftPath(contractName: string) {
  return `build/compiled/${contractName}.fif`;
}

export function compile(
  contractName: string,
  otherFilesWithExtensions?: string[]
) {
  const compiledFift = compiledFiftPath(contractName);
  const sources = `${
    otherFilesWithExtensions?.map((fName) => `contracts/${fName} `)?.join("") ??
    ""
  }contracts/${contractName}.fc`;

  try {
    child_process.execSync(`func -o ${compiledFift} -SPA ${sources}`);
  } catch (e) {
    console.log(
      "FATAL ERROR: 'fift' executable failed, is FIFTPATH env variable defined?"
    );
    process.exit(1);
  }

  console.log("Compilation result: " + compiledFift);
}
