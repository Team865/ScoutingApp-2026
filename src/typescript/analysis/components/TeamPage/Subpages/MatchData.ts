import SubpageInterface from "./SubpageInterface";

export default class MatchDataSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");

    constructor() {
        this.mainContainer.innerText = "UNIMPLEMENTED";
    }

    public setTeam(teamNumber: number) {
        // Stub
    }

    public get domElement() {
        return this.mainContainer;
    }
}