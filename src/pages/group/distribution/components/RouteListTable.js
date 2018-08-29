import React, {PureComponent} from 'react';
import {Table, Divider, Switch,Button} from 'antd';
import styles from './RouteListTable.less';
import {connect} from 'dva';

@connect(state => ({
  distributionInfo: state.distribution,
}))
class RouteListTable extends PureComponent {
  state = {
    
  };

  componentDidMount() {
    this.getData();
  }

  getData(){
    const {OrganizationId,TaskId} = this.props;
    console.log(OrganizationId,TaskId);
    const {dispatch} = this.props;
    dispatch({
      type: 'distribution/queryRouteList',
      payload:{
        OrganizationId:OrganizationId,
        TaskId:TaskId,
        page:1,
        page_size:10,
      }
    });
  }

  render() {
    const {distributionInfo: { routeList:{List}, loading}} = this.props;
    console.log(List);
    let columns = [
      {
        title: '路线名称', 
        dataIndex: 'LineName',
      },
      {
        title: '导出记录',
        dataIndex: 'UpdateTime',
      },
    ];
    columns.push({
      title: '操作',
      render: (text,record,index) => {
        return (
          <div>
            <Switch checkedChildren="开启" defaultChecked={ record.IsSelected } onChange={(val)=>{this.change(val,record)}} unCheckedChildren="禁用"  />
          </div>
        )},
    },)
    return (
      <div className={styles.container}>
        <Table
          bordered
          className={styles.table}
          loading={loading}
          rowKey='LineId'
          dataSource={List}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default RouteListTable;
