import React, { useEffect, useCallback, useState, Component } from 'react';
import { HVLayout, Button, Icon } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent, IndexPageLeft, IndexPageRight } from './container';
import { useResizeDetector } from 'react-resize-detector';
import TopTitle from './TopTitle/index';

import ContentOne from './Left/Top/index';


const { Pane } = HVLayout;

const ProductOverView = ({ cHeight }) => {
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
                style={{ backgroundColor: 'darkgrey' }}
            >
                <TopTitle />
                <IndexPageContent
                    style={{ backgroundColor: 'red' }}
                >
                    <IndexPageLeft
                        style={{ width: '25%', }}
                    >
                        11111111111111111111
                        <ContentOne
                            usedHeight={usedHeight}

                        />
                    </IndexPageLeft>
                    <IndexPageRight
                        style={{ width: '75%', }}
                    >
                        22222222222222222222
                    </IndexPageRight>

                </IndexPageContent>
            </IndexPageStyle>
        </HVLayout>
        // <HVLayout autoScroll style={{  margin: 0, padding: 0, height: '100%', position: "fixed" }}>
        //     <FullScreen handle={handleFullScreen} className='fullScreenContainer'  >
        //         <IndexPageStyle
        //             ref={resizeRef}
        //             style={{ display: 'flex', flexDirection: 'column' }}
        //         >
        //             {/* <TopTitle /> */}
        //             <IndexPageContent
        //                       style={{
        //                         display: 'flex',
        //                         // flexDirection: 'column',
        //                         // flex: '1',
        //                         marginBottom: '4.6rem'
        //                       }}
        //             >
        //                 <IndexPageLeft
        //                     // style={{ width: '50%', }}
        //                 >
        //                     11111111111111111111
        //                 </IndexPageLeft>
        //                 <IndexPageRight
        //                     // style={{ width: '50%', }}
        //                 >
        //                     22222222222222222222
        //                 </IndexPageRight>
        //             </IndexPageContent>
        //         </IndexPageStyle>
        //     </FullScreen>
        // </HVLayout>
    );
};

export default ProductOverView;
