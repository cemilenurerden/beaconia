import app from './app.js';
import { config } from './config/index.js';
import { connectDatabase } from './utils/prisma.js';

async function main() {
  // Connect to database
  await connectDatabase();

  // Start server
  app.listen(config.port, () => {
    console.log(`🚀 Application is running on: http://localhost:${config.port}`);
    console.log(`📚 Swagger docs available at: http://localhost:${config.port}/docs`);
  });
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
