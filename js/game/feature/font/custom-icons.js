const icons = new ig.Font("media/font/ag-icons.png", 16, ig.MultiFont.ICON_START);
const smallIcons = new ig.Font("media/font/ag-icons-small.png", 14, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;
const smallFontIndex = sc.fontsystem.smallFont.iconSets.length;

sc.fontsystem.font.pushIconSet(icons);
sc.fontsystem.smallFont.pushIconSet(smallIcons);

sc.fontsystem.font.setMapping({
    "status-cond-0": [fontIndex, 0],
})
sc.fontsystem.smallFont.setMapping({
    "daze": [smallFontIndex, 0]
})