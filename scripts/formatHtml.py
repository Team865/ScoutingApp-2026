from bs4 import BeautifulSoup
from bs4.formatter import HTMLFormatter
from pathlib import Path
import re

### BEAUTIFULSOUP CONFIG ###
formatter = HTMLFormatter(indent=2)
############################

for htmlPath in Path(".").rglob("*.html"):
    with open(htmlPath, "rt+") as htmlFile:
        htmlContents = htmlFile.read()
        soup = BeautifulSoup(htmlContents, "html.parser")
        formattedHtml = soup.prettify(formatter=formatter)
        # Truncate all white-space/new-line between a script's opening and closing tags
        
        formattedHtml = re.compile(r"(?<=module\">)(.)*?(?=</script>)", re.RegexFlag.DOTALL).sub("", formattedHtml)

        htmlFile.seek(0)
        htmlFile.truncate()
        htmlFile.write(formattedHtml)