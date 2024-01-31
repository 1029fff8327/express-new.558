module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'File Server API',
    version: '1.0.0',
    description: 'API for file operations',
  },
  paths: {
    '/file': {
      post: {
        summary: 'Upload a file',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    Warning: {
                      type: 'string',
                      example: 'Attention, the directory size is more than 10 megabytes',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/file/{id}': {
      put: {
        summary: 'Update a file',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the file',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'File not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error',
                    },
                    description: {
                      type: 'string',
                      example: 'file not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Download a file',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'ID of the file',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'File downloaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
