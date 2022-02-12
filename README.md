# Project module 2

Endpoints table 



| Method    |  URL     | Description |  Protected   |
| :-------- | :------- | :---------- | :----------- |
| GET | `/` | Index |   No   |
| GET | `/login ` | Login form render | No |
| POST | `/login ` | Login form handler | No |
| POST | `/logout ` | Logout form handler | No |
| GET | `/singup ` | Singup form render | No |
| POST | `/singup ` | Singup form handler | No |
| GET | `/events` | Search form render for events | No |
| POST | `/events` | Search form handler for events | No |
| GET | `/events/list` | Event list render | No |
| GET | `/events/details/:id` | Events details render | No |
| GET | `/user/:id` | User details render | Yes |
| GET | `/user/:id/edit` | User edit form render | Yes |
|POST | `/user/:id/edit` | User edit form handler | Yes |
| GET | `/user/:id/friends` | User's friends list | Yes |
