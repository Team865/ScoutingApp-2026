export default class BottomBar {
    public readonly domElement = document.createElement("div");

    constructor() {
        this.domElement.classList.add("sticky-bottom");
    }
}