import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getContacts, getContactsById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();
    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactsById(contactId);
      if (!contact) {
        res.status(404).json({
          message: 'Contact not found...',
        });
        return;
      }
      res.status(200).json({
        status: res.statusCode,
        data: contact,
        message: `Successfully found contact with id ${contactId}!`,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
