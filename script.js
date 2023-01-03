const pickerButton = document.querySelector(".picker-btn")
const colorsList = document.querySelector(".color-list")
const clearAllBtn = document.querySelector(".clear-color")
const colorsPickedList = JSON.parse(localStorage.getItem("picked-color") || "[]")


const rgbaToHex = (rgba) => {
    const rgb = rgba.substring(5, rgba.length - 1).split(",")
    return "#" + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
}

const copyColor = (element) => {
    navigator.clipboard.writeText(element.dataset.color)
    element.innerHTML = "Copied"
    setTimeout(() => element.innerHTML = element.dataset.color, 500);
}

const createUiColorList = () => {
    const colorItem = colorsPickedList.map(color => {
        return `
        <li class="color-item">
            <span class="rect-color" style="background:${color}; border: 1px solid ${color === "#ffffff" ? "#000" : color}"></span>
            <span class="color-value" data-color="${color}">${color}</span>
        </li>
      `
    }).join("")
    colorsList.innerHTML = colorItem

    colorsList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", (e) => {
            copyColor(e.currentTarget.lastElementChild)
        })
    })
}
createUiColorList()

const clearAllColor = () => {
    colorsPickedList.length = 0
    localStorage.setItem("picked-color", JSON.stringify(colorsPickedList))
    createUiColorList()
}

const pickedColor = async () => {
    try {
        const eyeDraper = new EyeDropper()
        const { sRGBHex } = await eyeDraper.open()
        const convertToHex = rgbaToHex(sRGBHex)
        navigator.clipboard.writeText(convertToHex)
        if (!colorsPickedList.includes(convertToHex)) {
            colorsPickedList.push(convertToHex)
        }
        localStorage.setItem("picked-color", JSON.stringify(colorsPickedList))
        createUiColorList()
    } catch (error) {
        console.log(error.message)
    }
}

pickerButton.addEventListener("click", pickedColor)
clearAllBtn.addEventListener("click", clearAllColor)


