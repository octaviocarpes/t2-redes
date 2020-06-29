import splitFile from "split-file";

export const readFile = async (path) => {
    const file = await splitFile.splitFileBySize(path, 256);
    return file;
};
