import BaseService from './BaseService';

const appName = '/materials-master-data';
const service = new BaseService();
const create = async data => {
  try {
    await service.post(`${appName}/material_class/create`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteById = async id => {
  try {
    await service.delete(`${appName}/material_class/deleteById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

const update = async data => {
  try {
    await service.put(`${appName}/material_class/update`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const findPage = async data => {
  try {
    return await service.post(`${appName}/material_class/findPage`, {
      ...data,
      direction: false,
      sort: true,
      sortCol: 'id'
    });
  } catch (err) {
    throw new Error(err);
  }
};

const findByMaterialClassId = async id => {
  try {
    return await service.get(`${appName}/material_class_property/findByMaterialClassId/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

const createProperTy = async data => {
  try {
    return await service.post(`${appName}/material_class_property/create`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const updateProperTy = async data => {
  try {
    return await service.put(`${appName}/material_class_property/update`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteByIdProperTy = async id => {
  try {
    return await service.delete(`${appName}/material_class_property/deleteById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

const addClassToMaterial = async (classId, materialId) => {
  try {
    return await service.post(
      `${appName}/material_class/addClassToMaterial/${materialId}/${classId}`
    );
  } catch (err) {
    throw new Error(err);
  }
};

const findByMaterialId = async id => {
  try {
    return await service.get(`${appName}/material_class/findByMaterialId/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};
const removeClassToMaterial = async (classId, materialId) => {
  try {
    return await service.delete(
      `${appName}/material_class/removeClassToMaterial/${materialId}/${classId}`
    );
  } catch (err) {
    throw new Error(err);
  }
};

const findPropertyByMaterialId = async id => {
  try {
    return await service.get(`${appName}/material_property/findByMaterialId/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};
const updateMaterialProperty = async data => {
  try {
    return await service.put(`${appName}/material_property/update`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const addPropertyToMaterials = async data => {
  try {
    return await service.post(`${appName}/material_property/addPropertyToMaterials`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const deletePropertyToMaterials = async id => {
  try {
    return await service.delete(`${appName}/material_property/deletePropertyById//${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

export {
  create,
  deleteById,
  update,
  findPage,
  findByMaterialClassId,
  createProperTy,
  deleteByIdProperTy,
  updateProperTy,
  addClassToMaterial,
  findByMaterialId,
  removeClassToMaterial,
  findPropertyByMaterialId,
  updateMaterialProperty,
  deletePropertyToMaterials,
  addPropertyToMaterials
};
