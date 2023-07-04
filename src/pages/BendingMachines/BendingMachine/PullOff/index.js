import React, { useState, useEffect, useMemo } from 'react';
import {
    HVLayout,
    Button,
    notification,
    Modal,
    Divider,
    Radio,
    Pagination,
    Input,
    DatePicker,
    SearchForm,
    Tooltip
} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import retrievalApi from '~/api/retrieval';
import moment from 'moment';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { Pane } = HVLayout;
const { showTotal } = page;

const PullOff = ({ pullOffData }) => {
    const [tableData, setTableData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedstatus, setSelectedstatus] = useState('0');
    const [searchValue, setSearchValue] = useState({toLocation:pullOffData.readyMaterials});

    useEffect(() => {
        loadTableData(page, pageSize, { ...searchValue, status: selectedstatus });
    }, []);

    const columns = [
        {
            title: '出库单号',
            dataIndex: 'owNumber',
            key: 'owNumber',
            align: 'center',
            render: (_, record) => {
                if (!record.owNumber) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.owNumber}>
                        {record.owNumber}
                    </Tooltip>
                )
            },
            width: 200
        },
        {
            title: '操作人',
            dataIndex: 'operatorName',
            key: 'operatorName',
            align: 'center',
            render: (_, record) => {
                if (!record.operatorName) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.operatorName}>
                        {record.operatorName}
                    </Tooltip>
                )
                    ;
            },
            width: 120
        },

        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: text => {
                if (text == 0) {
                    return '出库中';
                }
                if (text == 1) {
                    return '已完成';
                }
            },
            width: 100
        },

        {
            title: '出库时间',
            dataIndex: 'outStockTime',
            key: 'outStockTime',
            align: 'center',
            render: (_, record) => {
                if (!record.outStockTime) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.outStockTime}>
                        {record.outStockTime}
                    </Tooltip>
                )
            },
            width: 170
        },
        {
            title: '关联单号',
            dataIndex: 'associateNumber',
            key: 'associateNumber',
            align: 'center',
            render: (_, record) => {
                if (!record.associateNumber) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.associateNumber}>
                        {record.associateNumber}
                    </Tooltip>
                )
            },
            width: 200
        },
        {
            title: '托盘号',
            dataIndex: 'transferCode',
            key: 'transferCode',
            align: 'center',
            render: (_, record) => {
                if (!record.transferCode) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.transferCode}>
                        {record.transferCode}
                    </Tooltip>
                )
            },
            // width: 200
        },
        {
            title: '属性1',
            dataIndex: 'attributeOne',
            key: 'attributeOne',
            align: 'center',
            render: (_, record) => {
                if (!record.attributeOne) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.attributeOne}>
                        {record.attributeOne}
                    </Tooltip>
                )
            },
            // width: 200
        },
        {
            title: '属性2',
            dataIndex: 'attributeTwo',
            key: 'attributeTwo',
            align: 'center',
            render: (_, record) => {
                if (!record.attributeTwo) {
                    return '暂无';
                }
                return (
                    <Tooltip placement="left" title={record.attributeTwo}>
                        {record.attributeTwo}
                    </Tooltip>
                )
            },
            // width: 200
        },
        {
            title: getFormattedMsg('global.label.operation'),
            dataIndex: 'opt',
            key: 'opt',
            align: 'center',
            // width: 200,
            // fixed: 'right',
            render: (_, record) => [
                <a key="delivery" onClick={() => onHandleDelivery(record)}>
                    托盘下架
                </a>
            ]
        }
    ];

    const onHandleDelivery = async (record) => {
        Modal.confirm({
            title: `确认下架托盘${record.transferCode}?`,
            onOk: async () => {
                await retrievalApi.outShelf(record.id)
                    .then(res => {
                        notification.warning({
                            message: '托盘下架成功',
                        });
                    })
                    .catch(err => {
                        setLoading(false);
                        notification.warning({
                            message: '托盘下架失败',
                            description: err.message
                        });
                    });
            },
            onCancel: () => { }
        })
    }

    const handleSearch = data => {
        const params = { ...data }
        if (params.outStockTime && params.outStockTime.length > 0) {
            params.startTime = moment(params.outStockTime[0]).format(dateTime)
            params.endTime = moment(params.outStockTime[1]).format(dateTime)
        }
        setSearchValue({ ...params, status: selectedstatus,toLocation:pullOffData.readyMaterials });
        setPage(1);
        setPageSize(10);
        loadTableData(1, 10, { ...params, status: selectedstatus == 2 ? '' : selectedstatus, toLocation : pullOffData.readyMaterials });
    };

    const loadTableData = (page, pageSize, searchValue) => {
        setLoading(true);
        const params = {
            ...searchValue,
            page: page - 1,
            pageSize
        };
        retrievalApi
            .getQueryList(params)
            .then(res => {
                setTableData(res.content);
                setTotalPage(res.totalElements);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                notification.warning({
                    message: getFormattedMsg('global.notify.submitFail'),
                    description: err.message
                });
            });
    };
    const onShowSizeChange = (p, s) => {
        loadTableData(p, s, { ...searchValue, status: selectedstatus == 2 ? '' : selectedstatus });
        setPageSize(s);
    };
    const pageChange = (p, s) => {
        loadTableData(p, s, { ...searchValue, status: selectedstatus == 2 ? '' : selectedstatus });
        setPage(p);
    };

    const { Table, SettingButton } = useMemo(
        () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_retrieval_management' }),
        []
    );

    return (
        <>
            <HVLayout>
                <HVLayout.Pane height={'auto'}>
                    <SearchForm onSearch={handleSearch}>
                        <SearchForm.Item label={getFormattedMsg('retrieval.label.owNumber')} name="owNumber">
                            <Input placeholder="请输入出库单号" allowClear />
                        </SearchForm.Item>
                        <SearchForm.Item
                            label={getFormattedMsg('retrieval.label.outStockTime')}
                            name="outStockTime"
                        >
                            <RangePicker format={dateTime} showTime />
                        </SearchForm.Item>
                    </SearchForm>
                </HVLayout.Pane>
                <HVLayout.Pane
                    icon={<i className="h-visions hv-table" />}
                    title="物料出库列表"
                    settingButton={<SettingButton />}
                    onRefresh={() => handleSearch(searchValue)}
                >
                    <Table
                        loading={loading}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        dataSource={tableData.map((i, idx) => ({
                            ...i,
                            serialNumber: (page - 1) * pageSize + ++idx
                        }))}
                        columns={columns}
                        rowKey={record => record.id}
                    />
                    <Pane.BottomBar>
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
                            pageSize={pageSize}
                        />
                    </Pane.BottomBar>
                </HVLayout.Pane>
            </HVLayout>
        </>
    );
};
export default PullOff;
