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

    //详情页数据
    useEffect(() => {
        let tableKey = 1
        const getDetails = () =>{
            LargeScreenApi.rawMterialInDetails()
            .then(res => {
                if(res != null){
                setDetailData(res);
                }
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

        return () => {
            clearInterval(refreshDetailData);
        };
    }, []);

    //分组数据
    useEffect(() => {
        const rawMterialInGroup = () => {
            LargeScreenApi.rawMterialInGroup()
                .then(res => {
                    if(res != null){
                        setNewData(res)
                    }
                })
                .catch(err => {
                    notification.warning({
                        description: err.message
                    });
                });
        };
        rawMterialInGroup()
        const refreshData = setInterval(() => {
            rawMterialInGroup();
        }, 1000 * 60);

        return () => {
            clearInterval(refreshData);
        };
    }, []);

    //托盘数据
    useEffect(() => {
        const getData = () => {
            LargeScreenApi.rawMterialInList()
                .then(res => {
                    if(res != null){
                        setNewDataDetail(res);
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
        };
        getData()
        const refreshData = setInterval(() => {
            getData();
        }, 1000 * 60);

        return () => {
            clearInterval(refreshData);
        };
    }, []);

    useEffect(() => {
        const getRbgStatus = () => {
            LargeScreenApi.getRbgStatus()
                .then(res => {
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