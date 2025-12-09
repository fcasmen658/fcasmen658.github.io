export default class ModalGenerator {
    static newModal(text) {
        const modalContainer = parseHTML(`
            <div class="modal-container">
                <div class="modal-content">
                    <div>${text}</div>
                    <button class="close-button">Cerrar</button>
                </div>
            </div>
        `);

        const close = () => {
            modalContainer.remove();
        };

        modalContainer
            .querySelector('.close-button')
            .addEventListener('click', close);

        // Cerrar al hacer clic fuera del contenido
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                close();
            }
        });

        document.body.appendChild(modalContainer);
    }
}

function parseHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
