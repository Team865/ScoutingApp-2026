import HTMLClassObserver from "../../lib/dataTypes/HTMLClassObserver.js";

/** accordionContainer is the parent container encompassing the entire accordion,
 * and accordionContentsDiv is the div containing all the content that should collapse/expand
*/
export function bindAccordionBehavior(accordionContainer: HTMLDivElement, accordionContentsDiv: HTMLDivElement) {
    accordionContentsDiv.classList.add("accordion-body");

    const updateSize = () => {
        // Accordion is open
        if (accordionContainer.classList.contains("active")) {
            accordionContentsDiv.style.maxHeight = `${accordionContentsDiv.scrollHeight}px`;
        } else {
            // Ensure there is an initial height so it can ease
            accordionContentsDiv.style.maxHeight = `${accordionContentsDiv.scrollHeight}px`;
            // Close accordion, set a little delay so it can apply the previous change first
            setTimeout(() => accordionContentsDiv.style.maxHeight = "0px", 0);
        }
    }

    // Set initial max height
    accordionContentsDiv.style.maxHeight = (accordionContainer.classList.contains("active")) ?
        `${accordionContentsDiv.scrollHeight}px` :
        "0px";
    
    new HTMLClassObserver(accordionContainer, "active", updateSize);

    accordionContentsDiv.addEventListener("transitionend", e => {
        if(e.propertyName !== "max-height") return;
        if(accordionContentsDiv.style.maxHeight === "0px") return;

        // Make content scale automatically once the accordion is fully open
        accordionContentsDiv.style.maxHeight = null; 
    });
}