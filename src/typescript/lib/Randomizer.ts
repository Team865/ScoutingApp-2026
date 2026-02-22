if (!window.crypto.randomUUID) {
    /** This generation method was taken from https://stackoverflow.com/a/2117523 */
    window.crypto.randomUUID = () => {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        ) as `${string}-${string}-${string}-${string}-${string}`;
    };
}

export function getRandomUUID() {
    return crypto.randomUUID();
}

export function encrypt(text: string, key: string): string {
    const xorKeys = key.split("").map(keyStr => keyStr.charCodeAt(0));
    
    return text.split("").map((character, index) => {
        const keyIndex = index % xorKeys.length;
        return character.charCodeAt(0) ^ xorKeys[keyIndex];
    }).join(",");
}

export function decrypt(text: string, key: string): string {
    const xorKeys = key.split("").map(keyStr => keyStr.charCodeAt(0));
    
    return text.split(",").map((characterCode, index) => {
        const keyIndex = index % xorKeys.length;
        return String.fromCharCode(Number.parseInt(characterCode) ^ xorKeys[keyIndex]);
    }).join("");
}