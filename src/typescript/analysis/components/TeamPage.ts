import AppData from "../AppData";

export default class TeamPage {
    private readonly pageContainer = document.createElement("div");

    public readonly exitButton = document.createElement("button");
    private readonly pageTitle = document.createElement("h1");

    constructor() {
        this.pageContainer.id = "team-page";
        this.pageContainer.hidden = true;

        this.exitButton.id = "exit-page";
        this.exitButton.innerText = "Return";
        this.exitButton.addEventListener("click", () => this.pageContainer.hidden = true);

        this.pageContainer.append(
            this.exitButton,
            this.pageTitle
        );
    }

    public open(teamNumber: number) {
        const teamData = AppData.superscouting.fetched_team_data.find(
            (team) => team.number === teamNumber
        );
        
        this.pageTitle.innerText = `${teamData.number}: ${teamData.name}`;
        this.pageContainer.hidden = false;
    }

    public get domElement() {
        return this.pageContainer;
    }
}