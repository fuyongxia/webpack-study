import React from 'react';
import {Adapter,Select} from 'ui';
import Option from  'option'

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
        <div onClick={clickFn}>hello1</div>
        <Adapter />
        <Select/>
        <Option/>

    </>
}