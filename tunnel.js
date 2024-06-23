import { exec } from 'child_process';
const controller = new AbortController();
const signal = controller.signal;

const runTunnel = () => {
  let opened=false;
  const ssh = exec('ssh -R 80:localhost:10888 nokey@localhost.run',{signal});
  ssh.stdout.on('data',data => {
    process.stdout.write(data)
    const msg = data.toString();
    const d=msg.match(/(https:\/\/.+)$/m)
    if (!opened&&d&&d[0]) {
      opened=true;
      console.log(`Туннель запущен на: ${d[0]}`)
      exec(`start ${d[0]}`)
    }
  })
}

const runVKTunnel = () => {
  let opened=false;
  const vk = exec('vk-tunnel', {signal});
  vk.stdout.on('data',data => {
    process.stdout.write(data)
    const msg = data.toString();
    const d=msg.match(/(https:\/\/.+)$/m)
    if (!opened&&d&&d[0]) {
      opened=true;
      console.log(`Туннель запущен на: ${d[0]}`)
      setTimeout(exec, 2000,`start ${d[0]}`);
    }
  })

  vk.on("close",console.log)
}

switch (process.argv[2]) {
  case "prod":
    console.log("[1] Сборка проекта")
    const b = exec("npm run build", {signal});
    b.stdout.on('data',data => {
      process.stdout.write(data)
    })
    b.on('exit',e=>{
      if (e == 0) {
        console.log("[2] Запуск сервера")
        const d = exec("npm run preview", {signal});
        d.stdout.on('data',data => {
          process.stdout.write(data)
        })
        console.log("[3] Открытие туннеля")
        runTunnel()
      } else {
        console.log("[1] Не удалось собрать проект")
      }
    })
    break;
  case "lh":
    console.log("[1] Запуск сервера")
    const d = exec("npm run dev",{signal});
    d.stdout.on('data',data => {
      process.stdout.write(data)
    })
    console.log("[2] Открытие туннеля")
    runTunnel()
    break;
  default:
    console.log("[1] Запуск сервера")
    const dv = exec("npm run dev", {signal});
    dv.stdout.on('data',data => {
      process.stdout.write(data)
    })
    runVKTunnel()
    
    break;
}

const exitEvent = e => {
  controller.abort();
  if (e==="SIGINT") return process.exit(2);
  process.exit(15)
}

process.on('SIGTERM', exitEvent)
process.on('SIGINT', exitEvent)