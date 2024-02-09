const cron = require('node-cron');
const { reporteAutomaticoViaEmail } = require('../controllers/partesController');

const initializeCronJobs = () => {
    cron.schedule('0 0 * * 1', async () => { //semanalmente!!           
        await reporteAutomaticoViaEmail();
    });
};

module.exports = { initializeCronJobs };