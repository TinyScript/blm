import React, {PureComponent} from 'react';
import {Table, Divider, Switch,Button} from 'antd';
import styles from './GroupListTable.less';
import {connect} from 'dva';
import {getLocalStorage} from '../../../../../utils/utils'

const userData = getLocalStorage('userData');
@connect(state => ({
  purchaseInfo: state.purchaseEdit,
}))
class GroupListTable extends PureComponent {
  state = {
    // TeamIds : [],
  };

  componentDidMount() {
    this.getData();
  }

  getData(){
    const {dispatch} = this.props;
    dispatch({
      type: 'purchaseEdit/queryGroupList',
      payload:{
        OrganizationId:userData.id,
        page:1,
        page_size:10,
      }
    });
  }
  
  change = (val,record) => {
    const {dispatch,data} = this.props;
    if(!data.TeamIds){
      data.TeamIds = [];
    }
    let midArray = data.TeamIds.slice(0);
    if(val){
      midArray.push(record.TeamId);
    }else{
      let index = midArray.indexOf(record.TeamId);
      if(index == -1){ return };
      midArray.splice(index,1);
    }
    data.TeamIds = midArray;
    
    dispatch({
      type:'purchaseEdit/setAdd',
      payload:{
        ...data,
      }
    })
  }

  check = (record) => {
    const {data} = this.props;
    if(data.TeamIds&&data.TeamIds.indexOf(record.TeamId)>0){
      return true;
    }else{
      return false;
    }
  }

  tableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'purchaseEdit/queryGroupList',
      payload:{
        OrganizationId:userData.id,
        page: pagination.current,
        page_size: pagination.pageSize,
      }
    });
  }

  render() {
    const { purchaseInfo: { groupList:{List,pagination,Count}, loading}, data } = this.props;
    // if(groupList){
    //   console.log(groupList);
    // }
    let columns = [
      {
        title: '路线名称', 
        dataIndex: 'Name',
      },
    ];
    columns.push({
      title: '操作',
      render: (text,record,index) => {
        return (
          <div>
            <Switch checkedChildren="开启" defaultChecked={ data.TeamIds&&data.TeamIds.indexOf(record.TeamId)>0?true:false } onChange={(val)=>{this.change(val,record)}} unCheckedChildren="禁用"  />
          </div>
        )},
    },)
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Count,
      ...pagination,
    };
    return (
      <div className={styles.container}>
        <Table
          bordered
          className={styles.table}
          loading={loading}
          rowKey='TeamId'
          dataSource={List}
          columns={columns}
          pagination={paginationProps}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}

export default GroupListTable;
