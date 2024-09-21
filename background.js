let data = null;

async function init() {
    if (data) return;
    const fetchData = await fetch('./data.json')
    data = await fetchData.json();
}

chrome.runtime.onInstalled.addListener(async() => {
    await init();
    data?.forEach((el, i) => {
        chrome.contextMenus.create({
            id: el.id,
            title: el.title,
            contexts: el.contexts,
            parentId: i == 0 ? null : el.parentId
        });
    });
});

chrome.contextMenus.onClicked.addListener(async(request, sender) => {
    await init();
    const menu = data?.filter(el => el.id === request.menuItemId);
    if (!menu || !menu.length) return;
    chrome.tabs.create({ url: menu[0].url.replace("{TEXT}", request.selectionText).replace("{SRC}", request.srcUrl) });
});