import React from 'react';
import ReactDOM from 'react-dom';
// import angela from   'angela'
import App from './src/pages/App';
import Welcome from './src/pages/Welcome';


// const app=angela()
// app.error((e)=>{
//     console.log(e)
// })
window.onerror=(e)=>{
    console.log(e)
}
// console.log(99999)


ReactDOM.render(
    <App />,
    document.getElementById("app")
);