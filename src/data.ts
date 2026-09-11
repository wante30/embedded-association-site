// 协会内容数据 — 单一来源，方便协会成员直接维护。

export const siteConfig = {
  name: '单片机与嵌入式技术协会',
  shortName: 'ME Tech Lab',
  englishName: 'ME Tech Lab',
  school: '哈尔滨理工大学',
  description: '从一行代码，到真实世界。面向学生的嵌入式实践与开源社区。',
  tagline: '把代码写进真实世界。',
  lead: '聚集对单片机、嵌入式系统和动手实践感兴趣的同学。从一颗 LED 开始，把想法做成可以运行、可以分享、可以继续迭代的作品。',
  email: 'me-tech@example.com',
  github: 'https://github.com/',
  recruitmentUrl: '',
};

export const stats = [
  { value: '2018', label: '成立年份', sub: 'Since' },
  { value: '128+', label: '在册成员', sub: 'Members' },
  { value: '16', label: '国家级奖项', sub: 'Awards' },
  { value: '24', label: '开源项目', sub: 'Projects' },
];

export type Project = {
  slug: string;
  name: string;
  en: string;
  summary: string;
  status: string;
  year: string;
  tags: string[];
  image: string;
  lead: string;
  contest: string;
  background: string;
  goal: string;
  architecture: string;
  result: string;
  members: string[];
};

export const projects: Project[] = [
  {
    slug: 'esp32-homepilot',
    name: 'HomePilot 智能家居终端',
    en: 'ESP32 / HomePilot',
    summary: '用一块 ESP32，把传感器、屏幕和家里的日常连接起来。',
    status: '持续迭代',
    year: '2026',
    tags: ['ESP32', 'MQTT', 'LVGL'],
    image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80',
    lead: '林沐',
    contest: '校级创新实践项目',
    background: '宿舍和实验室里常见的设备彼此孤立，数据无法被简单地看见和控制。',
    goal: '打造一个可扩展、低功耗、开源的桌面智能终端。',
    architecture: 'ESP32-S3 采集传感器数据，经 Wi-Fi / MQTT 送入本地网关，LVGL 提供交互。',
    result: '完成首版硬件打样，接入温湿度、光照与空气质量三类传感器。',
    members: ['林沐', '周思远', '陈一'],
  },
  {
    slug: 'stm32-control',
    name: 'STM32 智能控制系统',
    en: 'STM32 / Control',
    summary: '从电机控制到状态监测，做一个真正能跑起来的控制系统。',
    status: '已结题',
    year: '2025',
    tags: ['STM32', 'FreeRTOS', 'CAN'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    lead: '赵启航',
    contest: '全国大学生电子设计竞赛',
    background: '复杂设备需要稳定的控制、清晰的状态反馈以及可诊断的通信链路。',
    goal: '构建模块化控制平台，验证实时任务、总线通信与安全策略。',
    architecture: 'STM32H743 主控 + FreeRTOS 任务调度 + CAN 总线 + 编码器闭环。',
    result: '完成两轴平台控制，关键任务抖动小于 20μs，获省级一等奖。',
    members: ['赵启航', '方可', '王景钰'],
  },
  {
    slug: 'edge-vision',
    name: 'EdgeSight 边缘视觉平台',
    en: 'AIoT / EdgeSight',
    summary: '让模型离开云端，在一块小板上完成识别、决策和反馈。',
    status: '公开测试',
    year: '2026',
    tags: ['YOLO', 'RK3588', 'OpenCV'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    lead: '苏禾',
    contest: '机器人与人工智能创新赛',
    background: '许多校园场景需要实时响应，网络延迟和隐私要求让云端推理并不理想。',
    goal: '探索轻量视觉模型在边缘设备上的完整部署链路。',
    architecture: '摄像头采集 → ONNX Runtime / RKNN 推理 → 规则引擎 → 执行器反馈。',
    result: '在 Orange Pi 5 Pro 上实现 18 FPS 的目标识别演示。',
    members: ['苏禾', '陆知行', '张然'],
  },
];

export type Award = {
  year: string;
  level: '国家级' | '省级' | '校级';
  title: string;
  project: string;
  people: string;
  date: string;
};

export const awards: Award[] = [
  { year: '2026', level: '国家级', title: '全国大学生电子设计竞赛', project: '智能控制系统', people: '赵启航 / 方可', date: '2026.08' },
  { year: '2026', level: '省级', title: '机器人与人工智能创新赛', project: 'EdgeSight 边缘视觉平台', people: '苏禾 / 陆知行', date: '2026.06' },
  { year: '2025', level: '校级', title: '校园创新实践项目', project: 'HomePilot 智能家居终端', people: '林沐 / 周思远', date: '2025.12' },
  { year: '2024', level: '国家级', title: '蓝桥杯全国软件和信息技术专业人才大赛', project: '嵌入式设计与开发', people: '协会代表队', date: '2024.05' },
];

export type Activity = {
  title: string;
  date: string;
  dateLabel: string;
  tag: string;
  summary: string;
  image: string;
};

export const activities: Activity[] = [
  {
    title: '从 0 到 1：STM32 入门工作坊',
    date: '2026.03.22',
    dateLabel: '03 / 22',
    tag: '技术培训',
    summary: '从点亮第一颗 LED 开始，完成一个按键控制的小系统。',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '焊接与硬件调试夜',
    date: '2026.04.08',
    dateLabel: '04 / 08',
    tag: '动手实践',
    summary: '认识常见元器件，学会看原理图、焊接和排查虚焊。',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: '学长学姐的比赛复盘',
    date: '2026.05.16',
    dateLabel: '05 / 16',
    tag: '经验分享',
    summary: '把赛场上的选择、失误和经验，讲给下一届队友听。',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
];

// 技术方向 — 首页 "我们做什么" 板块
export type Direction = {
  num: string;
  name: string;
  en: string;
  desc: string;
  tags: string[];
};

export const directions: Direction[] = [
  { num: '01', name: '嵌入式开发', en: 'Embedded', desc: '从寄存器到 RTOS，在真实硬件上写出可维护的代码。', tags: ['STM32', 'FreeRTOS', 'HAL'] },
  { num: '02', name: '物联网连接', en: 'IoT', desc: '把设备接入网络，理解协议、网关与边缘协同。', tags: ['ESP32', 'MQTT', 'BLE'] },
  { num: '03', name: '边缘智能', en: 'Edge AI', desc: '让模型离开云端，在小板上完成感知与决策。', tags: ['YOLO', 'RKNN', 'ONNX'] },
  { num: '04', name: '机器人实践', en: 'Robotics', desc: '从运动控制到感知融合，做一个能动的系统。', tags: ['ROS', 'SLAM', 'Control'] },
  { num: '05', name: '电子设计', en: 'Electronics', desc: '画板、打样、焊接、调试，把原理图变成实物。', tags: ['PCB', 'EDA', 'Solder'] },
  { num: '06', name: '技术竞赛', en: 'Contest', desc: '以赛促学，在 deadline 前把系统跑起来。', tags: ['电赛', '蓝桥杯', 'RoboCom'] },
];

// 协会文化图片墙
export type Culture = { image: string; label: string; en: string };

export const culture: Culture[] = [
  { image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', label: '实验室日常', en: 'Lab' },
  { image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', label: '项目调试', en: 'Build' },
  { image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', label: '比赛现场', en: 'Field' },
  { image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', label: '技术分享', en: 'Talk' },
  { image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80', label: '硬件打样', en: 'Solder' },
  { image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', label: '团队协作', en: 'Team' },
];

// 指导教师（单独展示）
export type Member = {
  name: string;
  role: string;
  focus: string;
  bio: string;
  avatar: string;
};

export const advisor: Member = {
  name: '高老师',
  role: '指导教师',
  focus: '嵌入式系统 / 教学实践',
  bio: '关注学生工程能力的成长，支持协会把课堂上的概念做成真正能跑起来的作品。',
  avatar: '高',
};

export const members: Member[] = [
  { name: '赵启航', role: '协会负责人', focus: 'STM32 / 实时系统', bio: '喜欢把复杂系统拆成可以验证的模块。', avatar: '赵' },
  { name: '苏禾', role: '项目负责人', focus: '边缘 AI / 机器人', bio: '在寻找模型准确率和设备功耗之间的平衡。', avatar: '苏' },
  { name: '林沐', role: '核心成员', focus: 'ESP32 / 物联网', bio: '负责把传感器数据变成每个人都看得懂的界面。', avatar: '林' },
  { name: '周思远', role: '核心成员', focus: 'PCB / 硬件设计', bio: '热衷于画板子，也热衷于把板子一次点亮。', avatar: '周' },
];

// 学习资源
export type Resource = { name: string; desc: string; level: '入门' | '进阶' | '实战'; tags: string[] };
export type ResourceGroup = { cat: string; en: string; items: Resource[] };

export const resources: ResourceGroup[] = [
  {
    cat: '单片机', en: 'MCU', items: [
      { name: 'C 语言基础', desc: '从变量、指针到模块化编程，给硬件开发打底。', level: '入门', tags: ['C', 'Pointer'] },
      { name: 'STM32 官方文档', desc: '查找芯片手册、参考手册与 HAL 驱动说明。', level: '进阶', tags: ['STM32', 'HAL'] },
      { name: 'ESP32 技术参考', desc: '了解 Wi-Fi、BLE 与 FreeRTOS 的完整能力。', level: '进阶', tags: ['ESP32', 'BLE'] },
    ],
  },
  {
    cat: '嵌入式', en: 'Embedded', items: [
      { name: 'FreeRTOS', desc: '理解任务、队列、信号量，写出可维护的实时程序。', level: '进阶', tags: ['RTOS', 'Task'] },
      { name: 'Linux & CMake', desc: '在真实的开发环境里构建、调试和交付。', level: '实战', tags: ['Linux', 'CMake'] },
    ],
  },
  {
    cat: '物联网', en: 'IoT', items: [
      { name: 'MQTT', desc: '轻量、可靠，适合设备间传递状态和指令。', level: '入门', tags: ['MQTT', 'Protocol'] },
      { name: 'BLE / Wi-Fi', desc: '从无线连接开始理解设备如何进入网络。', level: '入门', tags: ['BLE', 'Wi-Fi'] },
    ],
  },
  {
    cat: 'AI', en: 'Edge AI', items: [
      { name: 'OpenCV', desc: '从图像读取到特征处理，建立视觉直觉。', level: '入门', tags: ['OpenCV', 'CV'] },
      { name: 'YOLO & ONNX', desc: '把模型部署到边缘设备，感受推理的全过程。', level: '进阶', tags: ['YOLO', 'ONNX'] },
    ],
  },
];

// 招新流程
export const joinSteps = [
  { num: '01', title: '了解协会', desc: '看看我们在做什么，确认这是你想投入时间的地方。' },
  { num: '02', title: '填写报名', desc: '基本信息和你的兴趣方向，不需要已有项目经历。' },
  { num: '03', title: '交流 / 面试', desc: '一次轻松的对话，了解你的节奏和想法。' },
  { num: '04', title: '加入协会', desc: '从一次培训、一颗 LED 开始，慢慢把想法做成系统。' },
];

export const joinReasons = [
  { num: '01', title: '在项目里学习', desc: '没有 PPT 课堂。每个方向都从一个可以摸到的硬件开始，做到能跑、能演示、能复盘。' },
  { num: '02', title: '在协作中成长', desc: '从设计、焊接到调试，分工和代码评审都是日常。你会习惯把想法讲清楚、把代码写明白。' },
  { num: '03', title: '把作品带去现场', desc: '从校内展示到全国赛场，作品会被真实地用、真实地评、真实地继续迭代。' },
];

export const joinLearn = [
  '读原理图、画简单 PCB，把元器件焊成一块能用的板子',
  '在 STM32 / ESP32 上写出结构清晰、可调试的固件',
  '理解总线、协议和实时系统，让多个模块稳定协作',
  '把模型部署到边缘设备，跑通从感知到执行的链路',
  '在比赛和复盘里，把一次性的代码变成可维护的系统',
];
