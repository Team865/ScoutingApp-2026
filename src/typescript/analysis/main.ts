import {
    Chart,
    ChartConfiguration,
    ChartData,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

Chart.register([
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
]);

const testChart = document.getElementById("test-chart");

const data: ChartData = {
    labels: [1, 2, 3, 4, 5],
    datasets: [
        {
            label: "Dataset 1",
            data: [20, 21, 45, 39, 19],
            borderColor: "rgba(63, 66, 163, 1)"
        },
    ],
};

const config: ChartConfiguration = {
    type: "line",
    data: data
};

new Chart(testChart as any, config);
