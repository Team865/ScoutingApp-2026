export function positionWithinDOMRect(positionX: number, positionY: number, domRect: DOMRect) {
    return (domRect.left <= positionX && positionX <= domRect.right) &&
        (domRect.top <= positionY && positionY <= domRect.bottom)
}

export function doesDOMRectsOverlap(domRect1: DOMRect, domRect2: DOMRect) {
    return (domRect1.left <= domRect2.right && domRect1.right >= domRect2.left) &&
        (domRect1.top <= domRect2.bottom && domRect1.bottom >= domRect2.top);
}

export function setTitleHeading(title: string) {
    const titleElement = document.getElementById("page-title");
    if (titleElement) {
        titleElement.textContent = title;
    }
}

function validateIntegerInput(startInput: string, newInput: string): string {
    if(Number.isNaN(Number.parseFloat(newInput))) return startInput;
    if(Number.isInteger(newInput)) return newInput;

    return Math.trunc(Number.parseFloat(newInput)).toString();
}

export function makeInputIntegerOnly(input: HTMLInputElement, min?: number, max?: number) {
    let previousInput: string = input.value;

    input.addEventListener("focusin", () => previousInput = input.value);
    input.addEventListener("focusout", () => input.value = validateIntegerInput(previousInput, input.value));
}