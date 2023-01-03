const pickerButton = document.querySelector(".picker-btn")
const colorsList = document.querySelector(".color-list")
const clearAllBtn = document.querySelector(".clear-color")

// if data in localStorage get in initial run code
const colorsPickedList = JSON.parse(localStorage.getItem("picked-color") || "[]")

// convert rgba to hex 
const rgbaToHex = (rgba) => {
    const rgb = rgba.substring(5, rgba.length - 1).split(",")
    return "#" + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
}

// when click to color item color copied
const copyColor = (element) => {
    copyText(element.dataset.color)
    // change element text after copy and reset with settimeout
    element.innerHTML = "Copied"
    setTimeout(() => element.innerHTML = element.dataset.color, 500);
}

const copyText = (text) => {
    // check the browser to support navigator api
    if (window.navigator) {
        navigator.clipboard.writeText(text)
    } else {
        console.log("Yor browser does not support navigator api");
    }
}

// create and update ui after all change
const createUiColorList = () => {
    const colorItem = colorsPickedList.map(color => {
        return `
        <li class="color-item">
            <span class="rect-color" style="background:${color}; border: 1px solid #bfbfbf;"></span>
            <span class="color-value" data-color="${color}">${color}</span>
        </li>
      `
    }).join("")
    colorsList.innerHTML = colorItem

    // set navigator copy to all item color in color list
    colorsList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", (e) => {
            copyColor(e.currentTarget.lastElementChild)
        })
    })
}
// initial create ui with localStorage data
createUiColorList()

// clear all color list and update localStorage  
const clearAllColor = () => {
    colorsPickedList.length = 0
    localStorage.setItem("picked-color", JSON.stringify(colorsPickedList))
    createUiColorList()
}

// handel picked color with EyeDropper api 
// EyeDropper api does not supported in all browsers just chrome, opera and edge
const pickedColor = async () => {
    document.body.style.display = "none"
    // remove body after clicked button picker and open Eyedropper tool to target color under the body
    setTimeout(async () => {
        try {
            const eyeDraper = new EyeDropper()
            // destructure color from Dropper api
            const { sRGBHex } = await eyeDraper.open()
            // send value to convert rgba to hex function
            const convertToHex = rgbaToHex(sRGBHex)
            copyText(convertToHex)
            if (!colorsPickedList.includes(convertToHex)) {
                colorsPickedList.push(convertToHex)
            }
            // save color picked in localStorage and update ui
            localStorage.setItem("picked-color", JSON.stringify(colorsPickedList))
            createUiColorList()
        } catch (error) {
            console.log(error.message)
        }
        document.body.style.display = "block"
    }, 10);
}

// Event handler for picked color and clear color list
pickerButton.addEventListener("click", pickedColor)
clearAllBtn.addEventListener("click", clearAllColor)


