
/**
 * @param {{ ISimplecovResultset { coverage: any;} }} resultSet
 */
export function getCoverage(resultSet) {
    // get the top level object
    const object1 = Object.keys(resultSet);
    //reference the top level object to get the coverage without hard coding the name so it will work with files with other top level objects.
    //allows other values besides RSpec without having to specify them.
    return resultSet[object1[0]].coverage;
}