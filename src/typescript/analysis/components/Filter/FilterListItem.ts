import { BlockCore } from "./Blocks/Core/BlockCore";

export default class FilterListItem {
    public filter: BlockCore;
    public readonly filterName: string;

    public readonly domElement = document.createElement("div");
    public readonly loadButton = document.createElement("button");
    public readonly deleteButton = document.createElement("button");

    public constructor(filterName: string, filter: BlockCore) {
        this.domElement.classList.add("filter-list-item");

        this.filterName = filterName;
        this.filter = filter;

        const filterNameLabel = document.createElement("span");
        filterNameLabel.innerText = filterName;

        {
            const loadImage = document.createElement("img");
            const deleteImage = document.createElement("img");

            loadImage.src = "./static/deploy/icons/load.svg";
            loadImage.alt = "Load";
            
            deleteImage.src = "./static/deploy/icons/trashCan.svg";
            deleteImage.alt = "Delete";

            this.loadButton.appendChild(loadImage);
            this.deleteButton.appendChild(deleteImage);
        }

        this.domElement.append(filterNameLabel, this.loadButton, this.deleteButton);
    }
}