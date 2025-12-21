import AppData from "../AppData";

export default class TeamCard {
    private readonly teamNumber: number;
    private readonly teamName: string;

    private readonly mainButton = document.createElement("button");
    private readonly epaLabel = document.createElement("span");

    constructor(teamNumber: number) {
        const teamData = AppData.superscouting.fetched_team_data.find(
            (team) => team.number === teamNumber
        );

        this.teamNumber = teamNumber;
        this.teamName = teamData.name;
        this.epaLabel.innerText = `EPA: ${Math.round((teamData.epa || teamData.normalized_epa) * 10) / 10}`;
        this.mainButton.classList.add("team-card");
        this.mainButton.innerText = this.teamString;

        this.mainButton.appendChild(this.epaLabel);
    }

    public get teamString() {
        return `${this.teamNumber}: ${this.teamName}`;
    }

    public get domElement() {
        return this.mainButton;
    }
}