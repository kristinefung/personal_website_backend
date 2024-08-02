const express = require('express');
const apiInfoHdlr = require('../handlers/api_info.handler')
const userHdlr = require('../handlers/user.handler')
const enquiryHdlr = require('../handlers/enquiry.handler')
const workHdlr = require('../handlers/work.handler')
const educationHdlr = require('../handlers/education.handler')

const router = express.Router();

/*************************************************************
 *                         API Info
 ************************************************************/
router.get('/', apiInfoHdlr.apiInfo);

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/users', userHdlr.createUser);
router.get('/users', userHdlr.getAllUsers);
router.get('/users/:id', userHdlr.getUserById);
router.put('/users/:id', userHdlr.updateUserById);
router.delete('/users/:id', userHdlr.deleteUserById);

router.post('/login', userHdlr.login);
router.get('/verify-account', userHdlr.verifyAccount);

/*************************************************************
 *                       Enquiry Module
 ************************************************************/
router.post('/enquiries', enquiryHdlr.createEnquiry);
router.get('/enquiries', enquiryHdlr.getAllEnquiries);
router.get('/enquiries/:id', enquiryHdlr.getEnquiryById);
router.put('/enquiries/:id', enquiryHdlr.updateEnquiryById);
router.delete('/enquiries/:id', enquiryHdlr.deleteEnquiryById);

/*************************************************************
 *                         Work Module
 ************************************************************/
router.post('/works', workHdlr.createWork);
router.get('/works', workHdlr.getAllWorks);
router.get('/works/:id', workHdlr.getWorkById);
router.put('/works/:id', workHdlr.updateWorkById);
router.delete('/works/:id', workHdlr.deleteWorkById);

/*************************************************************
 *                      Education Module
 ************************************************************/
router.post('/educations', educationHdlr.createEducation);
router.get('/educations', educationHdlr.getAllEducations);
router.get('/educations/:id', educationHdlr.getEducationById);
router.put('/educations/:id', educationHdlr.updateEducationById);
router.delete('/educations/:id', educationHdlr.deleteEducationById);

module.exports = router;