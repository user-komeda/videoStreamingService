import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: '../backend/gen/swagger/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints',
      schemas: 'src/api/generated/models',
      client: 'fetch',
      override: {
        mutator: {
          path: 'src/api/client.ts',
          name: 'customFetch',
        },
      },
    },
  },
  zod: {
    input: {
      target: '../backend/gen/swagger/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/zod',
      client: 'zod',
      override: {
        zod: {
          generate: {
            body: true,
            response: false,
            param: false,
            query: false,
            header: false,
          },
        },
      },
    },
  },
})
