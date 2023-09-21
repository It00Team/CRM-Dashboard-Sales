import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';

import { Button } from '@mui/material';
import MyAPI, {Token} from 'src/config/MyAPI';

const Email = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const sender = useRef();
  const sender_pass = useRef();
  const reciever = useRef();
  const title = useRef();

  const handleClick = () => {
    console.log(content);

    const data = {
      sender: sender.current.value,
      sender_pass: sender_pass.current.value,
      reciever: reciever.current.value,
      subject: title.current.value,
      text: content,
    };

    console.log(data);
    const token = Token.getToken()
    MyAPI.post('/crm/mail/add-mail', data, token).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '80%',
          padding: '20px',
        }}
      >
        <label for="sender">Sender</label>
        <input type="text" id="sender" name="sender" required ref={sender} />

        <label for="password">Sender's Password</label>
        <input type="password" id="password" name="password" required ref={sender_pass} />

        <label for="to">To</label>
        <input type="text" id="to" name="to" required ref={reciever} />

        <label for="title">Title</label>
        <input type="text" id="title" name="title" required ref={title} />
        <br></br>
        <div>
          <JoditEditor ref={editor} value={content} onChange={(newContent) => setContent(newContent)} />
        </div>
      </div>
      <Button variant="contained" onClick={handleClick}>
        Send
      </Button>
    </>
  );
};

export default Email;
