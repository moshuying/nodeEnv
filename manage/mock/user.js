/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-12-19 14:23:33
 * @LastEditTime :2019-12-19 15:25:11
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 */

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'data:image/jpeg;base64,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',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'data:image/jpeg;base64,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',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'get',
    response: config => {
      const { username } = config.query
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
