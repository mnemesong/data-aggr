/**
 * Aggregates and distributes objects from dictionary of models arrays
 * into array of objects (see tests for details)
 */
export declare function aggr<T extends {}, V extends Record<string, any[]>>(rootModels: T[], vals: V, distribFn: (t: T, k: keyof V, v: V[typeof k][number]) => boolean): (T & V)[];
/**
 * Extract values from models by key, contains array of values.
 * Return omited models and dictionary of extracted values.
 * Is reversed function for function aggr()
 */
export declare function disaggr<T extends {}, K extends keyof T>(aggreagetes: T[], extractKeys: K[]): [Omit<T, K>[], Pick<T, K>];
