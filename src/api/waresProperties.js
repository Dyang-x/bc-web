import { Service } from '@hvisions/core';

const appName = '/warehouse-service';
const service = new Service();
const create = async data => {
  try {
    await service.post(`${appName}/wares_class/create`, data);
  } catch (err) {
    throw new Error(err);
  }
}

const deleteById = async id => {
  try {
    await service.delete(`${appName}/wares_class/deleteById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
}

const update = async data => {
  try {
    await service.put(`${appName}/wares_class/update`, data);
  } catch (err) {
    throw new Error(err);
  }
}

const findPage = async data => {
  try {
    return await service.post(`${appName}/wares_class/findPage`, { ...data, direction: false, sort: true, sortCol: 'id' });
  } catch (err) {
    throw new Error(err);
  }
}

const findByUserClassId = async id => {
  try {
    return await service.get(`${appName}/wares_class_property/findByLocationClassId/${id}`);
  } catch (err) {
    throw new Error(err);
  }
}

const createProperTy = async data => {
  try {
    return await service.post(`${appName}/wares_class_property/create`, data);
  } catch (err) {
    throw new Error(err);
  }
}

const updateProperTy = async data => {
  try {
    return await service.put(`${appName}/wares_class_property/update`, data);
  } catch (err) {
    throw new Error(err);
  }
}

const deleteByIdProperTy = async id => {
  try {
    return await service.delete(`${appName}/wares_class_property/deleteById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
}

const addClassToUser = async (classId, userId) => {
  try {
    return await service.post(`${appName}/wares_class/addClassToLocation/${userId}/${classId}`);
  } catch (err) {
    throw new Error(err);
  }
}

const findByUserId = async id => {
  try {
    return await service.get(`${appName}/wares_class/findById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
}
const removeClassToUser = async (classId, userId) => {
  try {
    return await service.delete(`${appName}/wares_class/removeClassToLocation/${userId}/${classId}`);
  } catch (err) {
    throw new Error(err);
  }
}

const findPropertyByUserId = async id => {
  try {
    return await service.get(`${appName}/wares_property/findByLocationId/${id}`);
  } catch (err) {
    throw new Error(err);
  }
}
const updateUserProperty = async data => {
  try {
    return await service.put(`${appName}/wares_property/update`, data);
  } catch (err) {
    throw new Error(err);
  }
}

const addPropertyToUser = async data => {
  try {
    return await service.post(`${appName}/wares_property/addPropertyToLocations`, data);
  } catch (err) {
    throw new Error(err);
  }
};

const deletePropertyById = async id => {
  try {
    return await service.delete(`${appName}/wares_property/deletePropertyById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

export {
  create, deleteById, 
  update, findPage, 
  findByUserClassId, 
  createProperTy, 
  deleteByIdProperTy,
  updateProperTy,
  addClassToUser,
  findByUserId,
  removeClassToUser,
  findPropertyByUserId,
  updateUserProperty,
  addPropertyToUser,
  deletePropertyById
};
