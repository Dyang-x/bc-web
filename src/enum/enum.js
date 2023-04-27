//备料区状态
export const PrepareAreaState = [
    { id: 1, name: '空置', value: '空置', },
    { id: 2, name: '使用中', value: '使用中', },
    { id: 3, name: '运输中', value: '运输中', },
]

//备料区
export const prepareAreas = [
    { id: 1, name: 'C001', value: 'C001', },
    { id: 2, name: 'C003', value: 'C003', },
    { id: 3, name: 'C005', value: 'C005', },
    { id: 4, name: 'C007', value: 'C007', },
    { id: 5, name: 'C009', value: 'C009', },
]

//接驳口状态
export const dockingPointState = [
    { id: 1, name: '空置', value: '空置', },
    { id: 2, name: '使用中', value: '使用中', },
    { id: 3, name: '运输中', value: '运输中', },
]

//接驳口
export const dockingPoints = [
    { id: 1, name: 'J002', value: 'J002', },
    { id: 2, name: 'J003', value: 'J003', },
]

// 托盘类型
export const palletType = [
    { id: 0, name: '原料托盘', value: '原料托盘', },
    { id: 1, name: '半成品托盘', value: '半成品托盘', }
]

// export const palletType = [
//     { id: 0, name: '板料托盘', value: '板料托盘', },
//     { id: 1, name: '半成品托盘', value: '半成品托盘', },
//     { id: 2, name: '通用托盘', value: '通用托盘', },
// ]

//托盘状态
export const palletState = [
    { id: 0, name: '满托', value: '满托', },
    { id: 1, name: '空闲', value: '空闲', }
]

//接驳口
export const attribute = [
    { id: 1, name: 'J002', value: 'J002', },
    { id: 2, name: 'J003', value: 'J003', },
]

//托盘属性1
export const attributeOne = [
    { id: 1, name: '大', value: '大', },
    { id: 2, name: '中', value: '中', },
    { id: 3, name: '小', value: '小', },
]

//托盘属性2
export const attributeTwo = [
    { id: 1, name: '切割完工', value: '切割完工', },
    { id: 2, name: '切割未完工', value: '切割未完工', },
    { id: 3, name: '折弯完工', value: '折弯完工', },
    { id: 4, name: '折弯未完工', value: '折弯未完工', },
]

//转运系统 查询 任务类型
export const TransportTaskType = [
    { id: 1, name: '上架', value: '上架', },
    { id: 2, name: '下架', value: '下架', },
]


// 全部 任务状态
export const taskState = [
    { id: 1, name: '排队中', value: '排队中', },
    { id: 2, name: '执行中', value: '执行中', },
    { id: 3, name: '暂停', value: '暂停', },
    { id: 4, name: '完成', value: '完成', },
    { id: 5, name: '异常', value: '异常', },
]

// 全部 任务类型
export const taskType = [
    { id: 1, name: '原料采购入库', value: '原料采购入库', },
    { id: 2, name: '原料领料出库', value: '原料领料出库', },
    { id: 3, name: '半成品生产入库', value: '半成品生产入库', },
    { id: 4, name: '半成品领料出库', value: '半成品领料出库', },
    { id: 5, name: '原料托盘回库', value: '原料托盘回库', },
    { id: 6, name: '原料托盘出库', value: '原料托盘出库', },
    { id: 7, name: '半成品托盘回库', value: '半成品托盘回库', },
    { id: 8, name: '半成品托盘出库', value: '半成品托盘出库', },
    { id: 9, name: '原材料运输小车', value: '原材料运输小车', },
    // { id: 10, name: '链条', value: '链条', },
    // { id: 11, name: '原料托盘上架', value: '原料托盘上架', },
    // { id: 12, name: '半成品托盘上架', value: '半成品托盘上架', },
    // { id: 13, name: '半成品托盘下架', value: '半成品托盘下架', },
]

// AGV 任务种类
export const taskKind = [
    { id: 1, name: '库区转运', value: '库区转运', },
    { id: 2, name: '上下料', value: '上下料', },
    { id: 3, name: '链条传动', value: '链条传动', },
]

//半成品  分拣位置
export const sortPositions = [
    { id: 1, name: 'J004', value: 'J004', },
    { id: 2, name: 'J005', value: 'J005', },
    { id: 3, name: 'J006', value: 'J006', },
    { id: 4, name: 'J007', value: 'J007', },
    { id: 5, name: 'J008', value: 'J008', },
    { id: 6, name: 'J009', value: 'J009', },
]


//接驳口
export const emptyInMid = [
    { id: 1, name: 'J001', value: 'J001', },
    { id: 2, name: 'J002', value: 'J002', },
    { id: 3, name: 'J003', value: 'J003', },
]


/*

J001    原料交接区


*/


