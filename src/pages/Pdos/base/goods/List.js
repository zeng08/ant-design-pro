import React, { PureComponent } from 'react';
import { Table, Alert, Divider } from 'antd';
import { getValue } from '@/utils/utils';
import styles from './List.less';
import { connect } from 'dva';

@connect(({ loading }) => ({
  loading: loading.models.goods,
}))
class List extends PureComponent {
  // 组件加载完成后加载数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetch',
    });
  }
  // 清除选择
  cleanSelectedKeys = () => {
    this.handleSelectRows([]);
  };

  // 行选事件
  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/updateState',
      payload: { selectedRowKeys: rows },
    });
  };

  // 删除事件
  handleDeleteClick = selectKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/remove',
      payload: { key: [selectKey.key] },
    });
  };

  // 编辑事件
  handleEditClick = record => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goods/showModal',
      payload: {
        modalType: 'update',
        currentItem: record,
      },
    });
  };

  // 表格动作触发事件
  handleListChange = (pagination, filtersArg, sorter) => {
    const { dispatch, formValues } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'goods/fetch',
      payload: params,
    });
  };

  render() {
    const { selectedRowKeys, data, pagination, loading } = this.props;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '品类',
        dataIndex: 'category',
        render: val => <div style={{ textAlign: 'center' }}>{val}</div>,
      },
      {
        title: '型号',
        dataIndex: 'model',
        sorter: true,
      },
      {
        title: '助记码',
        dataIndex: 'mnemonic',
        sorter: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        sorter: true,
        render: val => <div style={{ textAlign: 'center' }}>{val}</div>,
      },
      {
        title: '装箱规格',
        dataIndex: 'boxunit',
      },
      {
        title: '条码',
        dataIndex: 'barcode',
        sorter: true,
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <a onClick={e => this.handleEditClick(record, e)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e => this.handleDeleteClick(record, e)}>删除</a>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelectionProps = {
      fixed: true,
      selectedRowKeys,
      onChange: selectedKeys => {
        this.handleSelectRows(selectedKeys);
      },
    };
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空选择
                </a>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          bordered
          rowKey={record => record.id}
          rowSelection={rowSelectionProps}
          dataSource={data.records}
          columns={columns}
          pagination={paginationProps}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleListChange}
        />
      </div>
    );
  }
}

export default List;
