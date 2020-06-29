import fs from "fs";

export const deleteTemporaryFiles = (fileArray) => {
    console.log("Deleting temporary files");
    for (const path of fileArray) {
        console.log(`Deleting file ${path}`);
        fs.unlinkSync(path);
    }
};
