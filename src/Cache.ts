import { readFileSync, statSync } from "fs";
import { ISimplecovResultset } from "./ISimplecovResultset";

var cachedResult : ISimplecovResultset;
var cacheTime : number = 0;

export async function readResultSet(filename : string) {
  let stats = statSync(filename);

  if(!cachedResult || stats.mtimeMs !== cacheTime) {
    cachedResult = JSON.parse(readFileSync(filename, 'utf8')) as ISimplecovResultset;
    cacheTime = stats.mtimeMs;
  }

  return cachedResult;
}