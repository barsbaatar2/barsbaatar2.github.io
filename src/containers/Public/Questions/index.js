import React from 'react';
import { Layout, Row, Col, Input,Divider, Icon, Button, Modal, message, Typography, Select} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import './style.css'
import axios from 'axios';
const {Content} =Layout;
const { Option } = Select;
const { Paragraph } = Typography;
class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      visible: false,
      questions:[],
      campaign: '',
      modal: false,
      new_question: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      right_answer: ''

    })
    this.base = this.state;
  }

  componentWillMount() {
    if(JSON.parse(sessionStorage.getItem('user')).type == 'admin'){
        this.setState({visible: true})
      }

    axios
    .get(`https://tataatungaa.firebaseio.com/campaigns/${sessionStorage.getItem('campaign')}.json`)
    .then(res=>{
        this.setState({campaign: res.data})
    })
    
    axios
    .get(`https://tataatungaa.firebaseio.com/questions/${sessionStorage.getItem('campaign')}/length.json`)
    .then(res=>{
        for(var i=0; i<res.data; i++){
        axios
        .get(`https://tataatungaa.firebaseio.com/questions/${sessionStorage.getItem('campaign')}/${i}.json`)
        .then(res1=>{
            this.setState({questions: [...this.state.questions, res1.data]})
        })
        }
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
  open =()=>{
    this.setState({modal: !this.state.modal})
  }

  create=()=>{
      if(this.state.new_question == null || this.state.answer1 == null || this.state.answer2 == null || this.state.answer3 == null || this.state.answer4 == null || this.state.right_answer == null)
    this.setState({modal: !this.state.modal})
  }

  render() {
    console.log(this.state)
    return (
      <Layout className="homeApp" style={{backgroundColor: '#C1C8E4', height: '100vh', width: '100vw'}}>
        
          <Content style={{alignSelf:'center', padding: '10px'}}>
             <Row>
              <Col>
                <h2 style={{textAlign:"center", color:'#5AB9EA', fontSize: '18px'}}>{this.state.campaign.name}</h2>
                {
                this.state.visible == true
                ?
                <Button style={{float:'right'}} onClick={this.open}>Шинэ</Button>
                :
                null
            }
              </Col>
            </Row>
            <Row>
                <Divider style={{width: '100vW',  marginTop:'0px'}}/>
            </Row>
            {
                this.state.questions.map(q=>(
                <div>
                    <Row style={{marginLeft: '20px'}}>
                        <Col>
                            <h1>{q.id+1}. {q.name}</h1>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: '40px'}}>
                        <Col>
                        <Select size='small' onChange={(value)=>console.log(value)} style={{width: '50vw'}}>
                            <Option value= {q.answers[0].id}>{q.answers[0].name}</Option>
                            <Option value= {q.answers[1].id}>{q.answers[1].name}</Option>
                            <Option value= {q.answers[2].id}>{q.answers[2].name}</Option>
                            <Option value= {q.answers[3].id}>{q.answers[3].name}</Option>
                        </Select>
                        </Col>
                    </Row>
                </div>
                ))
            }

          </Content>

          <Modal 
            visible={this.state.modal}
            onOk={this.create}
            onCancel={this.open}
        >
            <Row style={{marginTop: '20px'}}>
                <Col>
                <Input name='new_question' onChange={this.changeHandler} value={this.state.new_question} type='text' placeholder='Асуулт'></Input>
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <Col>
                    <Input name='answer1' onChange={this.changeHandler} value={this.state.answer1} type='text' placeholder='Хариулт 1'></Input>
                </Col>
            </Row >
            <Row style={{marginTop: '10px'}}>
                <Col>
                    <Input name='answer2' onChange={this.changeHandler} value={this.state.answer2} type='text' placeholder='Хариулт 2'></Input>
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <Col>
                    <Input name='answer3' onChange={this.changeHandler} value={this.state.answer3} type='text' placeholder='Хариулт 3'></Input>
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <Col>
                    <Input name='answer4' onChange={this.changeHandler} value={this.state.answer4} type='text' placeholder='Хариулт 4'></Input>
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <Col>
                    <Select placeholder='Зөв хариултын дугаар' onChange={(value)=>this.setState({right_answer: value})} style={{width: '100%'}}>
                        <Option value='0'>1</Option>
                        <Option value='1'>2</Option>
                        <Option value='2'>3</Option>
                        <Option value='3'>4</Option>
                    </Select>                
                </Col>
            </Row>

          </Modal>
          
        
      </Layout>)
  }
};

export default withRouter(Questions);

