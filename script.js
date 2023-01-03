const pickerButton = document.querySelector(".picker-btn")

const pickedColor = async () => {
    try {
        const eyeDraper = new EyeDropper()
        const { sRGBHex } = await eyeDraper.open()
        navigator.clipboard.writeText(sRGBHex)
    } catch (error) {
        console.log(error.message)
    }
}

pickerButton.addEventListener("click", pickedColor)