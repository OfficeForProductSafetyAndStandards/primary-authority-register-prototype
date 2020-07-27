const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

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

// Process additional legal entities.
router.post('/people/add/existing-process', function (req, res) {
    let answer = req.session.data['par_data_person_id']

    if (answer === 'new') {
        res.redirect('/people/add/contact-details')
    } else {
        res.redirect('/people/manage/update')
    }
})

// Process additional legal entities.
router.post('/people/add/account-process', function (req, res) {
    let answer = req.session.data['user-account']

    if (answer === 'yes') {
        res.redirect('/people/add/invite')
    } else {
        res.redirect('/people/add/review')
    }
})

module.exports = router
