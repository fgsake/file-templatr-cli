"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConflicts = void 0;
const constants_1 = require("../constants");
/**
 * Helper function to filter out option / argument conflicts
 * based on the suppled exclusion value
 *
 * @param {string} excl
 *  - Option to exclued from the final list
 *
 * @returns {Array}
 */
const getConflicts = (excl) => (['type', ...Object.values(constants_1.COMPONENT_TYPES)].filter((opt) => opt !== excl));
exports.getConflicts = getConflicts;
//# sourceMappingURL=index.js.map