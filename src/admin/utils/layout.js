export async function loadAdminLayout() {
    try {
        const response = await fetch('/src/admin/layouts/AdminLayout.html');
        const html = await response.text();

        // Extract sidebar and header
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sidebar = doc.querySelector('#sidebar').outerHTML;
        const header = doc.querySelector('.admin-header').outerHTML;

        // Insert into current page
        document.querySelector('#adminLayout').innerHTML = sidebar + header;
    } catch (error) {
        console.error('Error loading admin layout:', error);
    }
}