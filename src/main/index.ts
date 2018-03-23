#!/usr/bin/env node

import * as commander from "commander";
import create from "./create";

const packageData = require("../../package.json");

commander
    .command("create <dir>")
    .description("Create a new KomPOST project.")
    .action((dir) => {
        create(dir)
            .then(() => console.log("Project created!"))
            .catch(error => console.log(`Error: ${error.message}`));
    });

if (process.argv.length < 3) {
    commander.help()
}

commander
    .version(packageData.version)
    .parse(process.argv);
