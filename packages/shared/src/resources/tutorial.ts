import type { LearningResourceDefinition } from '../resource-types';

export const tutorialResources: LearningResourceDefinition[] = [
  {
    id: 'R01',
    group: 'tutorial',
    category: 'INSTALL_GUIDE',
    name: '博图 TIA Portal 安装图文教程',
    tag: '教程 · 约15分钟',
    desc: '从系统检查、解压安装到首次启动，完成 TIA Portal 的安全安装与验证。',
    softwareName: '博图 TIA Portal',
    softwareVersion: 'V16/V17',
    estimatedTime: 15,
    chapters: [
      {
        title: '1. 安装前先核对电脑环境',
        items: [
          { type: 'p', text: 'TIA Portal 体积大、依赖多，安装失败往往不是安装包本身，而是操作系统版本、磁盘空间、Windows 更新状态或旧组件冲突造成的。先检查再安装，比出错后反复卸载更省时间。' },
          { type: 'steps', text: '按下面的顺序完成环境检查：', lines: ['确认系统为 64 位 Windows 10 或 Windows 11 专业版，内存建议 16 GB 以上。', '准备至少 80 GB 连续可用空间，安装路径只使用英文和数字。', '安装前重启一次电脑，退出杀毒软件的文件拦截提示和正在运行的西门子软件。', '查看西门子官方兼容性工具，确认当前系统版本和 TIA Portal 版本匹配。'] },
          { type: 'note', text: '使用学校或西门子官方提供的正版安装介质，不下载破解包、激活补丁或来源不明的精简版。' },
        ],
      },
      {
        title: '2. 解压安装包并启动安装程序',
        items: [
          { type: 'p', text: '多个 ISO 或压缩包必须先完整保存在本地硬盘，再解压到同一目录。直接在压缩软件预览窗口中运行安装程序，可能导致组件找不到源文件。' },
          { type: 'steps', text: '推荐按以下方式操作：', lines: ['将所有安装分包放在 D:\\TIA_V17 目录，确认文件数量与官方清单一致。', '右键压缩包选择“全部解压缩”，解压到 D:\\TIA_V17\\setup。', '进入 setup 目录，右键 Start.exe，选择“以管理员身份运行”。', '按安装向导选择安装语言、目标目录和需要安装的组件。'] },
          { type: 'code', text: `示例目录：\nD:\\TIA_V17\\setup\\Start.exe\n安装目录：D:\\Siemens\\Automation\n建议保留至少 80 GB 可用空间` },
        ],
      },
      {
        title: '3. 处理重启提示与组件安装',
        items: [
          { type: 'p', text: '安装程序提示“需要重启计算机”时，说明某个 Windows 更新或安装事务尚未结束。先正常重启并等待系统更新完成，再重新运行安装程序，不要直接修改注册表强行跳过。' },
          { type: 'steps', text: '出现重启提示时依次处理：', lines: ['保存文件并选择“重启”，不要使用强制关机。', '进入系统后等待 Windows 更新完成，再关闭占用安装目录的软件。', '重新以管理员身份运行 Start.exe，并选择恢复安装。', '如果同一提示连续出现，记录提示文字并请教师检查 Windows Installer 状态。'] },
          { type: 'note', text: '安装过程中不要同时安装 STEP 7、WinCC、Startdrive 等其他大版本组件，避免组件版本相互覆盖。' },
        ],
      },
      {
        title: '4. 首次启动与授权检查',
        items: [
          { type: 'p', text: '安装结束后，TIA Portal 首次启动会检查许可证、项目服务和运行库。能打开欢迎页面并不代表全部组件都可用，还要新建项目验证硬件目录和编译功能。' },
          { type: 'steps', text: '完成以下验证：', lines: ['从开始菜单启动 TIA Portal，确认没有缺失 DLL 或服务错误。', '新建一个空项目，添加一个与实训设备匹配的 PLC。', '打开设备视图，执行一次“编译 > 硬件和软件（全部重建）”。', '在“帮助 > 已安装的产品”中核对版本和授权状态。'] },
          { type: 'code', text: `项目名示例：\nKXZ_TIA_Demo\n设备示例：\nCPU 1214C DC/DC/DC\n编译目标：\n硬件和软件（全部重建）` },
        ],
      },
      {
        title: '5. 安装后的整理与备份',
        items: [
          { type: 'p', text: '把安装版本、系统版本、安装日期和授权来源记录下来，便于后续排查兼容性问题。安装介质不要立即删除，遇到组件修复时仍可能用到。' },
          { type: 'steps', text: '建议建立实训电脑安装记录：', lines: ['记录电脑编号、Windows 版本、TIA Portal 完整版本号。', '记录安装目录、安装包来源和授权方式。', '新建测试项目并备份到教师指定目录。', '在管理后台登记本机已知问题，方便同型号电脑参考。'] },
          { type: 'note', text: '删除系统目录或使用第三方清理工具处理西门子组件前应先备份，错误清理可能导致软件无法修复。' },
        ],
      },
    ],
  },
  {
    id: 'R02',
    group: 'tutorial',
    category: 'INSTALL_GUIDE',
    name: 'S7-200 SMART 快速入门',
    tag: '教程 · 约18分钟',
    desc: '完成软件安装、PLC 组态、网线连接、程序下载和首次运行。',
    softwareName: 'S7-200 SMART',
    softwareVersion: 'STEP 7-Micro/WIN SMART',
    estimatedTime: 18,
    chapters: [
      {
        title: '1. 认识软件与实训设备',
        items: [
          { type: 'p', text: 'S7-200 SMART 的编程软件是 STEP 7-Micro/WIN SMART。学习时先分清 PLC 型号、供电方式、输入输出类型和通信口，再开始接线，避免把 24 V 传感器信号误接到 220 V 回路。' },
          { type: 'code', text: `常见设备信息：\nCPU：SR20 AC/DC/RLY\n输入：24 V DC 漏型/源型可接线\n输出：继电器输出\n以太网口：1 个 RJ45\n默认 PLC IP：192.168.2.1` },
          { type: 'note', text: '接线和下载前必须断开主电源，由教师确认电源类型与端子定义后再上电。' },
        ],
      },
      {
        title: '2. 新建工程并选择 CPU',
        items: [
          { type: 'p', text: '新建工程后，软件中的 CPU 型号要与铭牌一致。型号不一致会造成系统块、输入输出地址或高速计数功能不可用。' },
          { type: 'steps', text: '建立第一个工程：', lines: ['打开 STEP 7-Micro/WIN SMART，新建空白项目。', '在系统块中选择实际 CPU 型号和订货号。', '在项目树中打开程序块，确认主程序 OB1 已创建。', '保存工程为 KXZ_SMART_Basic。'] },
          { type: 'code', text: `Network 1：启动保持\nI0.0      M0.0      Q0.0\n--| |------| |-------( )\n\nNetwork 2：停止\nI0.1      M0.0\n--| |------( )` },
        ],
      },
      {
        title: '3. 连接 PLC 并设置通信',
        items: [
          { type: 'p', text: '电脑与 PLC 直连时，双方必须在同一网段。例如 PLC 为 192.168.2.1，电脑可设为 192.168.2.10。不要占用网关已被其他设备使用的地址。' },
          { type: 'steps', text: '使用以太网线连接：', lines: ['将电脑有线网卡设为固定 IP 192.168.2.10，子网掩码 255.255.255.0。', '用网线连接电脑网口和 PLC 以太网口，确认网口指示灯闪烁。', '在软件中打开“通信”，选择对应网卡并搜索 CPU。', '搜索到设备后记录 MAC 地址和 IP，再进入系统块设置参数。'] },
          { type: 'code', text: `电脑 IP：192.168.2.10\nPLC IP：192.168.2.1\n子网掩码：255.255.255.0\n测试命令：ping 192.168.2.1` },
        ],
      },
      {
        title: '4. 下载程序并运行',
        items: [
          { type: 'p', text: '下载前先编译，确认没有语法错误。首次下载通常需要把系统块和程序块一起写入；运行前还需要检查输入输出接线和机械安全区域。' },
          { type: 'steps', text: '完成首次下载：', lines: ['点击“编译”，确认输出窗口显示 0 个错误。', '点击“下载”，选择程序块、系统块和数据块。', '下载完成后将 CPU 拨到 RUN 状态。', '按下启动按钮，观察 Q0.0 是否按程序逻辑动作。'] },
          { type: 'note', text: '下载过程中不要断电或拔网线，否则可能造成程序不完整或通信配置丢失。' },
        ],
      },
      {
        title: '5. 做一个启停联锁小练习',
        items: [
          { type: 'p', text: '启停电路是 PLC 基础练习。启动按钮按下后输出保持，停止按钮优先；热继电器动作时也应立即切断输出，形成基本安全联锁。' },
          { type: 'code', text: `输入：\nI0.0 启动按钮（常开）\nI0.1 停止按钮（常闭）\nI0.2 热继电器（常闭）\n输出：\nQ0.0 接触器线圈\n\n逻辑要求：\nI0.0 与 Q0.0 并联形成自锁\nI0.1、I0.2 串联在回路中\n任一保护条件动作，Q0.0 复位` },
          { type: 'steps', text: '验证方法：', lines: ['按下启动按钮，确认 Q0.0 得电并保持。', '松开启动按钮，确认输出仍保持。', '按下停止按钮，确认 Q0.0 立即断开。', '模拟热继电器动作，确认输出不能重新启动。'] },
        ],
      },
    ],
  },
  {
    id: 'R03',
    group: 'tutorial',
    category: 'INSTALL_GUIDE',
    name: '组态王工程创建指南',
    tag: '教程 · 约20分钟',
    desc: '从新建工程、建立设备到变量和画面，完成一个可运行的组态王实训项目。',
    softwareName: '组态王',
    softwareVersion: '通用教学版',
    estimatedTime: 20,
    chapters: [
      {
        title: '1. 先规划工程结构',
        items: [
          { type: 'p', text: '组态王工程由设备、数据库变量、画面和运行系统组成。先画出设备清单、通信参数和变量表，再打开软件创建工程，可以减少后期反复修改地址。' },
          { type: 'steps', text: '新建工程前准备三项资料：', lines: ['确认 PLC 型号、通信协议和串口或网络参数。', '列出需要读写的变量，包括名称、地址、数据类型和单位。', '确定画面数量，例如主画面、报警画面和趋势画面。'] },
          { type: 'note', text: '工程目录使用英文路径，避免把工程放在桌面临时目录或同步网盘中。' },
        ],
      },
      {
        title: '2. 新建工程与设置路径',
        items: [
          { type: 'p', text: '每个组态王工程应使用独立目录。工程目录中包含数据库、画面和历史数据配置，复制工程时要连同整个目录一起复制。' },
          { type: 'steps', text: '创建工程：', lines: ['启动组态王工程管理器，选择“新建工程”。', '工程名称填写 KXZ_KingView_Basic，工程描述填写实训启停控制。', '保存路径选择 D:\\KingViewProjects\\KXZ_KingView_Basic。', '确认创建后进入开发系统。'] },
          { type: 'code', text: `工程目录示例：\nD:\\KingViewProjects\\KXZ_KingView_Basic\n\n备份命名：\nKXZ_KingView_Basic_20261118` },
        ],
      },
      {
        title: '3. 建立设备与通信连接',
        items: [
          { type: 'p', text: '设备配置决定组态王如何访问 PLC。串口通信时，必须让 PLC 与组态王的波特率、数据位、校验位和停止位一致；以太网通信时，还要确认 IP、端口和协议。' },
          { type: 'steps', text: '以 Modbus RTU 为例进行配置：', lines: ['在设备管理器中新建设备，选择 PLC 对应驱动和通信端口。', '串口参数设置为 COM1、9600 bit/s、8 数据位、偶校验、1 停止位。', '设置 PLC 站号为 1，超时时间 1000 ms，重试次数 3。', '保存配置后使用“测试”功能读取一个已知寄存器。'] },
          { type: 'code', text: `示例通信参数：\n协议：Modbus RTU\n端口：COM1\n波特率：9600\n数据位：8\n校验：Even\n停止位：1\n从站地址：1` },
          { type: 'note', text: '实际参数以 PLC 程序中的通信设置和实训设备铭牌为准，示例值不能直接套用到所有设备。' },
        ],
      },
      {
        title: '4. 建立变量与主画面',
        items: [
          { type: 'p', text: '变量是画面与设备之间的数据桥梁。变量名应表达用途，地址和数据类型要与 PLC 保持一致。先在数据词典中建立变量，再在画面中绑定控件。' },
          { type: 'steps', text: '完成启停画面：', lines: ['在数据词典中新建启动按钮、停止按钮和电机运行三个变量。', '设置启动按钮为内存离散变量，停止按钮为内存离散变量，电机运行为 I/O 离散变量。', '新建主画面，放置两个按钮和一只运行指示灯。', '将按钮和指示灯分别绑定到对应变量，并设置按钮动作。'] },
          { type: 'code', text: `变量示例：\nStartBtn  Bool  内存离散\nStopBtn   Bool  内存离散\nMotorRun  Bool  设备寄存器 00001\n\n按钮动作：\n按下 StartBtn = 1\n按下 StopBtn = 1\n松开对应按钮后恢复 0` },
        ],
      },
      {
        title: '5. 运行测试与保存备份',
        items: [
          { type: 'p', text: '切换运行前要确认设备在线、变量地址正确、画面按钮不会触发危险动作。先在空载或仿真环境下测试，再连接实际设备。' },
          { type: 'steps', text: '完成运行验证：', lines: ['保存工程并切换至运行系统。', '点击启动按钮，观察 PLC 输出和画面指示灯是否同步。', '点击停止按钮，确认输出立即停止。', '关闭运行系统，压缩整个工程目录并按日期备份。'] },
          { type: 'note', text: '不要只备份单个画面文件，组态王工程必须连同配置文件和数据库一起备份。' },
        ],
      },
    ],
  },
  {
    id: 'R04',
    group: 'tutorial',
    category: 'INSTALL_GUIDE',
    name: 'WinCC 变量与画面入门',
    tag: '教程 · 约18分钟',
    desc: '掌握 WinCC 变量连接、画面控件、按钮脚本和运行测试的基本流程。',
    softwareName: 'WinCC',
    softwareVersion: 'WinCC 7.x/8.x',
    estimatedTime: 18,
    chapters: [
      {
        title: '1. 理解变量、画面与运行系统',
        items: [
          { type: 'p', text: 'WinCC 通过变量访问 PLC 数据，画面负责显示和操作，运行系统负责刷新和记录。变量地址、数据类型和连接配置任何一处错误，都可能表现为画面数值不变化或按钮无效。' },
          { type: 'steps', text: '开始前确认：', lines: ['WinCC 项目已创建并能进入图形编辑器。', 'PLC 通信连接已建立，通道和驱动与设备匹配。', '变量表已经规划好名称、地址和数据类型。'] },
          { type: 'note', text: '不同 WinCC 版本的菜单名称可能略有不同，但变量、画面和运行系统的操作思路一致。' },
        ],
      },
      {
        title: '2. 新建变量连接',
        items: [
          { type: 'p', text: '先在变量管理中建立连接，再建立变量。连接名称用于区分不同 PLC，变量名用于画面绑定。不要使用“变量1”“地址a”这类无法维护的名称。' },
          { type: 'steps', text: '建立变量：', lines: ['打开变量管理，新建一个与 S7 设备匹配的连接。', '在连接下新建二进制变量 MotorRun。', '填写 PLC 地址，例如 M0.0 或 DB1.DBX0.0。', '将变量类型设为二进制，保存并检查连接状态。'] },
          { type: 'code', text: `变量表示例：\n名称        类型      地址\nMotorRun    Binary    M0.0\nFaultLamp   Binary    M0.1\nSpeedSet    Unsigned  DB1.DBW2\nStartCmd    Binary    M0.2` },
        ],
      },
      {
        title: '3. 绘制主画面并绑定动态属性',
        items: [
          { type: 'p', text: '画面控件本身不会自动连接 PLC。需要把圆、矩形或按钮的动态属性绑定到变量，例如颜色变化绑定 MotorRun，文本显示绑定 SpeedSet。' },
          { type: 'steps', text: '制作一个运行指示灯：', lines: ['在图形编辑器中新建画面，放置一个圆形和两个按钮。', '打开圆形对象的属性，选择背景颜色动态化。', '将动态化变量设为 MotorRun，0 时显示灰色，1 时显示绿色。', '给启动和停止按钮分别绑定鼠标按下事件。'] },
          { type: 'note', text: '按钮事件应使用边沿或短时置位逻辑，避免鼠标一直按下导致命令持续写入。' },
        ],
      },
      {
        title: '4. 添加按钮脚本',
        items: [
          { type: 'p', text: '按钮脚本适合处理界面命令和简单的变量写入。脚本执行前要确认变量名与变量管理中的名称完全一致，并避免在脚本中写入未定义的变量。' },
          { type: 'code', text: `按钮脚本示例：\nHMIRuntime.Tags("StartCmd").Write 1;\nHMIRuntime.Tags("StartCmd").Write 0;\n\n读取运行状态：\nvar motor = HMIRuntime.Tags("MotorRun").Read();` },
          { type: 'steps', text: '完成脚本测试：', lines: ['双击启动按钮，在事件中选择“鼠标单击”。', '粘贴脚本并检查变量名拼写。', '保存画面，启动运行系统。', '点击按钮，确认 PLC 变量和画面状态同步变化。'] },
        ],
      },
      {
        title: '5. 运行测试与故障定位',
        items: [
          { type: 'p', text: '画面不刷新时，不要先怀疑显卡。按“变量值、连接状态、PLC 地址、画面绑定”的顺序逐层检查，通常能快速定位问题。' },
          { type: 'steps', text: '按顺序排查：', lines: ['在变量管理中查看变量当前值是否刷新。', '检查连接是否在线以及 PLC 地址是否正确。', '检查画面对象的动态化变量是否选对。', '查看运行系统诊断窗口，记录错误编号和处理结果。'] },
          { type: 'code', text: `排查记录格式：\n时间：2026-11-18 10:30\n现象：运行灯不变化\n变量值：MotorRun = 1\n连接状态：在线\n地址：M0.0\n处理：重新绑定圆形背景色动态化` },
        ],
      },
    ],
  },
];
