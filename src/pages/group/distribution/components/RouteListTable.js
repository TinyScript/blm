import React, {PureComponent} from 'react';
import {Table, Divider, Switch,Button} from 'antd';
import styles from './RouteListTable.less';
import {connect} from 'dva'

@connect(state => ({
  groupUser: state.distribution,
}))
class UserListTable extends PureComponent {
  state = {
    
  };


  // componentDidMount() {
  //   this.getData();
  // }

  getData(){
    const {OrganizationId} = this.props;
    console.log(this.props);
    const {dispatch} = this.props;
    dispatch({
      type: 'distribution/queryRouteList',
      payload:{
        id:OrganizationId,
        taskId:taskId,
        page:1,
        page_size:10,
      }
    });
  }

  render() {
    // const {groupUser: {data:{List ,pagination,Count}, loading}} = this.props;

    let columns = [
      {
        title: '路线名称', dataIndex: 'UserId',
      },
      {
        title: '导出记录',
        dataIndex: 'OrganizationName',
      },
    ];
    columns.push({
      title: '操作',
      render: (row) => {
        // if(row.RoleName==="超级管理员"){
        //   return ''
        // }
        return (
          <div>
            {/* <a onClick={()=>{this.showEditDialog(row)}}>编辑</a>
            <Divider type="vertical"/>
            <Switch checkedChildren="开启" defaultChecked={!row.IsDisable} onChange={(val)=>{change(val,row)}} unCheckedChildren="禁用"  /> */}
          </div>
        )},
    },)
    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   total: Count,
    //   ...pagination,
    // };
    return (
      
      <div className={styles.container}>
        111
        {/* <Table
          bordered
          className={styles.table}
          loading={loading}
          rowKey='UserId'
          dataSource={List}
          columns={columns}
          pagination={paginationProps}
        /> */}

      </div>
    );
  }
}

export default UserListTable;
