import React,{useEffect,useState} from 'react';
import {Form, Select} from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import { prepareAreas,dockingPoints } from '~/enum/enum';
import bendingMachineServices from '~/api/bendingMachine';
import { isEmpty } from 'lodash';

const { Option } = Select
const getFormattedMsg = i18n.getFormattedMsg;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const OutForm = ({
  form: { getFieldDecorator},
  modifyData,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [readyMaterials,setReadyMaterials] = useState([]);

  useEffect(() => {
    loadData(page, pageSize);
  }, []);
  
    //查询页面数据
    const loadData = async (page, pageSize, searchValue) => {
      bendingMachineServices
        .getByQuery({ ...searchValue, page: page - 1, pageSize })
        .then(res => {
          // const arr = []
          // res.content.map(i => {
          //   arr.push(i.readyMaterials)
          // })
          
          // console.log(arr, 'arr');

          const newArr = []
          res.content.forEach(item => {
            if (!newArr.includes(item.readyMaterials)) {
              newArr.push(item.readyMaterials)
            }
          })
          console.log(newArr, 'newArr');

          setReadyMaterials(newArr);
        })
    };

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.prepareArea')}>
        {
          getFieldDecorator('readyMaterials', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.prepareArea'),
              },
            ],
            initialValue: modifyData ? modifyData['readyMaterials'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.prepareArea')}
              showSearch
              filterOption={false}
            >
              {readyMaterials.map((value, index) => (
                <Option value={value} key={value}>
                  {value}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.dockingPoint')}>
        {
          getFieldDecorator('dockingPoint', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.dockingPoint'),
              },
            ],
            initialValue: modifyData ? modifyData['dockingPoint'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.dockingPoint')}
              showSearch
              filterOption={false}
            >
              {dockingPoints.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(OutForm)
