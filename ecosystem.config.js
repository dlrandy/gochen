module.exports = {
    apps : [{
      name   : "gochen",  
      script: 'npm run start',
      cwd: '/home/ec2-user/actions-runner/_work/gochen/gochen',
      env: {
            NODE_ENV: 'production'
      }
    }]
  }
