
export default class Warning {
    static checkIfMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
            const warning = document.createElement('div')
            warning.style.position = 'fixed'
            warning.style.top = '0'
            warning.style.left = '0'
            warning.style.width = '100%'
            warning.style.height = '100%'
            warning.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'
            warning.style.color = '#fff'
            warning.style.zIndex = '9999'
            warning.style.display = 'flex'
            warning.style.flexDirection = 'column'
            warning.style.justifyContent = 'center'
            warning.style.alignItems = 'center'
            warning.style.textAlign = 'center'
            warning.style.padding = '2rem'
            warning.style.fontFamily = 'Arial, sans-serif'

            warning.innerHTML = `
                <h2 style="margin-bottom: 1rem;">Experience not optimized for mobile</h2>
                <p>To fully enjoy this visualization, please view this site on a computer.</p>
            `

            document.body.appendChild(warning)
        }
    }
}