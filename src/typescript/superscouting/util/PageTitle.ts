export function setPageTitle(title: string) {
  const titleElement = document.getElementById("page-title");
  if (titleElement) {
    titleElement.textContent = title;
  }
}