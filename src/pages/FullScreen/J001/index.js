import React, { useEffect, useCallback, useState, Component } from 'react';
import { HVLayout, Button, Icon } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent, PageTop, PageMid, PageDown } from './container';
import { useResizeDetector } from 'react-resize-detector';
import TopTitle from './TopTitle/index';

import ContentOne from './Top/index';
import ContentTwo from './Middle/index';

const { Pane } = HVLayout;

const J001OverView = ({ cHeight }) => {

    // const [data, setData] = useState([]);
    const [data, setData] = useState({});
    const [newData, setNewData] = useState({});
    const [newDataDetail, setNewDataDetail] = useState([]);
    const [num, setNum] = useState(0);

    const handleFullScreen = useFullScreenHandle();
    const onResize = width => {
        const doc = window.document;
        const docEl = doc.documentElement;
        console.log(width, 'width');
        const rem = (10 * width) / 3854;
        docEl.style.fontSize = rem + 'px';
        window.rem = rem;

        // //window.innerHeight：视口的高  -  TopTitle的高度 
        // const sHeight = window.innerHeight - 16 * rem - 19.4 * rem
        // setUsedHeight(sHeight)
        console.log(rem, 'rem');
        // console.log(sHeight, 'sHeight');
    };
    const { width, height, ref: resizeRef } = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 300,
        onResize
    });

    useEffect(() => {
        const datas = [
            {
                number: 'M10000000044',
                name: '040100200001',
                type: '链板排屑器11',
                count: 10,
                detail: [
                    { trayNumber: '1TPB0001', warehouse: '1-1', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0002', warehouse: '1-2', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0003', warehouse: '1-3', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0004', warehouse: '1-4', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0005', warehouse: '1-5', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0006', warehouse: '1-6', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0007', warehouse: '1-7', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0008', warehouse: '1-8', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0009', warehouse: '1-9', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0010', warehouse: '1-10', time: '2020-06-01 10:00:00', },
                    { trayNumber: '1TPB0011', warehouse: '1-11', time: '2020-06-01 10:00:00', },
                ]
            }, {
                number: 'M10000000045',
                name: '040100200002',
                type: '链板排屑器22',
                count: 20,
                detail: [
                    { trayNumber: '2TPB0001', warehouse: '2-1', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0002', warehouse: '2-2', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0003', warehouse: '2-3', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0004', warehouse: '2-4', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0005', warehouse: '2-5', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0006', warehouse: '2-6', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0007', warehouse: '2-7', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0008', warehouse: '2-8', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0009', warehouse: '2-9', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0010', warehouse: '2-10', time: '2020-06-01 10:00:00', },
                    { trayNumber: '2TPB0011', warehouse: '2-11', time: '2020-06-01 10:00:00', },
                ]
            }, {
                number: 'M10000000046',
                name: '040100200003',
                type: '链板排屑器33',
                count: 20,
                detail: [
                    { trayNumber: '3TPB0001', warehouse: '3-1', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0002', warehouse: '3-2', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0003', warehouse: '3-3', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0004', warehouse: '3-4', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0005', warehouse: '3-5', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0006', warehouse: '3-6', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0007', warehouse: '3-7', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0008', warehouse: '3-8', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0009', warehouse: '3-9', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0010', warehouse: '3-10', time: '2020-06-01 10:00:00', },
                    { trayNumber: '3TPB0011', warehouse: '3-11', time: '2020-06-01 10:00:00', },
                ]
            }
        ]
        let number = 0
        const getData = () => {
            const data = datas[number]
            setNewData(data)
            const detail = data.detail
            setNewDataDetail(detail)
            number = number == datas.length - 1 ? 0 : number + 1
        }
        getData();
        const refreshData = setInterval(() => {
            getData();
        }, 1000 * 15);
        return () => {
            clearInterval(refreshData);
        };
    }, []);

    return (
        <HVLayout  >
            <IndexPageStyle
                ref={resizeRef}
                className={styles.fullScreenContainer}
            >
                <TopTitle />
                <IndexPageContent
                >
                    <PageTop  >
                        <ContentOne newData={newData}/>
                    </PageTop>
                    <PageMid  >
                        <ContentTwo newDataDetail={newDataDetail}/>
                    </PageMid>
                </IndexPageContent>
            </IndexPageStyle>
        </HVLayout>
    );
};

export default J001OverView;
