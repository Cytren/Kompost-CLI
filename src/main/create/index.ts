
import { walk } from "../core/walker";
import { parseTemplates } from "./template";
import { existsSync, readFile, writeFile, unlink, remove } from "fs-extra";
import { resolve } from "path";
import { exec } from "shelljs";

const TEMPLATE_PROPERTY_REGEX = /\$#([-_a-zA-Z0-9]+)#\$/g;

function execute (message: string, command: string) {
    console.log(`${message}...`);
    exec(command, { silent: true });
}

export default async function create (projectKey: string) {
    const dir = resolve(`${process.cwd()}/${projectKey}`);

    if (existsSync(dir)) {
        throw new Error("The project already exists!");
    }

    const templateResults = await parseTemplates(projectKey);

    execute("Cloning template",
        `git clone git@github.com:Cytren/Kompost-Template.git ${projectKey}`);

    await remove(`${dir}/.git`);

    const templatePaths = await walk(`${dir}/template`, path => path.endsWith(".template"));

    for (const templatePath of templatePaths) {
        const content = await readFile(templatePath, "utf-8");
        const data = content.replace(TEMPLATE_PROPERTY_REGEX, (substring, key) => templateResults[key]);
        const path = templatePath
            .substring(0, templatePath.length - 9)
            .replace(/template\//g, "");

        await writeFile(path, data, "utf-8");
        await unlink(templatePath);
    }

    const executeInProject = (message: string, command: string) =>
        execute(message, `cd ${projectKey} && ${command}`);

    executeInProject("Installing npm dependencies", "npm i");
    executeInProject("Creating git repo", "git init");
    executeInProject("Creating initial git commit", "git add . && git commit -m 'Initial commit'");

    console.log();
}
