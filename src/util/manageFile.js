import splitFile from "split-file";

export const readFile = async (path) => {
    const file = await splitFile.splitFileBySize(path, 512);
    return file;
};
