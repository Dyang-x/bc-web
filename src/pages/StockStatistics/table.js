import React, { useState, useEffect, useMemo } from 'react';
import { DetachTable, Pagination, notification, HVLayout } from '@hvisions/h-ui';
import { page } from '@hvisions/toolkit';
import stockApi from '~/api/stock';
const { showTotal } = page;
const MaterialTable = ({ modifyData }) => {
  const [materialList, setMaterialList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '储位名称',
      dataIndex: 'locationDescription',
      width: 150,
      fixed: 'left',
      key: 'locationDescription'
    },
    {
      title: '物料批次号',
      dataIndex: 'materialBatchNum',
      width: 150,
      key: 'materialBatchNum'
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 150
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      align: 'center',
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100
    },
    {
      title: '冻结',
      dataIndex: 'frozen',
      key: 'frozen',
      align: 'center',
      render: (_, record) => {
        if (record.frozen) {
          return '冻结';
        } else {
          return '正常';
        }
      },
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 170
    }
  ];

  useEffect(() => {
    if (modifyData && modifyData.locationId) {
      getMaterialList(page, pageSize, modifyData.locationId, modifyData.materialId);
    }
  }, [modifyData]);

  const onShowSizeChange = (p, s) => {
    getMaterialList(p, s, modifyData.locationId, modifyData.materialId);
    setPageSize(s);
  };
  const pageChange = (p, s) => {
    getMaterialList(p, s, modifyData.locationId, modifyData.materialId);
    setPage(p);
  };

  // 根据locationId查询物料信息 stockApi getAllByQuery
  const getMaterialList = async (page, pageSize, locationId, materialId) => {
    setLoading(true);
    const params = {
      page: page - 1,
      pageSize,
      locationId,
      materialId
    };
    await stockApi
      .getAllByQuery(params)
      .then(res => {
        setMaterialList(res.content);
        setTotalPage(res.totalElements);
        setLoading(false);
      })
      .catch(err => {
        setLoading(true);
        notification.warning({
          description: err.message
        });
      });
  };
  const { Table } = useMemo(() => DetachTable(columns), []);
  return (
    <HVLayout>
      <HVLayout.Pane>
        <Table
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          dataSource={materialList}
          columns={columns}
          rowKey={record => record.id}
        />
        <HVLayout.Pane.BottomBar>
          <Pagination
            onShowSizeChange={onShowSizeChange}
            current={page}
            onChange={pageChange}
            defaultCurrent={page}
            total={totalPage}
            size="small"
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => showTotal(total, range)}
          />
        </HVLayout.Pane.BottomBar>
      </HVLayout.Pane>
    </HVLayout>
  );
};

export default MaterialTable;
