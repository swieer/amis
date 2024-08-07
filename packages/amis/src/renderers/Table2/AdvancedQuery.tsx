import React, {useState} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {isMobile, ThemeProps, RendererProps} from 'amis-core';
import {Renderer, isVisible, ClassNamesFn} from 'amis-core';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {Modal, Select, InputBox} from 'amis-ui';
import {Button} from 'amis-ui';
import {TooltipWrapper} from 'amis-ui';

import {noop, autobind, anyChanged, createObject} from 'amis-core';
import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
import {getIcon} from 'amis-ui';
import {RootClose} from 'amis-core';
import type {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';
import {IColumn} from 'amis-core';
import type {IColumn2} from 'amis-core';

export interface AdvancedQueryProps extends ThemeProps {
  /**
   * 按钮文字
   */
  label?: string | React.ReactNode;

  /**
   * 按钮提示文字，hover focus 时显示
   */
  tooltip?: string | TooltipObject;
  /**
   *  ColumnToggler的CSS类名
   */
  className?: string;

  /**
   * 按钮的CSS类名
   */
  btnClassName?: string;
  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * 按钮级别，样式
   */
  level?: 'info' | 'success' | 'danger' | 'warning' | 'primary' | 'link';
  /**
   * 是否独占一行 `display: block`
   */
  block?: boolean;
  /**
   * ICON名称
   */
  icon?: string | React.ReactNode;
  classnames: ClassNamesFn;

  /**
   * 是否只显示图标。
   */
  iconOnly?: boolean;
  /**
   * 列数据
   */
  columns: Array<IColumn2>;
  onQuery: (condition: Array<any>) => void;
}

export default function AdvancedQuery(props: AdvancedQueryProps) {
  const queryArr = [
    {label: '精确', value: '='},
    {label: '模糊', value: '~'},
    {label: '大于', value: '>'},
    {label: '大于等于', value: '>='},
    {label: '小于', value: '<'},
    {label: '小于等于', value: '<='},
    {label: '区间', value: '区间'},
    {label: '包含', value: '包含'}
  ];
  const initCondition = [{title: '', value: '', query: ''}];
  const {
    level,
    block,
    iconOnly,
    icon,
    size,
    label,
    tooltip,
    classnames: cx,
    columns,
    onQuery
  } = props;
  const [isOpened, setIsOpened] = useState(false);
  const [conditionArr, setConditionArr] = useState(initCondition);
  const [tempColumns, setTempColumns] = useState<Array<IColumn2>>(
    columns.filter(item => item.title !== '操作')
  );
  const domRef = React.useRef<HTMLDivElement | null>(null);
  // setTempColumns([...columns]);
  const [currentQuery, setCurrentQuery] = useState('');
  function toggle() {
    setIsOpened(!isOpened);
  }
  function handleModalClose() {
    setConditionArr(initCondition);
    setIsOpened(false);
  }
  function handleAddQuery() {
    setConditionArr([{title: '', value: '', query: ''}, ...conditionArr]);
  }
  function handleQuery() {
    onQuery(conditionArr);
    handleModalClose();
  }
  function handleConditionTitleChange(data: any, index: number) {
    const temp = [...conditionArr];
    temp[index].title = data.value;
    setConditionArr(temp);
  }
  function handleConditionQueryChange(data: any, index: number) {
    const temp = [...conditionArr];
    temp[index].query = data.value;
    setConditionArr(temp);
  }
  function handleConditionValueChange(data: any, index: number) {
    const temp = [...conditionArr];
    temp[index].value = data;
    setConditionArr(temp);
  }
  // console.log(
  //   'zhengxi advanced query --- ',
  //   conditionArr,
  //   tempColumns.map(item => item)
  // );
  function renderModal() {
    return (
      <>
        <Modal
          size={'md'}
          closeOnEsc
          onHide={handleModalClose}
          show={isOpened}
          container={domRef}
          overlay
        >
          <header className={cx('ColumnToggler-modal-header')}>
            <span className={cx('ColumnToggler-modal-title')}>高级查询</span>
            <a
              data-tooltip={'关闭'}
              data-position="left"
              className={cx('Modal-close')}
              onClick={handleModalClose}
            >
              <Icon icon="close" className="icon" />
            </a>
          </header>
          <div className={cx('ColumnToggler-modal-content')}>
            <div>
              <span>查询条件</span>
              <Button level="link" onClick={handleAddQuery}>
                +增加查询条件
              </Button>
            </div>
            {conditionArr.map((item: any, index: number) => (
              <div className={cx('Table-toolbar')}>
                <Select
                  searchable
                  placeholder="请选择查询字段"
                  clearable={false}
                  options={tempColumns.map(col => {
                    return {
                      label: col.title,
                      value: col.title
                    };
                  })}
                  value={item.title}
                  onChange={e => {
                    handleConditionTitleChange(e, index);
                  }}
                ></Select>
                <div style={{width: '10px', height: '10px'}}></div>
                <Select
                  style={{paddingLeft: '10px'}}
                  placeholder="请选择查询条件"
                  options={queryArr}
                  value={item.query}
                  onChange={e => {
                    handleConditionQueryChange(e, index);
                  }}
                ></Select>
                <div style={{width: '10px', height: '10px'}}></div>
                <InputBox
                  placeholder="请输入条件值"
                  value={item.value}
                  onChange={e => {
                    handleConditionValueChange(e, index);
                  }}
                />
              </div>
            ))}
            <div>
              <Button level="primary" onClick={handleQuery}>
                查询
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
  return (
    <div ref={domRef}>
      <TooltipWrapper tooltip={tooltip}>
        <div style={{paddingLeft: '10px'}}>
          <button
            onClick={toggle}
            className={cx(
              'Button',
              typeof level === 'undefined'
                ? 'Button--default'
                : level
                ? `Button--${level}`
                : '',
              {
                'Button--block': block,
                'Button--iconOnly': iconOnly
              },
              size ? `Button--size-${size}` : ''
            )}
          >
            {label}
          </button>
        </div>
      </TooltipWrapper>
      {renderModal()}
    </div>
  );
}
