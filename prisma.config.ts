import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    async beforeApply() {
      return {
        datasourceUrl: process.env['DATABASE_URL']!,
      }
    },
  },
})