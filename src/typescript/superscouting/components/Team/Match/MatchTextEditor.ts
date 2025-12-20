import { insertString, removePrefix, removeSuffix } from "../../../util/StringManipulation";

export default function bindTextEditorBehavior(textEditorDiv: HTMLDivElement) {
    textEditorDiv.contentEditable = "plaintext-only";
    textEditorDiv.style.whiteSpace = "pre-wrap";

    // Returns null if the selection isn't valid
    const getSelection = (): Selection | null => {
        const selectionObject = window.getSelection();
        if(!(selectionObject.anchorNode instanceof Text)) return;
        if(selectionObject.anchorNode.nodeType !== Node.TEXT_NODE) return;

        return selectionObject;
    }

    const tabBehaviour = (e: KeyboardEvent) => {
        const selectionObject = getSelection();
        if(!selectionObject) return;
        e.preventDefault();

        const range = selectionObject.getRangeAt(0);
        let startIndex = range.startOffset;
        let endIndex = range.endOffset;

        // Only selecting one node, just insert a tab
        if(range.startContainer === range.endContainer && startIndex === endIndex) {
            range.startContainer.textContent = insertString(
                range.startContainer.textContent,
                "\t",
                startIndex
            );

            startIndex++;
            endIndex++;
        } else {
            let tabFunction: (referenceNode: Node) => void;
            
            if(e.shiftKey) {
                tabFunction = (referenceNode) => referenceNode.textContent = removePrefix(referenceNode.textContent, "\t");
                if(range.startContainer.textContent.startsWith("\t")) startIndex--;
                if(range.endContainer.textContent.startsWith("\t")) endIndex--;
            } else {
                tabFunction = (referenceNode) => referenceNode.textContent = "\t" + referenceNode.textContent;
                startIndex++;
                endIndex++;
            }

            // Selecting multiple lines
            const nodeIterator = document.createNodeIterator(range.commonAncestorContainer);
            // Find the first node
            while(nodeIterator.nextNode()) {
                if(nodeIterator.referenceNode === range.startContainer) {
                    tabFunction(nodeIterator.referenceNode);
                    break;
                }
            }

            // Loop until you reach the end (unlikely) or you reach the final selected node
            while(nodeIterator.nextNode()) {
                if(nodeIterator.referenceNode.textContent === "\n") continue; // Ignore new line text nodes
                tabFunction(nodeIterator.referenceNode);
                
                // Exit if the node is the final selected node
                if(nodeIterator.referenceNode === range.endContainer) break;
            }
        }

        range.setStart(range.startContainer, startIndex);
        range.setEnd(range.endContainer, endIndex);
    }

    const enterBehavior = (e: KeyboardEvent) => {
        const selectionObject = getSelection();
        if(!selectionObject) return;

        const range = selectionObject.getRangeAt(0);
        const startContainer = range.startContainer;
        const startIndex = range.startOffset;
        const endIndex = range.endOffset;

        const startingWhitespace = startContainer.textContent.match(/^[\s\t]*/)[0];

        // If this doesn't pass then the line can't be a bullet point
        if(startContainer.textContent.length <= startingWhitespace.length + 1) return;

        const firstNonWhitespaceChar = startContainer.textContent[startingWhitespace.length];
        if(firstNonWhitespaceChar !== "-") return;
        e.preventDefault();

        const newBulletpointNode = document.createTextNode(startingWhitespace + "- ");

        startContainer.parentNode.insertBefore(newBulletpointNode, startContainer.nextSibling);
        startContainer.parentNode.insertBefore(document.createTextNode("\n"), newBulletpointNode);

        range.setStart(newBulletpointNode, newBulletpointNode.textContent.length);
        range.collapse(true);
    }

    textEditorDiv.addEventListener("keydown", e => {
        const selectionObject = window.getSelection();
        const anchorNode = selectionObject.anchorNode;

        if(e.key === "Enter") {
            enterBehavior(e);
        } else if(e.key === "Tab") {
            tabBehaviour(e);
        }
    });

    textEditorDiv.addEventListener("input", e => {
        const breakTags = textEditorDiv.querySelectorAll("br");

        for(const breakTag of breakTags.values()) {
            breakTag.parentNode.insertBefore(document.createTextNode("\n"), breakTag);
            breakTag.remove();
        }
    });
}