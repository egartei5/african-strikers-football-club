declare module 'vanilla-tilt' {
    interface TiltOptions {
        max?: number;
        perspective?: number;
        scale?: number;
        speed?: number;
        glare?: boolean;
        'max-glare'?: number;
        gyroscope?: boolean;
        reverse?: boolean;
        reset?: boolean;
        easing?: string;
        transition?: boolean;
        axis?: 'x' | 'y' | null;
    }

    interface TiltInstance {
        destroy: () => void;
        getValues: () => { tiltX: number; tiltY: number; percentageX: number; percentageY: number };
        reset: () => void;
    }

    interface HTMLElement {
        vanillaTilt?: TiltInstance;
    }

    const VanillaTilt: {
        init: (element: HTMLElement, options?: TiltOptions) => void;
    };

    export default VanillaTilt;
}

declare global {
    interface HTMLDivElement {
        vanillaTilt?: {
            destroy: () => void;
        };
    }
}
