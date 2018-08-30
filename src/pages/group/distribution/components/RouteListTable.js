import React, {PureComponent} from 'react';
import {Table, Divider, Switch,Button} from 'antd';
import styles from './RouteListTable.less';
import {connect} from 'dva';

@connect(state => ({
  distribution: state.distribution,
}))
class RouteListTable extends PureComponent {
  state = {
    
  };

  componentDidMount() {
    // this.getData();
  }

  // getData(){
  //   const {OrganizationId,TaskId} = this.props;
  //   console.log(OrganizationId,TaskId);
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type: 'distribution/queryRouteList',
  //     payload:{
  //       OrganizationId:OrganizationId,
  //       TaskId:TaskId,
  //       page:1,
  //       page_size:10,
  //     }
  //   });
  // }

  change = (val,groupIndex,index) => {
    const {dispatch} = this.props;
    dispatch({
      type:'distribution/lineChange',
      payload:{
        val,
        groupIndex,
        index,
      }
    })
  }

  render() {
    const { distribution:{ finishBuyingList: { List } }, groupIndex, lineList } = this.props;
    let selectList = List[groupIndex].LineList;
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
            <Switch checkedChildren="开启" checked={ record.IsSelected } onChange={(val)=>{this.change(val,groupIndex,index)}} unCheckedChildren="禁用"  />
          </div>
        )},
    },)
    return (
      <div className={styles.container}>
        <Table
          bordered
          className={styles.table}
          rowKey='LineId'
          dataSource={selectList}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default RouteListTable;
