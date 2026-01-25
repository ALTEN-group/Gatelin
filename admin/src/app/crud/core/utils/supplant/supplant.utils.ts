/**
 * Replaces all interpolations in a string with format '{key}' by a value
 * defined in a object map 'key' => value.
 *
 * Based on supplant function by 'Douglas Crockford's Remedial JavaScript'
 *
 * Examples of usage:
 *
 *      supplant("I'm {age} years old!", { age: 29 });
 *      supplant("The {a} says {n}, {n}, {n}!", { a: 'cow', n: 'moo' });
 *
 * @param str string target in which do the replace
 * @param o an object with parameters to be interpolated
 */
export const supplant = (str: string, o: Record<string, string | number>) => {
  return str.replace(/{([^{}]*)}/g, (a: string, b: string) => {
    const r = o[b];
    return typeof r === "string" || typeof r === "number" ? `${r}` : a;
  });
};
