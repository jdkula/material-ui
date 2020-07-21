import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { SheetsRegistry } from 'jss';
import { createMount } from 'test/utils';
import { createGenerateClassName } from '@material-ui/styles';
import styled from './styled';
import StylesProvider from '../StylesProvider';

describe('styled', () => {
  // StrictModeViolation: uses makeStyles
  const mount = createMount({ strict: false });
  let StyledButton;

  before(() => {
    StyledButton = styled('button')({
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    });
  });

  it('should work as expected', () => {
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();

    mount(
      <StylesProvider sheetsRegistry={sheetsRegistry} generateClassName={generateClassName}>
        <StyledButton>Styled Components</StyledButton>
      </StylesProvider>,
    );

    expect(sheetsRegistry.registry.length).to.equal(1);
    expect(sheetsRegistry.registry[0].classes).to.deep.equal({ root: 'button-root-1' });
  });

  describe('prop: clone', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <StyledButton clone data-test="enzyme">
          <div>Styled Components</div>
        </StyledButton>,
      );
    });

    it('should be able to pass props to cloned element', () => {
      expect(wrapper.find('div').props()['data-test']).to.equal('enzyme');
    });

    it('should be able to clone the child element', () => {
      expect(wrapper.getDOMNode().nodeName).to.equal('DIV');
      wrapper.setProps({
        clone: false,
      });
      expect(wrapper.getDOMNode().nodeName).to.equal('BUTTON');
    });
  });

  it('should filter some props', () => {
    const style = (props) => ({
      background: props.color,
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    });
    style.filterProps = ['color'];
    style.propTypes = {};
    const StyledDiv = styled('div')(style);
    const wrapper = mount(
      <StyledDiv data-test="enzyme" color="blue">
        Styled Components
      </StyledDiv>,
    );
    expect(wrapper.find('div').props().color).to.equal(undefined);
    expect(wrapper.find('div').props()['data-test']).to.equal('enzyme');
  });

  describe('option: filterProps', () => {
    it('should omit only the specified props from being passed to the component', () => {
      const styles = { padding: 1 };
      const outerProps = { omitted: 1, kept: 1 };
      let innerProps;

      const Component = (props) => {
        innerProps = props;
        return null;
      };

      const StyledComponent = styled(Component)(styles, { filterProps: ['omitted'] });
      mount(<StyledComponent />);

      expect(innerProps.omitted).to.be.undefined();
      expect(innerProps.kept).to.equal(1);
      expect(innerProps.className).to.be.a('string');

      expect(outerProps.omitted).to.equal(1);
      expect(outerProps.className).to.be.undefined();
    });
  });

  describe('warnings', () => {
    beforeEach(() => {
      PropTypes.resetWarningCache();
    });

    it('warns if it cant detect the secondary action properly', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          StyledButton.propTypes,
          { clone: true, component: 'div' },
          'prop',
          'StyledButton',
        );
      }).toErrorDev('You can not use the clone and component prop at the same time');
    });
  });

  it('should accept a child function', () => {
    mount(<StyledButton>{(props) => <div {...props}>Styled Components</div>}</StyledButton>);
  });
});
