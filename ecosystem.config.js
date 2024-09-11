module.exports = {
    apps: [{
      name: "encope-dev",
      script: "./src/bin/www",
      node_args: "--max-old-space-size=4096",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "development"
      },
    }]
  };
  