export enum Element {
    H1,
    TEXT
}

export default class HTMLStringBuilder {
    private stringRepresentation = "";

    public append(text: string, elementType?: Element) {
        elementType = (elementType === undefined) ? Element.TEXT : elementType;

        switch(elementType) {
            case Element.H1:
                this.stringRepresentation += `<h1>${text}</h1>\n`;
                break;
            case Element.TEXT:
                this.stringRepresentation += `<p>${text}</p>\n`;
                break;
            default:
                throw new Error(`${elementType} is not implemented.`);
        }

        return this;
    }

    public toString() {
        return this.stringRepresentation;
    }
}