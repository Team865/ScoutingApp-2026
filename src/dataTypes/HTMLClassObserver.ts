export default class HTMLClassObserver {
    private targetHTML: HTMLElement;
    private callback: Function;
    private observer: MutationObserver;
    private previousClassState: boolean;
    private classToWatch: string

    constructor(targetHTML: HTMLElement, classToWatch: string, callback: () => void) {
        this.targetHTML = targetHTML;
        this.classToWatch = classToWatch;
        this.callback = callback;
        this.previousClassState = targetHTML.classList.contains(classToWatch);
        this.observer = new MutationObserver((mutationList) => this.mutationCallback(mutationList));
        this.observer.observe(targetHTML, {attributes: true});
    }

    private hasClassChanged(): boolean {
        const currentState = this.targetHTML.classList.contains(this.classToWatch);
        const hasChanged = this.previousClassState !== currentState;

        this.previousClassState = currentState;

        return hasChanged;
    }

    private mutationCallback(mutationList: MutationRecord[]) {
        for(const mutation of mutationList) {
            if(mutation.type !== "attributes") continue;
            if(mutation.attributeName !== "class") continue;
            if(!this.hasClassChanged()) continue;

            this.callback();
            return;
        }
    }

    public disconnect() {
        this.observer.disconnect();
    }
}