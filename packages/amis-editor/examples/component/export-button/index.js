import ExportButton from './export-button';
import {registerRendererByType} from '../amis-widget/main';
import {
  registerEditorPlugin,
  getSchemaTpl,
  BasePlugin,
  defaultValue
} from 'amis-editor-core';

class ExportButtonPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'export-button';
  $schema = '/schemas/UnkownSchema.json';
  // 组件名称（组件面板显示的Title）
  name = '导出按钮';
  description = '导出操作按钮';
  tags = ['导出'];
  icon = 'fa fa-square';
  scaffold = {
    type: 'export-button',
    label: '导出按钮',
    name: '导出按钮'
  };
  previewSchema = {
    type: 'export-button',
    label: '导出按钮'
  };
  events = [
    // {
    //   eventName: 'complete',
    //   eventLabel: '完成',
    //   description: '完成后触发',
    //   defaultShow: true,
    //   dataSchema: [
    //     {
    //       type: 'object',
    //       properties: {
    //         data: {
    //           type: 'object',
    //           title: '数据',
    //           description: '当前数据域，可以通过.字段名读取对应的值'
    //         }
    //       }
    //     }
    //   ]
    // },
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击后触发',
      defaultShow: true,
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              description: '当前数据域，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    }
  ];
  actions = [];
  panelTitle = '导出按钮配置';
  panelBodyCreator = context => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: 'input-text',
                  name: 'title',
                  label: '名称',
                  value: '导出'
                },
                {
                  type: 'input-text',
                  name: 'tableName',
                  label: '数据库表名',
                  value: ''
                },
                {
                  type: 'input-text',
                  name: 'schemaName',
                  label: 'schema名称',
                  value: ''
                }
                // {
                //   type: 'input-text',
                //   name: 'downloadUrl',
                //   label: '下载地址',
                //   value: ''
                // },
                // {
                //   type: 'input-text',
                //   name: 'processKey',
                //   label: '流程Key',
                //   value: ''
                // }
              ]
            },
            getSchemaTpl('status', {
              disabled: true
            })
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('buttonLevel', {
                  label: '样式',
                  name: 'level',
                  pipeIn: defaultValue('primary')
                }),
                getSchemaTpl('size', {
                  label: '尺寸',
                  pipeIn: defaultValue('md')
                })
              ]
            }
          ])
        }
        // {
        //   title: '事件',
        //   className: 'p-none',
        //   body: [
        //     getSchemaTpl('eventControl', {
        //       name: 'onEvent',
        //       ...getEventControlConfig(this.manager, context),
        //       rawType: 'export-button'
        //     })
        //   ]
        // }
      ])
    ];
  };
}

export function registExportButton() {
  registerRendererByType(ExportButton, {
    type: 'export-button',
    usage: 'renderer',
    weight: 99,
    framework: 'react'
  });
  registerEditorPlugin(ExportButtonPlugin);
}
