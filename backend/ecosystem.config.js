// PM2 ecosystem file — keeps Node.js running 24/7, auto-restarts on crash
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup   ← run the command it outputs so it survives reboots
module.exports = {
  apps: [
    {
      name:        "swasthgram-apis",
      script:      "server.js",
      cwd:         "/home/swasthgram/api",
      instances:   1,
      autorestart: true,
      watch:       false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        PORT:     3002,
        APP_URL:  "https://swasthgram.org",
      },
      out_file:        "/home/swasthgram/api/logs/out.log",
      error_file:      "/home/swasthgram/api/logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};