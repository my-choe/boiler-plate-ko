import Axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null){
    // option
        // null => 아무나 출입 가능
        // true => 로그인 한 유저만 출입 가능
        // false => 로그인 한 유저는 출입 불가능

     // adminRounte  
        // true : 어드민만 가능
        // false : 모두 가능
    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.hisotry.push('/login')
                    }
                }else{ 
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.hisotry.push('/')
                    }else if(option === false){
                        props.hisotry.push('/')
                    }
                }
            })
        }, [])

        return(
            <SpecificComponent/>
        )
    }


    return AuthenticationCheck
}