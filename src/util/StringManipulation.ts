export function titleCase(str: string): string {
    if(str.length < 2) {
        return str.toUpperCase();
    }

    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function insertString(srcString: string, stringToInsert: string, insertIndex: number) {
    return srcString.substring(0, insertIndex) + stringToInsert + srcString.substring(insertIndex, srcString.length);
}

/** Gets the index corresponding to the beginning of the line that the currentSelectionIndex is on */
export function getBeginningOfLineIndex(srcString: string, currentSelectionIndex: number) {
    while(srcString.at(currentSelectionIndex) !== "\n") {
        if(currentSelectionIndex === 0) return 0;
        currentSelectionIndex--;
    }
    return currentSelectionIndex + 1; 
}

export function getIndexOfNextLine(srcString: string, currentSelectionIndex) {
    return srcString.substring(currentSelectionIndex, srcString.length).search(/\n/) + 1 + currentSelectionIndex;
}

export function removePrefix(srcString: string, prefix: string) {
    if(new RegExp(`^${prefix}`).test(srcString)) return srcString.substring(prefix.length, srcString.length);
    
    return srcString;
}

export function removeSuffix(srcString: string, suffix: string) {
    if(new RegExp(`${suffix}$`).test(srcString)) return srcString.substring(0, srcString.length - suffix.length);
    
    return srcString;
}