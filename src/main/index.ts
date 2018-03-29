#!/usr/bin/env node

import * as commander from "commander";
import { loadPackageMeta } from "./core/package-meta-loader";
import create from "./create";

const packageData = loadPackageMeta();

commander
    .command("create <dir>")
    .description("Create a new KomPOST project.")
    .action((dir) => {
        create(dir).then(() => {
            console.log("Project created!");
            process.exit(0);
        }).catch(error => console.log(`Error: ${error.message}`));
    });

if (process.argv.length < 3) {
    commander.help()
}

commander
    .version(packageData.version)
    .parse(process.argv);
