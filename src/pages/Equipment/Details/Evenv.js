import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Select,
  DatePicker,
  Form,
  Row,
  HLayout,
  Button,
  Pagination,
  ClearInput
} from '@hvisions/h-ui';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  tagTotalSelector,
  eventTotalSelector,
  eventListSelector
} from '~/store/equipment/selector';
import {
  getEquipmentEvent
} from '~/store/equipment/actions';
import { i18n } from '@hvisions/core';
const { Pane } = HLayout;

const getFormattedMsg = i18n.getFormattedMsg;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 18
  }
};

const Evenv = ({
  form: { getFieldDecorator, getFieldValue },
  equipment,
  eventTotal,
  eventList,
  getEquipmentEvent,
}) => {
  // 日期选择是否可见
  const [datePickerVisible2, setDatePickVisible2] = useState(false);
  // 设备编码
  const [equipmentCode, setEquipmentCode] = useState('');
  // 事件表 当前页
  const [eventCurrentPage, setEventCurrentPage] = useState(1);
  // 事件表  每页数量
  const [eventPageSize, setEventPageSize] = useState(10);

  useEffect(() => {
    if (equipment) setEquipmentCode(equipment.equipmentCode);
  }, [equipment]);

  // 事件表 当前页和每页数变化
  const eventPageChange = (page, size) => {
    setEventCurrentPage(page);
    setEventPageSize(size);
    serachEvent(page, size);
  };

  // 事件搜索
  const serachEvent = (page, size) => {
    const timeType = getFieldValue('timeType2');
    const time = getFieldValue('time2');
    let startTime = '';
    let endTime = '';
    // 不是自定义 根据时间类型算时间
    if (timeType != 9999) {
      startTime = moment(new Date() - timeType * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else {
      startTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    if (equipmentCode) {
      getEquipmentEvent(
        {
          tagCode: getFieldValue('tagCode'),
          eventType: getFieldValue('eventType'),
          startTime,
          endTime
        },
        page,
        size
      );
    }
  };

  const onSelectChange2 = value => {
    if (value == 9999) {
      setDatePickVisible2(true);
    } else {
      setDatePickVisible2(false);
    }
  };

  const onHandleSearch = () => {
    setEventCurrentPage(1);
    setEventPageSize(10);
    serachEvent(1, 10);
  };

  const eventColums = [
    {
      title: getFormattedMsg('equipment.label.time'),
      key: 'eventTime',
      dataIndex: 'eventTime'
    },
    {
      title: getFormattedMsg('equipment.label.Identification'),
      key: 'tagCode',
      dataIndex: 'tagCode'
    },
    {
      title: getFormattedMsg('equipment.label.eventName'),
      key: 'eventName',
      dataIndex: 'eventName'
    },
    {
      title: getFormattedMsg('equipment.label.eventType'),
      key: 'eventTypeString',
      dataIndex: 'eventTypeString'
    },
    {
      title: getFormattedMsg('equipment.label.unit'),
      key: 'unitName',
      dataIndex: 'unitName'
    }
  ];

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('tagCode')(<ClearInput placeholder="请输入事件标识符" style={{ width: 150, marginRight: 40 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator('eventType', { initialValue: '' })(
            <Select style={{ width: 150, marginRight: 40 }}>
              <Option key={0} value="">
                {getFormattedMsg('equipment.label.all')}
              </Option>
              <Option key={1} value="1">
                {getFormattedMsg('equipment.label.info')}
              </Option>
              <Option key={2} value="2">
                {getFormattedMsg('equipment.label.caveat')}
              </Option>
              <Option key={3} value="3">
                {getFormattedMsg('equipment.label.fault')}
              </Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('timeType2', {
            initialValue: '1'
          })(
            <Select onChange={value => onSelectChange2(value)} style={{ width: 150, marginRight: 40 }}>
              <Option key={1} value="1">
                {`1${getFormattedMsg('equipment.label.hour')}`}
              </Option>
              <Option key={2} value="24">
                {`24${getFormattedMsg('equipment.label.hour')}`}
              </Option>
              <Option key={3} value="168">
                {`7${getFormattedMsg('equipment.label.day')}`}
              </Option>
              <Option key={4} value="9999">
                {getFormattedMsg('equipment.label.customize')}
              </Option>
            </Select>
          )}
        </FormItem>
        {datePickerVisible2 && (
          <FormItem {...formItemLayout}>
            {getFieldDecorator('time2')(<RangePicker style={{ width: 200, marginRight: 40 }} />)}
          </FormItem>
        )}
        {datePickerVisible2 && (
          <FormItem {...formItemLayout}>
            {getFieldDecorator('time2')(<RangePicker style={{ width: 200, marginRight: 40 }} />)}
          </FormItem>
        )}
        <FormItem>
          <Button
            type="primary"
            icon="search"
            onClick={onHandleSearch}
          >
            {getFormattedMsg('global.btn.search')}
          </Button>
        </FormItem>
      </div>
        <Table
          columns={eventColums}
          rowKey={record => record.id}
          dataSource={eventList}
          pagination={false}
        />
        <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <Pagination
            current={eventCurrentPage}
            pageSize={eventPageSize}
            showQuickJumper
            size="small"
            showSizeChanger
            total={eventTotal}
            onShowSizeChange={eventPageChange}
            onChange={eventPageChange}
            showTotal={(total, range) =>
              `${getFormattedMsg('global.label.now')} ${range[0]}-${
                range[1]
              } ${getFormattedMsg('global.label.item')}  ${getFormattedMsg(
                'global.label.total'
              )} ${total} ${getFormattedMsg('global.label.item')} ${getFormattedMsg(
                'global.label.record'
              )}`
            }
          />
        </div>
    </Fragment>
  );
};

Evenv.propTypes = {
  form: PropTypes.object,
  equipment: PropTypes.object,
  tagTotal: PropTypes.number,
  eventTotal: PropTypes.number,
  eventList: PropTypes.array,
  getEquipmentEvent: PropTypes.func,
};

const mapStateToProps = state => ({
  tagTotal: tagTotalSelector(state),
  eventTotal: eventTotalSelector(state),
  eventList: eventListSelector(state)
});

export default connect(
  mapStateToProps,
  {
    getEquipmentEvent
  }
)(Form.create()(Evenv));
