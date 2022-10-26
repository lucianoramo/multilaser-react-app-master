import React, {useEffect, useState, useContext} from 'react'
//import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Dispatch, log, postServerLogin } from '../hooks/hooks';
import _ from 'lodash';
import { useHistory } from "react-router-dom";
import * as Yup from 'yup';
import { useSpring, animated, interpolate } from 'react-spring'
import Lottie from 'react-lottie-player'

import {
    Button,
    Form,
    Input,
  } from 'formik-semantic-ui';

import axios from 'axios';

import { Message, Icon, Image, Button as Btn, Header, Modal } from 'semantic-ui-react';

import check from '../lottie/1870-check-mark-done.json'


const LoginSchema = Yup.object().shape({
    cpf: Yup.string().required("Numero inválido"),
  });

  


export const LogIn = () => {

    const mobile = window.innerWidth<500?true:false
    const [message, setMessage] = useState('')
    const [logged, setLogged] = useState(false)

    const reducer = useContext(Dispatch)
    const [{token}, dispatch] = reducer;
    const history = useHistory();

    const [cpfError, setCpfError] = useState('')

    const [formanim, setformanim] = useSpring(() => ({ opacity: 0 }));
    const [letitpass, setLetitpass] = useSpring(() => ({ opacity: 0, position:'absolute', top:0}));

    const [modal, setModal] = useState(false)

    const [respToken, setRespToken] = useState(null)

    const defaultProps = {
        cpf:''
    }

    useEffect(() => {
        
        setformanim({from: {y: -window.innerHeight, opacity:0}, to:{y: 0, opacity:1}})
    },[])

    useEffect(() => {
        //console.log(token)
        if(_.isNil(token)){
            
        }else if(token){
            history.push({
                pathname: '/',
            });
        }
    },[token])

    /*const getUser = async (cpf) => {
        console.log(cpf)
        return axios
        .post("http://192.168.0.149/api/auth/login",{userDoc:cpf})
        .then(response => {return {val:true, token:response.data}})
        .catch(error => {console.log('erro:', error.response); return {val:false, token:error.response.status}});
    }*/

    const _handleSubmit = async (e, values, setFieldError) => {
       // let num = verificarCPF(values)
        /*if(!num){
            setText('CPF inválido')
            return
        }*/
        
        log() && console.log(e)

        //let digitsOnly = RegExp("[^0-9]"); 
       // console.log(values.cpf.replace(/[^0-9.]/g, ""))
        validaEntrada(e.cpf)
      };

    const setText = (texto) => {
        setCpfError(texto)

        setTimeout(() => {
            setCpfError('')
        }, 2000);
    }

    const validaEntrada = async (num) => {
        let cpf = num.replace(/[^0-9]/g, "")
        //console.log(hhh)
        const resposta = await postServerLogin('api/auth/login', {userDoc:cpf})
        log() && console.log(resposta)
            if(resposta.val){
                setLogged(true)
                setformanim({from: {y: 0}, to:{y: -window.innerHeight}})
                setLetitpass({from: {opacity: 0, top:0, left:window.innerWidth/2-75, position:'absolute'}, to:{opacity: 1, left:window.innerWidth/2-75, position:'absolute', top:window.innerHeight/2}})

                setRespToken(resposta.token.data)

                setTimeout(() => {
                   
                    setModal(true)
                }, 4000);

            }else{
                if(resposta.token.status === 401){
                    if(cpf.length === 11){
                        //dispatch({type:'mensagem', payload:{text:'CPF inválido, tente digitar agora o RG', type:'error'}})
                        setText('CPF inválido, tente digitar agora o RG')
                    }else{
                        setText('RG inválido, tente digitar agora o CPF')
                        //dispatch({type:'mensagem', payload:{text:'RG inválido, tente digitar agora o CPF', type:'error'}})
                    }
                }else{
                    dispatch({type:'mensagem', payload:{text:'Erro desconhecido, tente novamente', type:'error'}})
                }
            
        }
    }

    const handleClose = () => {
        setModal(false)
        localStorage.setItem('token', respToken);
        dispatch({type:'token', payload:respToken})
        document.location.reload(true);
    }
    

return (
    <div style={{display:'flex', margin:20,  justifyContent:'center'}}>
         <Modal
            //trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
            open={modal}
            onClose={handleClose}
            basic
            size='small'
        >
            <Header icon='browser' content='Bem vindo!' />
            <Modal.Content>
            <h3>A programação do evento acontece automaticamente, não é necessário recarregar o navegador.</h3>
            </Modal.Content>
            <Modal.Actions>
            <Btn color='teal' onClick={handleClose} inverted>
                <Icon name='checkmark' /> Entendi
            </Btn>
            </Modal.Actions>
        </Modal>
        <animated.div style={formanim}>
        <div style={{textAlign:"left", color:'white', maxWidth:mobile?300:900}}>
            <br/>
            <div style={{fontSize:25, marginTop:25, fontFamily:'Effra Medium', color:'#a33cd8'}}><i>Seja bem vindo!</i></div>
            <div style={{fontSize:25, marginTop:25, fontFamily:'Effra Medium', color:'#a33cd8', lineHeight:1}}><i>Preparado para uma grande dose de inovação?</i></div>
            <Image src='/images/pingos.png' style={{marginTop:20}}/>
            <div style={{fontSize:25, color:'#2679d5', marginTop:25, fontFamily:'Effra Medium', lineHeight:1}}>DIGITE SEU CPF E TOQUE EM INICIAR</div>
            <div style={{marginTop:30}}>
            
                <Form
                    initialValues={defaultProps}
                    //validationSchema={LoginSchema}
                    onSubmit={_handleSubmit}
                    //loading={true}
                    //enableReinitialize
                    render={({ handleReset, setFieldValue, setFieldError, values }) => (

                    <Form.Children>
                        <div style={{display:'flex', flexDirection:!mobile?'row':'column', justifyContent:'space-between'}}>
                            <div style={{width:!mobile?'80%':'100%',  marginRight:10}}>
                                <Input name="cpf" inputProps={{placeholder:'CPF', fontSize:16}}/>
                                <div style={{height:20}} className="sui-error-message">{cpfError}</div>
                            </div>
                           
                            <div style={{display:'flex', justifyContent:'flex-end'}} onClick={ e => _handleSubmit(values, e, setFieldError)} >
                                <Image src='/images/btn_iniciar.png' style={{height:40}}/>
                            </div>
                        </div>
                    </Form.Children>
                            
                )}
                />
                
            </div>
            <br/>
           
            <div>{ message }</div>
            
        </div>
        </animated.div>
        <animated.div style={letitpass}>
            <div style={{}}>
            <Lottie
                loop={false}
                speed={.5}
                animationData={check}
                play={logged}
                style={{ width: 150, height: 150 }}
            />
            </div>
        </animated.div>
        </div>
    )
}