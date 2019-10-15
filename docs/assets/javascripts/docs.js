/* global $ */
<<<<<<< HEAD
/* global GOVUK */
=======
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
}

$(document).ready(function () {
<<<<<<< HEAD
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
=======
  window.GOVUKFrontend.initAll()
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
})
