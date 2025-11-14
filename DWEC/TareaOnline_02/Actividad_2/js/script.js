        // Alfabetos español con ñ
        const ABC_MIN = "abcdefghijklmnñopqrstuvwxyz";
        const ABC_MAY = ABC_MIN.toUpperCase();

        // Función para mostrar mensajes de estado
        function showStatus(message, type = 'success') {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = `status ${type}`;
            status.style.display = 'block';
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }

        // Función para cifrar/descifrar un carácter
        function shiftChar(char, shift, alphabet) {
            const index = alphabet.indexOf(char);
            if (index === -1) return char; // No está en el alfabeto, devolver sin cambios

            // Calcular nueva posición con módulo
            const newIndex = (index + shift) % alphabet.length;
            // Ajustar para números negativos
            const adjustedIndex = newIndex < 0 ? newIndex + alphabet.length : newIndex;

            return alphabet[adjustedIndex];
        }

        // Función principal de cifrado/descifrado
        function processText(text, shift) {
            let result = '';

            for (let char of text) {
                if (ABC_MIN.includes(char)) {
                    // Minúscula
                    result += shiftChar(char, shift, ABC_MIN);
                } else if (ABC_MAY.includes(char)) {
                    // Mayúscula
                    result += shiftChar(char, shift, ABC_MAY);
                } else {
                    // Otros caracteres (espacios, signos, números) sin cambios
                    result += char;
                }
            }

            return result;
        }

        // Función para cifrar
        function cipher() {
            const inputText = document.getElementById('input-text').value;
            const key = parseInt(document.getElementById('key').value);

            if (!inputText.trim()) {
                showStatus('Por favor, introduce un texto para cifrar.', 'error');
                return;
            }

            if (isNaN(key)) {
                showStatus('Por favor, introduce una clave válida.', 'error');
                return;
            }

            const result = processText(inputText, key);
            document.getElementById('output-text').value = result;
            showStatus('Texto cifrado correctamente.');
        }

        // Función para descifrar
        function decipher() {
            const inputText = document.getElementById('input-text').value;
            const key = parseInt(document.getElementById('key').value);

            if (!inputText.trim()) {
                showStatus('Por favor, introduce un texto para descifrar.', 'error');
                return;
            }

            if (isNaN(key)) {
                showStatus('Por favor, introduce una clave válida.', 'error');
                return;
            }

            // Para descifrar, usamos el desplazamiento negativo
            const result = processText(inputText, -key);
            document.getElementById('output-text').value = result;
            showStatus('Texto descifrado correctamente.');
        }

        // Función para copiar al portapapeles
        async function copyResult() {
            const outputText = document.getElementById('output-text').value;

            if (!outputText.trim()) {
                showStatus('No hay resultado para copiar.', 'error');
                return;
            }

            try {
                await navigator.clipboard.writeText(outputText);
                showStatus('Resultado copiado al portapapeles.');
            } catch (err) {
                // Fallback para navegadores que no soportan clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = outputText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showStatus('Resultado copiado al portapapeles.');
            }
        }

        // Permitir usar Enter en el input de clave para cifrar
        document.getElementById('key').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                cipher();
            }
        });