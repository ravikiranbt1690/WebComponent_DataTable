/**
 * Creates a throttled function for custom Input Components
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [limit] The number of milliseconds to throttle invocations to.
 * @returns {Function} Returns the new throttled function.
*/
const throttle = (func, limit) => {
  let lastFunc, lastRan;
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}