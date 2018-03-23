
import * as klaw from "klaw";

export type Filter = (file: string) => boolean;

export function walk (dir: string, filter: Filter = () => true) {
    return new Promise<string[]>((resolve, reject) => {
        const items: string[] = [];

        klaw(dir)
            .on("data", item => filter(item.path) ? items.push(item.path) : undefined)
            .on("error", error => reject(error))
            .on("end", () => resolve(items));
    });
}
