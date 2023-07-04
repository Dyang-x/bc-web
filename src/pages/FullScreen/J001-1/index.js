import React, { useEffect, useState, useRef } from 'react';
import { HVLayout, Carousel, notification } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent, PageTop, PageMid, PageDown, PageDetail, PageContent } from './container';
import { useResizeDetector } from 'react-resize-detector';

import TopTitle from './TopTitle/index';
import ContentOne from './Top/index';
import ContentTwo from './Middle/index';
import ContentThree from './Down/index';
import Detail from './Detail/index';
import full from '../assets/slices/yw/fullscreen.png';
import LargeScreenApi from '~/api/LargeScreen';

const { Pane } = HVLayout;

const J001OverView = () => {

    const [dataSource, setDataSource] = useState([]);


    const [newData, setNewData] = useState({});
    const [newDataDetail, setNewDataDetail] = useState([]);

    const [trayCount, setTrayCount] = useState({});
    const [rbgStatus, setRbgStatus] = useState('');

    const [detailData, setDetailData] = useState({});
    const carouselRef = useRef();

    // const [tableKey, setTableKey] = useState(1);

    const handleFullScreen = useFullScreenHandle();
    const onResize = width => {
        const doc = window.document;
        const docEl = doc.documentElement;
        //console.log(width, 'width');
        const rem = (10 * width) / 3854;
        docEl.style.fontSize = rem + 'px';
        window.rem = rem;
        //console.log(rem, 'rem');
    };
    const { width, height, ref: resizeRef } = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 300,
        onResize
    });

    useEffect(() => {
        let tableKey = 1
        const getDetails = () =>{
            LargeScreenApi.semiMterialDetails('J003')
            .then(res => {
                // console.log('getDetailData', res);
                // console.log('getDetailData------', res!= null);
                setDetailData(res);
                //在主页 + 子页有数据  = 跳
                if (tableKey == 1 && res != null) {
                    // console.log('111');
                    tableKey = 2
                    carouselRef.current.next()
                    return
                }
                //在主页 + 子页没数据  = 不跳
                if (tableKey == 1 && res == null) {
                    // console.log('222');
                    tableKey = 1
                    return
                }
                //在子页 + 子页有数据  = 不跳
                if (tableKey == 2 && res != null) {
                    // console.log('333');
                    tableKey == 2
                    return
                }
                //在子页 + 子页没数据  = 跳
                if (tableKey == 2 && res == null) {
                    // console.log('444');
                    tableKey == 1
                    carouselRef.current.next()
                    return
                }
            })
            .catch(err => {
                notification.warning({
                    description: err.message
                });
            });
        }
        getDetails()
        const refreshDetailData = setInterval(() => {
            getDetails();
        }, 1000 * 10);



        let datas = []
        const getData = () => {
            LargeScreenApi.semiOrder()
                .then(res => {
                    //console.log('datas', res);
                    setDataSource(res);
                    datas = res
                    setData(res);
                })
                .catch(err => {
                    notification.warning({
                        description: err.message
                    });
                });

            LargeScreenApi.getTrayNumberCount()
                .then(res => {
                        setTrayCount(res);
                })
                .catch(err => {
                    notification.warning({
                        description: err.message
                    });
                });

            let number = 0
            const setData = (datas) => {
                const data = datas[number]
                setNewData(data)
                const detail = data.semiOrderListDTO
                setNewDataDetail(detail)
                number = number == datas.length - 1 ? 0 : number + 1
            }

            const refreshData = setInterval(() => {
                setData(datas);
            }, 1000 * 30);

            return () => {
                clearInterval(refreshData);
            };
        };
        getData()
        const refreshData = setInterval(() => {
            getData();
        }, 1000 * 5);


        const getRbgStatus = () => {
            LargeScreenApi.getRbgStatus()
                .then(res => {
                    console.log('RbgStatus', res);
                    if(rbgStatus != res ){
                        setRbgStatus(res);
                    }
                })
                .catch(err => {
                    notification.warning({
                        description: err.message
                    });
                });
        };
        getRbgStatus()
        const getRbgData = setInterval(() => {
            getRbgStatus()
        }, 1000 );

        return () => {
            clearInterval(refreshData);
            clearInterval(refreshDetailData);
            clearInterval(getRbgData);
        };
    }, []);

    return (
        <div>
            <img
                className={styles.fullscreenButton}
                alt="fullscreen"
                src={full}
                onClick={handleFullScreen.enter}
            />
            <HVLayout >
                <FullScreen handle={handleFullScreen} className={styles.fullScreenContainer}>
                    <IndexPageStyle
                        ref={resizeRef}
                        className={styles.fullScreenContainer}
                    >
                        <TopTitle />
                        <IndexPageContent
                        >
                            <Carousel ref={carouselRef}>
                                <PageContent>
                                    <PageTop  >
                                        <ContentOne newData={newData} />
                                    </PageTop>
                                    <PageMid  >
                                        <ContentTwo newDataDetail={newDataDetail} />
                                    </PageMid>
                                </PageContent>
                                <PageDetail>
                                    <Detail detailData={detailData}/>
                                </PageDetail>
                            </Carousel>
                            <PageDown  >
                                <ContentThree trayCount={trayCount} rbgStatus={rbgStatus}/>
                            </PageDown>
                        </IndexPageContent>
                    </IndexPageStyle>
                </FullScreen>
            </HVLayout>
        </div>
    );
};

export default J001OverView;


        // const datas = [
        //     {
        //         number: 'M10000000044',
        //         name: '040100200001',
        //         type: '链板排屑器11',
        //         count: 10,
        //         detail: [
        //             { trayNumber: '1TPB0001', warehouse: '1-1', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0002', warehouse: '1-2', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0003', warehouse: '1-3', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0004', warehouse: '1-4', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0005', warehouse: '1-5', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0006', warehouse: '1-6', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0007', warehouse: '1-7', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0008', warehouse: '1-8', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0009', warehouse: '1-9', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0010', warehouse: '1-10', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0011', warehouse: '1-11', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0012', warehouse: '1-12', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0013', warehouse: '1-13', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '1TPB0014', warehouse: '1-14', time: '2020-06-01 10:00:00', },
        //         ]
        //     }, {
        //         number: 'M10000000045',
        //         name: '040100200002',
        //         type: '链板排屑器22',
        //         count: 20,
        //         detail: [
        //             { trayNumber: '2TPB0001', warehouse: '2-1', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0002', warehouse: '2-2', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0003', warehouse: '2-3', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0004', warehouse: '2-4', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0005', warehouse: '2-5', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0006', warehouse: '2-6', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0007', warehouse: '2-7', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0008', warehouse: '2-8', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '2TPB0009', warehouse: '2-9', time: '2020-06-01 10:00:00', },
        //         ]
        //     }, {
        //         number: 'M10000000046',
        //         name: '040100200003',
        //         type: '链板排屑器33',
        //         count: 20,
        //         detail: [
        //             { trayNumber: '3TPB0001', warehouse: '3-1', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0002', warehouse: '3-2', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0003', warehouse: '3-3', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0004', warehouse: '3-4', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0005', warehouse: '3-5', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0006', warehouse: '3-6', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0007', warehouse: '3-7', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0008', warehouse: '3-8', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0009', warehouse: '3-9', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0010', warehouse: '3-10', time: '2020-06-01 10:00:00', },
        //             { trayNumber: '3TPB0011', warehouse: '3-11', time: '2020-06-01 10:00:00', },
        //         ]
        //     }
        // ]

        // const other = {
        //     empty: 30,
        //     full: 30,
        //     status: 1
        // }
