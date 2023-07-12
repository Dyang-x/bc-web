import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class LargeScreenApi extends Service {
    // 库区状态
    async getRbgStatus() {
        try {
            return await this.get(`${appName}/largeScreen/getRbgStatus`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 托盘数量
    async getTrayNumberCount() {
        try {
            return await this.get(`${appName}/largeScreen/getTrayNumberCount`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 原料入库详情
    async rawMterialInDetails() {
        try {
            return await this.get(`${appName}/largeScreen/rawMterialInDetails`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 原料入库厚度分组
    async rawMterialInGroup() {
        try {
            return await this.get(`${appName}/largeScreen/rawMterialInGroup`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 原料入库材质分组
    async rawMterialInMaterialTypeGroup() {
        try {
            return await this.get(`${appName}/largeScreen/rawMterialInMaterialTypeGroup`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 原料入库列表
    async rawMterialInList() {
        try {
            return await this.get(`${appName}/largeScreen/rawMterialInList`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 半成品出入库详情
    async semiMterialDetails(dockingStation) {
        try {
            return await this.get(`${appName}/largeScreen/semiMterialDetails/${dockingStation}`);
        } catch (error) {
            throw new Error(error);
        }
    }

    // 生产订单总览
    async semiOrder() {
        try {
            return await this.get(`${appName}/largeScreen/semiOrder`);
        } catch (error) {
            throw new Error(error);
        }
    }


}

export default new LargeScreenApi();