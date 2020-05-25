import { api } from './api';

const port = 30000;
// tslint:disable-next-line:no-console
api.listen(port, () => console.log(`Serenity/JS Playground API started on http://localhost:${port}`));
