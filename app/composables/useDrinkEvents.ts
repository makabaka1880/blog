// Event types for DrinkAnimation communication
export type DrinkEventType = 'camera-wobble' | 'drag-start' | 'drag-end' | 'hint-click';

export interface DrinkEvent {
    type: DrinkEventType;
    payload?: any;
}

// Simple event bus for DrinkAnimation events
class DrinkEventBus {
    private listeners: Map<DrinkEventType, Set<(payload?: any) => void>> = new Map();

    on(event: DrinkEventType, callback: (payload?: any) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    emit(event: DrinkEventType, payload?: any): void {
        this.listeners.get(event)?.forEach(callback => callback(payload));
    }
}

// Singleton instance
const eventBus = new DrinkEventBus();

export function useDrinkEvents() {
    return {
        on: (event: DrinkEventType, callback: (payload?: any) => void) => eventBus.on(event, callback),
        emit: (event: DrinkEventType, payload?: any) => eventBus.emit(event, payload),
    };
}

// Export the event bus for direct access in DrinkAnimation
export { eventBus };
