        // Array para almacenar las entregas
        let deliveries = JSON.parse(localStorage.getItem('recordatoriosEntregas')) || [];

        // Elementos del DOM
        const descriptionInput = document.getElementById('description');
        const datetimeInput = document.getElementById('datetime');
        const addBtn = document.getElementById('add-btn');
        const deliveriesList = document.getElementById('deliveries-list');
        const noDeliveries = document.getElementById('no-deliveries');
        const clearBtn = document.getElementById('clear-btn');

        // Función para formatear fecha
        function formatDate(date) {
            return new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }

        // Función para calcular y formatear tiempo restante/transcurrido
        function getTimeDifference(targetDate) {
            const now = new Date();
            const target = new Date(targetDate);
            const diff = target - now;

            const isPast = diff < 0;
            const absDiff = Math.abs(diff);

            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

            let timeString = '';

            if (days > 0) {
                timeString += `${days}d `;
            }
            if (hours > 0 || days > 0) {
                timeString += `${hours}h `;
            }
            if (minutes > 0 || hours > 0 || days > 0) {
                timeString += `${minutes}m `;
            }
            timeString += `${seconds}s`;

            return {
                isPast,
                timeString: timeString.trim(),
                days,
                hours,
                minutes,
                seconds
            };
        }

        // Función para crear elemento de entrega
        function createDeliveryElement(delivery, index) {
            const deliveryDiv = document.createElement('div');
            deliveryDiv.className = 'delivery-item';
            deliveryDiv.dataset.index = index;

            const timeInfo = getTimeDifference(delivery.datetime);
            const isExpired = timeInfo.isPast;

            deliveryDiv.classList.add(isExpired ? 'vencido' : 'activo');

            deliveryDiv.innerHTML = `
                <div class="delivery-header">
                    <h3 class="delivery-title">${delivery.description}</h3>
                    <div class="delivery-actions">
                        <button class="btn-edit" onclick="startEdit(${index})" title="Editar">✏️</button>
                        <button class="btn-delete" onclick="deleteDelivery(${index})" title="Eliminar">×</button>
                    </div>
                </div>
                <div class="delivery-datetime">
                    ${formatDate(new Date(delivery.datetime))}
                </div>
                <div class="delivery-countdown ${isExpired ? 'expired' : ''}">
                    ${isExpired ? 'Hace' : 'Faltan'} ${timeInfo.timeString}
                </div>
                <div class="edit-form" style="display: none;">
                    <input type="text" class="edit-description" value="${delivery.description}" maxlength="100">
                    <input type="datetime-local" class="edit-datetime" value="${delivery.datetime.slice(0, 16)}">
                    <div class="edit-buttons">
                        <button class="btn-save" onclick="saveEdit(${index})">Guardar</button>
                        <button class="btn-cancel" onclick="cancelEdit(${index})">Cancelar</button>
                    </div>
                </div>
            `;

            return deliveryDiv;
        }

        // Función para renderizar todas las entregas
        function renderDeliveries() {
            const container = deliveriesList.querySelector('.deliveries-container') ||
                            deliveriesList.appendChild(document.createElement('div'));

            container.className = 'deliveries-container';
            container.innerHTML = '';

            if (deliveries.length === 0) {
                noDeliveries.style.display = 'block';
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
                return;
            }

            noDeliveries.style.display = 'none';

            // Ordenar por fecha (más próximas primero)
            const sortedDeliveries = [...deliveries].sort((a, b) =>
                new Date(a.datetime) - new Date(b.datetime)
            );

            sortedDeliveries.forEach((delivery, originalIndex) => {
                const deliveryElement = createDeliveryElement(delivery, originalIndex);
                container.appendChild(deliveryElement);
            });
        }

        // Función para añadir nueva entrega
        function addDelivery() {
            const description = descriptionInput.value.trim();
            const datetime = datetimeInput.value;

            if (!description) {
                alert('Por favor, introduce una descripción para la entrega.');
                descriptionInput.focus();
                return;
            }

            if (!datetime) {
                alert('Por favor, selecciona una fecha y hora para la entrega.');
                datetimeInput.focus();
                return;
            }

            const targetDate = new Date(datetime);
            const now = new Date();

            if (targetDate <= now) {
                alert('La fecha debe ser futura.');
                datetimeInput.focus();
                return;
            }

            deliveries.push({
                description,
                datetime,
                created: new Date().toISOString()
            });

            // Guardar en localStorage
            localStorage.setItem('recordatoriosEntregas', JSON.stringify(deliveries));

            // Limpiar formulario
            descriptionInput.value = '';
            datetimeInput.value = '';

            // Renderizar
            renderDeliveries();

            // Enfocar descripción para añadir otra
            descriptionInput.focus();
        }

        // Función para eliminar entrega
        function deleteDelivery(index) {
            if (confirm('¿Estás seguro de que quieres eliminar esta entrega?')) {
                deliveries.splice(index, 1);
                localStorage.setItem('recordatoriosEntregas', JSON.stringify(deliveries));
                renderDeliveries();
            }
        }

        // Función para iniciar edición
        function startEdit(index) {
            const deliveryElement = document.querySelector(`[data-index="${index}"]`);
            const title = deliveryElement.querySelector('.delivery-title');
            const datetime = deliveryElement.querySelector('.delivery-datetime');
            const countdown = deliveryElement.querySelector('.delivery-countdown');
            const editForm = deliveryElement.querySelector('.edit-form');

            // Ocultar elementos normales
            title.style.display = 'none';
            datetime.style.display = 'none';
            countdown.style.display = 'none';

            // Mostrar formulario de edición
            editForm.style.display = 'block';
        }

        // Función para guardar edición
        function saveEdit(index) {
            const deliveryElement = document.querySelector(`[data-index="${index}"]`);
            const editDescription = deliveryElement.querySelector('.edit-description').value.trim();
            const editDatetime = deliveryElement.querySelector('.edit-datetime').value;

            if (!editDescription) {
                alert('La descripción no puede estar vacía.');
                return;
            }

            if (!editDatetime) {
                alert('Debes seleccionar una fecha y hora.');
                return;
            }

            const targetDate = new Date(editDatetime);
            const now = new Date();

            if (targetDate <= now) {
                alert('La fecha debe ser futura.');
                return;
            }

            // Actualizar la entrega
            deliveries[index].description = editDescription;
            deliveries[index].datetime = editDatetime;

            // Guardar en localStorage
            localStorage.setItem('recordatoriosEntregas', JSON.stringify(deliveries));

            // Renderizar de nuevo
            renderDeliveries();
        }

        // Función para cancelar edición
        function cancelEdit(index) {
            const deliveryElement = document.querySelector(`[data-index="${index}"]`);
            const title = deliveryElement.querySelector('.delivery-title');
            const datetime = deliveryElement.querySelector('.delivery-datetime');
            const countdown = deliveryElement.querySelector('.delivery-countdown');
            const editForm = deliveryElement.querySelector('.edit-form');

            // Mostrar elementos normales
            title.style.display = 'block';
            datetime.style.display = 'block';
            countdown.style.display = 'block';

            // Ocultar formulario de edición
            editForm.style.display = 'none';
        }

        // Función para actualizar contadores cada segundo
        function updateCountdowns() {
            const countdowns = document.querySelectorAll('.delivery-countdown');
            countdowns.forEach((countdown, index) => {
                const delivery = deliveries[index];
                if (delivery) {
                    const timeInfo = getTimeDifference(delivery.datetime);
                    const isExpired = timeInfo.isPast;

                    countdown.textContent = `${isExpired ? 'Hace' : 'Faltan'} ${timeInfo.timeString}`;
                    countdown.classList.toggle('expired', isExpired);

                    // Actualizar clase del elemento padre
                    const deliveryItem = countdown.closest('.delivery-item');
                    deliveryItem.classList.toggle('vencido', isExpired);
                    deliveryItem.classList.toggle('activo', !isExpired);
                }
            });
        }

        // Función para vaciar la lista y recargar la página
        function clearList() {
            if (confirm('¿Estás seguro de que quieres vaciar toda la lista? Se perderán todas las entregas.')) {
                localStorage.removeItem('recordatoriosEntregas');
                location.reload();
            }
        }

        // Event listeners
        addBtn.addEventListener('click', addDelivery);
        clearBtn.addEventListener('click', clearList);

        descriptionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                datetimeInput.focus();
            }
        });

        datetimeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addDelivery();
            }
        });

        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            renderDeliveries();
            // Actualizar contadores cada segundo
            setInterval(updateCountdowns, 1000);
        });
        
