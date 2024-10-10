/**
 * Aggregates and distributes objects from dictionary of models arrays
 * into array of objects (see tests for details)
 */
export function aggr<T extends {}, V extends Record<string, any[]> /* extends Record<string, (I* extends {})[]> */>(
    rootModels: T[], 
    vals: V,
    distribFn: (t: T, k: keyof V, v: V[typeof k][number]) => boolean
): (T & V)[] {
    return rootModels.map(rm => {
        const filteredVals: any = {}
        Object.keys(vals).forEach(k => {
            if(!Array.isArray(vals[k])) {
                throw new Error("Aggregated key should contains array of values. " 
                    + "Exactly contains " + (typeof vals[k]))
            }
            filteredVals[k] = Array.isArray(vals[k])
                ? vals[k].filter(vk => distribFn(rm, k as any, vk))
                : vals[k]
        })
        return {
            ...rm,
            ...filteredVals
        }
    })
}

/**
 * Extract values from models by key, contains array of values.
 * Return omited models and dictionary of extracted values.
 * Is reversed function for function aggr() 
 */
export function disaggr<T extends {}, K extends keyof T>(
    aggreagetes: T[],
    extractKeys: K[] /* extends any[] */
): [Omit<T, K>[], Pick<T, K>] {
    const result: [Omit<T, K>[], Pick<T, K>] = [[], {} as Pick<T, K>]
    aggreagetes.forEach(aggr => {
        const root: any = {}
        Object.keys(aggr).forEach(k => {
            if(extractKeys.indexOf(k as K) === -1) {
                root[k] = aggr[k]
            } else {
                if(!Array.isArray(aggr[k])) {
                    throw new Error("Disaggregated key " + k + " should contains array of values. "
                        + "Exactly contains " + (typeof aggr[k]))
                }
                if(!result[1][k]) {
                    result[1][k] = []
                }
                result[1][k] = (result[1][k] as any[]).concat(aggr[k])
            }
        })
        result[0].push(root)
    })
    return result
}
