
import * as uuid from "uuid/v4";
import { prompt } from "promptly";

export const createTemplates = (projectKey: string): TemplateBuilder[] => [
    () => ({
        key: "appKey",
        defaultValue: projectKey
    }),
    () => ({
        key: "appName",
        question: "What should the project be called?",
        defaultValue: projectKey
    }),
    () => ({
        key: "author",
        question: "Who is creating this project?",
        defaultValue: projectKey
    }),
    () => ({
        key: "timezone",
        question: "What cron timezone should be used?",
        defaultValue: "Etc./UTC"
    }),
    () => ({
        key: "mysqlHost",
        question: "What is the mysql host?",
        defaultValue: "localhost"
    }),
    () => ({
        key: "mysqlPort",
        question: "What is the mysql port?",
        defaultValue: "3306"
    }),
    ({ appKey }) => ({
        key: "mysqlDatabase",
        question: "What is the mysql database name?",
        defaultValue: appKey
    }),
    ({ appKey }) => ({
        key: "mysqlUsername",
        question: "What is the mysql username?",
        defaultValue: appKey
    }),
    () => ({
        key: "mysqlPassword",
        question: "What is the mysql password?",
        defaultValue: uuid().toString()
    }),
    () => ({
        key: "jwtKey",
        defaultValue: uuid().toString()
    })
];

export interface Template {
    key: string;
    defaultValue: string;
    question?: string;
    example?: string;
}

export type TemplateResults = { [key: string]: any };
export type TemplateBuilder = (results: TemplateResults) => Template;

export async function parseTemplates (projectKey: string) {
    const result: { [key: string]: string } = {};

    for (const builder of createTemplates(projectKey)) {
        const template = builder(result);

        if (template.question) {
            let question = `${template.question}\n`;

            if (template.example) { question += `example: '${template.example}'\n` }
            if (template.defaultValue) { question += `default: '${template.defaultValue}'\n` }

            question += "\n>";

            result[template.key] = await prompt(question, { default: template.defaultValue });
        } else if (template.defaultValue) {
            result[template.key] = template.defaultValue;
        }

        console.log();
    }

    return result;
}
