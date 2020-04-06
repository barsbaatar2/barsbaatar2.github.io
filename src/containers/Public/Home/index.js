import React from 'react';
import { Layout, Row, Col, Input,Divider, Icon, Button, Modal, message, Typography } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import './style.css'
import axios from 'axios';
const {Content} =Layout;
const { Paragraph } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      visible: false,
      length: '',

      username: '',
      password: '',
      new_username:'',
      new_password:'',
      new_password_repeat: '',
      new_lastname: '',
      new_firstname:'',
      new_phone: ''
    })
    this.base = this.state;
  }

  componentDidMount() {
    axios
    .get(`https://tataatungaa.firebaseio.com/users/length.json`)
    .then(res=>{
      this.setState({length: res.date})
    })
  }

  reset = () =>{
    this.setState(this.base)
  }

  // change states from item names
  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state)
  }

  login = () => {
    axios
    .get(`https://tataatungaa.firebaseio.com/auths/${this.state.username}.json`)
    .then(res=>{
      console.log(res)
      if(res.data == null){
        message.error('Таны бүртгэл олдсонгүй! Нэвтрэх нэр буруу байна эсвэл та бүртгүүлэх үү?')
      }else{
        if(res.data.password != this.state.password){
          message.error('Нууц үг буруу байна.')
        }else{
          axios
          .get(`https://tataatungaa.firebaseio.com/users/${res.data.id}.json`)
          .then(respone=>{
            sessionStorage.setItem('user', JSON.stringify(respone.data))
            message.success(`Тавтай морилно уу, ${respone.data.firstname}`)
            this.props.history.push('/campaigns')
            //document.location.href = '/campaigns';
            this.reset();
          })
        }
      }
    })
  }
  
  signup = () =>{
    if(this.state.new_username == '' || this.state.new_password == '' || this.state.new_password_repeat == '' || this.state.new_lastname == '' || this.state.new_firstname == '' || this.state.new_phone == ''){
      message.warning('Бүх талбарыг бөглөнө үү?')
    }else{
      if(this.state.new_password != this.state.new_password_repeat){
        message.warning('Нууц үгийг буруу давтан оруулсан байна.')
      }else{
        axios
        .get(`https://tataatungaa.firebaseio.com/auths/${this.state.new_username}.json`)
        .then(res=>{
          if(res.data != null) {
            message.warning('Энэ нэвтрэх нэрийг ашиглах боломжгүй байна.')
          }else{
            axios
            .get(`https://tataatungaa.firebaseio.com/users/length.json`)
            .then(res1=>{
              axios({
                method: 'patch',
                headers: {    'Content-Type': 'application/json'  },
                url: `https://tataatungaa.firebaseio.com/users/${res1.data}.json`,
                data: {
                  username: this.state.new_username,
                  firstname: this.state.new_firstname,
                  lastname: this.state.new_lastname,
                  id: res1.data,
                  mobile: this.state.new_phone,
                  type: 'customer',
                  net_score: 0,
                }
              })
              .then(res2=>{
                axios({
                  method: 'patch',
                  headers: {    'Content-Type': 'application/json'  },
                  url: `https://tataatungaa.firebaseio.com/auths/${this.state.new_username}.json`,
                  data: {
                    id: res1.data,
                    password: this.state.new_password
                  }
                })
                .then(res3=>{
                  axios({
                    method: 'patch',
                    headers: {    'Content-Type': 'application/json'  },
                    url: `https://tataatungaa.firebaseio.com/users.json`,
                    data: {
                      length: res1.data+1
                    }
                  })
                  .then(res4=>{
                    message.success('Бүртгэл амжилттай үүслээ.')
                    this.reset();
                  })
                })
              })
            })
            
          }
        })
      }
    }
  }

  render() {

    return (
      <Layout className="homeApp" style={{backgroundColor: '#C1C8E4', height: '100vh', width: '100vw'}}>
        {
          this.state.visible == false
          ?
          <Content style={{alignSelf:'center', padding: '40px'}}>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <h1 style={{textAlign:"center", color:'#5AB9EA'}}>Асуулт Хариулт</h1>
              </Col>
            </Row>
            
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="username" onChange={this.changeHandler} value={this.state.username} className='input' type="username" placeholder="Нэвтрэх нэр" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="password" onChange={this.changeHandler} value={this.state.password} type="password" placeholder="Нууц үг" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '10px', alignSelf:'center'}}>
              <Col style={{ alignSelf:'center'}}>
                <Button onClick={this.login} style={{backgroundColor:"#5AB9EA", borderColor: '#5AB9EA', color:"#FFFFFF", float:'right'}}>Нэвтрэх</Button>
              </Col>
            </Row>
            <Row style={{marginBottom: '10px', alignSelf:'center'}}>
              <Col style={{ textAlign:'center', color: '#FFFFFF'}}>
              эсвэл
              </Col>
            </Row>
            <Row style={{marginBottom: '20px', alignSelf:'center'}}>
              <Col style={{ textAlign:'center', color: '#FFFFFF'}}>
                <Button size="small" onClick={()=>this.setState({visible: !this.state.visible})} style={{backgroundColor:"#5AB9EA", borderColor: '#5AB9EA', color:"#FFFFFF", alignSelf:'center'}}>Бүртгүүлэх</Button>
              </Col>
            </Row>
            <Divider/>
            <Row style={{marginBottom: '20px', textAlign:'center'}}>
              <Col>
                <h2 style={{color:'#5AB9EA'}}>Танилцуулга</h2>
                <div style={{textAlign: 'center'}}>"Үүрийн Шүүдэр" чуулганы Библийн боловсролд чиглэсэн үйлчлэлд зориулан бүтээв. Асуултад хариулан бусадтай өрсөлдөн шагнал авах боломжтой.</div>

              </Col>
              <Col style={{ textAlign: 'center'}}>
              </Col>
            </Row>  
          </Content>
          :
          <Content style={{alignSelf:'center', padding: '40px'}}>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <h1 style={{textAlign:"center", color:'#5AB9EA'}}>Асуулт Хариулт</h1>
              </Col>
            </Row>
            
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_username" onChange={this.changeHandler} value={this.state.new_username} className='input' type="username" placeholder="Нэвтрэх нэр" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_password" onChange={this.changeHandler} value={this.state.new_password} type="password" placeholder="Нууц үг" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_password_repeat" onChange={this.changeHandler} value={this.state.new_password_repeat} type="password" placeholder="Нууц үг давтах" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_lastname" onChange={this.changeHandler} value={this.state.new_lastname} type="text" placeholder="Овог" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_firstname" onChange={this.changeHandler} value={this.state.new_firstname} type="text" placeholder="Нэр" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '20px'}}>
              <Col>
                <Input name="new_phone" onChange={this.changeHandler} value={this.state.new_phone} type="number" placeholder="Утасны дугаар" style={{borderColor: '#5AB9EA', width:'100%', align:'center'}}></Input>
              </Col>
            </Row>
            <Row style={{marginBottom: '10px', alignSelf:'center'}}>
              <Col style={{ alignSelf:'center'}}>
                <Button onClick={this.signup} style={{backgroundColor:"#5AB9EA", borderColor: '#5AB9EA', color:"#FFFFFF", float:'right'}}>Бүртгүүлэх</Button>
              </Col>
            </Row>
            <Row style={{marginBottom: '10px', alignSelf:'center'}}>
              <Col style={{ textAlign:'center', color: '#FFFFFF'}}>
              эсвэл
              </Col>
            </Row>
            <Row style={{marginBottom: '20px', alignSelf:'center'}}>
              <Col style={{ textAlign:'center', color: '#FFFFFF'}}>
                <Button size="small" onClick={()=>this.setState({visible: !this.state.visible})} style={{backgroundColor:"#5AB9EA", borderColor: '#5AB9EA', color:"#FFFFFF", alignSelf:'center'}}>Нэвтрэх</Button>
              </Col>
            </Row>
          </Content>
        }
        
      </Layout>)
  }
};

export default withRouter(Home);

