import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Divider,Card,Input,Radio,Button, Switch,Modal,Form, Icon,} from 'antd';
const FormItem = Form.Item;
import styles from './Community.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const {Search} = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import {getLocalStorage} from '../../../utils/utils'
import {checkRole} from "../../../utils/utilsCheckRole";
const userData = getLocalStorage('userData');

@connect(state => ({
  community: state.community,
}))
@Form.create()
export default class StandardTable extends PureComponent {

  state = {
    OrganizationName:'',
    OrganizationId:'',
    current:0,
    audit_state:1,
    searchValue:'',
    expandedRowKeys:[],
    operationkey: '1',
    groupVisible: false,
  };

  componentDidMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      OrganizationId:userData.id,
      OrganizationName:userData.Staff.OrganizationName
    },()=>{
      dispatch({
        type: 'community/queryCommunityList',
        payload:{
          page:1,
          page_size:10,
          audit_state:1,
          OrganizationId:this.state.OrganizationId,
          is_disable:this.state.audit_state==2?true:false,
        }
      });
      dispatch({
        type: 'community/queryGroupList',
        payload:{
          page:1,
          page_size:10,
          OrganizationId:this.state.OrganizationId,
        }
      });
    })

  }
  accountListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    this.setState({
      current:pagination.current
    })
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      OrganizationId: this.state.OrganizationId,
      audit_state:this.state.audit_state,
      search:this.state.searchValue,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'community/queryCommunityList',
      payload: params,
    });
  }

  groupListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    // const {formValues} = this.state;
    // this.setState({
    //   current:pagination.current
    // })
    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = {...obj};
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    // const params = {
    //   page: pagination.current,
    //   page_size: pagination.pageSize,
    //   OrganizationId: this.state.OrganizationId,
    //   audit_state:this.state.audit_state,
    //   search:this.state.searchValue,
    //   ...formValues,
    //   ...filters,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    // dispatch({
    //   type: 'community/queryCommunityList',
    //   payload: params,
    // });
    dispatch({
      type: 'community/queryGroupList',
      payload:{
        page: pagination.current,
        page_size:10,
        OrganizationId:this.state.OrganizationId,
      }
    });
  }

  getInfo(isOpen,val){
    if(isOpen){
      this.props.dispatch({
        type: 'community/queryCommunityInfo',
        payload: {
          GroupId:val.GroupId,
          OrganizationId:this.state.OrganizationId
        },
      }).then(()=>{
        this.setState({
          expandedRowKeys:[val.GroupId]
        })
      });
    }else{
      this.setState({
        expandedRowKeys:[]
      })
    }
    return false;
  }

  search(val){
    const {dispatch} = this.props;
    this.setState({
      searchValue:val,
      current:1,
    },()=>{
      dispatch({
        type: 'community/queryCommunityList',
        payload:{
          page:1,
          OrganizationId: this.state.OrganizationId,
          page_size:10,
          audit_state:this.state.audit_state,
          search:val,
          is_disable:this.state.audit_state==2?true:false,
        },
      });
    })
  }
  radioOnChange(val){
    const {dispatch} = this.props;
    this.setState({
      audit_state:parseInt(val.target.value),
      current:1,
    },()=>{
      dispatch({
        type: 'community/queryCommunityList',
        payload:{
          page:1,
          OrganizationId: this.state.OrganizationId,
          page_size:10,
          audit_state:this.state.audit_state,
          search:this.state.search,
          is_disable:this.state.audit_state==2?true:false,
        },
      });
    })
  }
  stop(e){
    e.stopPropagation();
  }

  authorization(e){
    return `/api/v1/user/org/user/access_id_card_pic?_token=${userData.Token}&_uid=${userData.UserId}&uri=${encodeURI(e)}`
  }

  audited(e,value){
    this.stop(e);
    const {dispatch} = this.props;
      dispatch({
        type: 'community/submitCommunityAudited',
        payload:{
          OrganizationId: this.state.OrganizationId,
          ...value
        },
      }).then(()=>{
        dispatch({
          type: 'community/queryCommunityList',
          payload:{
            page:this.state.current,
            OrganizationId: this.state.OrganizationId,
            page_size:10,
            audit_state:this.state.audit_state,
            is_disable:this.state.audit_state==2?true:false,
          },
        });
      });
  }
  renderCommunityList = () => {
    const {community:{communityList:{List,Count},loading,pagination}} = this.props;
    const {dispatch} = this.props;
    const userInfo = ()=>{
      const {community:{communityInfo}} = this.props;
      const data = communityInfo;
      return  (
        <div>
          <div>
            <span>所属团组织：</span>
            <span>{data.OrganizationName}</span>
          </div>
          <div>
            <span>社团名称：</span>
            <span>{data.Name}</span>
          </div>
          <div>
            <span>用户名：</span>
            <span>{data.ManagerWxNickname}</span>
          </div>
          <div>
            <span>团长姓名：</span>
            <span>{data.ManagerName}</span>
          </div>
          <div>
            <span>手机号：</span>
            <span>{data.ManagerMobile}</span>
          </div>
          <Divider/>
          <div>
            <span>身份证正反面照片：</span>
            <span>
              {data.ManagerIdCardFront?
                <a style={{marginRight:10}} target="_bank" href={this.authorization(data.ManagerIdCardFront)}>查看</a>:<span style={{marginRight:10}}>查看</span>
              }
              {data.ManagerIdCardBack?
                <a target="_bank" href={this.authorization(data.ManagerIdCardBack)}>查看</a>:'查看'
              }
            </span>
          </div>
          <div>
            <span>身份证号：</span>
            <span>{data.ManagerIdCardNumber}</span>
          </div>
          <div>
            <span>联系地址：</span>
            <span>{data.Address}</span>
          </div>
        </div>
      )
    }

    let columns = [
      { title: '所属团组织',dataIndex: 'OrganizationName',render:()=>(this.state.OrganizationName)} ,
      { title: '社团名称', dataIndex: 'Name'},
      { title: '团长姓名', dataIndex: 'ManagerName'},
      { title: '手机号', dataIndex: 'ManagerMobile'},
      { title: '提货地址', dataIndex: 'Address'},
    ];
    let Unaudited = [
      { title: '所属团组织',dataIndex: 'OrganizationName'} ,
      { title: '社团名称', dataIndex: 'Name'},
      { title: '团长姓名', dataIndex: 'ManagerName'},
      { title: '手机号', dataIndex: 'ManagerMobile'},
      { title: '提货地址', dataIndex: 'Address'}
    ];

    const change = (val,payload)=>{
      dispatch({
        type: 'community/uploadCommunityState',
        payload: {
          OrganizationId:payload.OrganizationId,
          GroupId:payload.GroupId,
          IsDisable:!val,
        },
      })
    }

    if(!checkRole(2002)){
      columns.push({
        title: '操作',
        render : (text,record,index)=>{
          return (
            <div>
              <Button><Link onClick={(e)=>{this.stop(e)}} to={`/group/&community&/communityEdit/${record.GroupId}`}>编辑</Link></Button>
              <Divider type="vertical"/>
              <Switch checkedChildren="开启" defaultChecked={!record.IsDisable} onChange={(val)=>{change(val,record)}} unCheckedChildren="禁用"  />
            </div>
          )
        }
      })

      Unaudited.push(
        {
          title: '操作',
          render : (text,record,index)=>{
            return (<div>
              <Button onClick={(e)=>{this.audited(e,{GroupId:record.GroupId,AuditState:1})}} type="primary" style={{marginRight:10}}>通过</Button>
              <Button onClick={(e)=>{this.audited(e,{GroupId:record.GroupId,AuditState:0})}} type="danger">拒绝</Button>
            </div>)
          }
        }
      )
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current:this.state.current,
      total: Count,
      ...pagination,
    };

    const extraContent = (
      <div >
        <Search
          enterButton
          placeholder="用户名/手机号"
          onSearch={(e) => {this.search(e)}}
        />
      </div>
    );
    return (
      <Card bordered={false}
            extra={extraContent}
            title="社团列表">
        <div>
          <div className={styles.standardTable}>
            <RadioGroup onChange={this.radioOnChange.bind(this)} style={{marginBottom:20}} defaultValue="1">
              <RadioButton value="1">已审核</RadioButton>
              <RadioButton value="0">未审核</RadioButton>
              <RadioButton value="2">已禁用</RadioButton>
            </RadioGroup>
            <Link style={{float:'right'}} to="/group/&community&/communityAdd"><Button  type="primary" ghost  icon="plus">添加社团</Button></Link>
            <Table
              bordered
              columns={this.state.audit_state===0 ?   Unaudited :  columns}
              rowKey="GroupId"
              expandedRowRender={record => userInfo(record)}
              expandRowByClick
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={(val,text)=>{this.getInfo(val,text)}}
              dataSource={List}
              loading={loading}
              pagination={paginationProps}
              onChange={this.accountListTableChange}
            />
          </div>
        </div>
      </Card>
    )
  }

  groupOperate = 'add'
  groupOperateInfo = {};
  showGroupModal = () => {
    this.props.form.resetFields();
    this.groupOperate = 'add';
    this.groupOperateInfo = {};
    this.setState({
      groupVisible: true,
    });
  }

  editGroupModal = (e,record) => {
    e.preventDefault();
    this.groupOperate = 'edit';
    this.groupOperateInfo = record;
    this.props.form.setFieldsValue({
      TeamName: record.Name,
    });
    this.setState({
      groupVisible: true,
    });
  }

  deleteGroup = (e,record) => {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch({
      type: 'community/deleteCommunityGroup',
      payload: {
        OrganizationId: this.state.OrganizationId,
        TeamId: record.TeamId,
      },
    });
  }

  groupHandleOk = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    let that = this;
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          if(that.groupOperate == 'add'){
            dispatch({
              type: 'community/addCommunityGroup',
              payload: {
                OrganizationId: this.state.OrganizationId,
                ...values,
              },
            });
          }else if(that.groupOperate == 'edit'){
            dispatch({
              type: 'community/editCommunityGroup',
              payload: {
                OrganizationId: that.state.OrganizationId,
                TeamId: that.groupOperateInfo.TeamId,
                ...values,
              },
            });
          }
          this.setState({
            groupVisible: false,
          });
        }
      }
    );
  }

  groupHandCancel = (e) => {
    this.setState({
      groupVisible: false,
    });
  }
  renderCommunityGroup = () => {
    const {community:{groupList:{List,Count},loading,pagination}} = this.props;
    const {dispatch} = this.props;

    let columns = [
      { title: '群组ID',dataIndex: 'TeamId',} ,
      { title: '群组名称', dataIndex: 'Name'},
      { title: '社团数量', dataIndex: 'GroupCount'},
    ];

    columns.push({
      title: '操作',
      render : (text,record,index)=>{
        return (
          <div>
            <Button onClick={(e)=>{this.editGroupModal(e,record)}}>编辑群组</Button>
            <Divider type="vertical"/>
            <Button><Link onClick={(e)=>{this.stop(e)}} to={`/group/&community&/communityGoup/${record.TeamId}`}>关联社团</Link></Button>
            <Divider type="vertical"/>
            <Button onClick={(e)=>{this.deleteGroup(e,record)}}>删除</Button>
            {/* <Switch checkedChildren="开启" defaultChecked={!record.IsDisable} onChange={(val)=>{change(val,record)}} unCheckedChildren="禁用"  /> */}
          </div>
        )
      }
    })

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Count,
      ...pagination,
    };

    return (
      <Card bordered={false}
            title="社团群组">
        <div className={styles.standardTable}>
          <Button style={{marginBottom:20}} type="primary" onClick={(e)=>{this.showGroupModal(e)}}>添加群组</Button>
          <Table
            bordered
            columns={columns}
            rowKey="TeamId"
            dataSource={List}
            loading={loading}
            pagination={paginationProps}
            onChange={this.groupListTableChange}
          />
        </div>
      </Card>
    )
  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const tabList = [
      {
        key: '1',
        tab: '社团列表',
      },
      {
        key: '2',
        tab: '社团群组',
      }
    ];
    return (
      <PageHeaderLayout
        tabList={tabList}
        onTabChange={this.onOperationTabChange}
        activeTabKey={this.state.operationkey}
      >
        {
          this.state.operationkey == '2'?this.renderCommunityGroup():this.renderCommunityList()
        }
        <Modal
          title="添加群组"
          visible={this.state.groupVisible}
          onOk={this.groupHandleOk}
          onCancel={this.groupHandCancel}
        >
          <Form className="login-form">
            <FormItem>
              {getFieldDecorator('TeamName', {
                initialValue: '',
                rules: [{ required: true, message: '请输入群组名称' },{ max: 20, message: '最大长度不超过20位' }],
              })(
                <Input placeholder="请输入群组名称" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}

