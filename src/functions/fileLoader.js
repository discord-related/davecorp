/* eslint-disable no-undef */
const glob = require("glob");
const { promisify } = require("util");
const proGlob = promisify(glob);

async function loadFiles(dirName) {
    try {
        const Files = await proGlob(
            `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
        );
        Files.forEach((file) => delete require.cache[require.resolve(file)]);
        return Files;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { loadFiles };