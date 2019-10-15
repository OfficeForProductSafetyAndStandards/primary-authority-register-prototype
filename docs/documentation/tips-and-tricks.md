# Tips and tricks

A few useful things to help you get started.

## Update the Service name

You can change the service name by editing the file '/app/config.js'.

    module.exports = {

      // Service name used in header. Eg: 'Renew your passport'
      serviceName: "Service name goes here",

    };

## Show navigation in the header

<<<<<<< HEAD
Remove the comments surrounding the unordered list with an ID of proposition links.

    <nav id="proposition-menu">
      <a href="/" id="proposition-name">Service name</a>
      <!--
      <ul id="proposition-links">
        <li><a href="url-to-page-1" class="active">Navigation item #1</a></li>
        <li><a href="url-to-page-2">Navigation item #2</a></li>
      </ul>
      -->
    </nav>

An example of this can be seen in the [blank question page](/docs/examples/template-question-page-blank) template.

## Add a phase banner

Include either the alpha or beta phase banner from the `app/views/includes/` folder.

### How to include an Alpha banner

    {% include "includes/phase_banner_alpha.html" %}

### How to include a Beta banner

    {% include "includes/phase_banner_beta.html" %}


=======
Import the header component macro place it in the `{% block header %}`and provide `navigation` items as shown below.

    {% from 'header/macro.njk' import govukHeader %}

    {% block header %}
      {{ govukHeader({
        homepageUrl: "/",
        serviceName: "Service Name",
        serviceUrl: "#",
        containerClasses: "govuk-width-container",
        navigation: [
          {
            href: "#1",
            text: "Navigation item 1",
            active: true
          },
          {
            href: "#2",
            text: "Navigation item 2"
          }
        ]
      }) }}
    {% endblock %}

An example of this can be seen in the [blank question page](/docs/templates/question).

## Add a phase banner

Import the phase-banner component and supply tag and feedback text. The phase banner must be inside a `{% block beforeContent %}`.

### How to include an Alpha banner

    {% from 'phase-banner/macro.njk' import govukPhaseBanner %}

    {{ govukPhaseBanner({
      tag: {
        text: "alpha"
      },
      html: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
    }) }}

### How to include a Beta banner

    {% from 'phase-banner/macro.njk' import govukPhaseBanner %}

    {{ govukPhaseBanner({
      tag: {
        text: "beta"
      },
      html: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
    }) }}
>>>>>>> 7dfe394cc9d3042db4ebabfd67b35a61c3048f95
