import app from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
    console.log(`[ITERIQ Backend] Server running on port ${config.port} in ${config.nodeEnv} mode.`);
});