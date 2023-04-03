



import { Service } from '@hvisions/core';

const appName = '/equipment-master-data';
class Equipment extends Service {
	// 根据设备名称或者设备编码还有设备类型id获取设备信息,如果名称，编码都传空值，那么默认获取根级别设备
	getEquipmentPageByNameOrCodeAndEquipmentTypeId(search = {}, page = 1, size = 10) {
		const pageInfo = {
			pageSize: size,
			direction: false,
			sort: true,
			sortCol: 'id'
		};
		return this.post(
			`${appName}/equipment/getEquipmentPageByNameOrCodeAndEquipmentTypeId`,
			{ ...search, ...pageInfo, page: page - 1 }
		);
	}

	// 根据设备id获取设备信息
	getEquipmentById(id) {
		return this.get(
			`${appName}/equipment/getEquipmentById/${id}`
		);
	}

	// 根据设备id删除设备信息
	async deleteEquipmentById(id) {
		try {
			await this.delete(
				`${appName}/equipment/deleteEquipmentById/${id}`
			);
		} catch (err) {
			throw new Error(err);
		}
	}

	// 根据设备ID获取所绑定文件信息
	getFileIdsByEquipmentId(equipmentId) {
		try {
			return this.get(
				`${appName}/equipmentFile/getFileIdsByEquipmentId/${equipmentId}`
			);
		} catch (err) {
			throw new Error(err);
		}
	}

	// 根据设备ID与文件ID删除文件绑定
	deleteEquipmentFileByEIdAndFileId(equipmentId, fileId) {
		this.delete(`${appName}/equipmentFile/deleteEquipmentFileByEIdAndFileId?equipmentId=${equipmentId}&fileId=${fileId}`);
	}

	// 修改设备基础信息
	async updateEquipment(data) {
		return await this.put(`${appName}/equipment/updateEquipment`, data);
	}

	// 导出所有设备信息
	exportEquipment(){
		return this.get(`${appName}/equipment/exportEquipment`);
	}

	// 导入设备信息
	importEquipment(file){
		try {
			const data = new window.FormData();
			data.append('file', file);
			return this.post(
				`${appName}/equipment/importEquipment`,
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
		} catch (err) {
			throw new Error(err);
		}
	}

	// 根据设备父级id查询设备列表
	getEquipmentListByParentId(id = 0){
		return this.get(`${appName}/equipment/getEquipmentListByParentId/${id}`);
	}

	// 获取设备扩展信息
	getEquipmentExtendColumnInfo(){
		return this.get(`${appName}/equipment/getEquipmentExtendColumnInfo`);
	}
	
	// 新增设备绑定文件
	createEquipmentFile(data){
		this.post(`${appName}/equipmentFile/createEquipmentFile`, data);
	}

	// 新增设备扩展信息
	createEquipmentColumn(data){
		this.post(`${appName}/equipment/createEquipmentColumn`, data);
	}

	// 删除设备扩展信息
	deleteEquipmentColumnByColumnName(name){
		this.post(`${appName}/equipment/deleteEquipmentColumnByColumnName/${name}`);
	}

	// 查询所有设备信息
	getAllEquipment(){
		return this.get(`${appName}/equipment/getAllEquipment`);
	}
	// 查询设备运行参数
	getEquipmentParamneterValue(equipmentCode) {
		try {
			return this.get(
				`/equipment-info-collection/equipmentParameterValue/getParameterValueByEquipment/${equipmentCode}`
			);
		} catch (err) {
			throw new Error(err);
		}
	};

	// 新增设备
	async createEquipment(data){
		try {
			return	await this.post(`${appName}/equipment/createEquipment`, data);
		} catch (err) {
			throw new Error(err);
		}
	}

	// 获取设备事件
	getEquipmentEvent(search = {}, page = 1, size = 10) {
		const pageInfo = {
			pageSize: size,
			direction: false,
			sort: true,
			sortCol: 'id'
		};
		return this.post(
			`/equipment-info-collection/equipmentParameter/findEquipmentFunctionList`,
			{ ...search, ...pageInfo, page: page - 1 }
		);
	}

	// 获取设备tag
	getEquipmentTagValueList(search = {}, page = 1, size = 10) {
		const pageInfo = {
			pageSize: size,
			direction: false,
			sort: true,
			sortCol: 'id'
		};
		return this.post(
			`/equipment-info-collection/equipmentParameterValue/equipmentList`,
			{ ...search, ...pageInfo, page: page - 1 }
		);
	}

	// 获取设备tag
	getAllEquipmentTagValueList(search = {}) {
		return this.post(
			`/equipment-info-collection/equipmentParameterValue/equipmentListNotPage`,
			{ params: search }
		);
	};
	async getAllEquipmentByCellIdList(ids) {
		return await this.post(`${appName}/equipment/getAllEquipmentByCellIdList`, ids);
	}
}

export default new Equipment();
