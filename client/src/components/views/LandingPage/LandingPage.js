import Axios from 'axios';
import React from 'react';
import {withRouter} from 'react-router-dom';

function LandingPage(props){

    const onClickHandler = () => {
        Axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success){
                props.history.push("/login")
            }else{
                alert('로그아웃 실패!')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height:'100vh'
        }}>
            <h2>시작 페이지</h2>
            <br/>
            <br/>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)