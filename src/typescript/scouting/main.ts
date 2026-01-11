import FuelCounter from "./components/FuelCounter"

const mainElement: HTMLElement = document.querySelector("main");
const testFuelCounter = new FuelCounter();

mainElement.appendChild(testFuelCounter.domElement);