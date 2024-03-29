//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// Process existing business decision.
router.post('/partnerships/apply/name-process', function (req, res) {
    let answer = req.session.data['name']

    if (answer === 'Existing Organisation') {
        res.redirect('/partnerships/apply/existing')
    } else {
        res.redirect('/partnerships/apply/registered')
    }
})
// Process existing business decision.
router.post('/partnerships/apply/existing-process', function (req, res) {
    let answer = req.session.data['par_data_organisation_id']

    if (answer === 'new') {
        res.redirect('/partnerships/apply/registered')
    } else {
        res.redirect('/partnerships/apply/review')
    }
})
// Process registered business decision.
router.post('/partnerships/apply/registered-process', function (req, res) {
    let answer = req.session.data['registered-organisation']

    if (answer === 'yes') {
        res.redirect('/partnerships/apply/contact')
    } else {
        res.redirect('/partnerships/apply/address')
    }
})

// Process additional legal entities.
router.post('/partnerships/complete/additional-legal-entities-process', function (req, res) {
    let answer = req.session.data['additional-legal-entities']

    if (answer === 'yes') {
        res.redirect('/partnerships/complete/add-legal-entity')
    } else {
        res.redirect('/partnerships/complete/review')
    }
})

router.post('/people/add/existing-process', function (req, res) {
    let answer = req.session.data['par_data_person_id']

    if (answer === 'new') {
        res.redirect('/people/add/contact-details')
    } else {
        res.redirect('/people/manage/update')
    }
})

router.post('/people/add/account-process', function (req, res) {
    let answer = req.session.data['user-account']

    if (answer === 'yes') {
        res.redirect('/people/add/invite')
    } else {
        res.redirect('/people/add/review')
    }
})

// Process partnership legal entity add type.
router.post('/partnerships/legal-entities/add/type-process', function (req, res) {
    let answer = req.session.data['organisation-type']

    switch(answer) {
        case 'registered_organisation':
        case 'registered_charity':
            res.redirect('/partnerships/legal-entities/add/choose')
            break;
        default:
            res.redirect('/partnerships/legal-entities/add/check-unregistered')
    }
})

// Process partnership legal entity add check.
router.post('/partnerships/legal-entities/add/check-process', function (req, res) {
    let answer = req.session.data['op']

    switch(answer) {
        case 'confirm':
            res.redirect('/partnerships/manage/direct')
            break;
        default:
            res.redirect('/partnerships/legal-entities/add/name')
    }
})

