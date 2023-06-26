import React, { useState, useEffect } from 'react';
import RightTop from './Top/index';
import RightMiddle from './Middle/index';
import { LargeRectRight } from '../../container';
import PanelTitle from '../../Components/PanelTitle';
import { Button } from '@hvisions/h-ui';

const ContentThree = ({ usedHeight }) => {

    useEffect(() => {
        // const getData = () => {
        //   console.log('4444');
        //   productService
        //     .getMouth()
        //     .then(res => {
        //       if(res!= null){
        //         const time = res.map(i=>{
        //           return i.time
        //         })
        //         setTime(time)
        //         const passRate = res.map(i=>{
        //           return i.passRate
        //         })
        //         setPassRate(passRate)
        //         const acount = res.map(i=>{
        //           return i.acount
        //         })
        //         setAcount(acount)
        //       }

        //     })
        //     .catch(err => {
        //       notification.warning({
        //         description: err.message
        //       });
        //     });
        // };
        // getData();
        const refreshData = setInterval(() => {
            //   getData();
        }, 1000 * 5);
        return () => {
            clearInterval(refreshData);
        };
    }, []);

    return (
        <div
            style={{
                marginTop: '4rem',
                marginLeft: '4rem',
                // display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                // height: usedHeight * 0.6
                height: '120rem'
            }}
        >
            <LargeRectRight style={{ flex: '1', }}>
                <PanelTitle title="核心产品" style={{ width: '100%', }} />
                <div
                style={{
                    marginLeft: '190rem',
                    marginTop: '2rem',
                    // marginRight: 20,
                    position: 'fixed',
                }}
                    >
                    <Button>昨天</Button>
                    <Button>今天</Button>
                    <Button>本周</Button>
                    <Button>本月</Button>
                </div>
                <RightTop usedHeight={usedHeight} />
                <RightMiddle usedHeight={usedHeight} />
            </LargeRectRight>
        </div>
    );
};

export default ContentThree;
