export class Loading {
    static show() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner-overlay';
        spinner.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.appendChild(spinner);
    }

    static hide() {
        const spinner = document.querySelector('.spinner-overlay');
        if (spinner) {
            spinner.remove();
        }
    }
}