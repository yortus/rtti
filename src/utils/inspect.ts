export function inspect(v: unknown): string {
    if (v === null || v === undefined || typeof v === 'number' || typeof v === 'boolean') {
        return String(v);
    }

    if (typeof v === 'string') {
        return JSON.stringify(v);
    }

    if (v instanceof Date) {
        return v.toISOString();
    }

    if (typeof v === 'object' && !Array.isArray(v)) {
        const obj = v as Record<string, unknown>;
        const props = Object.keys(obj).map(propName => {
            const value = inspect(obj[propName]);
            if (!/^[a-z_$][a-z0-9_$]*$/ig.test(propName)) propName = JSON.stringify(propName);
            return `${propName}: ${value}`;
        });
        return `{${props.join(', ')}}`;
    }

    if (typeof v === 'object' && Array.isArray(v)) {
        return `[${v.map(elem => inspect(elem)).join(', ')}]`;
    }

    return `[${(v as any).constructor.name}]`;
}
