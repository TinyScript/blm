import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card,Button,Input,Table} from 'antd';
const {Search} = Input;
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getLocalStorage} from '../../../utils/utils'
import style from './communityGoup.less';
import styles from './Community.less';
const userData = getLocalStorage('userData');

@connect(state => ({
  community: state.community,
}))

export default class communityGoup extends PureComponent {

  state = {
    page:1,
    checkedList: [],
  }

  componentDidMount() {
    const {dispatch,match:{params}} = this.props
    console.log(params);
    this.setState({
      OrganizationId:userData.id,
      TeamId:params.TeamId,
    },()=>{
      dispatch({
        type: 'community/queryUnbindCommunityList',
        payload:{
          page:1,
          page_size:5,
          audit_state:1,
          OrganizationId:userData.id,
          TeamId:this.state.TeamId,
        }
      });

      dispatch({
        type: 'community/queryBindCommunityList',
        payload:{
          page:1,
          page_size:10,
          audit_state:1,
          OrganizationId:userData.id,
          TeamId:this.state.TeamId,
        }
      });
    })
  }

  handlerSubmit(){
    const {dispatch,community:{finishBuyingList}}  = this.props;

    let data = [];

    finishBuyingList.List.map(val=>{
      if(val.isChecked){
        let midObj = {};
        midObj.TaskId = val.TaskId;
        let midArray = [];
        val.LineList.map(val => {
          if(val.IsSelected){
            midArray.push(val.LineId);
          }
        })
        midObj.LineIds = midArray;
        data.push(midObj);
      }
    })

    dispatch({
      type:'community/submitDistributionAdd',
      payload:{
        TaskLineIds:data,
        OrganizationId:userData.id
      }
    })
  }

  search(val){
    const {dispatch} = this.props;
    this.setState({
      searchValue:val,
      current:1,
    },()=>{
      dispatch({
        type: 'community/queryUnbindCommunityList',
        payload:{
          page:1,
          OrganizationId: this.state.OrganizationId,
          TeamId:this.state.TeamId,
          page_size:10,
          search:val,
        },
      });
    })
  }

  addCommunity = (e,record) => {
    e.preventDefault();
    let midArray = this.state.checkedList.slice(0);
    midArray.push(record);
    this.setState({
      checkedList: midArray
    })
  }

  renderUncheckCommunityList = () => {
    const {community:{unBindCommunityList:{Groups,Count},loading,pagination}} = this.props;
    const {dispatch} = this.props;
    // 筛选掉已经选中的值
    let checkedArray = [];
    if(Groups){
      for(let i=0; i<Groups.length; i++){
        let midBol = true;
        for(let j=0; j<this.state.checkedList.length; j++){
          if(Groups[i].GroupId == this.state.checkedList[j].GroupId){
            midBol = false;
            break;
          }
        }
        if(midBol){
          checkedArray.push(Groups[i]);
        }
      }
    }
    let columns = [
      { title: '社团名称', dataIndex: 'Name'},
      { title: '团长姓名', dataIndex: 'ManagerName'},
    ];

    columns.push({
      title: '操作',
      render : (text,record,index)=>{
        return (
          <div>
            <Button onClick = {(e) => {this.addCommunity(e,record)}}>添加</Button>
          </div>
        )
      }
    })
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
            <Table
              bordered
              columns={columns}
              rowKey="GroupId"
              dataSource={checkedArray}
              loading={loading}
              pagination={paginationProps}
              onChange={this.accountListTableChange}
            />
          </div>
        </div>
      </Card>
    )
  }

  renderCheckCommunityList = () => {
    const {community:{bindCommunityList:{Groups,Count},loading,pagination}} = this.props;
    const {dispatch} = this.props;
    console.log(this.state.checkedList)
    // 补全选中的值
    let midArray = [];
    if(Groups){
      Groups.map((val,key) => {
        midArray.push(val);
      })
    }
    this.state.checkedList.map((val,key) => {
      midArray.push(val);
    })
    console.log(midArray);
    let columns = [
      { title: '社团名称', dataIndex: 'Name'},
      { title: '团长姓名', dataIndex: 'ManagerName'},
    ];

    columns.push({
      title: '操作',
      render : (text,record,index)=>{
        return (
          <div>
            <Button>移除</Button>
          </div>
        )
      }
    })
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current:this.state.current,
      total: Count,
      ...pagination,
    };

    return (
      <Card bordered={false}
            title="社团列表">
        <div>
          <div className={styles.standardTable}>
            <Table
              bordered
              columns={columns}
              rowKey="GroupId"
              dataSource={midArray}
              loading={loading}
              pagination={false}
              onChange={this.accountListTableChange}
            />
          </div>
        </div>
      </Card>
    )
  }

  render() {
    const {community:{ loading }}  = this.props;

    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'社群管理',
        href:'/group/community'
      },
      {
        title:'关联社区',
      }
    ]

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}
              title="关联社区"
        >
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div className={style.list}>
              <h3>待选</h3>
              <div className={style.listContent}>
                {this.renderUncheckCommunityList()}
              </div>
            </div>
            <div className={style.list}>
              <h3 style={{po:'fle'}}>已选</h3>
              <div className={style.listContent}>
                {this.renderCheckCommunityList()}
              </div>
            </div>
          </div>
          <div style={{display:'flex',marginTop:20,justifyContent:'center'}} ><Button loading={loading} onClick={()=>{this.handlerSubmit()}}>确定</Button></div>
        </Card>
      </PageHeaderLayout>

    );
  }
}
