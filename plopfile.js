const validator = require('validator')

const validateInput = function(input) {
    // Declare function as asynchronous, and save the done callback
    const done = this.async()

    validator.isNumeric(input) ? done('You need to provide a string') : null
    validator.isEmpty(input, { ignore_whitespace: true }) ? done('You cannot provide empty a string') : null
    if(/\s/.test(input)) {
        done('Your value cannot have whitespaces')
    }

    // Pass the return value in the done callback
    done(null, true)
}

module.exports = function (plop) {

    plop.setWelcomeMessage('Welcome to Get IT Project! What do you want to generate?')
    // service generator 
    plop.setGenerator('service', {
        description: 'Create a new service',
        prompts: [
            {
                type: 'input',
                name: 'serviceName',
                message: 'name of the service',
                validate: validateInput
            },
            {
                type: 'list',
                name: 'serviceType',
                message: 'which kind of service you want to generate?',
                choices: ['MIDDLEWARE']
            }
        ],
        actions: function(data) {
            const actions = [
                {
                    type: 'add',
                    path: 'src/services/{{camelCase serviceName}}/index.js',
                    templateFile: '_templates/src/services/_service.hbs'
                }
            ]
            
            data.serviceType.includes('MIDDLEWARE') ? actions.push({
                type: 'modify',
                path: 'src/services/{{camelCase serviceName}}/index.js',
                pattern: '/* MIDDLEWARE */',
                templateFile: '_templates/src/services/serviceTypes/_middleware.hbs'
            }) : actions.push({
                type: 'modify',
                path: 'src/services/{{camelCase serviceName}}/index.js',
                pattern: '/* MIDDLEWARE */',
                template: ''
            })

            return actions
 
        }
    })

    // api endpoint generator
    plop.setGenerator('api endpoint', {
        description: 'Create a new api endpoint (/api/endpoint)',
        prompts: [
            {
                type: 'input',
                name: 'endpointName',
                message: 'name of the endpoint in singular like "message" or "article"'
            },
            {
                type: 'checkbox',
                name: 'endpointTypes',
                message: 'which endpoint options would you like to provide?',
                choices: ['GET', 'POST', 'PATCH', 'DELETE']
            }
        ],
        actions: function(data) {
            
            const actions = [
                {
                    type: 'add',
                    path: 'test/api/{{lowerCase endpointName}}.test.js',
                    templateFile: '_templates/test/api/_apitest.hbs'
                },
                {
                    type: 'add',
                    path: 'src/api/{{lowerCase endpointName}}/index.js',
                    templateFile: '_templates/src/api/_index.hbs'
                },
                {
                    type: 'add',
                    path: 'src/api/{{lowerCase endpointName}}/model.js',
                    templateFile: '_templates/src/api/_model.hbs'
                },
                {
                    type: 'append',
                    path: 'src/api/index.js',
                    pattern: '/* ENDPOINT_ROUTER_IMPORT */',
                    template: 'import {{lowerCase endpointName}} from \'./{{lowerCase endpointName}}\'',
                },
                {
                    type: 'append',
                    path: 'src/api/index.js',
                    pattern: '/* ENDPOINT_ROUTER_EXPORT */',
                    template: 'router.add(\'/{{lowerCase endpointName}}s\', {{lowerCase endpointName}})',
                }  
            ]

            data.endpointTypes.includes('GET') ? actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* GET */',
                templateFile: '_templates/src/api/endpointTypes/_getIndex.hbs'
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* GET_TEST */',
                templateFile: '_templates/test/api/endpointTypes/_getIndex.hbs'
            }) : actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* GET */',
                template: ''
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* GET_TEST */',
                template: ''
            })

            data.endpointTypes.includes('POST') ? actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* POST */',
                templateFile: '_templates/src/api/endpointTypes/_postIndex.hbs'
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* POST_TEST */',
                templateFile: '_templates/test/api/endpointTypes/_postIndex.hbs'
            }) : actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* POST */',
                template: ''
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* POST_TEST */',
                template: ''
            })

            data.endpointTypes.includes('PATCH') ? actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* PATCH */',
                templateFile: '_templates/src/api/endpointTypes/_patchIndex.hbs'
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* PATCH_TEST */',
                templateFile: '_templates/test/api/endpointTypes/_patchIndex.hbs'
            }) : actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* PATCH */',
                template: ''
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* PATCH_TEST */',
                template: ''
            })

            data.endpointTypes.includes('DELETE') ? actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* DELETE */',
                templateFile: '_templates/src/api/endpointTypes/_deleteIndex.hbs'
            }, {
                type: 'add',
                path: 'src/api/{{lowerCase endpointName}}/controller.js',
                templateFile: '_templates/src/api/_controller.hbs'
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* DELETE_TEST */',
                templateFile: '_templates/test/api/endpointTypes/_deleteIndex.hbs'
            }) : actions.push({
                type: 'modify',
                path: 'src/api/{{lowerCase endpointName}}/index.js',
                pattern: '/* DELETE */',
                template: ''
            }, {
                type: 'modify',
                path: 'test/api/{{lowerCase endpointName}}.test.js',
                pattern: '/* DELETE_TEST */',
                template: ''
            })

            return actions
        }

    })
}