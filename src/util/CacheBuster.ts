(() => {
    const uniqueNum = new Date().getTime();

    for(const stylesheetLink of document.getElementsByTagName("link")) {
        if(stylesheetLink.rel !== "stylesheet") continue;

        stylesheetLink.href = `${stylesheetLink.href}?ver=${uniqueNum}`;
    }
})()