import { CaseVerificationStatus, ContentStatus, PrismaClient, ResourceCategory } from '@prisma/client';
import { LEARNING_RESOURCES } from '@kongxiaozhi/shared';
import userCases from './data/user-cases.json';
import { hash } from 'bcryptjs';
import { buildSearchText } from '../src/common/helpers';

const prisma = new PrismaClient();
const DEMO_TAG = '演示数据';

const softwareSeed = [
  { name: '博图 TIA Portal', description: '西门子 TIA Portal 安装、兼容性、通信与项目维护', icon: 'TIA', sortOrder: 10 },
  { name: 'S7-200 SMART', description: 'S7-200 SMART 编程软件、设备连接与程序下载', icon: 'S7', sortOrder: 20 },
  { name: '组态王', description: '组态王安装、数据库、变量与通信配置', icon: '组', sortOrder: 30 },
  { name: 'WinCC', description: 'WinCC 组件、服务、授权与运行系统', icon: 'WC', sortOrder: 40 },
  { name: 'GX Works', description: '三菱 GX Works 驱动、端口与工程文件', icon: 'GX', sortOrder: 50 },
  { name: 'Windows 系统', description: 'Windows 10/11 安装、启动、权限、文件和系统环境问题', icon: 'WIN', sortOrder: 60 },
  { name: 'Windows 更新', description: 'Windows Update 下载、安装、回滚和系统更新问题', icon: 'UPD', sortOrder: 70 },
  { name: '常用软件', description: '工控学习和实训中常用软件的安装与运行问题', icon: 'APP', sortOrder: 80 },
  { name: 'Office', description: 'Office/WPS 安装、激活提示、文档打开和打印问题', icon: 'OFF', sortOrder: 90 },
  { name: '驱动/硬件', description: 'USB、串口、网卡、显卡、打印机等驱动与硬件识别问题', icon: 'DRV', sortOrder: 100 },
  { name: '网络', description: 'IP、DNS、网络连接、共享和局域网通信问题', icon: 'NET', sortOrder: 110 },
  { name: '打印机', description: '打印机驱动、共享、脱机和打印队列问题', icon: 'PRN', sortOrder: 120 },
];
const faultTypeSeed = [
  { name: '安装失败', description: '安装中断、组件安装错误或安装程序无法启动', sortOrder: 10 },
  { name: '兼容性/系统环境', description: '操作系统版本、权限、路径和环境依赖问题', sortOrder: 20 },
  { name: '驱动与设备连接', description: 'USB、串口、网卡、驱动或设备识别异常', sortOrder: 30 },
  { name: '驱动异常', description: '驱动未安装、版本不匹配或设备初始化失败', sortOrder: 35 },
  { name: '通信配置', description: 'PLC、HMI、上位机之间的网络或协议通信问题', sortOrder: 40 },
  { name: '运行库与组件', description: '运行库、服务、数据库组件或依赖缺失', sortOrder: 50 },
  { name: '项目打开与编译', description: '工程文件无法打开、编译报错或版本不匹配', sortOrder: 60 },
  { name: '授权与服务', description: '授权、许可证、后台服务或运行状态异常', sortOrder: 70 },
  { name: '服务运行状态', description: '后台服务未启动、服务崩溃或启动类型错误', sortOrder: 55 },
  { name: '通信连接失败', description: '设备搜索、在线连接、串口和网络通信失败', sortOrder: 45 },
  { name: '缓存清理', description: '缓存、临时文件、历史数据导致的性能或空间问题', sortOrder: 65 },
  { name: '运行库缺失', description: 'VC++、.NET、组件注册等运行库和依赖问题', sortOrder: 52 },
  { name: '系统更新失败', description: 'Windows 更新下载、安装、回滚或版本升级失败', sortOrder: 80 },
  { name: '蓝屏/无法启动', description: '系统蓝屏、启动失败、驱动冲突或恢复环境问题', sortOrder: 85 },
  { name: '网络故障', description: 'IP 冲突、DNS、共享、网络适配器和局域网问题', sortOrder: 86 },
  { name: '外设/打印', description: '打印机、扫描仪和其他外设连接异常', sortOrder: 87 },
  { name: '权限/文件占用', description: '管理员权限、文件占用、账户和系统权限问题', sortOrder: 88 },
  { name: '其他', description: '暂未归类的工控软件和系统使用问题', sortOrder: 99 },
];

type DemoCase = {
  id: string; sw: string; ft: string; title: string; version: string; errorCode: string;
  symptom: string; causes: string[]; steps: string[]; environment: string; tags: string[];
};
const demoCases: DemoCase[] = [
  { id: 'demo-tia-install-001', sw: '博图 TIA Portal', ft: '安装失败', title: 'TIA Portal 安装中提示重启后继续', version: 'V16/V17', errorCode: '示例提示：需要重启计算机', symptom: '安装程序在检查环境后停止，提示需要重启计算机后再继续。', causes: ['Windows 更新或安装组件挂起', '系统权限不足', '安装包解压不完整'], steps: ['保存工作并正常重启计算机', '关闭其他安装程序与安全软件弹窗', '右键以管理员身份运行安装程序', '若仍提示重启，先由教师检查系统更新与挂起组件'], environment: 'Windows 10/11；校园实训电脑', tags: [DEMO_TAG, '安装', '重启'] },
  { id: 'demo-tia-compat-002', sw: '博图 TIA Portal', ft: '兼容性与系统环境', title: 'TIA Portal 安装前提示操作系统不受支持', version: 'V15.1/V16', errorCode: '示例提示：操作系统版本不满足要求', symptom: '安装检查阶段显示当前 Windows 版本不受支持。', causes: ['安装版本与系统版本不匹配', '系统缺少必要更新', '家庭版环境存在额外限制'], steps: ['核对西门子官方兼容性列表', '记录当前系统版本和更新编号', '不要通过修改安装包绕过兼容性检查', '由教师确认是否改用受支持的实验环境'], environment: 'Windows 家庭版/教育版；需按官方兼容性表核验', tags: [DEMO_TAG, '兼容性', '系统版本'] },
  { id: 'demo-tia-comm-003', sw: '博图 TIA Portal', ft: '通信配置', title: 'TIA Portal 无法在线访问 PLC', version: 'V15.1及以上', errorCode: '常见提示：无法建立到设备的连接', symptom: '项目在线时找不到可访问设备，或设备列表为空。', causes: ['电脑与 PLC 不在同一网段', '网卡选择错误', '防火墙或 VPN 干扰', '设备 IP 配置不正确'], steps: ['检查电脑网卡 IP 与 PLC 是否同网段', '在在线访问中指定正确网卡', '暂时关闭 VPN 并测试', '使用 ping 测试基础连通性后再在线访问'], environment: 'Windows 10；PROFINET 实训网络', tags: [DEMO_TAG, '通信', 'PROFINET'] },
  { id: 'demo-s7-driver-004', sw: 'S7-200 SMART', ft: '驱动与设备连接', title: 'S7-200 SMART 编程软件找不到 USB 设备', version: 'STEP 7-Micro/WIN SMART', errorCode: '常见提示：未找到设备', symptom: 'USB 线已连接 PLC，但软件搜索不到目标设备。', causes: ['USB 驱动未安装或异常', 'USB 线仅供电不支持数据', 'PLC 未上电', '端口被其他程序占用'], steps: ['确认 PLC 电源和指示灯状态', '更换确认可传输数据的 USB 线', '在设备管理器中检查未知设备或错误标记', '重新安装官方驱动后再次搜索'], environment: 'Windows 10；实训台 SMART 200 PLC', tags: [DEMO_TAG, 'USB', '设备连接'] },
  { id: 'demo-s7-port-005', sw: 'S7-200 SMART', ft: '驱动与设备连接', title: 'S7-200 SMART 搜索设备时提示端口被占用', version: 'Micro/WIN SMART', errorCode: '示例提示：通信端口打开失败', symptom: '搜索设备操作无法继续，提示端口不可用。', causes: ['其他编程软件占用通信端口', '串口转换器驱动异常', '后台服务未释放端口'], steps: ['关闭其他可能连接 PLC 的软件', '拔插通信线并检查设备管理器', '重启电脑后仅打开一个编程软件测试', '记录端口名称交给教师进一步检查'], environment: 'Windows 10；USB/串口转换器', tags: [DEMO_TAG, '端口占用', '串口'] },
  { id: 'demo-kingview-install-006', sw: '组态王', ft: '安装失败', title: '组态王安装完成后提示组件注册失败', version: '通用演示版本', errorCode: '示例提示：组件注册失败', symptom: '安装进度结束，但部分组件提示注册不成功。', causes: ['管理员权限不足', '安全软件拦截组件注册', '系统中存在旧版本残留'], steps: ['保存错误截图和组件名称', '以管理员身份重新运行安装程序', '检查安全软件拦截记录', '不要直接删除系统组件，先由教师确认残留清理方案'], environment: 'Windows 10 实训电脑', tags: [DEMO_TAG, '组件注册', '安装'] },
  { id: 'demo-kingview-db-007', sw: '组态王', ft: '运行库与组件', title: '组态王启动时提示数据库组件不可用', version: '通用演示版本', errorCode: '常见提示：数据库连接失败', symptom: '工程打开后历史库相关功能不可用，并出现数据库连接提示。', causes: ['数据库服务未启动', '数据源配置错误', '当前用户权限不足'], steps: ['检查 Windows 服务中的数据库服务状态', '在组态王中核对数据源名称与连接参数', '使用普通测试工程验证数据库读写', '保留错误信息并由教师检查权限配置'], environment: 'Windows 10；SQL Server 实验环境', tags: [DEMO_TAG, '数据库', '组件'] },
  { id: 'demo-kingview-comm-008', sw: '组态王', ft: '通信配置', title: '组态王设备通讯状态显示异常', version: '通用演示版本', errorCode: '常见提示：设备通讯失败', symptom: '运行画面中设备状态异常，变量值不刷新。', causes: ['串口参数不一致', 'PLC 地址或站号配置错误', '通信线连接异常', '设备驱动选择错误'], steps: ['核对波特率、数据位、校验位和停止位', '确认 PLC 站号与设备地址一致', '检查通信线缆和接地', '使用串口调试工具做基础连通性测试'], environment: 'Windows 10；串口连接实训设备', tags: [DEMO_TAG, '通讯', '串口'] },
  { id: 'demo-wincc-service-009', sw: 'WinCC', ft: '授权与服务', title: 'WinCC 项目管理器无法启动服务', version: '通用演示版本', errorCode: '示例提示：服务未启动', symptom: '打开项目管理器时提示相关服务不可用。', causes: ['后台服务被停止', '系统权限不足', '组件安装不完整'], steps: ['查看服务名称和当前状态', '尝试以管理员身份启动相关服务', '记录错误代码与系统事件日志', '若服务反复停止，由教师检查组件和授权环境'], environment: 'Windows 10；WinCC 实验环境', tags: [DEMO_TAG, '服务', '授权'] },
  { id: 'demo-wincc-runtime-010', sw: 'WinCC', ft: '运行库与组件', title: 'WinCC 运行系统打开项目时组件缺失', version: '通用演示版本', errorCode: '示例提示：组件未安装', symptom: '运行系统提示缺少组件，无法加载项目。', causes: ['项目使用了未安装的功能组件', '安装版本不一致', '组件注册异常'], steps: ['记录提示中的组件名称', '核对项目所需选件与当前安装清单', '使用官方安装介质补齐对应组件', '补齐后重启并重新打开测试项目'], environment: 'Windows 10；WinCC 运行系统', tags: [DEMO_TAG, '运行系统', '组件'] },
  { id: 'demo-gx-driver-011', sw: 'GX Works', ft: '驱动与设备连接', title: 'GX Works 连接 PLC 时 USB 驱动异常', version: 'GX Works2/3', errorCode: '常见提示：USB 设备无法识别', symptom: '编程线连接后电脑未识别设备，软件无法建立连接。', causes: ['USB 驱动未安装', '线缆损坏', 'USB 端口供电异常', '驱动签名不兼容'], steps: ['更换 USB 端口和确认可用的数据线', '在设备管理器中查看驱动状态', '安装与当前软件及系统匹配的官方驱动', '重启后使用测试工程验证连接'], environment: 'Windows 10；三菱 PLC 实训设备', tags: [DEMO_TAG, 'USB驱动', '设备连接'] },
  { id: 'demo-gx-project-012', sw: 'GX Works', ft: '项目打开与编译', title: 'GX Works 工程文件无法正常打开', version: 'GX Works2/3', errorCode: '示例提示：工程文件读取失败', symptom: '双击工程文件后提示无法读取或版本不匹配。', causes: ['文件来自更高版本软件', '工程文件复制不完整', '磁盘权限或路径异常'], steps: ['先复制一份工程文件作为备份', '确认创建该工程所使用的软件版本', '检查文件大小和复制来源', '由教师使用匹配版本打开并另存为兼容版本'], environment: 'Windows 10；课程工程文件', tags: [DEMO_TAG, '工程文件', '版本'] },
  { id: 'demo-s7-version-013', sw: 'S7-200 SMART', ft: '项目打开与编译', title: 'S7-200 SMART 项目提示版本不兼容', version: 'Micro/WIN SMART', errorCode: '示例提示：项目版本不兼容', symptom: '打开课程项目时提示当前软件版本无法兼容该文件。', causes: ['项目由不同版本创建', '软件升级后工程格式变化', '工程文件来源不明'], steps: ['备份原工程文件', '核对项目创建版本和当前软件版本', '使用官方支持的升级或另存流程', '升级前在测试工程中验证编译结果'], environment: 'Windows 10；课程实训项目', tags: [DEMO_TAG, '版本', '编译'] },
  { id: 'demo-tia-runtime-014', sw: '博图 TIA Portal', ft: '运行库与组件', title: 'TIA Portal 启动提示缺少运行库组件', version: 'V15.1/V16', errorCode: '示例提示：缺少必要的系统组件', symptom: '软件启动阶段提示组件缺失或初始化失败。', causes: ['系统运行库缺失', '安装过程被中断', '系统更新不完整'], steps: ['记录缺失组件名称', '检查 Windows 更新和已安装运行库', '使用官方安装维护工具修复安装', '重启后仅打开软件验证启动状态'], environment: 'Windows 10；实训电脑', tags: [DEMO_TAG, '运行库', '启动失败'] },
  { id: 'demo-wincc-net-015', sw: 'WinCC', ft: '通信配置', title: 'WinCC 与 PLC 通讯时通时断', version: '通用演示版本', errorCode: '常见提示：连接超时', symptom: '变量偶发停止刷新，短时间后自动恢复。', causes: ['网络链路不稳定', 'IP 地址冲突', '交换机端口异常', '通信负载过高'], steps: ['持续 ping 检查丢包', '核对 IP、子网掩码和网关', '检查交换机端口和网线', '降低测试频率并记录断线发生时间'], environment: 'Windows 10；工业以太网实训网络', tags: [DEMO_TAG, '通信', '网络'] },
];

export async function seedDemoData(client: PrismaClient = prisma) {
  const username = process.env.ADMIN_INITIAL_USERNAME || 'admin';
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@123456';
  const passwordHash = await hash(password, 12);
  const admin = await client.admin.upsert({ where: { username }, update: { displayName: '系统管理员', status: 'ACTIVE' }, create: { username, passwordHash, displayName: '系统管理员', role: 'SUPER_ADMIN' } });
  const softwareMap = new Map<string, string>();
  for (const item of softwareSeed) { const row = await client.software.upsert({ where: { name: item.name }, update: { description: item.description, icon: item.icon, sortOrder: item.sortOrder, status: 'ACTIVE' }, create: item }); softwareMap.set(item.name, row.id); }
  const faultMap = new Map<string, string>();
  for (const item of faultTypeSeed) { const row = await client.faultType.upsert({ where: { name: item.name }, update: { description: item.description, sortOrder: item.sortOrder, status: 'ACTIVE' }, create: item }); faultMap.set(item.name, row.id); }
  for (const item of userCases) {
    const softwareId = softwareMap.get(item.software);
    const faultTypeId = faultMap.get(item.type);
    if (!softwareId || !faultTypeId) throw new Error(`案例 ${item.id} 的软件或故障类型不存在`);
    const cleanedSymptom = item.symptom.replace(/\s+/g, ' ').trim();
    const firstSentence = cleanedSymptom.split(/[。！？!?]/)[0].trim();
    const title = firstSentence.length > 50 ? `${firstSentence.slice(0, 50)}…` : (firstSentence || `故障案例 ${item.id}`);
    const tags = ['用户提供案例', '待教师核验', item.type];
    const data = {
      title,
      softwareId,
      softwareVersion: item.version,
      faultTypeId,
      errorCode: item.code,
      symptom: item.symptom,
      possibleCauses: [item.cause, '处理思路：' + item.overview],
      solutionSteps: item.steps.map((step) => `${step.title}：${step.detail}${step.visual ? '（' + step.visual + '）' : ''}${step.hint ? ' 注意：' + step.hint : ''}`),
      systemEnvironment: '待核验：请在管理后台补充实际操作系统版本、设备型号和软件环境。',
      tags,
      screenshotUrls: [],
      sourceName: '用户提供的 cases.js 案例集',
      sourceUrl: null,
      verificationStatus: CaseVerificationStatus.PENDING_REVIEW,
      verifiedAt: null,
      searchText: buildSearchText({ title, symptom: item.symptom, errorCode: item.code, tags, softwareName: item.software, faultTypeName: item.type }),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      createdById: admin.id,
    };
    const id = `user-${item.id}`;
    await client.faultCase.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
  const resources = LEARNING_RESOURCES.map((item, index) => ({
    id: item.id,
    title: item.name,
    category: item.category as ResourceCategory,
    group: item.group,
    tag: item.tag,
    softwareId: item.softwareName ? softwareMap.get(item.softwareName) : undefined,
    softwareVersion: item.softwareVersion,
    description: item.desc,
    estimatedTime: item.estimatedTime,
    content: item.chapters,
    sortOrder: index + 1,
    source: '沐-辅助包教学资源库',
    status: ContentStatus.PUBLISHED,
  }));
  await client.resource.updateMany({
    where: { id: { startsWith: 'demo-resource-' }, deletedAt: null },
    data: { status: ContentStatus.OFFLINE, deletedAt: new Date() },
  });
  for (const item of resources) await client.resource.upsert({ where: { id: item.id }, update: item, create: { ...item, createdById: admin.id } });
  const settings = [
    { key: 'project_name', value: '沐-辅助包' },
    { key: 'welcome_text', value: '遇到工控报错，先问沐-辅助包' },
    { key: 'contact', value: 'TODO：补充校内试用联系人' },
    { key: 'copyright', value: '沐-辅助包项目组' },
    { key: 'demo_mode', value: true },
    { key: 'announcement', value: '当前为校内试用阶段，用户提供案例需经教师核验后使用。' },
  ];
  for (const item of settings) await client.systemSetting.upsert({ where: { key: item.key }, update: { value: item.value }, create: item });
  return { admin: admin.username, software: softwareSeed.length, faultTypes: faultTypeSeed.length, cases: userCases.length, resources: resources.length };
}

async function main() {
  const result = await seedDemoData();
  console.log('Seed complete:', result);
}
if (require.main === module) main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());



