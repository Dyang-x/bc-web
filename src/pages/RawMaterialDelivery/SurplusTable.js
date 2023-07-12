import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, HVLayout, Form, Drawer } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import AddSurplusForm from './AddSurplusForm';

const { getFormattedMsg } = i18n;

const SurplusTable = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  const [materialList, setMaterialList] = useState([])
  const [dataSource, setDataSource] = useState([]);
  const [addVis, setAddVis] = useState(false);
  const addFormRef = useRef();

  const columns = [
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.specification'),
      dataIndex: 'specification',
      key: 'specification',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.count'),
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
  ]

  useEffect(() => {

  }, [])

  const handleAdd = (record) => {
    setAddVis(true)
  }

  const handleCancelAdd = () => {
    const { resetFields } = addFormRef.current;
    resetFields();
    setAddVis(false)
  }

  const modalUpdateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveAdd}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdd}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveAdd = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = addFormRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();

      handleCancelAdd();
    });
  }

  // const rowSelection = {
  //   hideDefaultSelections: false,
  //   type: 'radio',
  //   onSelect: (record, selected, selectedRows, nativeEvent) => {

  //   },
  //   selectedRowKeys,
  //   onChange: selectedRowKeys => {
  //     setSelectedRowKeys(selectedRowKeys);
  //   }
  // };

  // const onRowClick = record => {
  //   setSelectedRowKeys([record.id]);
  // };

  return (
    <>
      <HVLayout >
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.surplus')}
          buttons={[
            <Button key="add" type="primary" style={{ marginRight: 30 }} onClick={() => handleAdd()} >
              {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.add')}
            </Button>
          ]}
          className='SurplusTable'
          style={{ margin: 0 }}
        >
          <Table
            pagination={false}
            scroll={{ x: 'max-content' }}
            dataSource={dataSource}
            columns={columns}
            rowKey={record => record.id}
          // rowSelection={rowSelection}
          // onRow={record => {
          //   return {
          //     onClick: () => {
          //       onRowClick(record);
          //     }
          //   };
          // }}
          />
        </HVLayout.Pane>
      </HVLayout>
      <Drawer
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.add')}
        visible={addVis}
        onClose={handleCancelAdd}
        width={500}
        destroyOnClose>
        <Drawer.DrawerContent >
          <AddSurplusForm ref={addFormRef} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  )
}

export default Form.create()(SurplusTable)
