
import * as performGlob from "glob";

export function glob (pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        performGlob(pattern, (error: Error, matches: string[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(matches);
            }
        });
    });
}
