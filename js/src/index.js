"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disaggr = exports.aggr = void 0;
/**
 * Aggregates and distributes objects from dictionary of models arrays
 * into array of objects (see tests for details)
 */
function aggr(rootModels, vals, distribFn) {
    return rootModels.map(function (rm) {
        var filteredVals = {};
        Object.keys(vals).forEach(function (k) {
            if (!Array.isArray(vals[k])) {
                throw new Error("Aggregated key should contains array of values. "
                    + "Exactly contains " + (typeof vals[k]));
            }
            filteredVals[k] = Array.isArray(vals[k])
                ? vals[k].filter(function (vk) { return distribFn(rm, k, vk); })
                : vals[k];
        });
        return __assign(__assign({}, rm), filteredVals);
    });
}
exports.aggr = aggr;
/**
 * Extract values from models by key, contains array of values.
 * Return omited models and dictionary of extracted values.
 * Is reversed function for function aggr()
 */
function disaggr(aggreagetes, extractKeys /* extends any[] */) {
    var result = [[], {}];
    aggreagetes.forEach(function (aggr) {
        var root = {};
        Object.keys(aggr).forEach(function (k) {
            if (extractKeys.indexOf(k) === -1) {
                root[k] = aggr[k];
            }
            else {
                if (!Array.isArray(aggr[k])) {
                    throw new Error("Disaggregated key " + k + " should contains array of values. "
                        + "Exactly contains " + (typeof aggr[k]));
                }
                if (!result[1][k]) {
                    result[1][k] = [];
                }
                result[1][k] = result[1][k].concat(aggr[k]);
            }
        });
        result[0].push(root);
    });
    return result;
}
exports.disaggr = disaggr;
