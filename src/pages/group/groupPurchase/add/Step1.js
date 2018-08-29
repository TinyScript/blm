import React, { PureComponent } from 'react';
import { Form, Switch,Input, Button,DatePicker,Radio,Modal, } from 'antd';
import moment from 'moment';
import GroupListTable from './components/GroupListTable';
const {TextArea} = Input ;
const RadioGroup = Radio.Group;
class Step1 extends PureComponent {

  state = {
    startValue: null,
    ShowStartTime: null,
    endValue: null,
    isChooseGroup: false,
    originTeamIds: [],
    originTeamVisibleState: '',
  };

  componentDidMount = () => {
    const {data} = this.props;
    this.setState({
      originTeamIds: data.TeamIds ? data.TeamIds:[],
      originTeamVisibleState: data.TeamVisibleState ? data.TeamVisibleState:0,
    })
  }

  disabledStartDate = (startValue) => {
    return startValue && startValue.format('YYYY-MM-DD 00:00') < moment().format('YYYY-MM-DD 00:00');
  }

  chooseGroup = () => {
    this.setState({
      isChooseGroup:true,
    })
  }

  confirmGroup = () => {
    const {dispatch,data} = this.props;
    if(!data.TeamIds||data.TeamIds.length==0){
      data.TeamVisibleState = 0;
    }
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
      }
    })
    this.setState({
      isChooseGroup:false,
    })
  }

  unChooseGroup = () => {
    const {dispatch,data} = this.props;
    data.TeamIds = this.state.originTeamIds;
    data.TeamVisibleState = this.state.originTeamVisibleState;
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
      }
    })
    this.setState({
      isChooseGroup:false,
    })
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }
  onShowStartTimeChange = (value) => {
    this.onChange('ShowStartTime', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  setSellType(e){
    const {dispatch,data} = this.props;
    data['SellType'] = e ? 2 : 1;
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
      }
    })
  }

  setVisibleType(e){
    const {dispatch,data} = this.props;
    data['TeamVisibleState'] = e ? 1 : 0;
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
      }
    })
  }

  setCancelType(e){
    const {dispatch,data} = this.props;
    data['AllowCancel'] = e ? 1 : 0;
    dispatch({
      type:'purchaseAdd/setAdd',
      payload:{
        ...data,
      }
    })
  }

  render(){
    const {formItemLayout,form,data,GroupBuyingMode} = this.props
    const { getFieldDecorator} = form;

    return (
      <div>
        <Form layout="horizontal" >
          <h2 style={{color:'green'}}>
            填写团购任务信息:
          </h2>
          <Form.Item
            {...formItemLayout}
            label="开团日期"
          >
            {getFieldDecorator('ShowStartTime', {
              initialValue: data.ShowStartTime ? moment(data.ShowStartTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '开团日期为必填项' }],
            })(
              <DatePicker
                disabledDate={this.disabledStartDate}
                onChange={this.onShowStartTimeChange}
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="截单日期"
          >

            {getFieldDecorator('EndTime', {
              validateTrigger:'submit',
              initialValue: data.EndTime ? moment(data.EndTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '截单日期为必填项' },{
                validator:(rule,val,callback)=>{
                  if(val < this.state.ShowStartTime){
                    callback('截单日期必须大于开团日期！')
                  }else{
                    callback()
                  }
                },
              }],
            })(
              <DatePicker
                onChange={this.onEndChange}
                showTime={{ defaultValue: moment('00:01', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}

          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >

            {getFieldDecorator('Notes', {
              initialValue: data.Notes ||'',
              rules:[{
                validator:(rule,val,callback)=>{

                  if(val.length>50){
                    callback('字数最长50')
                  }else{
                    callback()
                  }
                }},
                {required: true, message: '备注为必填项' }
              ]
            })(
              <TextArea placeholder="(如：今晚截单，下周一左右配送！)" rows={4} />
            )}

          </Form.Item>
          {GroupBuyingMode === 2 ?<Form.Item
            {...formItemLayout}
            label="秒杀模式"
          >
            <Switch checked={data.SellType===2 ? true : false} onChange={(e)=>{this.setSellType(e)}}/>
          </Form.Item> : ''}
          {data.SellType === 2?<Form.Item
            {...formItemLayout}
            colon={false}
            required={false}
            label=" "
          >
            {getFieldDecorator('StartTime', {
              initialValue: data.StartTime ? moment(data.StartTime, 'YYYY-MM-DD HH:mm'):null,
              rules: [{type:'object',required: true, message: '秒杀日期为必填项' },{
                validator:(rule,val,callback)=>{
                  if(val < this.state.ShowStartTime){
                    callback('秒杀日期必须大于开团日期！')
                  }else{
                    callback()
                  }
                },
              }],
            })(
              <DatePicker
                onChange={this.onStartChange}
                showTime={{ defaultValue: moment('00:01', 'HH:mm') }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择日期"
              />
            )}
          </Form.Item>:''}
          <Form.Item
            {...formItemLayout}
            label="允许取消订单"
          >
            <Switch checked={data.AllowCancel===1 ? true : false} onChange={(e)=>{this.setCancelType(e)}}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="是否上架"
          >

            {getFieldDecorator('ShowState', {
              initialValue: data.ShowState === undefined ? 1 : data.ShowState,
            })(
              <RadioGroup>
                <Radio value={1}>是<br/></Radio>
                <Radio value={0}>否<br/></Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="部分社团可见"
          >
            <Switch checked={data.TeamVisibleState===1 ? true : false} onChange={(e)=>{this.setVisibleType(e)}}/>
          </Form.Item>
          {data.TeamVisibleState === 1?<Form.Item
            {...formItemLayout}
            colon={false}
            required={false}
            label=" "
          >
            <Button onClick={this.chooseGroup}>请选择群组</Button>
          </Form.Item>:''}
        </Form>
        <Modal 
          title="选择群组"
          visible={this.state.isChooseGroup}
          onOk={this.confirmGroup}
          onCancel={this.unChooseGroup}
        >
          <GroupListTable data = { data }></GroupListTable>
          <p style = {{ color: 'red', }}>tips:选择群组前，请先在“社团管理-社团群组”中创建群组。</p>
        </Modal>
      </div>
    );
  }
}
export default Step1
