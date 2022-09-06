import { COMPONENT_TYPES } from "../constants";

/**
 * Helper function to filter out option / argument conflicts
 * based on the suppled exclusion value
 *
 * @param {string} excl
 *  - Option to exclued from the final list
 *
 * @returns {Array}
 */
 export const getConflicts = (excl:string): Array<any> => (
  ['type', ...Object.values(COMPONENT_TYPES)].filter((opt) => opt !== excl)
);
