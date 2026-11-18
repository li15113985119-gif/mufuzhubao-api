import type { LearningResourceDefinition } from '../resource-types';

export const plcResources: LearningResourceDefinition[] = [
  {
    id: 'R05',
    group: 'plc',
    category: 'PLC_EXAMPLE',
    name: '博图 Startdrive 基础例程（电机启停/变频控制）',
    tag: '例程 · 约25分钟',
    desc: '在 TIA Portal 与 Startdrive 中完成变频器组态、电机启停和速度给定。',
    softwareName: '博图 TIA Portal',
    softwareVersion: 'TIA Portal + Startdrive',
    estimatedTime: 25,
    chapters: [
      {
        title: '1. 明确控制任务与安全边界',
        items: [
          { type: 'p', text: '本练习使用 PLC 控制变频器，实现启动、停止和两档速度给定。程序只负责发出运行命令和速度设定，急停、过载和机械限位仍应由硬件安全回路保护。' },
          { type: 'steps', text: '实验前完成检查：', lines: ['核对电机铭牌上的额定电压、电流、频率和转速。', '确认变频器输入电压与实训台供电一致。', '将电机固定在安全位置，联轴器和皮带轮安装防护罩。', '由教师确认急停、断路器和接地连接有效。'] },
          { type: 'note', text: '首次调试应空载或轻载运行，出现异味、异常振动或过流报警时立即断电并查找原因。' },
        ],
      },
      {
        title: '2. 在博图中添加设备',
        items: [
          { type: 'p', text: 'TIA Portal 中要同时组态 PLC 和变频器，并建立它们之间的通信关系。设备名称、IP 地址和报文必须与现场一致，否则程序能看到设备但无法交换控制字。' },
          { type: 'steps', text: '添加控制设备：', lines: ['新建项目并添加实际型号的 S7-1200 或 S7-1500 PLC。', '在网络视图中添加支持 Startdrive 的 SINAMICS 变频器。', '用 PROFINET 连线连接 PLC 和变频器，分配设备名称与 IP。', '选择标准报文 1，确认输入输出地址已自动分配。'] },
          { type: 'code', text: `网络参数示例：\nPLC IP：192.168.0.10\n变频器 IP：192.168.0.20\n子网掩码：255.255.255.0\n报文：Standard telegram 1\n控制字：STW1\n状态字：ZSW1` },
        ],
      },
      {
        title: '3. 编写启停与速度给定程序',
        items: [
          { type: 'p', text: '控制字用于发送启动和停止命令，主设定值用于发送速度。建议先在 PLC 中建立明确的接口变量，再映射到变频器报文，避免直接在各处写裸地址。' },
          { type: 'code', text: `变量建议：\nI0.0 StartPB\nI0.1 StopPB\nI0.2 SpeedHigh\nQ0.0 RunLamp\nMW10 SpeedSetpoint` },
          { type: 'steps', text: '编写基础逻辑：', lines: ['用启动按钮和停止按钮构建自锁运行位 M0.0。', '将 M0.0 映射到控制字的运行使能位。', '当 I0.2 为 0 时速度给定设为 750，为 1 时设为 1500。', '将运行位和速度反馈分别映射到指示灯和监控画面。'] },
          { type: 'note', text: '停止按钮建议使用常闭触点逻辑并在程序中做取反处理，实际接线须与实训台图纸一致。' },
        ],
      },
      {
        title: '4. 在 Startdrive 中完成电机调试',
        items: [
          { type: 'p', text: 'Startdrive 的调试向导会采集电机数据并执行识别。参数必须来自铭牌或教师确认的电机资料，不能随意填写大电流或高转速，否则可能触发过流或超速保护。' },
          { type: 'steps', text: '按向导完成调试：', lines: ['打开变频器调试向导，选择 IEC 电机和实际控制方式。', '输入额定电压 400 V、额定电流 1.1 A、额定频率 50 Hz、额定转速 1440 r/min。', '设置加速时间 2 s、减速时间 2 s，并选择静态识别。', '保存并下载参数，确认变频器无报警后进入就绪状态。'] },
          { type: 'code', text: `电机参数示例：\np0304 = 400 V\np0305 = 1.1 A\np0310 = 50 Hz\np0311 = 1440 r/min\np1120 = 2 s\np1121 = 2 s` },
        ],
      },
      {
        title: '5. 联调与结果记录',
        items: [
          { type: 'p', text: '联调时先低速点动，再逐步升到设定速度。观察变频器状态字、输出频率、电机转向和 PLC 指示灯是否一致，并把实际参数记录到实训报告。' },
          { type: 'steps', text: '验证控制功能：', lines: ['在低速档启动，确认电机转向和设定频率正确。', '切换到高速档，观察升速过程是否平稳。', '按下停止按钮，确认输出按减速时间停止。', '记录启动电流、稳定频率和停止时间，比较两次实验结果。'] },
          { type: 'code', text: `验收记录：\n任务：电机两档速度控制\n低速目标：750 r/min\n高速目标：1500 r/min\n加速时间：2 s\n停止方式：按斜坡减速\n异常记录：无` },
        ],
      },
    ],
  },
  {
    id: 'R06',
    group: 'plc',
    category: 'PLC_EXAMPLE',
    name: 'S7-200 SMART 顺序控制例程（交通灯/机械手）',
    tag: '例程 · 约22分钟',
    desc: '用步序和定时器完成交通灯循环，并迁移到机械手顺序动作。',
    softwareName: 'S7-200 SMART',
    softwareVersion: 'STEP 7-Micro/WIN SMART',
    estimatedTime: 22,
    chapters: [
      {
        title: '1. 把动作拆成步骤',
        items: [
          { type: 'p', text: '顺序控制的核心是同一时刻只允许一个主步执行。交通灯和机械手都可以拆成“初始、动作1、动作2、返回”几个步骤，每一步设定进入条件、输出和转移条件。' },
          { type: 'steps', text: '设计交通灯步序：', lines: ['步1：红灯亮 10 s。', '步2：绿灯亮 8 s。', '步3：黄灯亮 3 s。', '步3结束后返回步1，直到停止按钮动作。'] },
          { type: 'note', text: '先写步序表再编程，不要在梯形图里边试边加定时器，否则容易出现两个灯同时亮或步序无法复位。' },
        ],
      },
      {
        title: '2. 建立输入输出与内存地址',
        items: [
          { type: 'p', text: '地址表是程序、接线和画面之间的共同约定。输入按钮、输出灯和步序标志要分别命名，地址不要与高速计数或系统保留区冲突。' },
          { type: 'code', text: `输入：\nI0.0 启动按钮\nI0.1 停止按钮\n\n输出：\nQ0.0 红灯\nQ0.1 黄灯\nQ0.2 绿灯\n\n步标志：\nM1.1 红灯步\nM1.2 绿灯步\nM1.3 黄灯步\n\n定时器：\nT37 红灯 10 s\nT38 绿灯 8 s\nT39 黄灯 3 s` },
          { type: 'steps', text: '先在符号表中录入地址：', lines: ['打开符号表，建立 StartPB、StopPB 和三个灯输出。', '建立 StepRed、StepGreen、StepYellow 三个内存位。', '保存符号表后开始编写程序，避免直接记地址。'] },
        ],
      },
      {
        title: '3. 编写启动保持与步序定时',
        items: [
          { type: 'p', text: 'S7-200 SMART 的 100 ms 定时器预设值 100 表示 10 s。每一步由当前步标志启动自己的定时器，定时到达后关闭当前步并打开下一步。' },
          { type: 'code', text: `Network 1：启停保持\nLD I0.0\nO M0.0\nAN I0.1\n= M0.0\n\nNetwork 2：进入红灯步\nLD M0.0\nAN M1.2\nAN M1.3\n= M1.1\n\nNetwork 3：红灯定时\nLD M1.1\nTON T37, 100` },
          { type: 'steps', text: '按顺序完成：', lines: ['运行信号 M0.0 有效时进入红灯步 M1.1。', '在红灯步调用 TON T37，预设值 100。', 'T37 到达后置位绿灯步、复位红灯步。', '绿灯和停止按钮同样采用“前一步完成再进入下一步”的方式。'] },
        ],
      },
      {
        title: '4. 用相同方法编写机械手动作',
        items: [
          { type: 'p', text: '机械手动作要加入传感器确认，不能只按时间推进。例如夹紧后必须检测夹紧到位，再允许上升或旋转，否则可能发生碰撞。' },
          { type: 'steps', text: '典型动作顺序：', lines: ['原位且按下启动后，机械手下降到下限位。', '下限位检测有效后夹紧工件，等待夹紧到位信号。', '上升到位后旋转到目标工位，再下降放置。', '松开夹具并回到原位，完成一次循环。'] },
          { type: 'code', text: `机械手关键信号：\nI0.2 下限位\nI0.3 上限位\nI0.4 夹紧到位\nI0.5 旋转到位\nQ0.3 下降电磁阀\nQ0.4 夹紧电磁阀\nQ0.5 旋转电磁阀` },
          { type: 'note', text: '电磁阀动作前确认气源压力和机械限位正常，调试时先使用单步模式。' },
        ],
      },
      {
        title: '5. 单步、连续与故障复位',
        items: [
          { type: 'p', text: '实训程序应支持单步、连续和复位三种模式。单步用于检查每个动作，连续用于验证循环，复位用于在异常停机后回到安全初始状态。' },
          { type: 'steps', text: '测试顺序：', lines: ['单步模式下逐项确认每个传感器和输出。', '连续模式下观察循环切换和定时误差。', '按下停止按钮后确认当前动作安全结束。', '模拟传感器失效，记录程序停在哪一步以及恢复方法。'] },
          { type: 'note', text: '任何故障复位都不能绕过安全门、急停和人员进入检测条件。' },
        ],
      },
    ],
  },
  {
    id: 'R07',
    group: 'plc',
    category: 'PLC_EXAMPLE',
    name: 'GX Works2 基础编程例程（三菱 Q 系列梯形图）',
    tag: '例程 · 约20分钟',
    desc: '创建 Q 系列工程，完成 X/Y 地址、启停梯形图、定时器和程序下载。',
    softwareName: 'GX Works',
    softwareVersion: 'GX Works2',
    estimatedTime: 20,
    chapters: [
      {
        title: '1. 新建 Q 系列工程',
        items: [
          { type: 'p', text: 'GX Works2 支持多种系列和程序语言。创建工程时必须选择 QCPU、实际 PLC 型号和梯形图程序，否则程序编译后可能无法下载。' },
          { type: 'steps', text: '新建工程：', lines: ['打开 GX Works2，选择“新建工程”。', '系列选择 QCPU，型号按实际设备选择，例如 Q03UDECPU。', '程序语言选择梯形图，程序名填写 MAIN。', '确认工程路径为 D:\\GXWorks\\KXZ_Q_Basic。'] },
          { type: 'code', text: `工程设置示例：\n系列：QCPU\n型号：Q03UDECPU\n程序语言：Ladder\n程序名：MAIN\n工程路径：D:\\GXWorks\\KXZ_Q_Basic` },
        ],
      },
      {
        title: '2. 认识 X、Y、M、T、D 地址',
        items: [
          { type: 'p', text: '三菱 PLC 常用 X 表示输入、Y 表示输出、M 表示内部辅助继电器、T 表示定时器、D 表示数据寄存器。地址编号和输入输出范围要与硬件配置一致。' },
          { type: 'code', text: `本练习地址：\nX0 启动按钮\nX1 停止按钮\nX2 模式开关\nY0 运行指示灯\nY1 报警指示灯\nM0 运行状态\nT0 延时定时器\nD100 计数结果` },
          { type: 'note', text: '不要把带断电保持功能的 M 或 D 地址分配给临时状态，否则重启后可能保留旧状态。' },
        ],
      },
      {
        title: '3. 编写电机启停梯形图',
        items: [
          { type: 'p', text: '启停自锁是最基础的梯形图。启动输入与运行状态并联，停止输入以常闭逻辑串联，最后驱动运行状态和输出。' },
          { type: 'code', text: `指令表形式：\nLD X0\nOR M0\nANI X1\nOUT M0\nLD M0\nOUT Y0\nEND` },
          { type: 'steps', text: '在梯形图编辑器中输入：', lines: ['将 X0 常开触点与 M0 常开触点并联。', '串联 X1 常闭触点，驱动 M0 线圈。', '用 M0 常开触点驱动 Y0 输出。', '按 F4 转换程序，检查灰色梯形图变为可编译状态。'] },
        ],
      },
      {
        title: '4. 加入 5 秒延时启动',
        items: [
          { type: 'p', text: '定时器 T0 的计时单位通常由 PLC 参数决定，Q 系列普通定时器常见为 100 ms。若设定值为 K50，对应约 5 秒，调试时应通过监控确认实际计时。' },
          { type: 'code', text: `延时启动示例：\nLD M0\nOUT T0 K50\nLD T0\nOUT Y1\n\n解释：\nT0 条件保持 5 s 后，Y1 报警灯亮\n松开 M0 或停止时 T0 立即复位` },
          { type: 'steps', text: '验证定时器：', lines: ['启动后进入软元件监控，观察 T0 当前值递增。', '到达 K50 后检查 Y1 是否点亮。', '停止运行并确认 T0 当前值回到 0。', '修改 K30 比较 3 秒与 5 秒的差异。'] },
        ],
      },
      {
        title: '5. 下载、监控和备份',
        items: [
          { type: 'p', text: '下载前先进行程序检查，再连接实际 PLC。在线修改程序时要确认设备处于安全状态，下载完成后不能直接带负载全速运行。' },
          { type: 'steps', text: '完成上机验证：', lines: ['执行“程序检查”，确认无语法和双线圈错误。', '通过 USB 或以太网连接 PLC，测试通信。', '写入程序后切换到监视模式，逐个测试输入输出。', '保存工程，并导出程序清单和软元件注释作为备份。'] },
          { type: 'note', text: '程序下载可能覆盖 PLC 原有程序，操作前必须由教师确认并做好原始工程备份。' },
        ],
      },
    ],
  },
  {
    id: 'R08',
    group: 'plc',
    category: 'PLC_EXAMPLE',
    name: '组态王与 PLC 通信例程',
    tag: '例程 · 约24分钟',
    desc: '以 Modbus TCP 为例，完成组态王设备、变量、画面和通信故障排查。',
    softwareName: '组态王',
    softwareVersion: 'Modbus TCP',
    estimatedTime: 24,
    chapters: [
      {
        title: '1. 先画通信拓扑',
        items: [
          { type: 'p', text: '通信例程要明确电脑、PLC、交换机和设备地址。PC 与 PLC 应在同一网段，PLC 侧必须启用对应通信服务，组态王中的 IP 和端口要与 PLC 一致。' },
          { type: 'code', text: `拓扑示例：\n组态王电脑 192.168.2.10\nPLC        192.168.2.1\n交换机      普通工业交换机\n协议        Modbus TCP\n端口        502` },
          { type: 'steps', text: '连接前检查：', lines: ['用网线连接电脑和 PLC，确认网口指示灯正常。', '在电脑上设置固定 IP 192.168.2.10。', '用 ping 检查电脑与 PLC 是否连通。', '在 PLC 程序中确认 Modbus TCP 服务已启用。'] },
        ],
      },
      {
        title: '2. 测试网络和端口',
        items: [
          { type: 'p', text: '能 ping 通只能说明网络层可达，不代表 Modbus TCP 服务正常。还要确认 502 端口开放，并在 PLC 侧检查服务器配置和保持寄存器地址范围。' },
          { type: 'code', text: `Windows PowerShell 测试：\nping 192.168.2.1\nTest-NetConnection -ComputerName 192.168.2.1 -Port 502` },
          { type: 'steps', text: '按结果判断：', lines: ['ping 不通时检查网线、电脑 IP 和子网掩码。', 'ping 通但 502 不通时检查 PLC 服务、防火墙和端口配置。', '端口通但仍读不到变量时检查站号、功能码和寄存器地址。', '记录测试时间和结果，便于后续对比。'] },
        ],
      },
      {
        title: '3. 在组态王中建立设备',
        items: [
          { type: 'p', text: '组态王设备配置由驱动、设备地址和通信参数组成。Modbus TCP 设备的站号通常用于区分同一 IP 下的从站，必须与 PLC 设置一致。' },
          { type: 'steps', text: '新建设备：', lines: ['打开工程浏览器，在设备下新建 Modbus TCP 设备。', '填写设备名称 KXZ_Modbus_PLC，选择 TCP/IP 通信方式。', '输入 PLC IP 192.168.2.1、端口 502、站号 1。', '设置超时 1000 ms、重试 3 次并保存。'] },
          { type: 'code', text: `设备参数示例：\n设备名：KXZ_Modbus_PLC\nIP：192.168.2.1\n端口：502\n站号：1\n超时：1000 ms\n重试：3 次` },
        ],
      },
      {
        title: '4. 建立变量并绑定画面',
        items: [
          { type: 'p', text: '组态王变量要按 PLC 实际数据类型建立。线圈和寄存器地址属于不同的数据区，不能只凭名称猜测；寄存器长度也要与 PLC 数据类型匹配。' },
          { type: 'code', text: `变量示例：\nMotorRun  I/O 离散  00001\nFaultLamp I/O 离散  00002\nSpeedSet  I/O 整型  40001\nRunState  I/O 离散  00003` },
          { type: 'steps', text: '完成基础画面：', lines: ['在数据词典中建立四个变量，并绑定到设备 KXZ_Modbus_PLC。', '新建主画面，放置启动按钮、停止按钮、运行灯和速度输入框。', '设置按钮写入线圈地址，指示灯绑定运行状态变量。', '保存工程并切换到运行系统进行测试。'] },
        ],
      },
      {
        title: '5. 通信失败的分层排查',
        items: [
          { type: 'p', text: '通信故障按“网络、端口、设备配置、变量地址、PLC 程序”五层排查，不要一开始就重启电脑。每层只验证一个事实，能避免把配置问题误判为软件故障。' },
          { type: 'steps', text: '推荐排查顺序：', lines: ['检查电脑 IP 和 PLC IP 是否在同一网段。', '用 ping 和 502 端口测试确认网络与服务。', '在组态王设备测试中读取一个已知寄存器。', '检查变量地址、数据类型和 PLC 程序中的寄存器映射。'] },
          { type: 'note', text: '修改 PLC 的通信服务或 IP 前，先记录原参数并通知同组同学，避免影响正在运行的实训设备。' },
        ],
      },
    ],
  },
];
