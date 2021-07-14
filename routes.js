const routes = require('next-routes')();

routes
    .add('campaigns/new','/campaigns/new')
    .add('/campaigns/:address','/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');
//writing the : tells it that it is wildcard

module.exports = routes;