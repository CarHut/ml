import fs from 'fs/promises';
import path from 'path';


const extensionsPath = 'C:\\Users\\Johny\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions'

class FileLoader {

    async loadExtensionFolders() {
        const extensions = [];
    
        try {
            const baseEntries = await fs.readdir(extensionsPath, { withFileTypes: true });
    
            for (const baseEntry of baseEntries) {
                if (baseEntry.isDirectory()) {
                    const extensionPath = path.join(extensionsPath, baseEntry.name);
    
                    // Get all entries in the current extension folder.
                    const versionEntries = await fs.readdir(extensionPath, { withFileTypes: true });
    
                    for (const versionEntry of versionEntries) {
                        if (versionEntry.isDirectory()) {
                            const versionFolderPath = path.join(extensionPath, versionEntry.name);
                            extensions.push(versionFolderPath); // Add version folder path to array.
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error while traversing folders: ${error.message}`);
        }
    
        return extensions;
    }

    // Currently there are 19 Chrome extensions
    pickRandomExtensionsFromList(extensions, rangeStart=5, rangeEnd=15) {
        if (extensions === null) {
            return null;
        }
        const pickedNumbers = [];
        const randomNumberOfPickedExtensions = Math.floor(Math.random() * (rangeEnd - rangeStart) + rangeStart);

        while (pickedNumbers.length < randomNumberOfPickedExtensions) {
            const randomPickedExtension = Math.floor(Math.random() * 19);
            if (pickedNumbers.some(ext => ext === randomPickedExtension)) {
                continue;
            } else {
                pickedNumbers.push(randomPickedExtension);
            }
        }

        const randomExtensions = [];
        for (let i = 0; i < pickedNumbers.length; i++) {
            randomExtensions.push(extensions[pickedNumbers[i]]);
        }

        return randomExtensions;
    }

    extensionsToString(extensions) {
        return extensions.join(',');
    }

}

export default FileLoader;


