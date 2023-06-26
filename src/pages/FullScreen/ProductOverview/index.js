import React, { useEffect, useCallback, useState, Component } from 'react';
import { HVLayout, Button, Icon } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent, IndexPageLeft, IndexPageRight } from './container';
import { useResizeDetector } from 'react-resize-detector';
import TopTitle from './TopTitle/index';

import ContentOne from './Left/Top/index';
import ContentTwo from './Left/Down/index';

import ContentThree from './Right/Top/index';
import ContentFour from './Right/Down/index';

const ProductOverView = () => {
    const [usedHeight, setUsedHeight] = useState();

    const handleFullScreen = useFullScreenHandle();
    const onResize = width => {
        const doc = window.document;
        const docEl = doc.documentElement;
        const rem = (10 * width) / 3854;
        docEl.style.fontSize = rem + 'px';
        window.rem = rem;

        //window.innerHeight：视口的高  -  TopTitle的高度 
        const sHeight = window.innerHeight - 16 * rem - 19.4 * rem
        setUsedHeight(sHeight)
        console.log(rem, 'rem');
        console.log(sHeight, 'sHeight');
    };
    const { width, height, ref: resizeRef } = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 300,
        onResize
    });

    return (
        <HVLayout  >
            <IndexPageStyle
                ref={resizeRef}
                className={styles.fullScreenContainer}
            >
                <TopTitle />
                <IndexPageContent
                >
                    <IndexPageLeft
                        style={{ width: '30%', }}
                    >
                        <ContentOne usedHeight={usedHeight} />
                        <ContentTwo usedHeight={usedHeight} />
                    </IndexPageLeft>
                    <IndexPageRight
                        style={{ width: '70%', }}
                    >
                        <ContentThree usedHeight={usedHeight} />
                        <ContentFour usedHeight={usedHeight} />
                    </IndexPageRight>

                </IndexPageContent>
            </IndexPageStyle>
        </HVLayout>
    );
};

export default ProductOverView;
