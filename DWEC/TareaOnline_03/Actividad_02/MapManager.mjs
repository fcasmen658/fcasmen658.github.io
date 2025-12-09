import DataManager from './DataManager.mjs';

/**
 * Implementación basada en Map.
 */
export class MapManager extends DataManager {
    constructor() {
        super();
        this.data = new Map();
    }

    add(newId, newGrade) {
        this.data.set(newId, newGrade);
    }

    search(id) {
        return this.data.has(id) ? this.data.get(id) : null;
    }
}
