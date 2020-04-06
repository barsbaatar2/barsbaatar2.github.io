import React from 'react';
import { Layout, Row, Col, Input,Divider, Icon, Button, Card, Modal, Popover, message, Typography, Tabs, DatePicker  } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import './style.css'
import axios from 'axios';
import { Context } from 'immutability-helper';
import moment from 'moment';
const {Content, Footer} =Layout;
const { Paragraph } = Typography;
const { TabPane } = Tabs;

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      visible: false,
      user:'',
      campaigns:[],
      campaign:'',
      name: '',
      start: '',
      end: ''
    })
    this.base = this.state;
  }

  componentDidMount() {
    this.setState({user: JSON.parse(sessionStorage.getItem('user'))})
    //console.log(JSON.parse(sessionStorage.getItem('user')).type)
    if(JSON.parse(sessionStorage.getItem('user')).type == 'admin'){
      this.setState({visible: true})
    }
    this.setState({campaigns: []})

    axios
    .get(`https://tataatungaa.firebaseio.com/campaigns/length.json`)
    .then(res=>{
      for(var i=0; i<res.data; i++){
        axios
        .get(`https://tataatungaa.firebaseio.com/campaigns/${i}.json`)
        .then(res1=>{
          this.setState({campaigns: [...this.state.campaigns, res1.data]})
        })
      }      
    })
  }

  reset = () =>{
    this.setState(this.base)
  }

  start = (value, dateString) => {
    this.setState({start: dateString})
  }

  end = (value, dateString) => {
    this.setState({end: dateString})
    console.log(this.state)
  }

  create =()=>{
    axios
    .get(`https://tataatungaa.firebaseio.com/campaigns/length.json`)
    .then(res =>{
      axios({
        method: 'patch',
        headers: {    'Content-Type': 'application/json'  },
        url: `https://tataatungaa.firebaseio.com/campaigns/${res.data}.json`,
        data: {
          id: res.data,
          name: this.state.name,
          start: this.state.start,
          end: this.state.end,
          user: this.state.user.id,
          user_name: this.state.user.firstname
        }
      })
      .then(res1=>{
        axios({
          method: 'patch',
          headers: {    'Content-Type': 'application/json'  },
          url: `https://tataatungaa.firebaseio.com/campaigns.json`,
          data: {
            length: res.data+1
          }
        })
        message.success('Амжилттай үүслээ')
        this.componentDidMount()
      })
      .catch(err =>{
        message.error('Алдаа гарлаа.')
      })
    })
  }

  // change states from item names
  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  open =(value)=>{
    document.location.href = '/questions';
    sessionStorage.setItem('campaign', value)
  }

  render() {

    const content = (
      <div style={{alignSelf: 'center'}}>
        <Row>
          <Button size='small' style={{alignSelf: 'center', backgroundColor:'#5AB9EA', color:'#FFFFFF', marginBottom: '10px'}}>Профайл</Button>
        </Row>
        <Row>
          <Button size='small' style={{alignSelf: 'center', backgroundColor:'#5AB9EA', color:'#FFFFFF'}}>Гарах</Button>
        </Row>
      </div>
    )
    return (
      <Layout className="homeApp" style={{backgroundColor: '#C1C8E4', height: '100vh',   width: '100vw'}}>
        {/*<Content style={{margin:'10px'}}>
          <Row>
            <Col style={{float: 'left', color:'#5AB9EA'}}>
              <Popover placement="bottom" content={content} trigger="click">
                <h4 style={{color:'#5AB9EA'}}>{this.state.user.firstname}</h4>
              </Popover>
            </Col>
            <Col style={{float: 'right', color:'#5AB9EA'}}>
              <h4 style={{color:'#5AB9EA'}}>Нийт оноо: {this.state.user.net_score}</h4>
              {/*<Button size='small' style={{backgroundColor:'#5AB9EA', color:'#FFFFFF'}}>гарах</Button>}
            </Col>
          </Row>
        </Content>
    <Divider style={{marginTop:'-5px'}}/>*/}

        <Content style={{height: '95vh', marginTop:'0px'}}>
          <Row>
            <Col>
              <h2 style={{textAlign: 'center', color:'#1890FF'}}>Тэмцээнүүд</h2>
            </Col>
          </Row>
          <Tabs size='small'>
            <TabPane  style={{padding:'10px'}}  key='1' tab={<span><Icon type='check-circle'/> Нээлттэй</span>}>
              {
                this.state.campaigns.map(open=>(
                  console.log( moment(Date.now()).isBetween(open.start, open.end)),
                  moment(Date.now()).isBetween(open.start, open.end) == true && open.deleted == null
                  ?
                  <Card size="small" title={open.name} style={{ width: '100%', marginBottom:'5px' }}>
                    <div>Дуусах хугацаа: <b>{open.end}</b></div>
                    <div>Хариуцагч: <b>{open.user_name}</b></div>
                    <Button onClick={()=>this.open(open.id)} size='small' style={{float: 'right', backgroundColor:'#5AB9EA', color:'#FFFFFF'}}>Орох</Button>
                  </Card> 
                  :
                  null      
               ))
              }
            </TabPane>
            <TabPane  style={{padding:'10px'}}  key='2' tab={<span><Icon type='clock-circle'/> Удахгүй</span>}>
            {
                this.state.campaigns.map(open=>(
                  console.log( moment(Date.now()).isBetween(open.start, open.end)),
                  moment(Date.now()).isBefore(open.start) == true && open.deleted == null
                  ?
                  <Card size="small" title={open.name} style={{ width: '100%', marginBottom:'5px' }}>
                    <div>Эхлэх хугацаа: <b>{open.start}</b></div>
                    <div>Дуусах хугацаа: <b>{open.end}</b></div>
                    <div>Хариуцагч: <b>{open.user_name}</b></div>
                  </Card> 
                  :
                  null      
               ))
              }
            </TabPane>
            <TabPane  style={{padding:'10px'}}  key='3' tab={<span><Icon type='close-circle'/> Дууссан</span>}>
            {
                this.state.campaigns.map(open=>(
                  console.log( moment(Date.now()).isBetween(open.start, open.end)),
                  moment(Date.now()).isAfter(open.end) == true && open.deleted == null
                  ?
                  <Card size="small" title={open.name} style={{ width: '100%', marginBottom:'5px' }}>
                    <div>Эхэлсэн хугацаа: <b>{open.end}</b></div>
                    <div>Дуусcан хугацаа: <b>{open.end}</b></div>
                    <div>Хариуцагч: <b>{open.user_name}</b></div>
                    <Button size='small' style={{float: 'right', backgroundColor:'#5AB9EA', color:'#FFFFFF'}}>Орох</Button>
                  </Card> 
                  :
                  null      
               ))
              }
            </TabPane>
            {
              this.state.visible != false
              ?
              <TabPane key='4' style={{padding:'10px'}} tab={<span><Icon type='plus-circle'/> Шинэ</span>}>
                <Input name="name" onChange={this.changeHandler} value={this.state.name} style={{marginBottom:'10px'}} type='text' placeholder='Нэр'></Input>
                <DatePicker onChange={this.start} showTime format="YYYY-MM-DD HH:mm:ss" style={{marginBottom:'10px', width: '100%'}} type="date" placeholder='Эхлэх хугацаа'></DatePicker>
                <DatePicker onChange={this.end} showTime format="YYYY-MM-DD HH:mm:ss"  style={{marginBottom:'10px', width: '100%'}} type="date" placeholder='Дуусах хугацаа'></DatePicker>
                <Button onClick={this.create} style={{backgroundColor:"#5AB9EA", borderColor: '#5AB9EA', color:"#FFFFFF", float:'right'}}>Үүсгэх</Button>
              </TabPane>
              :
              null
            }
          </Tabs>
        </Content>
        {/*<Footer style={{backgroundColor: '#C1FFE4',position: "sticky", bottom: "0", height: '10vh', width: '100vw'}}>
          <Row align='middle' style={{alignItems:'center'}}>
            <Col style={{float: 'left'}}>
              <Button  size='small'>Жагсаалт</Button>
              <Button size='small'>Гарах</Button>
              <Button size='small'>Миний оноо</Button>
            </Col>
          </Row>
        </Footer>*/}
      </Layout>)
  }
};
export default withRouter(Campaign);
