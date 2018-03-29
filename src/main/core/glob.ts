
import * as performGlob from "glob";
import { resolve as resolvePath } from "path";

export function glob (pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        performGlob(pattern, (error: Error, matches: string[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(matches.map(path => resolvePath(path)));
            }
        });
    });
}
