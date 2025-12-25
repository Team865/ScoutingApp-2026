import { CategoryScale, Chart, ChartConfiguration, ChartData, LinearScale, LineController, LineElement, PointElement } from "chart.js";
import SubpageInterface from "./SubpageInterface";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
);

export default class VisualizerSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");
    private readonly chartCanvas = document.createElement("canvas");

    private readonly chartConfig: ChartConfiguration = {
        type: "line",
        data: {
            labels: Array.from(new Array(10).keys()).map(i => i + 1),
            datasets: []
        }
    };

    private readonly chart = new Chart(this.chartCanvas, this.chartConfig);
    
    constructor() {
        this.mainContainer.style.backgroundColor = "#fff";
        this.mainContainer.style.width = "min(800px, 90%)";
        this.mainContainer.style.padding = "1rem";
        this.mainContainer.append(this.chartCanvas);
    }

    public setTeam(teamNumber: number) {
        this.chart.data.datasets.splice(0);
        this.chart.data.datasets.push({
            label: `Team ${teamNumber}`,
            data: this.chart.data.labels.map(_ => Math.random() * 20),
            backgroundColor: "#fff",
            borderColor: "#f00"
        });

        console.log(this.chart.data);

        this.chart.update();
    }

    public get domElement() {
        return this.mainContainer;
    }
}