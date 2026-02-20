export function titleCasePhraseToCamelCase(phrase: string) {
    if(phrase.length <= 1) return phrase.toLowerCase();

    const concatenated = phrase.split(" ").join("");

    return concatenated.slice(0, 1).toLowerCase() + concatenated.slice(1);
}