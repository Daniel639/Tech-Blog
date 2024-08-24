const router = require('express').Router();

const apiRoutes = require('./api');
console.log('apiRoutes:', apiRoutes);

const homeRoutes = require('./home-routes');
console.log('homeRoutes:', homeRoutes);

const dashboardRoutes = require('./dashboard-routes');
console.log('dashboardRoutes:', dashboardRoutes);

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

module.exports = router;