/**
 * Clase base para gestores de datos (id, grade).
 */
export default class DataManager {
    constructor() {
        this.data = null;
    }

    add(newId, newGrade) {
        throw new Error('Method "add" must be implemented in derived class.');
    }

    search(id) {
        throw new Error('Method "search" must be implemented in derived class.');
    }
}
