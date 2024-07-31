import * as React from 'react';
import {Button, toast} from 'amis-ui';

export default class ExportButton extends React.Component {
  render() {
    const {title, level, size} = this.props;
    return (
      <div style={{marginLeft: '10px'}}>
        <Button
          level={level}
          size={size}
          onClick={() => toast.success('导出成功')}
        >
          {title}
        </Button>
      </div>
    );
  }
}
