export default class SearchBar {
    private readonly container = document.createElement("div");
    private readonly input = document.createElement("input");

    constructor() {
        this.container.classList.add("search-bar");
        this.container.appendChild(this.input);
    }

    /** 
     * Compares the search bar's input to the referenceString
     * and returns whether search input matches the referenceString
     */
    searchTest(referenceString: string): boolean {
        const searchString = this.input.value;
        if(!searchString) return true; // All checks pass if there is no search input
        const searchRegex = new RegExp(searchString, "gi");

        return searchRegex.test(referenceString);
    }

    /**
     * Same thing as searchTest(), except instead is applied for an array of referenceStrings
     * 
     * Serves as a way to check multiple strings without unnecessarily recompiling the regex
     * 
     * @return an array of the test results which maps 1-to-1 to the referenceStrings[] array.
    */
    batchSearchTest(referenceStrings: string[]): boolean[] {
        const searchString = this.input.value;
        if(!searchString) {
            return new Array(referenceStrings.length).fill(true);;
        }

        const searchRegex = new RegExp(searchString, "gi");

        return referenceStrings.map(refString => searchRegex.test(refString));
    }

    get containerElement() {
        return this.container;
    }

    get inputElement() {
        return this.input;
    }
}