export function inspect(v: unknown): string {
    return inspectInternal(v, new Set());
}

function inspectInternal(v: unknown, seen: Set<unknown>): string {
    if (v === null || v === undefined || typeof v === 'number' || typeof v === 'boolean') {
        return String(v);
    }

    if (typeof v === 'string') {
        return JSON.stringify(v);
    }

    if (v instanceof Date) {
        return v.toISOString();
    }

    if (seen.has(v)) {
        return '[cyclic]';
    }

    if (typeof v === 'object' && !Array.isArray(v)) {
        seen.add(v);
        const obj = v as Record<string, unknown>;
        const props = Object.keys(obj).map(propName => {
            const value = inspectInternal(obj[propName], seen);
            if (!/^[a-z_$][a-z0-9_$]*$/ig.test(propName)) propName = JSON.stringify(propName);
            return `${propName}: ${value}`;
        });
        return `{${props.join(', ')}}`;
    }

    if (typeof v === 'object' && Array.isArray(v)) {
        seen.add(v);
        return `[${v.map(elem => inspectInternal(elem, seen)).join(', ')}]`;
    }

    return `[${(v as any).constructor.name}]`;
}
