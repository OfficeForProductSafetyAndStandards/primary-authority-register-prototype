module.exports = function (env) {
<<<<<<< HEAD
  // if you need accss to the internal nunjucks filter you can just env
=======
  // If you need access to an internal nunjucks filter you can use env
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
  // see the example below for 'safe' which is used in 'filters.log'
  var nunjucksSafe = env.getFilter('safe')

  /**
<<<<<<< HEAD
   * object used store the methods registered as a 'filter' (of the same name) within nunjucks
   * filters.foo("input") here, becomes {{ "input" | foo }} within nunjucks templates
=======
   * Object used to store the filters
   * filters.foo("input") here, becomes {{ "input" | foo }} in templates
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
   * @type {Object}
   */
  var filters = {}

  /**
<<<<<<< HEAD
   * logs an object in the template to the console on the client.
   * @param  {Any} a any type
   * @return {String}   a script tag with a console.log call.
=======
   * Logs an object in the template to the console in the browser.
   * @param  {Any} a any type
   * @return {String} a script tag with a console.log call.
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
   * @example {{ "hello world" | log }}
   * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
   */
  filters.log = function log (a) {
    return nunjucksSafe('<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>')
  }

  return filters
}
