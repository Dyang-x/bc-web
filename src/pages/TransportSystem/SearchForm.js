import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit'
const FormItem = Form.SearchItem;
const { getFormattedMsg } = i18n;

class SearchForm extends PureComponent {
  onHandleSearch = () => {
    const {
      form: { getFieldsValue },
      onSearch
    } = this.props;
    if (onSearch) {
      onSearch(getFieldsValue());
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <FormItem label={getFormattedMsg('material.label.codeForMaterial')}>
          {getFieldDecorator('materialCode')(
            <Input placeholder={getFormattedMsg('material.validate.placeholderForCode')} allowClear />
          )}
        </FormItem>

        <FormItem label={getFormattedMsg('material.label.nameForMaterial')}>
          {getFieldDecorator('materialName')(
            <Input placeholder={getFormattedMsg('material.validate.placeholderForName')} allowClear />
          )}
        </FormItem>

        <FormItem>
          <Button type="primary" icon="search" onClick={this.onHandleSearch}>
            {getFormattedMsg('global.btn.search')}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  form: PropTypes.object
};

export default Form.create()(SearchForm);
