import BottomBar from "../components/BottomBar";

export default abstract class Page {
    public readonly header = document.createElement("h1");
    public readonly domElement = document.createElement("div");
    public readonly bottomBar = new BottomBar();

    constructor(title: string) {
        this.domElement.classList.add("page");
        this.domElement.appendChild(this.header);
        this.header.textContent = title;
    }

    public updateAppData() {}
}