import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button, ClearInput
} from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';
const getFormattedMsg = i18n.getFormattedMsg;

const FormItem = Form.SearchItem;

class SearchFrom extends PureComponent {
  onHandleSearch = () => {
    const { form: { getFieldsValue }, onSearch } = this.props;
    if (onSearch) {
      onSearch(getFieldsValue());
    }
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form>
        <FormItem label={getFormattedMsg('equipment.label.code')}>
          {getFieldDecorator('equipmentCode')(
            <ClearInput placeholder={getFormattedMsg('equipment.input.code')} />
          )}
        </FormItem>
        <FormItem label={getFormattedMsg('equipment.label.name')}>
          {getFieldDecorator('equipmentName')(
            <ClearInput placeholder={getFormattedMsg('equipment.input.name')} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="search" onClick={this.onHandleSearch}>{getFormattedMsg('global.btn.search')}</Button>
        </FormItem>
      </Form>
    );
  }
}

SearchFrom.propTypes = {
  onSearch: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create()(SearchFrom);
