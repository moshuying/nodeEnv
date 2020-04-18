/**
 * @Author :墨抒颖
 * @Date :2020-04-14 15:05:43
 * @LastEditTime :2020-04-14 15:54:45
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :http://sfau.lt/bPbzVVJ
 * @Description :墨抒颖
 */

const CronJob = require('cron').CronJob
const colorLog = require('./colorLog')
const config = require('./config')

let msgStr = ''
let errInfo = ''
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
  const writeFileSync = require('fs').writeFileSync
  // timeclock
  timestart = new Date()
  const data = String(~~(Math.random() * 100000000))

  writeFileSync('temp.json', data)
  const day = new Date()
  const fileTimeName = day.getFullYear() + '_' + (day.getMonth() + 1) + '_' + day.getDate()

  // Orderly execution of instructions
  backupTemplete('git', ['checkout', 'master'])
  backupTemplete('git', ['add', '.'])
  backupTemplete('git', ['commit', '-m', data])
  backupTemplete('git', ['push'])
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
    { missionType: 'compress' }
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
 * @param {string} commandStr
 * @param {string[]} arg
 * @param {object} options
 * @param {string} options.missionName
 * @param {string} options.missionType
 * @param {boolean} options.SilentImp
 */
function backupTemplete (commandStr, arg, options) {
  // analytic parameter
  // eslint-disable-next-line prefer-const
  let { missionName, missionType, SilentImp } = { missionName: '', missionType: '', SilentImp: false, ...options }
  SilentImp = SilentImp || config.SilentImp
  missionName = missionName || commandStr
  missionType = missionType || arg[0]
  // console.log(missionName, missionType, SilentImp)

  // Silent implementation
  SilentImp && (
    colorLog.white = () => {},
    colorLog.red = () => {},
    colorLog.yellow = () => {}
  )

  const start = new Date()
  colorLog.white(`[${missionName}]: ${missionType} start`)

  const spawnSync = require('child_process').spawnSync
  const res = spawnSync(commandStr, arg)

  msgStr += `[${missionName}]:`

  if (res.error) {
    colorLog.red(`[${missionName}]: ${missionType} error`)
    errInfo += `Has error in [${missionName}]: ${missionType}.\n${res.stderr.toString()}\n`
    msgStr += ` error \n${res.stderr.toString()}\n`
    console.log(res.stderr.toString())
  } else if (res.stderr.toString().length > 1) {
    colorLog.yellow(`[${missionName}]: ${missionType} error`)
    msgStr += ` warning \n${res.stderr.toString()}\n`
    SilentImp && console.log(res.stderr.toString())
  } else {
    colorLog.white(`[${missionName}]: ${missionType} success`)
    msgStr += ` success \n`
  }

  const end = new Date()
  colorLog.white(`[${missionName}]: ${missionType} complete,Using timed ${end - start}ms\n`)
  msgStr += `[${missionName}]: ${missionType} complete,Using timed ${end - start}ms\n`
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
    html: `<pre>\nToday's mission is complete in ${config.serveName} at ${
      timeend.toLocaleString()
    } .\nUsing time ${(timeend - timestart) / 1000}s.\n${
      errInfo.length > 1 ? (errInfo + '\nThe running log is\n' + msgStr) : 'No Error'
    }\n</pre>`
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
