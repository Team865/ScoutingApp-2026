export default interface Page {
    readonly id: string;
    show(pageContainer: HTMLDivElement): void;
    hide(): void;
}