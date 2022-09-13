import { Notification } from 'element-ui'

export default {
  /**
   * @description: 初始化阶段，把数据库和数据表等配置好
   */
  initIndexDB() {
    /* 创建数据库 */
    let request = window.indexedDB.open('Inertia_flywheel_v1', 1)

    // 失败时触发
    request.onerror = function(event) {
      Notification({
        title: '警告',
        message: '数据库创建失败，请重启设备！',
        type: 'warning',
        position: 'bottom-left'
      })
      return
    }

    // 成功时触发
    request.onsuccess = function(event) {
      Notification({
        title: '提示',
        message: '数据库初始化完成',
        type: 'success',
        position: 'bottom-left'
      })
    }

    // 刚创建数据库时 和 数据库版本更新时触发
    request.onupgradeneeded = function(event) {
      console.log('触发onupgradeneeded')

      /*  创建数据表 */
      let db = event.target.result
      let objectStore

      // 用户名表-UserData(暂时无用)
      /* 数据库实例的objectStoreNames中放的是我们的所有表的集合，contain方法查看数据库表集合中是否存在某种表
       * 同一个数据库中，重复创建同名数据表会报错，所以在创建之前要进行一下判断
       */
      if (!db.objectStoreNames.contains('UserData')) {
        /* keyPath设置主键Key
         * unique表示是否允许索引值唯一，true即必须唯一，false即不是唯一
         */
        // 创建表方法createObjectStore
        objectStore = db.createObjectStore('UserData', {
          keyPath: 'UserName'
        })
        objectStore.createIndex('UserName', 'UserName', { unique: true }) // 创建索引方法createIndex
      }

      // 当前用户配置项表-CurrentUserData
      if (!db.objectStoreNames.contains('CurrentUserData')) {
        objectStore = db.createObjectStore('CurrentUserData', {
          keyPath: 'UserName'
        })
        objectStore.createIndex('UserName', 'UserName', { unique: true })
        objectStore.createIndex('GroupNumber', 'GroupNumber', {
          unique: false
        }) // 设定的次数
        objectStore.createIndex('GroupTime', 'GroupTime', { unique: false }) // 设定的时间
        objectStore.createIndex('BigNumber', 'BigNumber', { unique: false })
        objectStore.createIndex('MiddleNumber', 'MiddleNumber', {
          unique: false
        })
        objectStore.createIndex('LittleNumber', 'LittleNumber', {
          unique: false
        })
        objectStore.createIndex('SmallNumber', 'SmallNumber', {
          unique: false
        })

        function updateCurrentUserData(NewCurrentUserData) {
          let db
          let request = window.indexedDB.open('Inertia_flywheel_v1')
          request.onerror = function(event) {
            return
          }
          request.onsuccess = event => {
            let dbs = event.target.result
            let transaction = dbs.transaction(['CurrentUserData'], 'readwrite')
            let objectStore = transaction.objectStore('CurrentUserData')
            objectStore.clear() // 先删除
            let updaterequest = objectStore.add(NewCurrentUserData) // 再写入
            updaterequest.onsuccess = event => {
              console.log('初始化CurrentUserData表成功')
            }
            updaterequest.onerror = event => {
              return
            }
          }
        }
        if (db.objectStoreNames.contains('CurrentUserData')) {
          updateCurrentUserData({
            UserName: 'admin',
            GroupNumber: 5,
            GroupTime: 10,
            BigNumber: 1,
            MiddleNumber: 1,
            LittleNumber: 1,
            SmallNumber: 1
          })
        } else {
          Notification({
            title: '警告',
            message: '数据初始化失败，请重启设备！',
            type: 'warning',
            position: 'bottom-left'
          })
        }
      }

      // 数据记录表-RecordData
      /* autoIncrement表示主键Key是否自增 */
      if (!db.objectStoreNames.contains('RecordData')) {
        objectStore = db.createObjectStore('RecordData', {
          autoIncrement: true
        })
        objectStore.createIndex('UserName', 'UserName', { unique: false })
        objectStore.createIndex('Rate', 'Rate', { unique: false }) // 分数
        objectStore.createIndex('ChartData', 'ChartData', { unique: false }) // 串口获取的数据，数组类型
        objectStore.createIndex('BigNumber', 'BigNumber', { unique: false }) // 大飞轮数
        objectStore.createIndex('MiddleNumber', 'MiddleNumber', {
          unique: false
        }) // 中飞轮数
        objectStore.createIndex('LittleNumber', 'LittleNumber', {
          unique: false
        }) // 小飞轮数
        objectStore.createIndex('SmallNumber', 'SmallNumber', {
          unique: false
        }) // 超小飞轮数
        objectStore.createIndex('RecordTime', 'RecordTime', { unique: false }) // 记录此次数据时的时间
      }
    }
  },

  // 新建用户（右上角）—— UserData表【这个表没用，后面需要修改或删掉】
  createUserData(NewUserData) {
    let db
    let request = window.indexedDB.open('Inertia_flywheel_v1')
    request.onerror = function(event) {
      Notification({
        title: '警告',
        message: '数据库丢失，请重启设备！',
        type: 'warning',
        position: 'bottom-left'
      })
    }

    request.onsuccess = function(event) {
      db = request.result
      let createrequest = db
        .transaction(['UserData'], 'readwrite')
        .objectStore('UserData')
        .add(NewUserData)

      createrequest.onsuccess = function(event) {
        Notification({
          title: '提示',
          message: '创建用户成功！',
          type: 'success',
          position: 'bottom-left'
        })
      }

      createrequest.onerror = function(event) {
        if (
          event.target.error.message ===
          'Key already exists in the object store.'
        ) {
          Notification({
            title: '错误',
            message: '用户名已存在',
            type: 'error',
            position: 'bottom-left'
          })
        } else {
          Notification({
            title: '错误',
            message: '创建用户失败！',
            type: 'error',
            position: 'bottom-left'
          })
        }
      }
    }
  },

  // 更新系统配置页面信息 —— CurrentUserData表
  updateCurrentUserData(NewCurrentUserData) {
    let db
    let request = window.indexedDB.open('Inertia_flywheel_v1')
    request.onerror = function(event) {
      Notification({
        title: '警告',
        message: '数据库丢失，请重启设备！',
        type: 'warning',
        position: 'bottom-left'
      })
    }

    request.onsuccess = event => {
      let dbs = event.target.result
      let transaction = dbs.transaction(['CurrentUserData'], 'readwrite')
      let objectStore = transaction.objectStore('CurrentUserData')
      objectStore.clear() // 先删除
      let updaterequest = objectStore.add(NewCurrentUserData) // 再写入
      updaterequest.onsuccess = event => {
        Notification({
          title: '提示',
          message: '修改成功！',
          type: 'success',
          position: 'bottom-left'
        })
      }
      updaterequest.onerror = event => {
        Notification({
          title: '错误',
          message: '修改失败！',
          type: 'error',
          position: 'bottom-left'
        })
      }
    }
  }
}
