import { readFileSync } from "fs";
import { ISimplecovResultset } from "./ISimplecovResultset";

export async function readResultSet(filename : string) {
  return JSON.parse(readFileSync(filename, 'utf8')) as ISimplecovResultset;
}

export function load() {

}