import DataManager from './DataManager.mjs';

/**
 * Implementación basada en arrays.
 */
export class ArrayManager extends DataManager {
    constructor() {
        super();
        this.data = [];
    }

    add(newId, newGrade) {
        const idx = this.data.findIndex(item => item.id === newId);
        if (idx >= 0) {
            this.data[idx].grade = newGrade;
        } else {
            this.data.push({ id: newId, grade: newGrade });
        }
    }

    search(id) {
        const found = this.data.find(item => item.id === id);
        return found ? found.grade : null;
    }
}
