import Vector2 from "./dataTypes/Vector2";

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

    input.type = "number";
    input.pattern = "[0-9]*";

    input.addEventListener("focusin", () => previousInput = input.value);
    input.addEventListener("focusout", () => input.value = validateIntegerInput(previousInput, input.value));
}

/** Positions an HTML element proportionally to its parent container.
 * @param element the HTML element
 * @param position the position, where (0, 0) would be the top-left of the parent container and (1, 1) would be the bottom right
 * @param anchorPoint the anchorPoint, where (0, 0) would place the anchor point in the top-left of the element and (1, 1) would be bottom-right
 */
export function absolutePosition(element: HTMLElement, position: Vector2, anchorPoint?: Vector2) {
    element.style.position = "absolute";

    if(anchorPoint) {
        element.style.transform = `translate(-${anchorPoint.x * 100}%, -${anchorPoint.y * 100}%)`;
    }

    element.style.left = `${position.x * 100}%`;
    element.style.top = `${position.y * 100}%`;
}