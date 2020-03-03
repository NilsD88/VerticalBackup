const {spawn} = require('child_process');
const config = process.env.NODE_ENV ? `-c=${process.env.NODE_ENV}` : '';

console.log(`[BUILDER]\tBuilding application with configuration: ${config ? process.env.NODE_ENV : 'default'}`);

let prebuildScript = `npm run prebuild`;
if (process.env.SKIP_PREBUILD) {
  prebuildScript = `echo "Skipping prebuild"`;
}

const prebuild = spawn(prebuildScript, {
  shell: true
});

prebuild.stdout.pipe(process.stdout);
prebuild.stderr.pipe(process.stdout);

prebuild.on('close', (code) => {
  console.log(`[BUILDER]\tprebuild process exited with code ${code}`);
  console.log(`ng build ${config}`);
  console.log(`node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng build ${config}`);
  const build = spawn(`node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng build ${config}`, {
    shell: true
  });
  build.stdout.pipe(process.stdout);
  build.stderr.pipe(process.stdout);
  build.on('close', async (buildCode) => {
    console.log(`[BUILDER]\tbuild process exited with code ${buildCode}`);
    process.exit(code ? code : buildCode);
  });
});

