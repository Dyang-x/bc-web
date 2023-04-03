import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Card,
  Modal,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Radio,
  Tooltip,
  Icon,
  Pagination,
  Divider,
  Switch,
  HLayout
} from '@hvisions/h-ui';
import Echarts from 'echarts-for-react';
import { CardList } from '~/components';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  equipmentParameterValueSelector,
  tagTotalSelector,
  eventTotalSelector,
  eventListSelector,
  tagListSelector,
  allTagListSelector
} from '~/store/equipment/selector';
import {
  getEquipmentParamneterValue,
  getEquipmentTagValueList,
  getEquipmentEvent,
  getAllEquipmentTagValueList
} from '~/store/equipment/actions';

import styles from './style.scss';

import { i18n } from '@hvisions/core';
const { Pane } = HLayout;

const getFormattedMsg = i18n.getFormattedMsg;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 12
  }
};

let timer = null;

const RunStatus = ({
  form: { getFieldDecorator, getFieldValue },
  equipment,
  parameterValueList,
  getEquipmentParamneterValue,
  getEquipmentTagValueList,
  tagTotal,
  tagValueList,
  allTagValueList,
  getAllEquipmentTagValueList
}) => {
  // 模态框是否可见
  const [visible, setVisible] = useState(false);
  // 日期选择是否可见
  const [datePickerVisible, setDatePickVisible] = useState(false);
  // 属性table 是否可见
  const [tableVisible, setTableVisible] = useState(true);
  // 当前选中的tag
  const [tagCode, setTagCode] = useState('');
  // tag 中文类型
  const [tagTypeName, setTagTypeName] = useState('');
  // 设备编码
  const [equipmentCode, setEquipmentCode] = useState('');
  // echars X轴
  const [xData, setXData] = useState([]);
  //  echars Y轴
  const [yData, setYData] = useState([]);
  // tag表 当前页
  const [tagCurrentPage, setTagCurrentPage] = useState(1);
  //  tag表 煤业数量
  const [tagPageSize, setTagPageSize] = useState(10);

  // 查询到设备后查询 设备的编码 和 tag列表值
  useEffect(() => {
    if (equipment.equipmentCode) {
      getEquipmentParamneterValue(equipment.equipmentCode);
      setEquipmentCode(equipment.equipmentCode);
    }
  }, [equipment]);
  // 打开模态框时 搜索tag的历史值
  useEffect(() => {
    if (visible == true) {
      onSerachTagValue('1', tagCurrentPage, tagPageSize);
    }
  }, [visible]);

  // 往echarts 添加数据
  useEffect(() => {
    let xDataTemp = [];
    let yDataTemp = [];
    if (allTagValueList && allTagValueList.length > 0) {
      allTagValueList.map(item => {
        xDataTemp = [...xDataTemp, item.timestamp];
        yDataTemp = [...yDataTemp, item.tagValue];
        return true;
      });
    }
    setEchartValue(xDataTemp, yDataTemp);
  }, [allTagValueList]);

  // 打开模态框
  const openModal = data => {
    setTagCode(data.tagCode);
    setTagTypeName(data.tagTypeName);
    // 初始模态框的table的当前页和每页数量
    setTagPageSize(10);
    setTagCurrentPage(1);
    setVisible(true);
  };
  // 关闭模态框
  const closeModal = () => {
    setVisible(false);
  };

  // 切换table和echarts显示
  const handleRadioChange = value => {
    if (value == 'a') {
      setTableVisible(true);
    } else {
      setTableVisible(false);
    }
  };
  // 搜索tag历史值
  const onSerachTagValue = async (
    timeType,
    tagCurrentPage,
    tagPageSize,
    startTimeMoment,
    entTimeMoment
  ) => {
    let startTime = '';
    let endTime = '';
    // 不是自定义的情况 根据类型计算时间
    if (timeType != 9999) {
      startTime = moment(new Date() - timeType * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else if (startTimeMoment == undefined && entTimeMoment == undefined) {
      // 如果没传从时间控件去取时间
      const time = getFieldValue('time');
      startTime = time[0].format('YYYY-MM-DD HH:mm:ss');
      endTime = time[1].format('YYYY-MM-DD HH:mm:ss');
    } else {
      // 如果穿了时间使用时间
      startTime = startTimeMoment.format('YYYY-MM-DD HH:mm:ss');
      endTime = entTimeMoment.format('YYYY-MM-DD HH:mm:ss');
    }
    if (tagCode && equipmentCode) {
      getEquipmentTagValueList(
        {
          equipmentCode,
          tagCode,
          timeType,
          startTime,
          endTime
        },
        tagCurrentPage,
        tagPageSize
      );
      getAllEquipmentTagValueList({
        equipmentCode,
        tagCode,
        timeType,
        startTime,
        endTime
      });
    }
  };

  const setEchartValue = (xData, yData) => {
    setXData(xData);
    setYData(yData);
  };
  // 画echarts
  const getOption = () => {
    const option = {
      backgroundColor: '#FFF',
      legend: {
        data: [tagTypeName],
        orient: 'vertical',
        right: '2%',
        top: '5%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        top: '9%',
        bottom: '15%',
        left: '6%',
        right: '10%'
      },
      xAxis: {
        boundaryGap: true,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        },
        data: xData
      },
      yAxis: {
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#d9d9d9'
          }
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: tagTypeName,
          type: 'line',
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: {
            color: 'rgb(33, 148, 246)',
            shadowBlur: 12,
            shadowColor: 'rgb(33, 148, 246,0.9)',
            shadowOffsetX: 1,
            shadowOffsetY: 1
          },
          itemStyle: {
            color: 'rgb(33, 148, 246)',
            borderWidth: 1,
            borderColor: '#FFF'
          },
          label: {
            show: false,
            distance: 1
          },
          data: yData
        }
      ]
    };
    return option;
  };

  // tag历史 当前页和每页数变化
  const tagPageChange = (page, size) => {
    setTagCurrentPage(page);
    setTagPageSize(size);
    onSerachTagValue(getFieldValue('timeType'), page, size);
  };

  // 是自定义显示时间控件
  const onSelectChange = value => {
    if (value == 9999) {
      setDatePickVisible(true);
    } else {
      onSerachTagValue(value, tagCurrentPage, tagPageSize);
      setDatePickVisible(false);
    }
  };
  // 转换时间
  const formartTime = data => {
    return moment(data).format('YYYY-MM-DD HH:mm:ss');
  };

  const renderCardItem = (data, title, size = 13) => (
    <Fragment>
      <span style={{ paddingLeft: '0.5em', fontSize: size }}>{title + '：'}</span>
      <b className={styles['card-b-style1']}>
        <span style={{ fontSize: size }} className={styles['card-b-style']}>
          {data || ''}
        </span>
      </b>
    </Fragment>
  );
  const renderItem = data => {
    return (
      <div key={data.id} style={{ marginTop: '1.8em' }}>
        {renderCardItem(data.parameterValue + data.unitString, getFormattedMsg('equipment.label.value'))}
        <Divider style={{ margin: '1.8em 0' }} />
        {renderCardItem(formartTime(data.timestampDate), getFormattedMsg('equipment.label.time'))}
      </div>
    );
  };

  const renderItemTitle = data => {
    return (
      <b key={data.tagCode}>
        <span style={{ fontSize: '14px' }}>
          <Icon style={{ fontSize: '14px', marginRight: '5px' }} type="file-text" />
          {data.tagName}
        </span>
      </b>
    );
  };

  const timerSwitchChange = isChecked => {
    if (isChecked) {
      timer = window.setInterval(() => getEquipmentParamneterValue(equipmentCode), 5000);
    } else {
      window.clearInterval(timer);
    }
  };

  const renderSwitch = () => {
    return (
      <Fragment>
        <span style={{ marginRight: 10 }}>{getFormattedMsg('equipment.label.realTimeRefresh')}</span>
        <Switch checkedChildren={getFormattedMsg('equipment.label.on')} unCheckedChildren={getFormattedMsg('equipment.label.off')} onChange={timerSwitchChange} />
      </Fragment>
    );
  };

  const cardHeadStyle = {
    padding: '0.5em 0 0 0.5em',
    background: '#f7f9fa'
  };
  const cardBodyStyle = {
    padding: '0 0.8em'
  };

  const parameterColumns = [
    {
      title: getFormattedMsg('equipment.label.time'),
      key: 'timestamp',
      dataIndex: 'timestamp'
    },
    {
      title: getFormattedMsg('equipment.label.value'),
      key: 'tagValue',
      dataIndex: 'tagValue'
    }
  ];

  return (
    <Fragment>
      <HLayout>
        <Pane
          title={getFormattedMsg('equipment.label.startStatus')}
          icon="table"
          style={{ overflow: 'hidden' }}
          buttons={renderSwitch()}
        >
          <CardList
            span={4}
            gutter={6}
            list={parameterValueList}
            width="100%"
            renderItem={renderItem}
            renderItemTitle={renderItemTitle}
            cardHeadStyle={cardHeadStyle}
            cardBodyStyle={cardBodyStyle}
            onItemClick={openModal}
            className={styles['card-list-bg-file']}
            height={200}
          />
        </Pane>
      </HLayout>
      <Modal
        title={getFormattedMsg('equipment.label.viewData')}
        visible={visible}
        style={{ overflow: 'hidden' }}
        destroyOnClose
        onCancel={() => closeModal()}
        width={1000}
      >
        <HLayout>
          <Pane>
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('timeType', {
                      initialValue: '1'
                    })(
                      <Select onChange={value => onSelectChange(value)}>
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
                </Col>
                <Col span={10}>
                  {datePickerVisible && (
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('time')(
                        <RangePicker
                          onChange={date => {
                            onSerachTagValue('9999', tagCurrentPage, tagPageSize, date[0], date[1]);
                          }}
                        />
                      )}
                    </FormItem>
                  )}
                </Col>
                <Col span={4}>
                  <FormItem>
                    {
                      <Radio.Group
                        defaultValue="a"
                        buttonStyle="outline"
                        onChange={e => handleRadioChange(e.target.value)}
                      >
                        <Radio.Button value="a">{getFormattedMsg('equipment.label.table')}</Radio.Button>
                        <Radio.Button value="b">{getFormattedMsg('equipment.label.chart')}</Radio.Button>
                      </Radio.Group>
                    }
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Pane>
          {tableVisible && (
          <Pane>
            <Fragment>
              <Table
                rowKey={record => record.key}
                columns={parameterColumns}
                dataSource={
                  tagValueList != null
                    ? tagValueList.map((item, index) => ({ ...item, key: index }))
                    : []
                }
                pagination={false}
              />
              <div style={{ margin: '10px 0', textAlign: 'center' }}>
                <Pagination
                  current={tagCurrentPage}
                  pageSize={tagPageSize}
                  showQuickJumper
                  size="small"
                  showSizeChanger
                  total={tagTotal}
                  onShowSizeChange={tagPageChange}
                  onChange={tagPageChange}
                  showTotal={(total, range) =>
                    `${getFormattedMsg('global.label.now')} ${range[0]}-${
                      range[1]
                    } ${getFormattedMsg('global.label.item')}  ${getFormattedMsg(
                      'message.label.total'
                    )} ${total} ${getFormattedMsg('global.label.item')} ${getFormattedMsg(
                      'message.label.record'
                    )}`
                  }
                />
              </div>
            </Fragment>
          </Pane>
          )}
          {!tableVisible && (
            <HLayout>
              <Pane style={{ margin: 5 }} height={300}>
                <Echarts option={getOption()} />
              </Pane>
            </HLayout>
          )}
        </HLayout>
      </Modal>
    </Fragment>
  );
};

RunStatus.propTypes = {
  form: PropTypes.object,
  equipment: PropTypes.object,
  getEquipmentById: PropTypes.func,
  parameterValueList: PropTypes.array,
  getEquipmentTagValueList: PropTypes.func,
  tagTotal: PropTypes.number,
  eventTotal: PropTypes.number,
  eventList: PropTypes.array,
  getEquipmentEvent: PropTypes.func,
  tagValueList: PropTypes.array,
  getAllEquipmentTagValueList: PropTypes.func
};

const mapStateToProps = state => ({
  parameterValueList: equipmentParameterValueSelector(state),
  tagTotal: tagTotalSelector(state),
  eventTotal: eventTotalSelector(state),
  eventList: eventListSelector(state),
  tagValueList: tagListSelector(state),
  allTagValueList: allTagListSelector(state)
});

export default connect(
  mapStateToProps,
  {
    getEquipmentParamneterValue,
    getEquipmentTagValueList,
    getEquipmentEvent,
    getAllEquipmentTagValueList
  }
)(Form.create()(RunStatus));
