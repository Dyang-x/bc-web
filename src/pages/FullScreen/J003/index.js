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
import { isEmpty } from 'lodash';

const { Pane } = HVLayout;

const J003OverView = () => {

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
        const getDetails = () => {
            LargeScreenApi.semiMterialDetails('J003')
                .then(res => {
                    //console.log('getDetailData', res);
                    // console.log('getDetailData------', res!= null);
                    if (res != null) {
                        setDetailData(res);
                    }
                    //在主页 + 子页有数据  = 跳
                    if (tableKey == 1 && res != null) {
                        //console.log('111');
                        tableKey = 2
                        getOverviewData()
                        carouselRef.current.next()
                        return
                    }
                    //在主页 + 子页没数据  = 不跳
                    if (tableKey == 1 && res == null) {
                        //console.log('222');
                        tableKey = 1
                        return
                    }
                    //在子页 + 子页有数据  = 不跳
                    if (tableKey == 2 && res != null) {
                        //console.log('333');
                        tableKey = 2
                        return
                    }
                    //在子页 + 子页没数据  = 跳
                    if (tableKey == 2 && res == null) {
                        //console.log('444');
                        tableKey = 1
                        getOverviewData()
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

        return () => {
            clearInterval(refreshDetailData);
        };
    }, []);

    useEffect(() => {
        const getRbgStatus = () => {
            LargeScreenApi.getRbgStatus()
                .then(res => {
                    if (rbgStatus != res) {
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
        }, 1000);

        return () => {
            clearInterval(getRbgData);
        };
    }, []);

    // useEffect(() => {
    //     const getData = () => {
    //     let datas = []
    //         LargeScreenApi.semiOrder()
    //             .then(res => {
    //                 //console.log(res,'semiOrder');
    //                 if (res != null) {
    //                     // setDataSource(res);
    //                     datas = res
    //                     setData(res);
    //                 }
    //             })
    //             .catch(err => {
    //                 notification.warning({
    //                     description: err.message
    //                 });
    //             });

    //         LargeScreenApi.getTrayNumberCount()
    //             .then(res => {
    //                 setTrayCount(res);
    //             })
    //             .catch(err => {
    //                 notification.warning({
    //                     description: err.message
    //                 });
    //             });

    //         let number = 0
    //         const setData = (datas) => {
    //             if (!isEmpty(datas)) {
    //                 const data = datas[number]
    //                 setNewData(data)
    //                 if (data.semiOrderListDTO != null) {
    //                     const detail = data.semiOrderListDTO
    //                     setNewDataDetail(detail)
    //                 }
    //                 number = number == datas.length - 1 ? 0 : number + 1
    //                 //console.log('11111111111111');
    //             }
    //         }

    //         const refreshData = setInterval(() => {
    //             setData(datas);
    //         }, 1000 * 30);

    //         return () => {
    //             clearInterval(refreshData);
    //         };
    //     };
    //     getData()
    //     const refreshData = setInterval(() => {
    //         getData();
    //     }, 1000 * 60);

    //     return () => {
    //         clearInterval(refreshData);
    //     };
    // }, []);
    useEffect(() => {
        getOverviewData()
    }, []);

    const getOverviewData = () => {
        let datas = []
        LargeScreenApi.semiOrder()
            .then(res => {
                console.log(res, 'semiOrder2222');
                if (res != null) {
                    // setDataSource(res);
                    datas = res
                    setData(res);
                }
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
            if (!isEmpty(datas)) {
                const data = datas[number]
                setNewData(data)
                if (data.semiOrderListDTO != null) {
                    const detail = data.semiOrderListDTO
                    setNewDataDetail(detail)
                }
                number = number == datas.length - 1 ? 0 : number + 1
            }
        }
        const refreshData = setInterval(() => {
            setData(datas);
        }, 1000 * 30);
        return () => {
            clearInterval(refreshData);
        };
    }

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
                            <Carousel ref={carouselRef} dots={false}>
                                <PageContent>
                                    <PageTop  >
                                        <ContentOne newData={newData} />
                                    </PageTop>
                                    <PageMid  >
                                        <ContentTwo newDataDetail={newDataDetail} />
                                    </PageMid>
                                </PageContent>
                                <PageDetail>
                                    <Detail detailData={detailData} />
                                </PageDetail>
                            </Carousel>
                            <PageDown  >
                                <ContentThree trayCount={trayCount} rbgStatus={rbgStatus} />
                            </PageDown>
                        </IndexPageContent>
                    </IndexPageStyle>
                </FullScreen>
            </HVLayout>
        </div>
    );
};

export default J003OverView;