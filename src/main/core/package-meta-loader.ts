
export function loadPackageMeta (): any {
    try {
        return require("../package.json");
    } catch (error) {}

    return require("../../package.json");
}
