export const setDisplay = (id: string, value: string) => {
    const el = document.getElementById(id)
    if (el) el.style.display = value
}

export const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
