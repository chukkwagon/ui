import React, { Component } from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { css } from 'emotion';

import Button from '../../muiComponents/Button';
import Dialog from '../../muiComponents/Dialog';
import DialogTitle from '../../muiComponents/DialogTitle';
import DialogContent from '../../muiComponents/DialogContent';
import DialogActions from '../../muiComponents/DialogActions';

import * as classes from './styles';

interface FormFields {
  required: boolean;
  pristine: boolean;
  helperText: string;
  value: string;
}
export interface FormError {
  type: string;
  title: string;
  description: string;
}

interface LoginModalProps {
  visibility: boolean;
  error?: FormError;
  onCancel: () => void;
  onSubmit: (username: string, password: string) => void;
}

interface LoginModalState {
  form: {
    username: Partial<FormFields>;
    password: Partial<FormFields>;
  };
  error?: FormError;
}

export default class LoginModal extends Component<Partial<LoginModalProps>, LoginModalState> {
  constructor(props: LoginModalProps) {
    super(props);
    this.state = {
      form: {
        username: {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: '',
        },
        password: {
          required: true,
          pristine: true,
          helperText: 'Field required',
          value: '',
        },
      },
      error: props.error,
    };
  }

  public render(): JSX.Element {
    const { visibility = true, onCancel = () => null, error } = this.props as LoginModalProps;
    return (
      <Dialog fullWidth={true} id={'login--form-container'} maxWidth={'xs'} onClose={onCancel} open={visibility}>
        <form noValidate={true} onSubmit={this.handleValidateCredentials}>
          <DialogTitle>{'Login'}</DialogTitle>
          <DialogContent>
            {error && this.renderLoginError(error)}
            {this.renderNameField()}
            {this.renderPasswordField()}
          </DialogContent>
          {this.renderActions()}
        </form>
      </Dialog>
    );
  }

  /**
   * set login modal's username and password to current state
   * Required to login
   */
  public setCredentials = (name, e) => {
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        [name]: {
          ...form[name],
          value: e.target.value,
          pristine: false,
        },
      },
    });
  };

  public handleUsernameChange = event => {
    this.setCredentials('username', event);
  };

  public handlePasswordChange = event => {
    this.setCredentials('password', event);
  };

  public handleValidateCredentials = event => {
    const { form } = this.state;
    // prevents default submit behavior
    event.preventDefault();

    this.setState(
      {
        form: Object.keys(form).reduce(
          (acc, key) => ({
            ...acc,
            ...{ [key]: { ...form[key], pristine: false } },
          }),
          { username: {}, password: {} }
        ),
      },
      () => {
        if (!Object.keys(form).some(id => !form[id])) {
          this.submitCredentials();
        }
      }
    );
  };

  public submitCredentials = async () => {
    const { form } = this.state;
    const username = (form.username && form.username.value) || '';
    const password = (form.password && form.password.value) || '';
    const { onSubmit } = this.props;
    if (onSubmit) {
      await onSubmit(username, password);
    }
    // let's wait for API response and then set
    // username and password filed to empty state
    this.setState({
      form: Object.keys(form).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [key]: { ...form[key], value: '', pristine: true } },
        }),
        { username: {}, password: {} }
      ),
    });
  };

  public renderErrorMessage(title: string, description: string): JSX.Element {
    return (
      <span>
        <div>
          <strong>{title}</strong>
        </div>
        <div>{description}</div>
      </span>
    );
  }

  public renderMessage(title: string, description: string): JSX.Element {
    return (
      <div className={classes.loginErrorMsg} id={'client-snackbar'}>
        <ErrorIcon className={classes.loginIcon} />
        {this.renderErrorMessage(title, description)}
      </div>
    );
  }

  public renderLoginError({ type, title, description }: FormError): JSX.Element | false {
    return type === 'error' && <SnackbarContent className={classes.loginError} message={this.renderMessage(title, description)} />;
  }

  public renderNameField = () => {
    const {
      form: { username },
    } = this.state;
    return (
      <FormControl error={!username.value && !username.pristine} fullWidth={true} required={username.required}>
        <InputLabel htmlFor={'username'}>{'Username'}</InputLabel>
        <Input id={'login--form-username'} onChange={this.handleUsernameChange} placeholder={'Your username'} value={username.value} />
        {!username.value && !username.pristine && <FormHelperText id={'username-error'}>{username.helperText}</FormHelperText>}
      </FormControl>
    );
  };

  public renderPasswordField = () => {
    const {
      form: { password },
    } = this.state;
    return (
      <FormControl
        className={css`
          margin-top: 8px;
        `}
        error={!password.value && !password.pristine}
        fullWidth={true}
        required={password.required}>
        <InputLabel htmlFor={'password'}>{'Password'}</InputLabel>
        <Input id={'login--form-password'} onChange={this.handlePasswordChange} placeholder={'Your strong password'} type={'password'} value={password.value} />
        {!password.value && !password.pristine && <FormHelperText id={'password-error'}>{password.helperText}</FormHelperText>}
      </FormControl>
    );
  };

  public renderActions = () => {
    const {
      form: { username, password },
    } = this.state;
    const { onCancel } = this.props;
    return (
      <DialogActions className={'dialog-footer'}>
        <Button color={'inherit'} id={'login--form-cancel'} onClick={onCancel} type={'button'}>
          {'Cancel'}
        </Button>
        <Button color={'inherit'} disabled={!password.value || !username.value} id={'login--form-submit'} type={'submit'}>
          {'Login'}
        </Button>
      </DialogActions>
    );
  };
}
