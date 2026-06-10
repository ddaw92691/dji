import { defineStore } from 'pinia'
import { userInfoRequest } from '@/api/login'
import { rolePage } from '@/api/role'
import { updateProfile, updatePasswordRequest, updateAvatarRequest, deleteUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import router, { resetRouter } from '@/router'
import { useMenuStore } from './menu'
import { useTabsStore } from './tabs'
import defaultAvatarSvg from '@/assets/defaultAvatar.svg'
import defaultSystemAvatar from '@/assets/images/defaultSystemAvatar.svg'
import type { IRoleItem } from '@/types/system/role'
import type { ICurrentTab, ITabsMenuData } from '@/types/profile'
import type {
  IUserItem,
  IUserMessageItem,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
} from '@/types/system/user'
import dayjs from 'dayjs'
import { storage, STORAGE_KEYS } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  // 默认头像占位
  const defaultAvatarImg = ref(defaultAvatarSvg)
  // 用户信息
  const userInfo = ref<IUserItem | null>(null)

  // 角色信息
  const roleList = ref<IRoleItem[]>([])

  // 用户角色名称
  const userRoleName = computed(() => {
    const info = userInfo.value
    if (!info) return '无权限'
    // 后端返回的是角色编码(role，如 SUPER_ADMIN)，优先按 code 匹配角色名；
    // 兼容旧的 roleId 匹配；都匹配不到时直接展示角色编码，避免超管被误显示为“无权限”。
    const matched = roleList.value.find((role) => role.code === info.role || role.id === info.roleId)
    return matched?.name ?? info.role ?? '无权限'
  })

  // 地址信息
  const address = ref({
    country: '',
    region: '',
    city: '',
  })

  // 获取用户信息
  const getUserInfo = async () => {
    const { data: res } = await userInfoRequest()
    if (res.code !== 200) return
    userInfo.value = res.data
    userInfo.value.bio = userInfo.value.bio || '这个人很懒，什么都没留下~'
    if (!userInfo.value?.avatar) {
      userInfo.value.avatar = defaultAvatarImg.value
    }
    if (res.data?.countryCode) {
      storage.set(STORAGE_KEYS.COUNTRY_CODE, res.data.countryCode)
    }
    if (res.data?.languageCode) {
      storage.set(STORAGE_KEYS.LANGUAGE_CODE, res.data.languageCode)
    }
  }

  // 获取用户角色名称
  const getUserRoleName = async () => {
    const { data: res } = await rolePage({
      page: 1,
      pageSize: 1000,
    })
    if (res.code !== 200) return
    roleList.value = res.data?.list ?? []
  }

  // 修改头像
  const updateAvatar = async (avatar: string) => {
    const { data: res } = await updateAvatarRequest({ avatar })
    if (res.code !== 200) return
    getUserInfo()
    ElMessage.success('修改头像成功')
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }

  // 获取地址信息
  const getAddress = async () => {
    const ipRes = await fetch('https://ipapi.co/json/').then((res) => res.json())
    address.value = {
      country: ipRes.country_name,
      region: ipRes.region,
      city: ipRes.city,
    }
  }

  // --------------- 个人中心 ---------------

  const currentTab = ref<ICurrentTab>('personalInfo')

  // 导航菜单
  const menuTabs = ref<ITabsMenuData[]>([
    { key: 'personalInfo',       label: 'My Profile', icon: 'HOutline:UserIcon' },
    { key: 'projects', label: 'My Projects', icon: 'HOutline:Square3Stack3DIcon' },
    { key: 'permissions', label: 'My Permissions', icon: 'HOutline:ShieldCheckIcon' },
    { key: 'messages', label: 'My Messages', icon: 'HOutline:BellAlertIcon' },
    { key: 'logs', label: 'Login Logs', icon: 'HOutline:ClockIcon' },
  ])

  // 修改用户个人信息
  const updateUserProfile = async (data: IUpdateUserProfileParams) => {
    const { data: res } = await updateProfile(data)
    if (res.code !== 200) return
    getUserInfo()
    ElMessage.success('修改个人资料成功')
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // 注销用户
  const deleteUserAccount = async () => {
    const { data: res } = await deleteUser([userInfo.value!.id])
    if (res.code !== 200) return
    ElMessage.success('注销账户成功,2秒后跳转至登录页面...')
    await delay(2000)
    logout()
  }

  // 退出登录
  const logout = () => {
    storage.remove(STORAGE_KEYS.TOKEN)
    const menuStore = useMenuStore()
    const tabsStore = useTabsStore()
    menuStore.clearUserPermissions()
    clearUserInfo()
    tabsStore.clearTabs()
    resetRouter()
    router.push('/login')
  }

  // 用户消息
  const userMessages = ref<IUserMessageItem[]>([
    {
      id: '1',
      title: 'System Maintenance Notice',
      content: 'The system will undergo maintenance from 22:00 to 24:00 tonight. It may be inaccessible during this period. Please plan accordingly.',
      type: 'system',
      read: false,
      time: '2026-01-22 08:30:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '2',
      title: 'David Fan',
      content: "Today's task list has been updated. Don't forget to drink a glass of water first! 💧",
      type: 'user',
      read: false,
      time: '2026-01-22 08:45:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    {
      id: '3',
      title: 'New Feature Live',
      content: 'The personal center feature is now live. You can manage your personal information and view message notifications.',
      type: 'system',
      read: false,
      time: '2026-01-21 17:20:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '4',
      title: 'Alice L.',
      content: 'Your leaderboard progress has been updated. You are now #2, go for it! 🏆',
      type: 'user',
      read: true,
      time: '2026-01-21 16:10:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliceL',
    },
    {
      id: '5',
      title: 'Security Reminder',
      content: 'Please change your password regularly and enable two-factor authentication to protect your account.',
      type: 'system',
      read: true,
      time: '2026-01-21 09:30:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '6',
      title: 'Bob T.',
      content: 'Your friend leaderboard has been updated. You are now #3, keep it up! 🚀',
      type: 'user',
      read: false,
      time: '2026-01-20 14:25:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BobT',
    },
    {
      id: '7',
      title: 'Charlie W.',
      content: "You're in luck today! You received a hidden surprise from the system 🎁. Go check it out!",
      type: 'user',
      read: false,
      time: '2026-01-20 10:15:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CharlieW',
    },
    {
      id: '8',
      title: 'Database Optimization Notice',
      content: 'The system will undergo database performance optimization tonight at 23:00. Some services may experience brief interruptions.',
      type: 'system',
      read: false,
      time: '2026-01-19 18:10:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '9',
      title: 'Eve K.',
      content: "Don't forget the team tea break this afternoon ☕. Also, check who stole the cake 😂",
      type: 'user',
      read: false,
      time: '2026-01-19 15:45:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EveK',
    },
    {
      id: '10',
      title: 'Network Upgrade',
      content: 'To improve access speed, we will expand network bandwidth this week. Normal usage will not be affected during the upgrade.',
      type: 'system',
      read: false,
      time: '2026-01-18 09:50:00',
      avatar: defaultSystemAvatar,
    },
    {
      id: '11',
      title: 'Frank H.',
      content: 'A mysterious item has been added to your favorites 🔮. Go check it out!',
      type: 'user',
      read: true,
      time: '2026-01-18 08:40:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FrankH',
    },
    {
      id: '12',
      title: 'Grace M.',
      content: 'System reminder: Don\'t forget today\'s exercise plan 🏃‍♀️. Stay healthy, stay happy!',
      type: 'user',
      read: false,
      time: '2026-01-17 19:00:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GraceM',
    },
  ])

  // 发送消息
  const sendMessage = (message: string) => {
    userMessages.value.unshift({
      id: String(userMessages.value.length + 1),
      title: userInfo.value?.name || userInfo.value?.username || '未知用户',
      content: message,
      type: 'user',
      read: false,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      avatar: userInfo.value?.avatar || defaultSystemAvatar,
    })
  }

  // 未读消息数量
  const unreadCount = computed(() => {
    return userMessages.value.filter((msg) => !msg.read).length
  })

  // 标记消息为已读
  const markAsRead = (id: string) => {
    const message = userMessages.value.find((msg) => msg.id === id)
    if (message) message.read = true
  }

  // 删除消息
  const deleteMessage = (id: string) => {
    const index = userMessages.value.findIndex((msg) => msg.id === id)
    if (index !== -1) userMessages.value.splice(index, 1)
  }

  // 全部标记为已读
  const markAllAsRead = () => {
    userMessages.value.forEach((msg) => {
      if (!msg.read) msg.read = true
    })
  }

  // 全部删除消息
  const deleteAllMessages = () => {
    userMessages.value = []
  }

  // 修改密码
  const updatePassword = async (data: IUpdatePasswordParams) => {
    const { data: res } = await updatePasswordRequest(data)
    if (res.code !== 200) return
    ElMessage.success('修改密码成功,即将重新登录')
    setTimeout(() => logout(), 1000)
  }

  onMounted(() => {
    getAddress()
  })

  return {
    userInfo,
    roleList,
    userMessages,
    unreadCount,
    userRoleName,
    address,
    currentTab,
    menuTabs,
    getUserInfo,
    clearUserInfo,
    getUserRoleName,
    markAsRead,
    deleteMessage,
    markAllAsRead,
    deleteAllMessages,
    updateUserProfile,
    updatePassword,
    logout,
    updateAvatar,
    deleteUserAccount,
    delay,
    sendMessage,
  }
})
