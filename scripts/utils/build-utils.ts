import * as fs from "fs";
import child_process from "child_process";
import { Cell } from "ton";
import { compiledFiftPath } from "./compile-utils";

export function jsonPath(contractName: string) {
  return `build/json/${contractName}.json`;
}

export function getCellFromJson(contractName: string) {
  return Cell.fromBoc(
    JSON.parse(fs.readFileSync(jsonPath(contractName)).toString()).hex
  )[0];
}

export function build(contractName: string) {
  const compiledFift = compiledFiftPath(contractName);
  const fiftToBocScriptTemp = `build/${contractName}.fiftToBoc.fif`;
  const bocFileTemp = `build/boc/${contractName}.boc`;
  const bocAsHexJSON = jsonPath(contractName);

  let fiftToBocScriptContent = '"Asm.fif" include\n';
  fiftToBocScriptContent += `${fs.readFileSync(compiledFift).toString()}\n`;
  fiftToBocScriptContent += `boc>B "${bocFileTemp}" B>file`;
  fs.writeFileSync(fiftToBocScriptTemp, fiftToBocScriptContent);

  try {
    child_process.execSync(`fift ${fiftToBocScriptTemp}`);
  } catch (e) {
    console.log("ERROR: 'fift' execution");
    process.exit(1);
  }

  // Remove temp file
  fs.unlinkSync(fiftToBocScriptTemp);

  if (!fs.existsSync(bocFileTemp)) {
    console.log(`ERROR: Temp boc-file '${bocFileTemp}' was not generated`);
    process.exit(1);
  }

  const bocData = fs.readFileSync(bocFileTemp);
  fs.writeFileSync(
    bocAsHexJSON,
    JSON.stringify({
      hex: Cell.fromBoc(bocData)[0].toBoc().toString("hex"),
    })
  );

  // Remove temp file
  fs.unlinkSync(bocFileTemp);

  if (!fs.existsSync(bocAsHexJSON)) {
    console.log(`ERROR: Result json-file '${bocAsHexJSON}' was not generated`);
    process.exit(1);
  } else {
    console.log(`Build result: '${bocAsHexJSON}'`);
  }
}
