const wildcardRegex = /%s/;
const wildcardPlaceholders = "ABCDEF";

export function replaceWildcards(stringFormat: string) {
    let formattedString = stringFormat;
    let doesMatch = wildcardRegex.test(formattedString);
    let i = 0;

    while(doesMatch) {
        formattedString = formattedString.replace(wildcardRegex, wildcardPlaceholders[i]);
        doesMatch = wildcardRegex.test(formattedString);
        i++;
    }

    return formattedString;
}