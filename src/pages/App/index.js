import React from 'react';
import {Adapter,Select} from 'ui';
import Option from  'option';
import {Button} from 'antd';
import '../../../src/global.css'
import style from './index.less'
import  './app.less'



export default () => {
    const clickFn = () => {
        fetch('api/users').then(data => {
            if (data.status == 200) {
                data.json().then(result => {
                    console.log(result, 'result')
                })
            }
        })

    }
    Promise.resolve().finally();
    const [aname,b]=[1,2]
    return <>
        <div onClick={clickFn} className={style.subtitle}>hello1</div>
        <Adapter />
        <Select/>
        <Option/>
        <Button type='primary' style={{color:'red'}} className='readonly'>点击</Button>
        <div className='title'>测试</div>
        <div className='custo' style={{width:100,maxHeight:100}}>测试postcss</div>
        {/* <div className='title'>测试lessMixins</div> */}

    </>
}