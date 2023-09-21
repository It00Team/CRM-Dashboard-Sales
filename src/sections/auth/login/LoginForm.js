import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MyAPI, { Token } from '../../../config/MyAPI';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleClick = () => {
    try {
      const details = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      console.log(details);

      MyAPI.post('/users/user-login/', details).then((res) => {
        console.log(res);
        Token.setToken(res.data.token);
        navigate('/dashboard', { replace: true });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="username" inputRef={usernameRef} />

        <TextField
          name="password"
          label="Password"
          inputRef={passwordRef}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
