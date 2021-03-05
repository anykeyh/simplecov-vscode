export type ISimplecovFileCoverage = Array<number|null>;

export interface ISimplecovResultset {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  RSpec : {
    coverage: {
      lines: {
        [path : string] : ISimplecovFileCoverage;
      }
    }
  }
}