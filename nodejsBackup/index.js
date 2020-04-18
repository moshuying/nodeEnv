/**
 * @Author :墨抒颖
 * @Date :2020-04-14 15:05:43
 * @LastEditTime :2020-04-18 11:24:28
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */

const spawnSync = require('child_process').spawnSync
const writeFileSync = require('fs').writeFileSync
const CronJob = require('cron').CronJob
const colorLog = require('./colorLog')
const config = require('./config')

let msgStr = ''
let timestart = new Date()
let timeend = new Date()

new CronJob(
  '0 1 */1 * *', // every day
  async () => {
    run()
  },
  null,
  true,
  'Asia/Shanghai'
)

run()

/**
 * backup function
 */
function run () {
  // timeclock
  timestart = new Date()
  const day = new Date()
  const fileTimeName = day.getFullYear() + '_' + (day.getMonth() + 1) + '_' + day.getDate()

  // Backup database
  writeFileSync(
    `${config.workspace}all_databases_${fileTimeName}.sql`,
    backupTemplete(
      'mysqldump',
      [`-u${config.database.u}`, `-p${config.database.p}`, `--all-databases`], null, 'backup sql'
    ).stdout
  )
  backupTemplete(
    'tar',
    [].concat(
      [`-zcvf`, `${config.workspace + config.serveName + fileTimeName}.tar.gz`],
      config.ignoreWorkspace.map(el => '--exclude=' + el),
      [config.workspace]
    ),
    null,
    'compress'
  )
  backupTemplete('bypy', [`upload`, `${config.workspace + config.serveName + fileTimeName}.tar.gz`, config.uplaodPath])
  backupTemplete(
    'rm',
    [`-rf`, `${config.workspace + config.serveName + fileTimeName}.tar.gz`, `${config.workspace}all_databases_${fileTimeName}.sql`]
  )
  sendMailtoMyself()
}

/**
 *
 * @param {String} commandStr
 * @param {Array<string>} arg
 * @param {String} missionName
 * @param {String} missionType
 * Encapsulate instructions spawnSync
 */
function backupTemplete (commandStr, arg, missionName, missionType) {
  missionName = missionName || commandStr
  missionType = missionType || arg[0]
  colorLog.white(`[${missionName}]: ${missionType} start`)
  msgStr += `[${missionName}]: ${missionType} complete\n[${missionName}]:`
  const res = spawnSync(commandStr, arg)
  if (res.error || res.stderr.toString().length > 1) {
    colorLog.red(`[${missionName}]: ${missionType} error`)
    msgStr += ` error \n${res.stderr.toString()}\n`
    console.log(res.stderr.toString())
  } else {
    colorLog.white(`[${missionName}]: ${missionType} success`)
    msgStr += ` success`
  }
  return res
}

/**
 * send mail
 */
function sendMailtoMyself () {
  // Not configured
  if (!config.sendMailUser || !config.sendMailPass) return

  const nodemailer = require('nodemailer')
  timeend = new Date()
  nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secureConnection: true,
    auth: {
      user: config.sendMailUser,
      pass: config.sendMailPass
    }
  }).sendMail({
    // send mail address
    from: '"node server" <1457479958@qq.com>', // login user must equal to this user
    to: '1460083332@qq.com',
    // mail subject
    subject: 'mission complete in ' + config.serveName,
    // mail conent to html
    html: `<pre>\nToday's mission is complete in ${config.serveName} at ${timeend.toLocaleString()} .\nUsing time ${(timeend - timestart) / 1000}s .\nThe running log is \n${msgStr}</pre>`
  }, (error) => {
    if (error) {
      colorLog.red(`[mail]: Message error ${timeend.toLocaleString()}\n`, error)
    } else {
      colorLog.green(`[mail]: Message sent ${timeend.toLocaleString()}`)
    }

    // clear msg
    msgStr = ''
  })
}
