const express = require('express');
const userHdlr = require('../handlers/user.handler')
const enquiryHdlr = require('../handlers/enquiry.handler')

const router = express.Router();

/***************************************************
 *                User Module
 **************************************************/
router.post('/users', userHdlr.createUser);
router.get('/users', userHdlr.getAllUsers);
router.get('/users/:id', userHdlr.getUserById);
router.put('/users/:id', userHdlr.updateUserById);
router.delete('/users/:id', userHdlr.deleteUserById);

router.post('/login', userHdlr.login);
router.get('/verify-account', userHdlr.verifyAccount);

/***************************************************
 *                Enquiry Module
 **************************************************/
router.post('/enquiries', enquiryHdlr.createEnquiry);
router.get('/enquiries', enquiryHdlr.getAllEnquiries);
router.get('/enquiries/:id', enquiryHdlr.getEnquiryById);
router.put('/enquiries/:id', enquiryHdlr.updateEnquiryById);
router.delete('/enquiries/:id', enquiryHdlr.deleteEnquiryById);

/***************************************************
 *                Work Module
 **************************************************/

module.exports = router;