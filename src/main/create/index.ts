
import { walk } from "../core/walker";
import { glob } from "../core/glob";
import { parseTemplates } from "./template";
import { copy, existsSync, readFile, writeFile, unlink } from "fs-extra";
import { resolve } from "path";
import { exec } from "shelljs";

const TEMPLATE_PROPERTY_REGEX = /\$#([-_a-zA-Z0-9]+)#\$/g;

function getBasePath () {
    const productionPath = resolve(`${__dirname}/../../template`);

    if (existsSync(productionPath)) {
        return productionPath;
    }

    return resolve(`${__dirname}/../../../template`);
}

export default async function create (projectKey: string) {
    const dir = resolve(`${process.cwd()}/${projectKey}`);

    if (existsSync(dir)) {
        throw new Error("The project already exists!");
    }

    const templateResults = await parseTemplates(projectKey);

    const basePath = getBasePath();
    const files = await glob(`${basePath}/**/{*,.*}`);

    for (const file of files) {
        await copy(file, file.replace(basePath, dir));
    }

    const templatePaths = await walk(dir, path => path.endsWith(".template"));

    for (const templatePath of templatePaths) {
        const content = await readFile(templatePath, "utf-8");
        const data = content.replace(TEMPLATE_PROPERTY_REGEX, (substring, key) => templateResults[key]);
        const path = templatePath.substring(0, templatePath.length - 9);

        await writeFile(path, data, "utf-8");
        await unlink(templatePath);
    }

    const executeInProject = (message: string, command: string) => {
        console.log(`${message}...`);
        exec(`cd ${projectKey} && ${command}`, { silent: true });
    };

    executeInProject("Installing npm dependencies", "npm i");
    executeInProject("Installing latest version of KomPOST", "npm i --save kompost");
    executeInProject("Creating git repo", "git init");
    executeInProject("Creating initial git commit", "git add . && git commit -m 'Initial commit'");

    console.log();
}
